import { CarryOutOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Empty,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
  message
} from "antd";
import React, { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import {
  useAddSupplierConfirmOrderMutation,
  useGetSupplierChangedOrderListQuery,
} from "../../../features/supplier/changeOrder/supplierChangeOrderApiSlice";

function SupplierChangeOrderChanged() {
  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "confirmOrder";

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const [openConfirmModal, setOpenConfirmModal] = useState({
    open: false,
    orderId: null,
  });

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetSupplierChangedOrderListQuery();
  const [addConfirm] = useAddSupplierConfirmOrderMutation();

  /* Modal */
  const handleOpenConfirmModal = (orderId) => {
    setOpenConfirmModal({
      open: true,
      orderId,
    });
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal({
      open: false,
      orderId: null,
    });
  };

  /* TABLE ACTIONS */
  /* Hancle Search */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0] || "");
    setSearchedColumn(dataIndex);
  };

  /* Handle reset */
  const handleReset = (clearFilters) => {
    clearFilters("");
    setSearchText("");
  };

  const workerData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  /* Get Column search */
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText("");
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (record[dataIndex])
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      ...getColumnSearchProps("id"),
    },
    {
      title: "Dostavkachi",
      dataIndex: "dostavchik",
      key: "dostavchik",
      width: 150,
      ...getColumnSearchProps("dostavchik"),
    },
    {
      title: "order_id",
      dataIndex: "order_id",
      key: "order_id",
      width: 150,
      ...getColumnSearchProps("order_id"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      ...getColumnSearchProps("status"),
      render: (status) => {
        let color = "";
        if (status === "new") {
          color = "geekblue-inverse";
        } else if (status === "confirmed") {
          color = "cyan-inverse";
        } else if (status === "bekor_qilingan") {
          color = "red-inverse";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Yuborilgan vaqti",
      dataIndex: "yuborilgan_vaqt",
      key: "yuborilgan_vaqt",
      width: 150,
    },
    {
      title: "Amal",
      key: "operation",
      width: 60,
      fixed: "right",
      render: ({ id }) => (
        <Tooltip title="Qabul qilish" placement="bottom">
          <Button
            size={"large"}
            shape="rounded"
            icon={<CarryOutOutlined />}
            type="primary"
            onClick={() => handleOpenConfirmModal(id)}
          />
        </Tooltip>
      ),
    },
  ];

  /* Handle confirm order */
  const handleConfirmOrder = async (value) => {
    setIsSubmitting(true);
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const data = {
        getOrder: value,
      };
      const resData = await addConfirm({
        orderId: openConfirmModal?.orderId,
        body: data,
      }).unwrap();

      if (resData?.success === true) {
        handleCloseConfirmModal();
        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        if (resData?.message) {
          messageApi.open({
            key,
            type: "error",
            content: resData?.message,
          });
        }
      }
      setTimeout(() => {}, 2000);
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        messageApi.open({
          key,
          type: "warning",
          content: `Ulanishda xatolik! Qaytadan urinib ko'ring!`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}

      {/* Modal */}

      <Drawer
        height={140}
        title="Buyurtmani qabul qilasizmi?"
        placement="top"
        onClose={handleCloseConfirmModal}
        open={openConfirmModal.open}
      >
        <div style={{ display: "flex", width: "100%", gap: "1rem" }}>
          <Button
            style={{ width: "100%" }}
            type="primary"
            danger
            onClick={() => handleConfirmOrder(false)}
            loading={isSubmitting}
          >
            Bekor qilish
          </Button>
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={() => handleConfirmOrder(true)}
            loading={isSubmitting}
          >
            Qabul qilish
          </Button>
        </div>
      </Drawer>

      {/* TAble */}
      <Table
        size="small"
        columns={columns}
        dataSource={workerData}
        loading={isLoading}
        scroll={{
          x: 600,
          y: 700,
        }}
        locale={{
          emptyText: () => {
            if (isError && !isLoading) {
              return <MainRefetchBtn refetch={refetch} />;
            } else {
              return <Empty />;
            }
          },
        }}
        rowKey={"id"}
      />
    </>
  );
}

export default SupplierChangeOrderChanged;

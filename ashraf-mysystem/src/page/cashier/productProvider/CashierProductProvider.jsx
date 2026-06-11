import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Space, Table, Tag, Tooltip } from "antd";
import React, { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import MainModal from "../../../components/common/modal/MainModal";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import Section from "../../../components/common/section/Section";
import { useGetCashierPayProviderHistoryQuery } from "../../../features/cashier/productProvider/cashierProviderApiSlice";
import CashierPayProductProviderModal from "./components/CashierPayProductProviderModal";
import { CheckOutlined } from "@ant-design/icons";
import CashierProviderSmsConfirm from "./components/CashierProviderSmsConfirm";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";

function CashierProductProvider() {
  /* State */
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [openAddWorkerModal, setOpenAddWorkerModal] = useState(false);
  const [openConfirmSmsCodeModal, setOpenConfirmSmsCodeModal] = useState({
    open: false,
    data: {},
  });

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetCashierPayProviderHistoryQuery();

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
      title: "Taminotchi",
      dataIndex: "taminotchi",
      key: "taminotchi",
      width: 150,
      ...getColumnSearchProps("taminotchi"),
    },
    {
      title: "Summa",
      dataIndex: "summa",
      key: "summa",
      width: 150,
      render: (summa) => <MainNumberFormat value={summa} />,
    },
    {
      title: "Naqd so'm",
      dataIndex: "naqdsum",
      key: "naqdsum",
      width: 150,
      render: (naqdsum) => <MainNumberFormat value={naqdsum} />,
    },
    {
      title: "Naqd usd",
      dataIndex: "naqdusd",
      key: "naqdusd",
      width: 150,
      render: (naqdusd) => <MainNumberFormat value={naqdusd} />,
    },
    {
      title: "Valyuta",
      dataIndex: "valyuta",
      key: "valyuta",
      width: 150,
      render: (valyuta) => <MainNumberFormat value={valyuta} />,
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
      width: 150,
      render: (bank) => <MainNumberFormat value={bank} />,
    },
    {
      title: "Karta",
      dataIndex: "karta",
      key: "karta",
      width: 150,
      render: (karta) => <MainNumberFormat value={karta} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      ...getColumnSearchProps("status"),
      render: (_, { status }) => {
        const color = status === "checked" ? "cyan-inverse" : "red-inverse";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Vaqt",
      dataIndex: "vaqt",
      key: "vaqt",
      width: 150,
    },
    {
      title: "Amal",
      key: "operation",
      width: 65,
      fixed: "right",
      align: "center",
      render: ({ taminotchi_id, taminotchi,status }) => (
        <Tooltip title="SMS kodni tasdiqlash">
          <Button
            disabled={status === 'checked'}
            size="small"
            shape="circle"
            icon={<CheckOutlined />}
            type="primary"
            onClick={() => handleOpenConfirmSmsCodeModal({ taminotchi_id, taminotchi })}
          />
        </Tooltip>
      ),
    },
  ];

  /* MODAL */
  const handleOpenPaymentModal = () => setOpenAddWorkerModal(true);
  const handleClosePaymentModal = () => setOpenAddWorkerModal(false);
  const handleOpenConfirmSmsCodeModal = (data) =>
    setOpenConfirmSmsCodeModal({
      open: true,
      data,
    });
  const handleCloseConfirmSmsCodeModal = () =>
    setOpenConfirmSmsCodeModal({
      open: false,
      data: {},
    });

  return (
    <>
      {/* Payment modal */}
      <MainModal open={openAddWorkerModal} onClose={handleClosePaymentModal}>
        <CashierPayProductProviderModal />
      </MainModal>

      {/* Confirm SMS code modal */}
      <MainModal
        open={openConfirmSmsCodeModal?.open}
        onClose={handleCloseConfirmSmsCodeModal}
      >
        <CashierProviderSmsConfirm userData={openConfirmSmsCodeModal?.data} handleClose={handleCloseConfirmSmsCodeModal} />
      </MainModal>

      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginBottom: "1rem",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenPaymentModal}
          >
            Taminotchiga pul berish
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={workerData}
          loading={isLoading}
          scroll={{
            x: 400,
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
      </Section>
    </>
  );
}

export default CashierProductProvider;

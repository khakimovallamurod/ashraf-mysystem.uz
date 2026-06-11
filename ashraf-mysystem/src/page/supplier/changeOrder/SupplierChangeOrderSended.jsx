import { SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Space, Table, Tag } from "antd";
import React, { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import { useGetSupplierSendedOrderListQuery } from "../../../features/supplier/changeOrder/supplierChangeOrderApiSlice";

function SupplierChangeOrderSended() {
  /* State */
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  /* API */
  const { data, isLoading, isError, refetch } =
    useGetSupplierSendedOrderListQuery();

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
      title: "Qabul qiluvchi",
      dataIndex: "qabul_qiluvchi",
      key: "qabul_qiluvchi",
      width: 150,
      ...getColumnSearchProps("qabul_qiluvchi"),
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
  ];

  return (
    <>
      <Table
        size="small"
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
    </>
  );
}

export default SupplierChangeOrderSended;

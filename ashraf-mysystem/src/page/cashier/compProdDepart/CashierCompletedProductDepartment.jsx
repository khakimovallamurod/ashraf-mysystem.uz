import { SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Space, Table } from "antd";
import React, { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import Section from "../../../components/common/section/Section";
import { useGetCashierCompProdQuery } from "../../../features/cashier/completedProductDepart/cashierCompProdDepartApiSlice";

function CashierCompletedProductDepartment() {
  /* State */
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  /* API */
  const { data, isLoading, isError, refetch } = useGetCashierCompProdQuery();

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
      title: "Mahsulot nomi",
      dataIndex: "name",
      key: "name",
      width: 150,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Article",
      dataIndex: "article",
      key: "article",
      width: 150,
      ...getColumnSearchProps("article"),
    },
    {
      title: "Barcode",
      dataIndex: "barcode",
      key: "barcode",
      width: 150,
      ...getColumnSearchProps("barcode"),
    },
    {
      title: "Massa(kg)",
      dataIndex: "soni",
      key: "soni",
      width: 150,
      render: (_, { soni }) => <MainNumberFormat value={soni} />,
    },
  ];

  return (
    <>
      <Section>
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

export default CashierCompletedProductDepartment;

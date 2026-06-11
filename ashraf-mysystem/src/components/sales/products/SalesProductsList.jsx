import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Space, Table } from "antd";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch } from "react-redux";
import { deleteSalesOrderProductsListGrind } from "../../../features/sales/salesSlice";
import MainRefetchBtn from "../../common/refechBtn/MainRefetchBtn";
import Section from "../../common/section/Section";

function SalesProductsList({ isLoading, isError, refetch, list, component }) {
  /* State */
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  /* Dispatch */
  const dispatch = useDispatch();

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
      title: "Nomi",
      dataIndex: "title",
      key: "title",
      width: 150,
      ...getColumnSearchProps("title"),
    },
    {
      title: "Massa",
      dataIndex: "mass",
      key: "mass",
      width: 150,
      ...getColumnSearchProps("mass"),
    },
    {
      title: "Amal",
      key: "operation",
      width: 60,
      render: ({ id }) =>
        component !== "drawer" ? (
          "Boooooom"
        ) : (
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            onClick={() => handleRemoveProductItemOrderGrind(id)}
            size="small"
            danger
          />
        ),
    },
  ];

  /* Handle submit */
  const handleRemoveProductItemOrderGrind = (id) => {
    dispatch(deleteSalesOrderProductsListGrind(id));
  };

  return (
    <>
      {/* MainModal */}
      <Section>
        <Table
          selectedRowKeys={4}
          columns={columns}
          dataSource={list}
          loading={isLoading}
          scroll={{
            x: 800,
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
          // rowClassName={(record) =>
          //   selectedRowItems.find((item) => item.id === record.id) &&
          //   component !== "drawer"
          //     ? styles.disabledRow
          //     : ""
          // }
          rowKey={"id"}
        />
      </Section>
    </>
  );
}

export default SalesProductsList;

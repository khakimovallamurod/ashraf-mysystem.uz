import { SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Space, Table, Tag, message } from "antd";
import "dayjs/locale/zh-cn";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import MainDateRanger from "../../../components/common/dateRanger/MainDateRanger";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import Section from "../../../components/common/section/Section";
import {
  useGetCashierSaleOrderByDateMutation,
  useGetCashierSaleOrderQuery,
} from "../../../features/cashier/saleOrder/cashierSaleOrderApiSlice";

function CashierDayCost() {
  /* State */
  const [isSubbmitting, setIsSubmitting] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [filterData, setFilterData] = useState([]);
  const [tableData, setTableData] = useState([]);

  /* API */
  const { data, isLoading, isError, refetch } = useGetCashierSaleOrderQuery();
  const [getDataByDate] = useGetCashierSaleOrderByDateMutation();

  const [messageApi, contextHolder] = message.useMessage();
  const key = "geyDataByDate";

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

  const saleORderData = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  useEffect(() => {
    setTableData(saleORderData);
    setFilterData(saleORderData);
  }, [saleORderData]);

  useEffect(() => {
    if (data?.success === true && !data?.data && !data?.data?.length) {
      message.info(data?.message);
    }
  }, [data?.data, data?.message, data?.success]);

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
      title: "Sotuvchi",
      dataIndex: "sotuvchi",
      key: "sotuvchi",
      width: 150,
      ...getColumnSearchProps("sotuvchi"),
    },
    {
      title: "Agent",
      dataIndex: "agent",
      key: "agent",
      width: 150,
      ...getColumnSearchProps("agent"),
    },
    {
      title: "Yuklovchi",
      dataIndex: "yuklovchi",
      key: "yuklovchi",
      width: 150,
      ...getColumnSearchProps("yuklovchi"),
    },
    {
      title: "Naqd so'm",
      dataIndex: "naqd",
      key: "naqd",
      width: 150,
    },
    {
      title: "Naqd usd",
      dataIndex: "naqdusd",
      key: "naqdusd",
      width: 150,
    },
    {
      title: "Valyuta",
      dataIndex: "valyuta",
      key: "valyuta",
      width: 150,
    },
    {
      title: "Plastik",
      dataIndex: "plastik",
      key: "plastik",
      width: 150,
    },
    {
      title: "Karta",
      dataIndex: "karta",
      key: "karta",
      width: 150,
    },
    {
      title: "Summa",
      dataIndex: "summa",
      key: "summa",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        const color = "cyan";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Vaqt",
      dataIndex: "vaqt",
      key: "vaqt",
      width: 150,
    },
  ];

  /* Handle get data */
  const handleGetDataByDate = async (values) => {
    if ((!values[0] || !values[1]) && tableData?.length) {
      message.info(data?.message);
      setFilterData(tableData);
      return;
    }

    /* Set Event */
    setIsSubmitting(true);

    try {
      const resData = await getDataByDate({
        start: values[0],
        end: values[1],
      }).unwrap();
      if (resData?.success === true) {
        if (resData?.data && Array.isArray(resData?.data)) {
          setFilterData(resData?.data);
        }

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

      <Section>
        {/* Date ranger */}
        <MainDateRanger onChange={handleGetDataByDate} />
        <Table
          columns={columns}
          dataSource={filterData}
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

export default CashierDayCost;

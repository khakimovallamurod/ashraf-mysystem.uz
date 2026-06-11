import { CarryOutOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Space, Table, Tooltip } from "antd";
import React, { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import MainModal from "../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import Section from "../../../components/common/section/Section";
import { useGetCashierSupplierQuery } from "../../../features/cashier/supplier/cashierSupplierApiSlice";
import CashierAddSupplierReceptionModal from "./components/CashierAddSupplierReceptionModal";
import formatCurrency from "../../../util/formatCurrency";

function CashierSupplier() {
  /* State */
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [openAddReceptionModal, setOpenAddDepartmentModal] = useState({
    open: false,
    id: null,
    inputsData: {
      naqdsum: "",
      naqdusd: "",
      bank: "",
      karta: "",
    },
  });

  /* API */
  const { data, isLoading, isError, refetch } = useGetCashierSupplierQuery();

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

  const [productsData, allData] = useMemo(() => {
    if (
      data?.success === true &&
      data?.data?.list &&
      Array.isArray(data?.data?.list)
    ) {
      return [data.data.list, data?.data];
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
      title: "Dostavchik",
      dataIndex: "dostavchik",
      key: "dostavchik",
      width: 150,
      ...getColumnSearchProps("dostavchik"),
    },
    {
      title: "Naqd so'm",
      dataIndex: "naqdsum",
      key: "naqdsum",
      width: 150,
      render: (_, { naqdsum }) => <MainNumberFormat value={naqdsum} />,
    },
    {
      title: "Naqd usd",
      dataIndex: "naqdusd",
      key: "naqdusd",
      width: 150,
      render: (_, { naqdusd }) => <MainNumberFormat value={naqdusd} />,
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
      width: 150,
      render: (_, { bank }) => <MainNumberFormat value={bank} />,
    },
    {
      title: "Karta",
      dataIndex: "karta",
      key: "karta",
      width: 150,
      render: (_, { karta }) => <MainNumberFormat value={karta} />,
    },
    {
      title: "Amal",
      key: "operation",
      width: 80,
      fixed: "right",
      align: "center",
      render: ({ id, naqdsum, naqdusd, bank, karta }) => (
        <Tooltip title="Kirim qilish">
          <Button
            shape="round"
            size="small"
            icon={<CarryOutOutlined />}
            type="primary"
            onClick={() =>
              handleOpenAddDepartmentModal({
                id,
                inputsData: { naqdsum, naqdusd, bank, karta },
              })
            }
          />
        </Tooltip>
      ),
    },
  ];

  /* MODAL */
  const handleOpenAddDepartmentModal = ({ id, inputsData }) =>
    setOpenAddDepartmentModal({
      open: true,
      id,
      inputsData,
    });
  const handleCloseAddDepartmentModal = () =>
    setOpenAddDepartmentModal({
      open: false,
      id: null,
      inputsData: {
        naqdsum: "",
        naqdusd: "",
        bank: "",
        karta: "",
      },
    });

  return (
    <>
      <MainModal
        open={openAddReceptionModal.open}
        onClose={handleCloseAddDepartmentModal}
      >
        <CashierAddSupplierReceptionModal
          id={openAddReceptionModal.id}
          inputsData={openAddReceptionModal?.inputsData}
        />
      </MainModal>

      <Section>
        <Table
          columns={columns}
          dataSource={productsData}
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
        <div style={{ display: "flex", gap: "3rem" }}>
          <div>
            <p>
              Jami naqd: <b>{formatCurrency(allData?.jaminaqd)}</b>
            </p>
            <p>
              Jami usd: <b>{formatCurrency(allData?.jamiusd)}</b>
            </p>
            <p>
              Jami bank: <b>{formatCurrency(allData?.jamibank)}</b>
            </p>
            <p>
              Jami karta: <b>{formatCurrency(allData?.jamikarta)}</b>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

export default CashierSupplier;

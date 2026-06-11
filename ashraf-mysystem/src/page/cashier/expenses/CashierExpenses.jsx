import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Select, message } from "antd";
import React, { useMemo, useState } from "react";
import MainModal from "../../../components/common/modal/MainModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import {
  useDeleteCahierExpensesMutation,
  useGetCashierExpensesByDateQuery,
  useGetCashierExpensesCategoryQuery,
} from "../../../features/cashier/expenses/cashierExpensesApiSlice";
import formatCurrency from "../../../util/formatCurrency";
import validateApiResArray from "../../../util/validateApiResArray";
import CashierAddExpenseModal from "./components/CashierAddExpenseModal";
import validateApiResObjectArray from "../../../util/validateApiResObjectArray";

function CashierExpenses() {
  /* State */
  const [openModal, setOpenModal] = useState(false);
  const [selectDate, setSelectDate] = useState({
    start: "",
    end: "",
  });
  const [expenseCategory, setExpenseCategory] = useState(null);

  /* API */
  const expensesCategoryRes = useGetCashierExpensesCategoryQuery();
  const expensesRes = useGetCashierExpensesByDateQuery({
    ...selectDate,
    expenseCategory,
  });

  const [deleteExpense] = useDeleteCahierExpensesMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "delete";

  /* Memo */
  const expensesCategoryOptions = useMemo(() => {
    // Loading
    if (expensesCategoryRes.isLoading || expensesCategoryRes.isFetching) {
      return [];
    }

    return validateApiResArray(expensesCategoryRes);
  }, [expensesCategoryRes]);

  const [expensesData, totalData] = useMemo(() => {
    // Loading
    if (expensesRes.isLoading || expensesRes.isFetching) return [];

    // // Res
    const res = validateApiResObjectArray(expensesRes, "list");
    if (res.length) {
      const { jaminaqd, jamiusd, jamibank, jamikarta, jami } =
        expensesRes.data?.data;
      return [
        res,
        {
          jaminaqd: jaminaqd?formatCurrency(jaminaqd):0,
          jamiusd: jaminaqd?formatCurrency(jamiusd):0,
          jamibank: jaminaqd?formatCurrency(jamibank):0,
          jamikarta: jaminaqd?formatCurrency(jamikarta):0,
          jami: jaminaqd?formatCurrency(jami):0,
        },
      ];
    } else {
      // setAllResData(null);
    }
    return [];
  }, [expensesRes]);

  /* DELETE */
  const handleDeleteItem = async (id) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const resData = await deleteExpense(id).unwrap();

      if (resData?.success === true) {
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
        message.warning("Ulanishda xatolik! Qaytadan urinib ko'ring!");
      }
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sortType: "number",
    },
    {
      title: "Javobgar",
      dataIndex: "javobgar",
      key: "javobgar",
      width: 150,
      sortType: "string",
    },
    {
      title: "Turi",
      dataIndex: "turi",
      key: "turi",
      width: 150,
      sortType: "string",
    },
    {
      title: "Naqd so'm",
      dataIndex: "naqdsum",
      key: "naqdsum",
      width: 150,
      sortType: "number",
    },
    {
      title: "Naqd usd",
      dataIndex: "naqdusd",
      key: "naqdusd",
      width: 150,
      sortType: "number",
    },
    {
      title: "Karta",
      dataIndex: "karta",
      key: "karta",
      width: 150,
      sortType: "number",
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
      width: 150,
      sortType: "number",
    },
    {
      title: "Izoh",
      dataIndex: "izoh",
      key: "izoh",
      width: 300,
      sortType: "string",
    },
    {
      title: "Vaqt",
      dataIndex: "vaqt",
      key: "vaqt",
      width: 150,
      sortType: "date",
    },
    {
      title: "Amal",
      key: "operation",
      width: 70,
      fixed: "right",
      render: ({ id }, item) => (
        <Popconfirm
          title="O'chirish"
          description="Rostdan ham o'chirmoqchimisiz?"
          onConfirm={() => handleDeleteItem(id)}
          okText="Ha, albatta"
          cancelText="Yo'q"
        >
          <Button icon={<DeleteOutlined />} type="primary" danger />
        </Popconfirm>
      ),
    },
  ];

  /* MODAL */
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      {contextHolder}

      {/* Modal */}
      <MainModal open={openModal} onClose={handleCloseModal}>
        <CashierAddExpenseModal />
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
            onClick={handleOpenModal}
          >
            Harajat qo'shish
          </Button>
        </div>
        <MainDataTable
          mobile={true}
          columns={columns}
          isLoading={expensesRes.isLoading || expensesRes.isFetching}
          data={expensesData}
          showDatePicker={true}
          setDateValue={setSelectDate}
          pagination={false}
          customHeader={
            <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
              <Select
                style={{ width: "200px" }}
                allowClear
                showSearch
                placeholder="Xarajat turini"
                loading={expensesCategoryRes?.isLoading}
                filterOption={(inputValue, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
                onChange={setExpenseCategory}
              >
                {expensesCategoryOptions.map((option) => (
                  <Select.Option value={option.id} key={option.id}>
                    {option?.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          }
        />
        {expensesData?.length ? (
          <div style={{ display: "flex", gap: "100px", marginTop: "3rem" }}>
            <div>
              <p>
                Jami naqd: <b>{totalData?.jaminaqd}</b>
              </p>
              <p>
                Jami usd: <b>{totalData?.jamiusd}</b>
              </p>
              <p>
                Jami bank: <b>{totalData?.jamibank}</b>
              </p>
              <p>
                Jami karta: <b>{totalData?.jamikarta}</b>
              </p>
              <p>
                Jami: <b>{totalData?.jami}</b>
              </p>
            </div>
          </div>
        ) : null}
      </Section>
    </>
  );
}

export default CashierExpenses;

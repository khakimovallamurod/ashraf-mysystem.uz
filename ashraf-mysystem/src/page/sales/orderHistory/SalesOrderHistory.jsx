import {
  CheckOutlined,
  CloseOutlined,
  PrinterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Select, Space, Tag, Tooltip, message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MainModal from "../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import PrintChekOfSales from "../../../components/common/printChek/PrintChekOfSales";
import Section from "../../../components/common/section/Section";
import SupplierOrderSalesGive from "../../../components/supplier/order/orderSales/SupplierOrderSalesGive";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetSalesCustomerQuery } from "../../../features/sales/customer/salesCustomerApiSlice";
import {
  useGetSalesOrderHistoryByDateMutation,
  useGetSalesOrderHistoryQuery,
} from "../../../features/sales/orderHistory/salesOrderHistoryApiSlice";
import { usePutSalesPrintChekConfirmMutation } from "../../../features/sales/salesApiSlice";
import formatCurrency from "../../../util/formatCurrency";
import SupplierDebtForm from "../../supplier/debt/components/SupplierDebtForm";
import SalesOrderCloseModal from "./components/SalesOrderCloseModal";

function SalesOrderHistory() {
  /* Ref */
  const printRef = useRef(null);
  const closeModalRef = useRef(null);

  /* State */
  const [printData, setPrintData] = useState({
    orderId: null,
    productList: [],
    customer: {
      name: "",
      balance: "",
      allTelefon: [],
    },
    date: "",
    chekId: "",
  });
  const [orderDebt, setOpenDebt] = useState(false);
  const [printIsLoading, setPrintIsLoading] = useState(false);
  const [selectCustomer, setSelectSupplier] = useState(null);
  const [selectDate, setSelectDate] = useState({
    start: "",
    end: "",
  });
  const [selectCustErr, setSelectCustErr] = useState(false);
  const [allResData, setAllResData] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [mount, setMount] = useState(0);
  const [isSubbmitting, setIsSubmitting] = useState(false);

  // modal
  const [openGiveOrderModal, setOpenGiveOrderModal] = useState({
    open: false,
    orderId: null,
  });

  /* API */
  const { data, isLoading, isError, refetch } = useGetSalesOrderHistoryQuery();
  const [getDataByDate] = useGetSalesOrderHistoryByDateMutation();
  const [putConfirmPrintChek] = usePutSalesPrintChekConfirmMutation();
  const customerRes = useGetSalesCustomerQuery();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getData";

  /* Memo */
  const customerOptions = useMemo(() => {
    if (
      customerRes?.data?.success === true &&
      customerRes?.data?.data &&
      Array.isArray(customerRes?.data?.data)
    ) {
      return customerRes?.data.data;
    }
    return [];
  }, [customerRes?.data]);

  useEffect(() => {
    if (mount >= 1) {
      setSelectCustErr(false);

      handleGetDataByDate({ ...selectDate, customer: selectCustomer });
    }
    setMount(true);
  }, [selectCustomer, selectDate]);

  /* Handle get data */
  const handleGetDataByDate = async (values) => {
    if (!values.start || !values.end) {
      setFilterData([]);
      return;
    }
    /* Set Event */
    setIsSubmitting(true);

    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const resData = await getDataByDate({
        customerId: values.customer || 0,
        start: values.start,
        end: values.end,
      }).unwrap();

      if (resData?.success === true) {
        if (resData?.data && Array.isArray(resData?.data)) {
          const newData = resData.data?.map((item) => ({
            ...item,
            id: item?.id,
            customerName: item?.client?.fio,
            customer: {
              old_balance: item?.old_client_balans,
              name: item?.client?.fio,
              balance: item?.client?.balans,
              allTelefon: [
                item?.client?.telefon,
                item?.client?.telefon2,
                item?.client?.telefon3,
              ],
              location: item?.client?.manzil,
              debt: item?.client?.balans,
            },
            sellerName: item?.sotuvchi,
            date: item?.vaqt,
            status: item?.status,
            productList: item?.product_list?.map((innerItem) => ({
              id: innerItem.id,
              productName: innerItem?.product_name,
              price: innerItem?.price,
              mass: innerItem?.massa,
              total: innerItem?.summa,
              completedMass: innerItem?.tayyorlandi,
              orderId: item?.id,
            })),
            after_balans: item?.after_balans,
            printStatus: item?.print,
            allPoductTotalPrice: item?.all_summa,
          }));
          setFilterData([...newData]);
          setAllResData(resData?.data);
        } else {
          setFilterData([]);
          setAllResData(null);
        }

        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        setFilterData([]);
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sortType: "number",
    },
    {
      title: "Izoh",
      dataIndex: "izoh",
      width: 150,
      sortType: "string",
    },
    {
      title: "Mijoz nomi",
      dataIndex: "customerName",
      width: 150,
      sortType: "string",
    },
    {
      expand: true,
    },
    {
      title: "Mahsulotlar",
      dataIndex: "mahsulotlar",
      width: 150,
      sortType: "string",
      render: (_, { productList }) => (
        <Button type="link">Mahsulotlar ({productList?.length})</Button>
      ),
    },
    {
      title: "Sana",
      dataIndex: "date",
      width: 150,
      sortType: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      filters: [
        {
          text: "new",
          value: "new",
        },
        {
          text: "tayyorlanmoqda",
          value: "tayyorlanmoqda",
        },
        {
          text: "tayyorlandi",
          value: "tayyorlandi",
        },
        {
          text: "tugatildi",
          value: "tugatildi",
        },
        {
          text: "dostavka",
          value: "dostavka",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => {
        let color = "";
        switch (status) {
          case "new":
            color = "#ff0099";
            break;
          case "tayyorlanmoqda":
            color = "#07e0a3";
            break;
          case "tayyorlandi":
            color = "yellow-inverse";
            break;
          case "tugatildi":
            color = "red-inverse";
            break;
          case "dostavka":
            color = "#4788f7";
            break;
          case "topshirildi":
            color = "#059b3e";
            break;
          default:
        }

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Amal",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (
        _,
        {
          id,
          productList,
          date,
          customer,
          allPoductTotalPrice,
          after_balans,
          dostavchik,
          dostavchik_telefon,
          agent,
          status,
          printed_status,
        }
      ) => (
        <Space>
          <Button
            icon={<PrinterOutlined />}
            type="primary"
            size="small"
            style={{ background: printed_status ? "#4dc93a" : "" }}
            danger={!printed_status}
            shape="round"
            onClick={() => {
              setPrintData({
                orderId: id,
                productList: [...productList],
                customer,
                afterBalance: after_balans,
                date: date,
                allPoductTotalPrice,
                supplier: {
                  name: dostavchik,
                  telefon: dostavchik_telefon,
                },
                agent,
              });
              setTimeout(() => {
                handlePrint(id);
              }, 500);
            }}
          />
          <Tooltip title="Buyurtmani topshirish">
            <Button
              disabled={!["tayyorlandi", "dostavka"].includes(status)}
              size="small"
              icon={
                printed_status ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.394 13.742L7.137 17.362L14.753 8.658L13.247 7.342L6.863 14.638L3.606 12.152L2.394 13.742ZM21.753 8.658L20.247 7.342L13.878 14.621L13.125 14.019L11.875 15.581L14.122 17.379L21.753 8.658Z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <CheckOutlined />
                )
              }
              shape="round"
              type="primary"
              onClick={() => handleOpenGiveOrderModal({ id })}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  /* Handle submit confirm print */
  const handleConfirmPrintChek = async (orderId) => {
    setPrintIsLoading(true);
    try {
      const res = await putConfirmPrintChek({ orderId }).unwrap();
    } finally {
      setPrintIsLoading(false);
    }
  };

  /* Modal */
  const handleOpenGiveOrderModal = ({ id }) => {
    const res = filterData.find((item) => item.id === id);

    if (res) {
      setOpenGiveOrderModal({
        open: true,
        orderId: id,
      });
    }
  };
  const handleCloseOpenGiveOrderModal = () =>
    setOpenGiveOrderModal({ open: false, orderId: null });

  /* Handle grind */
  const handlePrint = (orderId) => {
    printRef.current?.print();
    handleConfirmPrintChek(orderId);
  };

  const handleOpenModalClose = (data) => {
    closeModalRef?.current?.onOpen(data);
  };

  /* Debt modal */
  const handleOpenDebtModal = () => setOpenDebt(true);
  const handleCloseDebtModal = () => setOpenDebt(false);

  return (
    <>
      {contextHolder}

      {/* Print chek */}
      <PrintChekOfSales ref={printRef} printData={printData} />

      {/* Close order modal */}
      <SalesOrderCloseModal ref={closeModalRef} />

      {/* Order give */}
      <MainModal open={orderDebt} onClose={handleCloseDebtModal}>
        <SupplierDebtForm />
      </MainModal>
      {/* Order give */}
      <MainModal
        open={openGiveOrderModal.open}
        onClose={handleCloseOpenGiveOrderModal}
      >
        <SupplierOrderSalesGive
          orderId={openGiveOrderModal.orderId}
          onClose={handleCloseOpenGiveOrderModal}
          from="sales"
        />
      </MainModal>

      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1.2rem",
            gap: "1rem",
          }}
        >
          <Button icon={<CheckOutlined />} onClick={handleOpenDebtModal}>
            Qarz yechish
          </Button>
          <Button icon={<ReloadOutlined />} type="primary" onClick={refetch}>
            Yangilash
          </Button>
        </div>
        <MainDataTable
          columns={columns}
          isLoading={isLoading}
          isError={isError}
          data={filterData}
          refetch={refetch}
          showDatePicker={true}
          setDateValue={setSelectDate}
          customHeader={
            <Select
              style={{ width: "200px" }}
              allowClear
              showSearch
              placeholder="Mijozni tanlash"
              loading={false}
              filterOption={(inputValue, option) =>
                option.children
                  .toLowerCase()
                  .indexOf(inputValue.toLowerCase()) >= 0
              }
              status={selectCustErr ? "error" : ""}
              onChange={setSelectSupplier}
            >
              {customerOptions.map((option) => (
                <Select.Option value={option.id} key={option.id}>
                  {option?.fio}
                </Select.Option>
              ))}
            </Select>
          }
          expandableTable={{
            name: "productList",
            columns: [
              {
                title: "Mahsulot nomi",
                dataIndex: "productName",
                width: 100,
              },
              {
                title: "Massa",
                dataIndex: "mass",
                width: 100,
                render: (_, { mass }) => (
                  <Tag color="blue">
                    <b>
                      <MainNumberFormat value={mass} />
                    </b>{" "}
                    kg
                  </Tag>
                ),
              },
              {
                title: "Tayyorlandi",
                dataIndex: "completedMass",
                width: 100,
                render: (_, { completedMass }) => (
                  <Tag color="blue">
                    <b>
                      <MainNumberFormat value={completedMass} />
                    </b>{" "}
                    kg
                  </Tag>
                ),
              },
              {
                title: "Price",
                dataIndex: "price",
                width: 100,
                render: (_, { price }) => (
                  <Tag color="cyan-inverse">
                    <b>{formatCurrency(price)}</b>{" "}
                  </Tag>
                ),
              },
              {
                title: "Summa",
                dataIndex: "total",
                width: 100,
                render: (_, { total }) => (
                  <Tag color="cyan-inverse">
                    <b>{formatCurrency(total)}</b>{" "}
                  </Tag>
                ),
              },
              {
                title: "Amal",
                key: "operation",
                fixed: "right",
                width: 60,
                render: (_, { orderId, id }) => (
                  <Tooltip title="Buyurtmani bekor qilish">
                    <Button
                      size="small"
                      icon={<CloseOutlined />}
                      shape="round"
                      type="primary"
                      danger
                      onClick={() =>
                        handleOpenModalClose({
                          orderId: orderId,
                          productId: id,
                        })
                      }
                    />
                  </Tooltip>
                ),
              },
            ],
          }}
        />
      </Section>
    </>
  );
}

export default SalesOrderHistory;

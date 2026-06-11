import { PrinterOutlined } from "@ant-design/icons";
import { Button, Divider, Select, message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MainTableCard from "../../../components/common/mainTableCard/MainTableCard";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainPrintTableData from "../../../components/common/printTableData/MainPrintTableData";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetSalesSupplierQuery } from "../../../features/sales/customer/salesCustomerApiSlice";
import { useGetSalesReportCustomerMutation } from "../../../features/sales/salesApiSlice";
import formatCurrency from "../../../util/formatCurrency";

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function SalesReportCustomer() {
  /* Ref */
  const printTableRef = useRef(null);

  /* State */
  const [allResData, setAllResData] = useState(null);
  const [isSubbmitting, setIsSubmitting] = useState(false);
  const [selectSupplier, setSelectSupplier] = useState(null);
  const [selectDate, setSelectDate] = useState({
    start: "",
    end: "",
  });
  const [selectCustErr, setSelectCustErr] = useState(false);
  const [mount, setMount] = useState(0);
  const [filterData, setFilterData] = useState([]);

  /* API */
  const supplierRes = useGetSalesSupplierQuery();
  const [getDataByDate] = useGetSalesReportCustomerMutation();
  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getData";

  /* Memo */
  const supplierOptions = useMemo(() => {
    if (
      supplierRes?.data?.success === true &&
      supplierRes?.data?.data &&
      Array.isArray(supplierRes?.data?.data)
    ) {
      return supplierRes?.data.data;
    }
    return [];
  }, [supplierRes?.data]);

  useEffect(() => {
    if (mount >= 1) {
      // if (!selectCustomer) {
      //   setSelectCustErr(true);
      //   message.error("Mijozni tanlang");
      //   return () => null;
      // }
      setSelectCustErr(false);

      handleGetDataByDate({ ...selectDate, supplier: selectSupplier });
    }
    setMount(true);
  }, [selectSupplier, selectDate]);

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
        supplier: values.supplier,
        start: values.start,
        end: values.end,
      }).unwrap();

      if (resData?.success === true) {
        if (
          resData?.success === true &&
          resData?.data &&
          resData?.data?.akt &&
          Array.isArray(resData?.data?.akt)
        ) {
          const newData = resData?.data?.akt.map((item, index) => ({
            ...item,
            id: index + 1,
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
      title: "T/r",
      dataIndex: "id",
      width: 150,
      sortType: "number",
    },
    {
      title: "FIO",
      dataIndex: "fio",
      width: 150,
      sortType: "string",
    },
    {
      title: "Eski qarzi",
      dataIndex: "eski_qarz",
      width: 150,
      sortType: "number",
      render: (_, { eski_qarz }) => <MainNumberFormat value={eski_qarz} />,
    },
    {
      title: "Debet",
      dataIndex: "debit",
      width: 150,
      sortType: "number",
      render: (_, { debit }) => <MainNumberFormat value={debit} />,
    },
    {
      title: "Kredit",
      dataIndex: "jamikredit",
      width: 150,
      sortType: "number",
      render: (_, { jamikredit }) => <MainNumberFormat value={jamikredit} />,
    },
    {
      title: "Qaytarilgan",
      dataIndex: "qaytarilgan",
      width: 150,
      sortType: "number",
      render: (_, { qaytarilgan }) => <MainNumberFormat value={qaytarilgan} />,
    },
    {
      title: "Saldo",
      dataIndex: "saldo",
      width: 150,
      sortType: "number",
      render: (_, { saldo }) => <MainNumberFormat value={saldo} />,
    },
  ];

  /* Handle print expand table */
  const handlePrintData = () => printTableRef.current.onPrint();

  return (
    <>
      {contextHolder}

      <MainPrintTableData
        ref={printTableRef}
        columns={columns}
        data={filterData}
        footer={
          filterData?.length ? (
            <div style={{ display: "flex", textAlign: "left", gap: "3rem" }}>
              <div>
                <p>Jami eski qarz: <b>{formatCurrency(safeNumber(allResData?.jami_eski_qarz))} so'm</b></p>
                <p>Berilgan yuklar: <b>{formatCurrency(safeNumber(allResData?.jamidebit))} so'm</b></p>
                <p>Kredit: <b>{formatCurrency(safeNumber(allResData?.jamikredit))} so'm</b></p>
                <p>Qaytarilgan: <b>{formatCurrency(safeNumber(allResData?.jamiqaytarilgan))} so'm</b></p>
                <p>Saldo: <b>{formatCurrency(safeNumber(allResData?.jami_saldo))} so'm</b></p>
              </div>
            </div>
          ) : null
        }
      />

      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <MainTableCard
              isLoading={isSubbmitting}
              title={formatCurrency(safeNumber(allResData?.jami_eski_qarz))}
              caption={"Eski qarz"}
              mode="danger"
            />
            <MainTableCard
              isLoading={isSubbmitting}
              title={formatCurrency(safeNumber(allResData?.jamidebit))}
              caption={"Berilgan yuklar"}
              mode="brown"
            />
            <MainTableCard
              isLoading={isSubbmitting}
              title={formatCurrency(safeNumber(allResData?.jamikredit))}
              caption={"Kredit"}
              mode="success"
            />
            <MainTableCard
              isLoading={isSubbmitting}
              title={formatCurrency(safeNumber(allResData?.jamiqaytarilgan))}
              caption={"Qaytarilgan"}
              mode="danger"
            />
            <MainTableCard
              isLoading={isSubbmitting}
              title={formatCurrency(safeNumber(allResData?.jami_saldo))}
              caption={"Saldo"}
              mode="danger"
            />
          </div>
          <Button
            onClick={handlePrintData}
            icon={<PrinterOutlined />}
            shape="round"
            type="primary"
          />
        </div>

        <Divider />

        <div>
          <MainDataTable
            pagination={true}
            columns={columns}
            isLoading={isSubbmitting}
            // isError={isError}
            // refetch={refetch}
            data={filterData}
            showDatePicker={true}
            setDateValue={setSelectDate}
            customHeader={
              <Select
                style={{ width: "200px" }}
                allowClear
                showSearch
                placeholder="Dastavkachini tanlash"
                loading={false}
                filterOption={(inputValue, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) >= 0
                }
                status={selectCustErr ? "error" : ""}
                onChange={setSelectSupplier}
              >
                {supplierOptions.map((option) => (
                  <Select.Option value={option.id} key={option.id}>
                    {option?.dostavchik}
                  </Select.Option>
                ))}
              </Select>
            }
          />
        </div>
      </Section>
    </>
  );
}

export default SalesReportCustomer;

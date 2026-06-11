import { PrinterOutlined } from "@ant-design/icons";
import { Button, Divider, Select, message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainPrintTableData from "../../../components/common/printTableData/MainPrintTableData";
import SalesShowReportDetailModal from "../../../components/common/sales/showReportDetail/SalesShowReportDetailModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import {
  useGetCashierSupplierHistoryByDateMutation,
  useGetCashierSupplierQuery,
} from "../../../features/cashier/supplier/cashierSupplierApiSlice";
import formatCurrency from "../../../util/formatCurrency";

function CashierSupplierHistory() {
  /* Ref */
  const printTableRef = useRef(null);
  const showReportDetailModalRef = useRef(null);

  /* State */
  const [isSubbmitting, setIsSubmitting] = useState();
  const [filterData, setFilterData] = useState([]);
  const [selectDate, setSelectDate] = useState({
    start: "",
    end: "",
  });
  const [mount, setMount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [allResData, setAllResData] = useState(null);
  const [selectSupplier, setSelectCustomer] = useState(null);

  /* API */
  const supplierRes = useGetCashierSupplierQuery();
  const [getDataByDate] = useGetCashierSupplierHistoryByDateMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getData";

  /* Memo */
  const providerOptions = useMemo(() => {
    if (
      supplierRes?.data?.success === true &&
      supplierRes?.data?.data?.list &&
      Array.isArray(supplierRes?.data?.data?.list)
    ) {
      return supplierRes?.data.data.list;
    }
    return [];
  }, [supplierRes?.data]);

  useEffect(() => {
    if (mount >= 1) {
      handleGetDataByDate({ ...selectDate, supplierId: selectSupplier });
    }
    setMount(true);
  }, [selectSupplier, selectDate]);

  useEffect(() => {
    setTableData(
      filterData.sort((a, b) => parseInt(b.sana) - parseInt(a.sana))
    );
  }, [filterData]);

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
        start: values.start,
        end: values.end,
        supplierId: values.supplierId,
      }).unwrap();

      if (resData?.success === true) {
        if (
          resData?.success === true &&
          resData?.data &&
          resData?.data?.list &&
          Array.isArray(resData?.data?.list)
        ) {
          const newData = resData?.data?.list.map((item, index) => ({
            ...item,
            id: index,
          }));
          setFilterData([...newData]);
          setAllResData(resData?.data);
        } else {
          setFilterData([]);
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
      width: 80,
      sortType: "number",
    },
    {
      title: "Dostavchik",
      dataIndex: "dostavchik",
      width: 150,
      sortType: "string",
    },
    {
      title: "Naqd so'm",
      dataIndex: "naqdsum",
      width: 150,
      render: (_, { naqdsum }) => <MainNumberFormat value={naqdsum} />,
      sortType: "number",
    },
    {
      title: "Naqd usd",
      dataIndex: "naqdusd",
      width: 150,
      render: (_, { naqdusd }) => <MainNumberFormat value={naqdusd} />,
      sortType: "number",
    },
    {
      title: "Bank",
      dataIndex: "bank",
      width: 150,
      render: (_, { bank }) => <MainNumberFormat value={bank} />,
      sortType: "number",
    },
    {
      title: "Karta",
      dataIndex: "karta",
      width: 150,
      render: (_, { karta }) => <MainNumberFormat value={karta} />,
      sortType: "number",
    },
  ];

  /* Handle print expand table */
  const handlePrintData = () => printTableRef.current.onPrint();

  return (
    <>
      {contextHolder}

      <SalesShowReportDetailModal ref={showReportDetailModalRef} />

      <MainPrintTableData
        ref={printTableRef}
        columns={columns}
        data={tableData}
        header={
          tableData?.length ? (
            <div style={{ display: "flex", gap: "100px" }}>
              <p>
                Mijoz nomi: <b>{allResData?.client?.fio}</b>
              </p>
              <div style={{ display: "flex", gap: "2rem" }}>
                <p>Telefonlari:</p>
                <div style={{ fontSize: "12px" }}>
                  {allResData?.client?.telefon},<br />
                  {allResData?.client?.telefon2}, <br />
                  {allResData?.client?.telefon3}
                </div>
              </div>
            </div>
          ) : null
        }
        footer={
          tableData?.length ? (
            <div style={{ padding: "1rem 0" }}>
              <p>
                Jami debet: <b>{allResData?.jamidebit}</b>
              </p>
              <p>
                Jami kredit: <b>{allResData?.jamikredit}</b>
              </p>
              <p>
                Debet: <b>{allResData?.client?.balans}</b>
              </p>
            </div>
          ) : null
        }
      />

      <Section>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
            columns={columns}
            isLoading={isSubbmitting}
            data={tableData}
            showDatePicker={true}
            setDateValue={setSelectDate}
            pagination={false}
            customHeader={
              <div
                style={{ display: "flex", gap: "3rem", alignItems: "center" }}
              >
                <Select
                  style={{ width: "200px" }}
                  allowClear
                  showSearch
                  placeholder="Dostavkachi tanlash"
                  loading={supplierRes?.isLoading}
                  filterOption={(inputValue, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) >= 0
                  }
                  onChange={setSelectCustomer}
                >
                  {providerOptions.map((option) => (
                    <Select.Option value={option.id} key={option.id}>
                      {option?.dostavchik}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            }
          />
          {tableData?.length ? (
            <div style={{ display: "flex", gap: "100px", marginTop: "3rem" }}>
              <div>
                <p>
                  Jami summa: <b>{formatCurrency(allResData?.jamisum)}</b>
                </p>
              </div>
              <div>
                <p>
                  Jami naqd: <b>{formatCurrency(allResData?.jaminaqd)}</b>
                </p>
                <p>
                  Jami usd: <b>{formatCurrency(allResData?.jamiusd)}</b>
                </p>
                <p>
                  Jami bank: <b>{formatCurrency(allResData?.jamibank)}</b>
                </p>
                <p>
                  Jami karta: <b>{formatCurrency(allResData?.jamikarta)}</b>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </Section>
    </>
  );
}

export default CashierSupplierHistory;

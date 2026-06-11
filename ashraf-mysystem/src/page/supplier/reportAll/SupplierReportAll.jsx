import { Button, Divider, Select, Tag, message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainPrintTableData from "../../../components/common/printTableData/MainPrintTableData";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetSalesReportAllMutation } from "../../../features/sales/salesApiSlice";
import formatCurrency from "../../../util/formatCurrency";
import { PrinterOutlined } from "@ant-design/icons";
import { useGetSalesSupplierQuery } from "../../../features/sales/customer/salesCustomerApiSlice";

function SupplierReportAll() {
  /* Ref */
  const printTableRef = useRef(null);

  /* State */
  const [isSubbmitting, setIsSubmitting] = useState();
  const [filterData, setFilterData] = useState([]);
  const [selectSupplier, setSelectSupplier] = useState(null);
  const [selectDate, setSelectDate] = useState({
    start: "",
    end: "",
  });
  const [selectCustErr, setSelectCustErr] = useState(false);
  const [mount, setMount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [allResData, setAllResData] = useState();

  /* API */
  const supplierRes = useGetSalesSupplierQuery();
  const [getDataByDate] = useGetSalesReportAllMutation();

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
            id: index,
          }));
          setFilterData([...newData]);
          setAllResData(resData?.data);
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
    // {
    //   title: "Summa",
    //   dataIndex: "summa",
    //   width: 150,
    //   sortType: "number",
    //   render: (_, { summa }) => <MainNumberFormat value={summa} />,
    // },
    {
      title: "FIO",
      dataIndex: "fio",
      width: 150,
      sortType: "string",
    },
    {
      title: "Debet",
      dataIndex: "debit",
      width: 150,
      sortType: "number",
      render: (_, { debit }) => <MainNumberFormat value={debit} />,
    },
    {
      title: "Jami to'lov",
      dataIndex: "jamikredit",
      width: 150,
      sortType: "number",
      render: (_, { jamikredit }) => <MainNumberFormat value={jamikredit} />,
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
        data={tableData}
        footer={
          tableData?.length ? (
            <div style={{ display: "flex", gap: "3rem" }}>
              <div>
                <p>
                  Jami debet: <b>{formatCurrency(allResData?.jamidebit)}</b>
                </p>
                <p>
                  Jami kredit: <b>{formatCurrency(allResData?.jamikredit)}</b>
                </p>
              </div>
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
            pagination={false}
            customHeader={
              <>
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
              </>
            }
            mobile={true}
            columns={columns}
            isLoading={isSubbmitting}
            // isError={isError}
            data={tableData}
            // refetch={refetch}
            showDatePicker={true}
            setDateValue={setSelectDate}
          />
          {tableData?.length ? (
            <div style={{ display: "flex", gap: "3rem", marginTop: "2rem" }}>
              <div>
                <p>
                  Jami debet: <b>{formatCurrency(allResData?.jamidebit)}</b>
                </p>
                <p>
                  Jami kredit: <b>{formatCurrency(allResData?.jamikredit)}</b>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </Section>
    </>
  );
}

export default SupplierReportAll;

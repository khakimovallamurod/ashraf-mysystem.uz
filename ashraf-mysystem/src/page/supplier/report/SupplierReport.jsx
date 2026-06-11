import { EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Divider, Select, Tag, message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainPrintTableData from "../../../components/common/printTableData/MainPrintTableData";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetSalesCustomerQuery } from "../../../features/sales/customer/salesCustomerApiSlice";
import { useGetSalesReportMutation } from "../../../features/sales/salesApiSlice";
import SalesShowReportDetailModal from "../../../components/common/sales/showReportDetail/SalesShowReportDetailModal";

function SupplierReport() {
  /* Ref */
  const printTableRef = useRef(null);
  const showReportDetailModalRef = useRef(null);

  /* State */
  const [isSubbmitting, setIsSubmitting] = useState();
  const [filterData, setFilterData] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState(null);
  const [selectDate, setSelectDate] = useState({
    start: "",
    end: "",
  });
  const [selectCustErr, setSelectCustErr] = useState(false);
  const [mount, setMount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [allResData, setAllResData] = useState();

  /* API */
  const customerRes = useGetSalesCustomerQuery();
  const [getDataByDate] = useGetSalesReportMutation();

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
      if (!selectCustomer) {
        setSelectCustErr(true);
        message.error("Mijozni tanlang");
        return () => null;
      }
      setSelectCustErr(false);

      handleGetDataByDate({ ...selectDate, customerId: selectCustomer });
    }
    setMount(true);
  }, [selectCustomer, selectDate]);

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
        customerId: selectCustomer,
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
          const newData = resData?.data?.akt;
          setFilterData([...newData]);
          setAllResData(resData?.data);
        }else {
          setFilterData([])
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
      title: "Debet",
      dataIndex: "debit",
      width: 150,
      sortType: "number",
      render: (_, { debit }) => <MainNumberFormat value={debit} />,
    },
    {
      title: "To'lovlar",
      dataIndex: "kredit",
      width: 150,
      sortType: "number",
      render: (_, { kredit }) => <MainNumberFormat value={kredit} />,
    },
    {
      title: "Vaqt",
      dataIndex: "vaqt",
      width: 150,
      sortType: "date",
      render: (_, { vaqt }) => <Tag color="cyan-inverse">{vaqt}</Tag>,
    },
    {
      title: "Amal",
      dataIndex: "operation",
      width: 100,
      align: "center",
      render: (_, item) => (
        <Button
          shape="round"
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() =>
            handleOpenReportDetailModal({ id: item.id, status: item.status })
          }
        />
      ),
    },
  ];

  alert('render')

  /* Handle print expand table */
  const handlePrintData = () => printTableRef.current.onPrint();
  const handleOpenReportDetailModal = ({ id, status }) =>
    showReportDetailModalRef.current.onOpen({ id, status });

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
                Saldo:{" "}
                <b>
                  <MainNumberFormat value={allResData?.saldo} />
                </b>
              </p>

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
            mobile={true}
            columns={columns}
            isLoading={isSubbmitting}
            // isError={isError}
            data={tableData}
            // refetch={refetch}
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
                  placeholder="Xaridorni tanlash"
                  loading={customerRes?.isLoading}
                  filterOption={(inputValue, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) >= 0
                  }
                  status={selectCustErr ? "error" : ""}
                  onChange={setSelectCustomer}
                >
                  {customerOptions.map((option) => (
                    <Select.Option value={option.id} key={option.id}>
                      {option?.fio}
                    </Select.Option>
                  ))}
                </Select>
                <p>
                  Saldo:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.saldo} />
                  </b>
                </p>
              </div>
            }
          />
          {tableData?.length ? (
            <div style={{ display: "flex", gap: "3rem", marginTop: "3rem" }}>
              <div style={{ display: "flex", gap: "100px" }}>
                <p>
                  Mijoz nomi: <b>{allResData?.client?.fio}</b>
                </p>
                <div style={{ display: "flex", gap: "2rem" }}>
                  <p>Telefonlari:</p>
                  <div>
                    {allResData?.client?.telefon},<br />
                    {allResData?.client?.telefon2}, <br />
                    {allResData?.client?.telefon3}
                  </div>
                </div>
              </div>
              <div>
                <p>
                  Jami debet:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.jamidebit} />
                  </b>
                </p>
                <p>
                  Jami kredit:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.jamikredit} />
                  </b>
                </p>
                <p>
                  Eski qarz:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.eski_balans} />
                  </b>
                </p>
                {/* <p>
                  Debet:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.client?.balans} />
                  </b>
                </p> */}
              </div>
            </div>
          ) : null}
        </div>
      </Section>
    </>
  );
}

export default SupplierReport;

import { PrinterOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Select, Tag, message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import TableTd from "../../../components/common/mainExportTable/TableTd";
import TableTh from "../../../components/common/mainExportTable/TableTh";
import TableTr from "../../../components/common/mainExportTable/TableTr";
import MainTableRowCard from "../../../components/common/mainTableCard/MainTableRowCard";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainPrintTableData from "../../../components/common/printTableData/MainPrintTableData";
import SalesShowReportDetailModal from "../../../components/common/sales/showReportDetail/SalesShowReportDetailModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetSalesCustomerQuery } from "../../../features/sales/customer/salesCustomerApiSlice";
import { useGetSalesReportMutation } from "../../../features/sales/salesApiSlice";
import useParamQuery from "../../../hooks/useParamQuery";
import formatCurrency from "../../../util/formatCurrency";

const localStorageName = "salesLocalStorageName";

function SalesReport() {
  /* Form */
  const [form] = Form.useForm();

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
  const [printTable, setPrintTable] = useState([]);

  /* Navigate */
  const navigate = useNavigate();

  const { pathname } = useLocation();

  /* Query */
  const query = useParamQuery();

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
      const paramCustomerId = query.get("customer");

      if (paramCustomerId) {
        /* Browser param */
        const customer = customerRes?.data.data.find(
          (item) => item.id === paramCustomerId
        );
        if (customer) {
          setTimeout(() => {
            form.setFieldValue("customer", customer.id);
            setSelectCustomer(customer.id);
          }, 400);
        }
      } else {
        /* Local storage */
        const salesReportData = localStorage.getItem(localStorageName);
        if (salesReportData) {
          const res = JSON.parse(salesReportData);

          if (res?.salesReport) {
            setTimeout(() => {
              form.setFieldValue("customer", res?.salesReport?.selectCustomer);
              setSelectCustomer(res?.salesReport?.selectCustomer);
            }, 400);
          } else {
            localStorage.removeItem(localStorageName);
          }
        }
      }

      return customerRes?.data.data;
    }
    return [];
  }, [customerRes?.data]);

  /* Print table data */
  useEffect(() => {
    if (tableData?.length) {
      const newData = [];

      tableData.forEach((item) => {
        newData.push({
          ...item,
          kredit: item.status === "olingan" ? item.kredit : 0,
          vozvrat: item.status === "vozvrat" ? item.kredit : 0,
        });
      });
      setPrintTable([...newData]);
    }
  }, [tableData]);

  /* Config */
  useEffect(() => {
    let dateStart = query.get("start");
    let dateEnd = query.get("end");

    const salesReportData = localStorage.getItem(localStorageName);
    if (salesReportData && !dateStart && !dateStart) {
      const res = JSON.parse(salesReportData);
      if (res?.salesReport) {
        setSelectDate({ ...res?.salesReport?.selectDate });
      } else {
        localStorage.removeItem(localStorageName);
      }
    }

    if (dateStart || dateEnd) {
      setSelectDate({
        start: dateStart,
        end: dateEnd,
      });
    }
  }, []);

  useEffect(() => {
    if (mount >= 1) {
      if (!selectCustomer && !customerRes.isLoading) {
        setSelectCustErr(true);
        message.error("Mijozni tanlang");
        return () => null;
      }
      setSelectCustErr(false);

      handleGetDataByDate({ ...selectDate, customerId: selectCustomer });

      /* Navigate */
      if (selectCustomer && (selectDate.start || selectDate.end)) {
        navigate(
          `${pathname}?customer=${selectCustomer}&start=${selectDate.start}&end=${selectDate.end}`
        );
        localStorage.setItem(
          localStorageName,
          JSON.stringify({
            salesReport: {
              selectCustomer,
              selectDate,
            },
          })
        );
      }
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
    setTableData([]);
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
      title: "Berilgan yuklar",
      dataIndex: "debit",
      width: 150,
      sortType: "number",
      render: (_, item) => (
        <Button
          style={{ width: "100%", textAlign: "left" }}
          type="text"
          disabled={item.status !== "berilgan"}
          onClick={() =>
            handleOpenReportDetailGivenModal({
              id: item.id,
              status: item.status,
            })
          }
        >
          <MainNumberFormat value={item.debit} />
        </Button>
      ),
    },
    {
      title: "To'lovlar",
      dataIndex: "kredit",
      width: 150,
      sortType: "number",
      render: (_, item) => (
        <Button
          style={{ width: "100%", textAlign: "left" }}
          type="text"
          disabled={item.status !== "olingan"}
          onClick={() =>
            handleOpenReportDetailModal({ id: item.id, status: item.status })
          }
        >
          {item.status !== "olingan" ? (
            0
          ) : (
            <MainNumberFormat value={item.kredit} />
          )}
        </Button>
      ),
    },
    {
      title: "Qaytarilgan",
      dataIndex: "vozvrat",
      width: 150,
      sortType: "number",
      render: (_, item) => (
        <Button
          style={{ width: "100%", textAlign: "left" }}
          type="text"
          disabled={item.status !== "vozvrat"}
          onClick={() =>
            handleOpenReportDetailModal({
              id: item.id,
              status: item.status,
            })
          }
        >
          {item.status !== "vozvrat" ? (
            0
          ) : (
            <MainNumberFormat value={item.vozvrat} />
          )}
        </Button>
      ),
    },
    {
      title: "Izoh",
      dataIndex: "izoh",
      width: 150,
    },
    {
      title: "Vaqt",
      dataIndex: "vaqt",
      width: 150,
      sortType: "date",
      render: (_, { vaqt }) => <Tag color="cyan-inverse">{vaqt}</Tag>,
    },
  ];
  const exportColumns = [
    {
      dataIndex: "vaqt",
    },
    {
      dataIndex: "debit",
      numberFormat: true,
    },
    {
      dataIndex: "kredit",
      numberFormat: true,
    },
    {
      dataIndex: "vozvrat",
      numberFormat: true,
    },
    {
      dataIndex: "customer_debit",
      numberFormat: true,
    },
    {
      dataIndex: "customer_kredit",
      numberFormat: true,
    },
  ];

  /* Handle print expand table */
  const handlePrintData = () => printTableRef.current.onPrint();
  const handleOpenReportDetailGivenModal = ({ id, status }) =>
    showReportDetailModalRef.current.onOpen({
      id,
      status,
      dataType: "berilgan",
    });
  const handleOpenReportDetailModal = ({ id, status }) =>
    showReportDetailModalRef.current.onOpen({ id, status });

  /* Export data */
  const exportData = useMemo(() => {
    return tableData.map((item) => ({
      ...item,
      customer_debit: item.kredit,
      customer_kredit: item.debit,
    }));
  }, [tableData]);

  return (
    <>
      {contextHolder}

      <SalesShowReportDetailModal ref={showReportDetailModalRef} />

      {/* Print Table */}
      <MainPrintTableData
        ref={printTableRef}
        columns={columns}
        data={printTable}
        header={
          tableData?.length ? (
            <table
              className="printTable border"
              style={{ marginBottom: "1rem" }}
            >
              <tbody>
                <tr>
                  <td style={{ width: "60px" }}>Mijoz nomi:</td>
                  <td>{allResData?.client?.fio}</td>
                </tr>
                <tr>
                  <td rowSpan={3}>Telefon:</td>
                  <td>{allResData?.client?.telefon}</td>
                </tr>
                <tr>
                  <td>{allResData?.client?.telefon2}</td>
                </tr>
                <tr>
                  <td>{allResData?.client?.telefon3}</td>
                </tr>
              </tbody>
            </table>
          ) : null
        }
        footer={
          tableData?.length ? (
            <table
              className="printCheckTable printTable borderRow"
              style={{ marginTop: "1rem" }}
            >
              <tbody>
                <tr>
                  <td>Eski qarz:</td>
                  <td>{formatCurrency(allResData?.eski_balans)}</td>
                </tr>
                <tr>
                  <td>Jami debet:</td>
                  <td>{formatCurrency(allResData?.jamidebit)}</td>
                </tr>
                <tr>
                  <td>Jami to'lov:</td>
                  <td>{formatCurrency(allResData?.jamikredit)}</td>
                </tr>
                <tr>
                  <td>Saldo:</td>
                  <td>{formatCurrency(allResData?.saldo)}</td>
                </tr>
              </tbody>
            </table>
          ) : null
        }
      />

      <Section>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <MainTableRowCard
              title={"Eski qarz:"}
              value={<MainNumberFormat value={allResData?.eski_balans} />}
            />
            <MainTableRowCard
              title={"Terilgan pullar qiymati:"}
              value={<MainNumberFormat value={allResData?.jamikredit} />}
            />
            <MainTableRowCard
              title={"Berilgan yuklar qiymati:"}
              value={<MainNumberFormat value={allResData?.jamidebit} />}
            />
            <MainTableRowCard
              title={"Qoldiq:"}
              value={<MainNumberFormat value={allResData?.saldo} />}
            />
          </div>

          <div
            style={{
              width: "300px",
              display: "flex",
              justifyContent: "flex-end",
              flexWrap: "wrap-reverse",
            }}
          >
            {/* Export */}
            <ExportTable
              columns={columns}
              fileName={allResData?.client?.fio}
              data={tableData}
              tableBody={
                <>
                  {/* Head */}
                  <TableTr>
                    <TableTh rowSpan={2}>Sana</TableTh>
                    <TableTh colSpan={3}>OOO "BROTHERS"</TableTh>
                    <TableTh colSpan={2}>{allResData?.client?.fio}</TableTh>
                  </TableTr>
                  <TableTr>
                    <TableTh>Debet</TableTh>
                    <TableTh>Kredit</TableTh>
                    <TableTh>Qaytarilgan</TableTh>
                    <TableTh>Debet</TableTh>
                    <TableTh>Kredit</TableTh>
                  </TableTr>
                  <TableTr>
                    <TableTh style={{ textAlign: "left" }}>Saldo</TableTh>
                    <TableTh numberFormat={true} style={{ textAlign: "right" }}>
                      {allResData?.saldo}
                    </TableTh>
                    <TableTh></TableTh>
                    <TableTh></TableTh>
                    <TableTh></TableTh>
                    <TableTh numberFormat={true} style={{ textAlign: "right" }}>
                      {allResData?.saldo}
                    </TableTh>
                  </TableTr>
                  {/* Body */}
                  {exportData?.map((item) => (
                    <TableTr key={item.id}>
                      {exportColumns.map((col) => {
                        return (
                          <TableTd
                            key={col.dataIndex}
                            numberFormat={!!col?.numberFormat}
                          >
                            {item[col.dataIndex]}
                          </TableTd>
                        );
                      })}
                    </TableTr>
                  ))}

                  {/* Footer */}
                  <TableTr style={{ color: "#536AC2" }}>
                    <TableTh style={{ textAlign: "left" }}>
                      {selectDate.start} - {selectDate.end}
                    </TableTh>
                    <TableTh numberFormat={true}>
                      {allResData?.jamidebit}
                    </TableTh>
                    <TableTh numberFormat={true}>
                      {allResData?.jamikredit}
                    </TableTh>
                    <TableTh numberFormat={true}>
                      {allResData?.jamiqaytarilgan}
                    </TableTh>
                    <TableTh numberFormat={true}>
                      {allResData?.jamikredit}
                    </TableTh>
                    <TableTh numberFormat={true}>
                      {allResData?.jamidebit}
                    </TableTh>
                  </TableTr>
                  <TableTr>
                    <TableTh>Toza massa</TableTh>
                    <TableTh
                      style={{ textAlign: "center" }}
                      colSpan={5}
                      numberFormat={true}
                    >
                      {allResData?.jamitozamassa}
                    </TableTh>
                  </TableTr>
                  <tr></tr>
                  <TableTr border={false}>
                    <TableTh border={false}>Eski qarz</TableTh>
                    <TableTh
                      border={false}
                      style={{ textAlign: "center" }}
                      colSpan={5}
                      numberFormat={true}
                    >
                      {allResData?.eski_balans}
                    </TableTh>
                  </TableTr>
                </>
              }
            />

            <Button
              onClick={handlePrintData}
              icon={<PrinterOutlined />}
              shape="round"
              type="primary"
            />
          </div>
        </div>

        <Divider />

        <div>
          <MainDataTable
            scroll={{ y: null }}
            mobile={true}
            columns={columns}
            isLoading={isSubbmitting}
            // isError={isError}
            data={tableData}
            // refetch={refetch}
            showDatePicker={true}
            setDateValue={setSelectDate}
            dateValue={selectDate}
            pagination={true}
            rowKey={"key"}
            customHeader={
              <div
                style={{ display: "flex", gap: "3rem", alignItems: "center" }}
              >
                <Form form={form}>
                  <Form.Item name={"customer"} style={{ margin: 0 }}>
                    <Select
                      style={{ width: "200px" }}
                      allowClear
                      showSearch
                      placeholder="Xaridorni tanlash"
                      loading={customerRes?.isLoading}
                      filterOption={(inputValue, option) =>
                        option.searchOne
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                      status={selectCustErr ? "error" : ""}
                      onChange={setSelectCustomer}
                    >
                      {customerOptions.map((option) => (
                        <Select.Option
                          value={option.id}
                          key={option.id}
                          searchOne={option.fio}
                        >
                          {option?.fio} {option.id}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
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
                  Eski qarz:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.eski_balans} />
                  </b>
                </p>
                <p>
                  Jami debet:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.jamidebit} />
                  </b>
                </p>
                <p>
                  Jami to'lov:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.jamikredit} />
                  </b>
                </p>
                <p>
                  Saldo:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.saldo} />
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

export default SalesReport;

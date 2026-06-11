import { EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Divider, Select, Tag, message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainPrintTableData from "../../../components/common/printTableData/MainPrintTableData";
import ProductStorageShowReportDetailModal from "../../../components/common/productStorage/showReportDetail/ProductStorageShowReportDetailModal";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetProductStorageReportMutation } from "../../../features/productStorage/productStorageApiSlice";
import { useGetProductProviderQuery } from "../../../features/sklad/productProvider/productProviderApiSlice";
import formatCurrency from "../../../util/formatCurrency";

/* Print table */
const printTableColumn = [
  {
    title: "Vaqt",
    dataIndex: "vaqt",
  },
  {
    title: "Kg",
    dataIndex: "massa",
  },
  {
    title: "Debet",
    dataIndex: "debit",
  },
  {
    title: "Dona",
    dataIndex: "dona",
  },
  {
    title: "Kredet",
    dataIndex: "kredit",
  },
];

function ProductStorageReport() {
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
  const providerRes = useGetProductProviderQuery();
  const [getDataByDate] = useGetProductStorageReportMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getData";

  /* Memo */
  const providerOptions = useMemo(() => {
    if (
      providerRes?.data?.success === true &&
      providerRes?.data?.data &&
      Array.isArray(providerRes?.data?.data)
    ) {
      return providerRes?.data.data;
    }
    return [];
  }, [providerRes?.data]);

  useEffect(() => {
    if (mount >= 1) {
      if (!selectCustomer) {
        setSelectCustErr(true);
        message.error("Mijozni tanlang");
        return () => null;
      }
      setSelectCustErr(false);

      handleGetDataByDate({ ...selectDate, providerId: selectCustomer });
    }
    setMount(true);
  }, [selectCustomer, selectDate]);

  /* Sort data by date */
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
        providerId: values?.providerId,
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
    // {
    //   title: "Summa",
    //   dataIndex: "summa",
    //   width: 150,
    //   sortType: "number",
    //   render: (_, { summa }) => <MainNumberFormat value={summa} />,
    // },
    {
      title: "Berilgan pullar",
      dataIndex: "debit",
      width: 150,
      sortType: "number",
      render: (_, { debit }) => <MainNumberFormat value={debit} />,
    },
    {
      title: "Olingan yuklar",
      dataIndex: "kredit",
      width: 150,
      sortType: "number",
      render: (_, { kredit }) => <MainNumberFormat value={kredit} />,
    },
    {
      title: "Massa(kg)",
      dataIndex: "massa",
      width: 150,
      sortType: "number",
      render: (_, { massa }) => <MainNumberFormat value={massa} />,
    },
    {
      title: "Vaqt",
      dataIndex: "vaqt",
      width: 150,
      sortType: "date",
      render: (_, { vaqt }) => <Tag color="cyan-inverse">{vaqt}</Tag>,
    },
    {
      title: "Dona",
      dataIndex: "dona",
      width: 150,
      sortType: "date",
      render: (dona) => <MainNumberFormat value={dona} />,
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

  /* Handle print expand table */
  const handlePrintData = () => printTableRef.current.onPrint();
  const handleOpenReportDetailModal = ({ id, status }) =>
    showReportDetailModalRef.current.onOpen({ id, status });

  return (
    <>
      {contextHolder}

      <ProductStorageShowReportDetailModal ref={showReportDetailModalRef} />

      <MainPrintTableData
        ref={printTableRef}
        columns={printTableColumn}
        data={tableData}
        rowKey={"key"}
        header={
          tableData?.length ? (
            <>
              <small>
                {selectDate.start.replace(/-/g, ".")} -{" "}
                {selectDate.end.replace(/-/g, ".")}
              </small>
              <table
                className="printCheckTable printTable borderRow"
                style={{ marginTop: "1rem" }}
              >
                <tbody>
                  <tr>
                    <td>Saldo:</td>
                    <td>
                      <b>{formatCurrency(allResData?.saldo)}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Mijoz nomi:</td>
                    <td>
                      <b>{allResData?.taminotchi?.fio}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Telefonlari:</td>
                    <td>
                      <b>{allResData?.taminotchi?.telefon}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
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
                  <td>Jami debet:</td>
                  <td>
                    <b>{formatCurrency(allResData?.jamidebit)}</b>
                  </td>
                </tr>
                <tr>
                  <td>Jami kredit:</td>
                  <td>
                    <b>{formatCurrency(allResData?.jamikredit)}</b>
                  </td>
                </tr>
                <tr>
                  <td>Debet:</td>
                  <td>
                    <b>{formatCurrency(allResData?.client?.balans || 0)}</b>
                  </td>
                </tr>
                <tr>
                  <td>Jami dona:</td>
                  <td>
                    <b>{formatCurrency(allResData?.jamidona || 0)}</b>
                  </td>
                </tr>
              </tbody>
            </table>
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
            rowKey={"key"}
            showDatePicker={true}
            setDateValue={setSelectDate}
            pagination={false}
            customHeader={
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <Select
                  style={{ width: "200px" }}
                  allowClear
                  showSearch
                  placeholder="Taminotchi tanlash"
                  loading={providerRes?.isLoading}
                  filterOption={(inputValue, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) >= 0
                  }
                  status={selectCustErr ? "error" : ""}
                  onChange={setSelectCustomer}
                >
                  {providerOptions.map((option) => (
                    <Select.Option value={option.id} key={option.id}>
                      {option?.fio}
                    </Select.Option>
                  ))}
                </Select>
                <ExportTable
                  columns={columns}
                  fileName="Hisobotlar"
                  data={[...tableData]}
                />
              </div>
            }
          />
          {tableData?.length ? (
            <div style={{ display: "flex", gap: "3rem", marginTop: "3rem" }}>
              <div style={{ display: "flex", gap: "100px" }}>
                <p>
                  Mijoz nomi: <b>{allResData?.taminotchi?.fio}</b>
                </p>
                <div style={{ display: "flex", gap: "2rem" }}>
                  <p>Telefonlari:</p>
                  <div>
                    {allResData?.taminotchi?.telefon},<br />
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
                  Olingan yuklar:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.jamidebit} />
                  </b>
                </p>
                <p>
                  Berilgan pullar:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.jamikredit} />
                  </b>
                </p>

                {/* <p>
                  Jami dona:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.jamidona} />
                  </b>
                </p> */}
                <p style={{ marginLeft: "3rem" }}>
                  Qoldiq:{" "}
                  <b>
                    <MainNumberFormat value={allResData?.saldo} />
                  </b>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </Section>
    </>
  );
}

export default ProductStorageReport;

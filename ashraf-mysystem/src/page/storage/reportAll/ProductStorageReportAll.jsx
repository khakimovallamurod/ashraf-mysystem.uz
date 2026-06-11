import { PrinterOutlined } from "@ant-design/icons";
import { Button, Divider, Select, message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ExportTable from "../../../components/common/exportTable/ExportTable";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainPrintTableData from "../../../components/common/printTableData/MainPrintTableData";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetProductStorageReportAllMutation } from "../../../features/productStorage/productStorageApiSlice";
import { useGetProductProviderQuery } from "../../../features/sklad/productProvider/productProviderApiSlice";
import formatCurrency from "../../../util/formatCurrency";
import MainTableCard from "../../../components/common/mainTableCard/MainTableCard";

function ProductStorageReportAll() {
  /* Ref */
  const printTableRef = useRef(null);

  /* State */
  const [isSubbmitting, setIsSubmitting] = useState();
  const [filterData, setFilterData] = useState([]);
  const [selectProvider, setSelectProvider] = useState(null);
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
  const [getDataByDate] = useGetProductStorageReportAllMutation();

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
      // if (!selectCustomer) {
      //   setSelectCustErr(true);
      //   message.error("Mijozni tanlang");
      //   return () => null;
      // }
      setSelectCustErr(false);

      handleGetDataByDate({ ...selectDate, providerId: selectProvider });
    }
    setMount(true);
  }, [selectProvider, selectDate]);

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
        providerId: values.providerId,
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
      title: "Eski qarz",
      dataIndex: "eski_qarz",
      width: 150,
      sortType: "number",
      render: (_, { eski_qarz }) => <MainNumberFormat value={eski_qarz} />,
    },
    {
      title: "Berilgan pullar",
      dataIndex: "debit",
      width: 150,
      sortType: "number",
      render: (_, { debit }) => <MainNumberFormat value={debit} />,
    },
    {
      title: "Olingan yuklar",
      dataIndex: "jamikredit",
      width: 150,
      sortType: "number",
      render: (_, { jamikredit }) => <MainNumberFormat value={jamikredit} />,
    },
    {
      title: "Qarzdorlik",
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
        rowKey={"id"}
        header={
          <small>
            {selectDate.start.replace(/-/g, ".")} -{" "}
            {selectDate.end.replace(/-/g, ".")}
          </small>
        }
        footer={
          filterData?.length ? (
            <table
              className="printCheckTable printTable borderRow"
              style={{ marginTop: "1rem" }}
            >
              <tbody>
                <tr>
                  <td>Jami eski qarz:</td>
                  <td>{formatCurrency(allResData?.jami_eski_qarz)}</td>
                </tr>
                <tr>
                  <td>Jami berilgan pullar:</td>
                  <td>{formatCurrency(allResData?.jamidebit)}</td>
                </tr>
                <tr>
                  <td>Jami olingan yuklar:</td>
                  <td>{formatCurrency(allResData?.jamikredit)}</td>
                </tr>
                <tr>
                  <td>Jami qarzdorlik:</td>
                  <td>{formatCurrency(allResData?.jami_qarzdorlik)}</td>
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
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <MainTableCard
              isLoading={isSubbmitting}
              title={formatCurrency(allResData?.jami_eski_qarz)}
              caption={"Eski qarz"}
              mode="danger"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <MainTableCard
                isLoading={isSubbmitting}
                title={formatCurrency(allResData?.jamikredit)}
                caption={"Terilgan pullar qiymati"}
                mode="success"
                size="medium"
                style={{ height: "50%" }}
              />
              <MainTableCard
                isLoading={isSubbmitting}
                title={formatCurrency(allResData?.jamidebit)}
                caption={"Berilgan yuklar qiymati"}
                mode="brown"
                size="medium"
                style={{ height: "50%" }}
              />
            </div>
            <MainTableCard
              isLoading={isSubbmitting}
              title={formatCurrency(allResData?.jami_qarzdorlik)}
              caption={"Qoldiq qarz"}
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
            customHeader={
              <>
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
                  onChange={setSelectProvider}
                >
                  {providerOptions.map((option) => (
                    <Select.Option value={option.id} key={option.id}>
                      {option?.fio}
                    </Select.Option>
                  ))}
                </Select>
                <ExportTable
                  columns={columns}
                  fileName="Hamma mijozlarning hisobotlari"
                  data={[...tableData]}
                />
              </>
            }
            mobile={true}
            columns={columns}
            isLoading={isSubbmitting}
            // isError={isError}
            data={filterData}
            // refetch={refetch}
            showDatePicker={true}
            setDateValue={setSelectDate}
            rowKey={"id"}
          />
          {/* {tableData?.length ? (
            <div>
              <p>
                Jami eski qarz:{" "}
                <b>{formatCurrency(allResData?.jami_eski_qarz)}</b>
              </p>
              <p>
                Jami berilgan pullar:{" "}
                <b>{formatCurrency(allResData?.jamidebit)}</b>
              </p>
              <p>
                Jami olingan yuklar:{" "}
                <b>{formatCurrency(allResData?.jamikredit)}</b>
              </p>
              <p>
                Jami qarzdorlik:{" "}
                <b>{formatCurrency(allResData?.jami_qarzdorlik)}</b>
              </p>
            </div>
          ) : null} */}
        </div>
      </Section>
    </>
  );
}

export default ProductStorageReportAll;

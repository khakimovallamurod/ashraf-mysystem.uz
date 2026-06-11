import { Divider, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetOrderCompletedStorageByDateMutation } from "../../../features/productStorage/order/storageOrderApiSlice";
import formatCurrency from "../../../util/formatCurrency";
import ExportTable from "../../../components/common/exportTable/ExportTable";

function StorageCompletedOrderReception() {
  /* State */
  const [isSubbmitting, setIsSubmitting] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [selectDate, setSelectDate] = useState({
    start: "",
    end: "",
  });
  const [mount, setMount] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [allResData, setAllResData] = useState();

  /* API */
  const [getDataByDate] = useGetOrderCompletedStorageByDateMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getData";

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 50,
      sortType: "number",
    },
    {
      title: "Qassob",
      dataIndex: "qassob",
      width: 150,
      sortType: "string",
    },
    {
      title: "Taminotchi",
      dataIndex: "taminotchi",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massa",
      dataIndex: "massa",
      width: 150,
      sortType: "number",
      render: (massa) => <MainNumberFormat value={massa} />,
    },
    {
      title: "Dona",
      dataIndex: "dona",
      width: 150,
      sortType: "number",
      render: (dona) => <MainNumberFormat value={dona} />,
    },
    {
      title: "Summa",
      dataIndex: "summa",
      width: 150,
      sortType: "number",
      render: (summa) => formatCurrency(summa),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
    },
    {
      title: "Sana",
      dataIndex: "sana",
      width: 150,
      sortType: "date",
    },
  ];

  useEffect(() => {
    if (mount >= 1) {
      handleGetDataByDate({ ...selectDate });
    }
    setMount(2);
  }, [selectDate]);

  useEffect(() => {
    setTableData(filterData.sort((a, b) => parseInt(b.id) - parseInt(a.id)));
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
      }).unwrap();

      if (resData?.success === true) {
        if (
          resData?.success === true &&
          resData?.data &&
          resData?.data?.list &&
          Array.isArray(resData?.data?.list)
        ) {
          const newData = resData?.data?.list;
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

  return (
    <>
      {contextHolder}

      <Section>
        <Typography.Title type="secondary" level={3}>
          Qabul qilish bo'limidan
        </Typography.Title>
        <Divider />
        <MainDataTable
          columns={columns}
          isLoading={isSubbmitting}
          data={tableData}
          showDatePicker={true}
          setDateValue={setSelectDate}
          scroll={{ x: 400 }}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Bajarilgan buyurtmalar-qabul qilish bo'limidan"
              data={[...tableData]}
            />
          }
        />
        {tableData?.length ? (
          <div style={{ display: "flex", gap: "100px", marginTop: "1rem" }}>
            <div>
              <p>
                Jami massa:{" "}
                <b>
                  <MainNumberFormat value={allResData?.jamimassa} />
                </b>
              </p>
              <p>
                Jami dona:{" "}
                <b>
                  <MainNumberFormat value={allResData?.jamidona} />
                </b>
              </p>
              <p>
                Jami summa:{" "}
                <b>
                  <MainNumberFormat value={allResData?.jamisumma} />
                </b>
              </p>
            </div>
          </div>
        ) : null}
      </Section>
    </>
  );
}

export default StorageCompletedOrderReception;

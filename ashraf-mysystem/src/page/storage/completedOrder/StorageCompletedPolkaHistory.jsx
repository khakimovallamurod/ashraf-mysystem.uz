import { Divider, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetPolkaHistoryStorageByDateMutation } from "../../../features/productStorage/polka/productStoragePolkaApiSlice";
import ExportTable from "../../../components/common/exportTable/ExportTable";

function StorageCompletedPolkaHistory() {
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
  const [getDataByDate] = useGetPolkaHistoryStorageByDateMutation();

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
      title: "Nomi",
      dataIndex: "pnomer",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massa (kg)",
      dataIndex: "massa",
      width: 150,
      sortType: "number",
      render: (_, { massa }) => <MainNumberFormat value={massa} />,
    },
    {
      title: "Olindi (kg)",
      dataIndex: "olindi",
      width: 150,
      sortType: "number",
      render: (_, { olindi }) => <MainNumberFormat value={olindi} />,
    },
    {
      title: "Pateriya (kg)",
      dataIndex: "qoldi",
      width: 150,
      sortType: "number",
      render: (_, { qoldi }) => <MainNumberFormat value={qoldi} />,
    },
    {
      title: "Pateriya (%)",
      dataIndex: "paterya",
      width: 150,
      sortType: "number",
      render: (_, { paterya }) => <MainNumberFormat value={paterya} />,
    },
    {
      title: "Saqlash soati",
      dataIndex: "saqlangan_soat",
      width: 150,
      sortType: "number",
    },
    {
      title: "Kirish vaqti",
      dataIndex: "kirish_vaqti",
      width: 150,
      sortType: "date",
    },
    {
      title: "Tugatilgan vaqti",
      dataIndex: "vaqt",
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
          resData?.data?.list[0]?.history_krim &&
          Array.isArray(resData?.data?.list[0]?.history_krim)
        ) {
          const filterData = [];
          resData?.data?.list[0]?.history_krim?.forEach((item) => {
            filterData.push({
              key: item.id,
              ...item,
            });
          });

          setFilterData(filterData);
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
          Tugatilgan polkalar
        </Typography.Title>
        <Divider />
        <MainDataTable
          columns={columns}
          isLoading={isSubbmitting}
          data={tableData}
          showDatePicker={true}
          setDateValue={setSelectDate}
          customHeader={
            <ExportTable
              columns={columns}
              fileName="Bajarilgan buyurtmalar-tugatilgan polkalar"
              data={[...tableData]}
            />
          }
          rowClassName={(record) => {
            if (record?.paterya <= 1) {
              return "row-success";
            } else if (record?.paterya <= 2) {
              return "row-yellow";
            } else {
              return "row-red";
            }
          }}
        />
        {tableData?.length ? (
          <div style={{ display: "flex", gap: "100px", marginTop: "1rem" }}>
            <div>
              <p>
                Jami massa:{" "}
                <b>
                  <MainNumberFormat value={allResData?.jami} />
                </b>
              </p>
              <p>
                Jami olindi:{" "}
                <b>
                  <MainNumberFormat value={allResData?.jamiolindi} />
                </b>
              </p>
              <p>
                Jami pateriya:{" "}
                <b>
                  <MainNumberFormat value={allResData?.jamiqoldi} />
                </b>
              </p>
            </div>
            <p>
              Pateriya foiz:{" "}
              <b>
                <MainNumberFormat value={allResData?.paterya_foiz} />%
              </b>
            </p>
          </div>
        ) : null}
      </Section>
    </>
  );
}

export default StorageCompletedPolkaHistory;

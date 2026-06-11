import { Divider, Tag, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetOrderCompletedFromGrindStorageMutation } from "../../../features/productStorage/order/storageOrderApiSlice";
import ExportTable from "../../../components/common/exportTable/ExportTable";

function StorageCompletedOrderGrind() {
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
  const [getDataByDate] = useGetOrderCompletedFromGrindStorageMutation();

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
      title: "Buyurtmachi",
      dataIndex: "buyurtmachi",
      width: 150,
      sortType: "string",
    },
    {
      title: "Raqami",
      dataIndex: "nomer",
      width: 100,
      sortType: "string",
    },
    {
      title: "Massa",
      dataIndex: "massa",
      width: 100,
      sortType: "number",
      render: (massa) => <MainNumberFormat value={massa} />,
    },
    {
      title: "Tayyorlandi",
      dataIndex: "tayyorlandi",
      width: 150,
      sortType: "number",
      render: (tayyorlandi) => <MainNumberFormat value={tayyorlandi} />,
    },
    {
      title: "Foiz",
      dataIndex: "foiz",
      width: 50,
      sortType: "number",
      render: (foiz) => <b>{foiz}%</b>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (_, { status }) => (
        <>
          <Tag color={"cyan-inverse"}>{status.toUpperCase()}</Tag>
        </>
      ),
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
          const newData = resData?.data;
          setFilterData([...newData.list]);
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
          Maydalash bo'limidan
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
              fileName="Bajarilgan buyurtmalar-maydalash bo'limidan"
              data={[...tableData]}
            />
          }
          rowClassName={(record) => {
            if (record?.foiz <= 97) {
              return "row-red";
            } else if (record?.foiz <= 98) {
              return "row-yellow";
            } else {
              return "row-success";
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
                Jami tayyorlandi:{" "}
                <b>
                  <MainNumberFormat value={allResData?.jamidone} /> &nbsp;(
                  {allResData?.foizda}%)
                </b>
              </p>
            </div>
          </div>
        ) : null}
      </Section>
    </>
  );
}

export default StorageCompletedOrderGrind;

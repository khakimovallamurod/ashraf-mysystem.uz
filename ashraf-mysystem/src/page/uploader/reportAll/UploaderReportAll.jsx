import { message } from "antd";
import React, { useEffect, useState } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import Section from "../../../components/common/section/Section";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetUploaderReportAllByDateMutation } from "../../../features/uploader/report/uploaderReportApiSlice";
import { formatFloatNumber } from "../../../util/formatFloatNumber";

function UploaderReportAll() {
  /* State */
  const [isSubbmitting, setIsSubmitting] = useState();
  const [filterData, setFilterData] = useState([]);

  /* API */
  const [getDataByDate] = useGetUploaderReportAllByDateMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getData";

  /* Handle get data */
  const handleGetDataByDate = async (values) => {
    if (!values.start || !values.end) {
      setFilterData([]);
      return;
    }
    // console.log(values);
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
          Array.isArray(resData?.data)
        ) {
          const newData = resData?.data?.map((item, index) => ({
            ...item,
            id: index,
          }));
          setFilterData([...newData]);
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
      title: "Mahsulot nomi",
      dataIndex: "product_name",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massa (kg)",
      dataIndex: "massa",
      width: 150,
      sortType: "number",
      render: (_, { massa }) => (
        <MainNumberFormat value={formatFloatNumber(massa)} />
      ),
    },
  ];

  return (
    <div style={{ marginTop: "1rem", maxWidth: "800px", margin: "1rem auto" }}>
      {contextHolder}

      <Section>
        <div>
          <MainDataTable
            pagination={false}
            customHeader={<div></div>}
            mobile={true}
            columns={columns}
            isLoading={isSubbmitting}
            // isError={isError}
            data={filterData}
            // refetch={refetch}
            showDatePicker={true}
            setDateValue={handleGetDataByDate}
            scroll={{y:500}}
          />
        </div>
      </Section>
    </div>
  );
}

export default UploaderReportAll;

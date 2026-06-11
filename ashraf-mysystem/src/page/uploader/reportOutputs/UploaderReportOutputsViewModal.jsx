import { message } from "antd";
import React, { useEffect, useState } from "react";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainDataTable from "../../../components/ui/dataTable/MainDataTable";
import { useGetUploaderReportOutputsItemMoreMutation } from "../../../features/uploader/report/uploaderReportApiSlice";
import { formatFloatNumber } from "../../../util/formatFloatNumber";

function UploaderReportOutputsViewModal({ data }) {
  /*State*/
  const [mount, setMount] = useState(0);
  const [isSubbmitting, setIsSubmitting] = useState();
  const [allResData, setAllResData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  /*API*/
  const [getDataByDate] = useGetUploaderReportOutputsItemMoreMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "getData";

  useEffect(() => {
    if (mount >= 1) {
      handleGetDataByDate({ ...data });
    }
    setMount(2);
  }, [mount, data]);

  useEffect(() => {
    setTableData(
      filterData.sort((a, b) => parseInt(b.sana) - parseInt(a.sana))
    );
  }, [filterData]);

  /* Handle get data */
  const handleGetDataByDate = async (values) => {
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
        start: values.sana1,
        end: values?.sana2,
        itemId: values?.item_id,
      }).unwrap();

      if (resData?.success === true) {
        if (
          resData?.success === true &&
          resData?.data &&
          resData?.data?.items_list &&
          Array.isArray(resData?.data?.items_list)
        ) {
          const newData = resData?.data?.items_list;

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
        setAllResData(null);
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
      title: "Id",
      dataIndex: "id",
      width: 150,
      sortType: "number",
    },
    {
      title: "Nomi",
      dataIndex: "name",
      width: 150,
      sortType: "string",
    },
    {
      title: "Massa (kg)",
      dataIndex: "soni",
      width: 150,
      sortType: "number",
      render: (_, { soni }) => (
        <MainNumberFormat value={formatFloatNumber(soni)} />
      ),
    },
    {
      title: "Mijoz",
      dataIndex: "client",
      width: 150,
      sortType: "string",
    },
    {
      title: "Dostavchik",
      dataIndex: "dostavchik",
      width: 150,
      sortType: "string",
    },
    {
      title: "Sana",
      dataIndex: "sana",
      width: 150,
      sortType: "string",
    },
  ];

  return (
    <>
      {contextHolder}

      <MainDataTable
        customHeader={
          <h4>
            <MainNumberFormat
              value={formatFloatNumber(allResData?.jami || 0)}
            />
            kg
          </h4>
        }
        mobile={true}
        showDatePicker={false}
        columns={columns}
        isLoading={isSubbmitting}
        data={tableData}
        pagination={false}
        rowKey={"id"}
        scroll={{ x: 300 }}
      />
    </>
  );
}

export default UploaderReportOutputsViewModal;

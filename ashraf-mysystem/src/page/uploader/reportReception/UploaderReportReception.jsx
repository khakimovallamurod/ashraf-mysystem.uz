import { Divider, Card, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import MainRangeDatePicker from "../../../components/ui/rangeDatePicker/MainRangeDatePicker";
import MainText from "../../../components/ui/title/MainText";
import { useGetUploaderReportReceptionByDateMutation } from "../../../features/uploader/report/uploaderReportApiSlice";
import AdminStatisticCard from "../../../components/admin/statistic/AdminStatisticCard";
import formatCurrency from "../../../util/formatCurrency";

function UploaderReportReception() {
  /* State */
  const [date, setDate] = useState("");
  const [isSubbmitting, setIsSubmitting] = useState();
  const [resAllData, setAllData] = useState({});

  /* API */
  const [getDataByDate] = useGetUploaderReportReceptionByDateMutation();

  const [messageApi, contextHolder] = message.useMessage();
  const key = "geyDataByDate";

  useEffect(() => {
    if (date) {
      handleGetDataByDate(date);
    }
  }, [date]);

  /* Handle get data */
  const handleGetDataByDate = async (values) => {
    /* Set Event */
    setIsSubmitting(true);
    try {
      const data = {
        start: values.start,
        end: values.end,
      };
      const resData = await getDataByDate(data).unwrap();

      if (resData?.success === true) {
        setAllData(resData?.data);

        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <MainRangeDatePicker setValue={setDate} value={date} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          marginBottom: "3rem",
        }}
      >
        <Card>
          <MainText sm>Kun davomida kirib kelgan yuklar massasi</MainText>
          <Divider />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <Row gutter={[16, 16]}>
              {Object.keys(resAllData)?.map((key) => (
                <AdminStatisticCard
                  key={key}
                  indicatorHidden={true}
                  title={key}
                  value={formatCurrency(resAllData[key] || 0)}
                  isLoading={isSubbmitting}
                  suffix="kg"
                />
              ))}
            </Row>
          </div>
        </Card>
      </div>
    </>
  );
}

export default UploaderReportReception;

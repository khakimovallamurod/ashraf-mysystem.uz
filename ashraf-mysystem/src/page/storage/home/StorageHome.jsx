import { message, Row } from "antd";
import { useEffect, useState } from "react";
import AdminStatisticCard from "../../../components/admin/statistic/AdminStatisticCard";
import MainRangeDatePicker from "../../../components/ui/rangeDatePicker/MainRangeDatePicker";
import { useGetCashierBalanceByDateMutation } from "../../../features/cashier/balance/cashierBalanceApiSlice";

function StorageHome() {
  /* State */
  const [date, setDate] = useState("");
  const [isSubbmitting, setIsSubmitting] = useState();
  const [resAllData, setAllData] = useState(null);

  /* API */
  const [getDataByDate] = useGetCashierBalanceByDateMutation();

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
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Row gutter={[16, 16]}>
          <AdminStatisticCard
            indicatorHidden={true}
            title={"Kunlik massa"}
            value={'123123'}
            devMode={true}
            suffix="kg"
            // isLoading={isLoading}
          />
          <AdminStatisticCard
            indicatorHidden={true}
            title={"Kun davomida qancha yuk bor edi."}
            value={'123123'}
            devMode={true}
            suffix="kg"
            // isLoading={isLoading}
          />
          <AdminStatisticCard
            indicatorHidden={true}
            title={"Qancha chiqib ketdi."}
            value={'123123'}
            devMode={true}
            suffix="kg"
            // isLoading={isLoading}
          />
        </Row>
      </div>
    </>
  );
}

export default StorageHome;

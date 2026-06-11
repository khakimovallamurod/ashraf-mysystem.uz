import { message } from "antd";
import React, { useEffect, useState } from "react";
import MainRangeDatePicker from "../../../components/ui/rangeDatePicker/MainRangeDatePicker";
import { useGetCashierBalanceByDateMutation } from "../../../features/cashier/balance/cashierBalanceApiSlice";
import WrapperItem from "./components/WrapperItem";

function CashierHome() {
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
          gap: "2rem",
          marginBottom: "3rem",
        }}
      >
        <WrapperItem
          title="Kunlik kun boshidagi kassa qoldig'i"
          data={resAllData?.kb}
          isLoading={isSubbmitting}
        />
        <WrapperItem
          title="Kunlik kirimlar"
          data={resAllData?.kunlik_krim}
          isLoading={isSubbmitting}
        />
        <WrapperItem
          title="Chiqim harajatlar"
          data={resAllData?.chiqim_harajat}
          isLoading={isSubbmitting}
        />
        <WrapperItem
          title="Chiqim oylik"
          data={resAllData?.chiqim_oylik}
          isLoading={isSubbmitting}
        />
        <WrapperItem
          title="Chiqim taminotchi"
          data={resAllData?.chiqim_taminotchi}
          isLoading={isSubbmitting}
        />
        <WrapperItem
          title="Qoldiq balans"
          data={resAllData?.qoldiq_balans}
          isLoading={isSubbmitting}
        />
      </div>
    </>
  );
}

export default CashierHome;

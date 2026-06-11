import React, { useMemo, useState } from "react";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import MainRangeDatePicker from "../../../components/ui/rangeDatePicker/MainRangeDatePicker";
import { useGetSupplierMyAccountByDateQuery } from "../../../features/supplier/myAccount/supplierMyAccountApiSlice";
import SupplierBalanceCard from "./components/SupplierBalanceCard";
import styles from "./supplierMyAccount.module.css";

function SupplierMyAccount() {
  // State
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null });

  // Api
  const { data, isLoading, isError, refetch } =
    useGetSupplierMyAccountByDateQuery(selectedDate);

  const {
    bajarilish_foizi,
    jami_berilgan_yuk,
    jami_terilgan_pullar,
    ortda_qolish_foizi,
  } = useMemo(() => {
    if (
      data?.success === true &&
      data?.data &&
      typeof data?.data === "object"
    ) {
      return data.data;
    }
    return [];
  }, [data]);

  return (
    <div className={styles.container}>
      <div style={{ maxWidth: 400, margin: "auto", padding: "1rem 10px" }}>
        <MainRangeDatePicker value={selectedDate} setValue={setSelectedDate} />
      </div>
      {isError ? (
        <MainRefetchBtn refetch={refetch} />
      ) : (
        <>
          <div className={styles.wrapper}>
            <SupplierBalanceCard
              isLoading={isLoading}
              color="dark"
              title={jami_berilgan_yuk}
              caption={"Berilgan yuklar"}
            />
            <SupplierBalanceCard
              isLoading={isLoading}
              color="green"
              title={jami_terilgan_pullar}
              caption={"Terilgan pullar"}
            />
          </div>
          <div className={styles.wrapper}>
            <SupplierBalanceCard
              isLoading={isLoading}
              isPercent={true}
              beforePercent={ortda_qolish_foizi}
              title={bajarilish_foizi}
              caption={"Bajarilgan foiz"}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default SupplierMyAccount;

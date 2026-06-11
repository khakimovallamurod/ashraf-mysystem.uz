import { Card, Divider, List } from "antd";
import React, { useMemo } from "react";
import MainText from "../../../components/ui/title/MainText";
import { useGetSupplierBalanceQuery } from "../../../features/supplier/balance/supplierBalanceApiSlice";
import styles from "./supplierBalance.module.css";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";

function SupplierBalance() {
  /* API */
  const { data, isLoading, isError, refetch } = useGetSupplierBalanceQuery();

  /* Memo */
  const balanceData = useMemo(() => {
    if (data?.success === true && data?.data) {
      return {
        naqdSum: data?.data?.naqdsum,
        naqdUsd: data?.data?.naqdusd,
        bank: data?.data?.bank,
        karta: data?.data?.karta,
      };
    }
    return [];
  }, [data]);

  return (
    <>
      <MainText sm>Balans</MainText>
      <Divider />
      {!isLoading && isError ? (
        <MainRefetchBtn refetch={refetch} />
      ) : (
        <Card>
          <List loading={isLoading}>
            <List.Item className={styles.listItem}>
              Naqd so'm:{" "}
              <b>
                <MainNumberFormat value={balanceData?.naqdSum} />
              </b>
            </List.Item>
            <List.Item className={styles.listItem}>
              Naqd usd:{" "}
              <b>
                <MainNumberFormat value={balanceData?.naqdUsd} />
              </b>
            </List.Item>
            <List.Item className={styles.listItem}>
              Naqd bank:{" "}
              <b>
                <MainNumberFormat value={balanceData?.bank} />
              </b>
            </List.Item>
            <List.Item className={styles.listItem}>
              Naqd karta:{" "}
              <b>
                <MainNumberFormat value={balanceData?.karta} />
              </b>
            </List.Item>
          </List>
        </Card>
      )}
    </>
  );
}

export default SupplierBalance;

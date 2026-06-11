import React, { useMemo } from "react";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";
import styles from "../supplierMyAccount.module.css";
import { LoadingOutlined } from "@ant-design/icons";

function SupplierBalanceCard({
  color,
  title,
  caption,
  isPercent,
  beforePercent,
  isLoading,
}) {
  const classes = useMemo(() => {
    const newClass = [styles.card, styles[color]];

    return newClass.join(" ");
  }, [color]);

  return (
    <div className={classes}>
      {!isPercent ? (
        <h1 className={styles.cardTitle}>
          {isLoading ? <LoadingOutlined /> : <MainNumberFormat value={title} />}
        </h1>
      ) : (
        <>
          <span className={styles.cardNoCompPercent}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 12L5 8L7.66667 10.6667L14.3333 4"
                stroke="#D975BB"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.3333 8V4H10.3333"
                stroke="#D975BB"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <MainNumberFormat value={beforePercent} />%
          </span>
          <h1 className={styles.cardPercentTitle}>
            {isLoading ? (
              <LoadingOutlined />
            ) : (
              <>
                <MainNumberFormat value={title} />%
              </>
            )}
          </h1>
        </>
      )}
      <p className={styles.cardCaption}>{caption}</p>
    </div>
  );
}

export default SupplierBalanceCard;

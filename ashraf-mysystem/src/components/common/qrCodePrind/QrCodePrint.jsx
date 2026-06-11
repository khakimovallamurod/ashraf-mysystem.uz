import { List, QRCode, message } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useReactToPrint } from "react-to-print";
import Logo from "../../../assets/images/logo-dark-min.png";
import { formatFloatNumber } from "../../../util/formatFloatNumber";
import MainNumberFormat from "../numberFormat/MainNumberFormat";
import styles from "./skladPrint.module.css";

function QrCodePrint(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      onPrint: handlePrintPart,
    };
  });

  /* Ref */
  const printRef = useRef();

  /* State */
  const [printData, setPrintData] = useState({
    productName: null,
    partiyanomer: null,
    taminotchi: null,
    qassob: null,
    massa: 0,
    allBoxCount: 0,
    dona: 0,
    sana: null,
  });

  const handlePrintPart = (data) => {
    if (
      data?.qtData &&
      (!data?.qrData?.polka_id ||
        !data?.qrData?.partiyanomer ||
        !data?.qrData?.product_id)
    ) {
      message.error("QR kod print qilish uchun ma'lumot yetarli emas.");
      return;
    }

    setPrintData({
      productName: data?.productName,
      partiyanomer: data?.partiyanomer,
      taminotchi: data?.taminotchi,
      qassob: data?.qassob,
      massa: data?.massa,
      allBoxCount: data?.allBoxCount,
      dona: data?.dona,
      sana: data?.sana,
      qrData: data?.qrData,
    });
    setTimeout(() => {
      setPrint();
    }, 200);
  };

  const setPrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      <img style={{ display: "none" }} src={Logo} alt="" />
      {/* Print */}
      <div ref={printRef} className={styles.printContent}>
        <h1>{printData?.partiyanomer}</h1>
        {printData?.partiyanomer ? (
          <QRCode value={JSON.stringify(printData?.qrData)} />
        ) : null}
        <List bordered={false}>
          {printData?.productName ? (
            <List.Item>
              <h3>Mahsulot nomi: {printData?.productName}</h3>
            </List.Item>
          ) : null}
          {printData?.taminotchi ? (
            <List.Item>
              <h3>Taminotchi: {printData?.taminotchi}</h3>
            </List.Item>
          ) : null}
          {printData?.taminotchi ? (
            <List.Item>
              <h3>Taminotchi: {printData?.taminotchi}</h3>
            </List.Item>
          ) : null}

          {printData?.qassob ? (
            <List.Item>
              <h3>Qassob: {printData?.qassob}</h3>
            </List.Item>
          ) : null}

          {printData?.massa ? (
            <List.Item>
              <h3 style={{ textAlign: "left" }}>
                Massa:{" "}
                <MainNumberFormat value={formatFloatNumber(printData?.massa)} />{" "}
                kg
              </h3>
            </List.Item>
          ) : null}

          {printData?.allBoxCount ? (
            <List.Item>
              <h3>Yashiklar soni: {printData?.allBoxCount}</h3>
            </List.Item>
          ) : null}

          {printData?.dona ? (
            <List.Item>
              <h3>Dona: {printData?.dona}</h3>
            </List.Item>
          ) : null}

          {printData?.sana ? (
            <List.Item>
              <h3>Sana: {printData?.sana}</h3>
            </List.Item>
          ) : null}
        </List>
      </div>
    </>
  );
}

export default forwardRef(QrCodePrint);

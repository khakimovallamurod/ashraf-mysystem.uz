import { CreditCardOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useRef } from "react";
import CurrencyExchangeModal from "./CurrencyExchangeModal";

function CurrencyExchange() {
  /* Ref */
  const exchangeModalRef = useRef(null);

  const handleOpenExchangeModal = () => exchangeModalRef.current.onOpen();

  return (
    <>
      <CurrencyExchangeModal ref={exchangeModalRef} />
      <Tooltip title={"Hisobni ayirboshlash"}>
        <Button
          icon={<CreditCardOutlined />}
          onClick={handleOpenExchangeModal}
        />
      </Tooltip>
    </>
  );
}

export default CurrencyExchange;

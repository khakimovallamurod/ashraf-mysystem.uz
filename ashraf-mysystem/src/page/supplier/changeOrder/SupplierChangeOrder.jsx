import { Segmented } from "antd";
import React, { useState } from "react";
import SupplierChangeOrderChanged from "./SupplierChangeOrderChanged";
import SupplierChangeOrderSended from "./SupplierChangeOrderSended";
import MainMobileSegmented from "../../../components/common/mobile/segmented/MainMobileSegmented";

function SupplierChangeOrder() {
  const [segmentValue, setSegmentValue] = useState(1);

  return (
    <div style={{ padding: "1rem" }}>
      <MainMobileSegmented
        value={segmentValue}
        setValue={setSegmentValue}
        options={[
          {
            value: 1,
            label: "Jo'natilgan",
          },
          {
            value: 2,
            label: "Qabul qilinadigan",
          },
        ]}
      />

      <div style={{ marginTop: "2rem" }}>
        {segmentValue === 1 ? (
          <SupplierChangeOrderSended />
        ) : (
          <SupplierChangeOrderChanged />
        )}
      </div>
    </div>
  );
}

export default SupplierChangeOrder;

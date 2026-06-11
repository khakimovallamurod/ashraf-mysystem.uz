import React, { useState } from "react";
import MainMobileSegmented from "../../../components/common/mobile/segmented/MainMobileSegmented";
import SupplierReturnProductAdd from "./components/SupplierReturnProductAdd";
import SupplierReturnProductHistory from "./components/SupplierReturnProductHistory";

function SupplierReturnProduct() {
  const [segmentValue, setSegmentValue] = useState(1);

  return (
    <div style={{ padding: "1rem" }}>
      {/* Segmented */}
      <MainMobileSegmented
        value={segmentValue}
        setValue={setSegmentValue}
        options={[
          {
            value: 1,
            label: "Mahsulotni qaytarish",
          },
          {
            value: 2,
            label: "Qaytarilgan mahsulotlar",
          },
        ]}
      />
      <div style={{ marginTop: "2rem" }}>
        {segmentValue === 1 ? (
          <SupplierReturnProductAdd />
        ) : (
          <SupplierReturnProductHistory />
        )}
      </div>
    </div>
  );
}

export default SupplierReturnProduct;

import { Divider, Segmented } from "antd";
import React, { useState } from "react";
import MainText from "../../../components/ui/title/MainText";
import SupplierDebtForm from "./components/SupplierDebtForm";
import SupplierDebtHistory from "./components/SupplierDebtHistory";

const tabs = [
  {
    value: 1,
    label: "Qarz yechish",
  },
  {
    value: 2,
    label: "Yechilgan qarzlar",
  },
];

function SupplierDebt() {
  /* State */
  const [selectedValue, setSelectedValue] = useState(1);

  return (
    <div>
      <div style={{ padding: "0 1rem", paddingTop: "1rem" }}>
        <MainText sm>Qarz yechish</MainText>
      </div>
      <Divider />
      <Segmented
        style={{ margin: "0 1rem" }}
        block
        options={tabs}
        value={selectedValue}
        onChange={setSelectedValue}
      />
      <Divider />

      {selectedValue === 1 ? <SupplierDebtForm /> : <SupplierDebtHistory />}
    </div>
  );
}

export default SupplierDebt;

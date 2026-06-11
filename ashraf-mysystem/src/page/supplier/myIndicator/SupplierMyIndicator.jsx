import React, { useState } from "react";
import { Divider, Segmented } from "antd";
import SupplierMyIndicatorTable from "./components/SupplierMyIndicatorTable";
import SupplierMyIndicatorFriendsTable from "./components/SupplierMyIndicatorFriendsTable";

const tabs = [
  {
    value: 1,
    label: "Ko'rsatkichim",
  },
  {
    value: 2,
    label: "Do'stlar ulushi",
  },
];

const SupplierMyIndicator = () => {
  /* State */
  const [selectedValue, setSelectedValue] = useState(1);

  return (
    <div style={{ padding: "0 10px" }}>
      <Segmented
        style={{ margin: "0 1rem" }}
        block
        options={tabs}
        value={selectedValue}
        onChange={setSelectedValue}
      />
      <Divider />

      {selectedValue === 1 ? (
        <SupplierMyIndicatorTable />
      ) : (
        <SupplierMyIndicatorFriendsTable />
      )}
    </div>
  );
};

export default SupplierMyIndicator;

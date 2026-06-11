import { Divider, Segmented } from "antd";
import React, { useState } from "react";
import SupplierMyTerritoryGivenProducts from "./components/SupplierMyTerritoryGivenProducts";
import SupplierMyTerritoryReceveidProducts from "./components/SupplierMyTerritoryReceveidProducts";

const tabs = [
  {
    value: 1,
    label: "Berilgan yuklar",
  },
  {
    value: 2,
    label: "Olingan pullar",
  },
];

function SupplierMyTerritory() {
  /* State */
  const [selectedValue, setSelectedValue] = useState(1);

  return (
    <div style={{padding:'0 10px'}}>
      <Segmented
        style={{ margin: "0 1rem" }}
        block
        options={tabs}
        value={selectedValue}
        onChange={setSelectedValue}
      />
      <Divider />

      {selectedValue === 1 ? (
        <SupplierMyTerritoryGivenProducts />
      ) : (
        <SupplierMyTerritoryReceveidProducts />
      )}
    </div>
  );
}

export default SupplierMyTerritory;

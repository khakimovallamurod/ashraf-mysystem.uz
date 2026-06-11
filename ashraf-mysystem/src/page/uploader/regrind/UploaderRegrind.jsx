import { Divider, Segmented } from "antd";
import React, { useState } from "react";
import MainText from "../../../components/ui/title/MainText";
import UploaderRegrindForm from "./components/UploaderRegrindForm";
import UploaderRegrindTable from "./components/UploaderRegrindTable";

const tabs = [
  {
    value: 1,
    label: "Qayta maydalash",
  },
  {
    value: 2,
    label: "Maydalangan",
  },
];

function UploaderRegrind() {
  /* State */
  const [selectedValue, setSelectedValue] = useState(1);

  return (
    <div style={{ padding: "1rem 10px" }}>
      <div style={{ marginTop: "20px" }}>
        <MainText sm>Qayta maydalash</MainText>
        <Divider />
      </div>
      <Segmented
        block
        options={tabs}
        value={selectedValue}
        onChange={setSelectedValue}
      />
      <Divider />

      {selectedValue === 1 ? <UploaderRegrindForm /> : <UploaderRegrindTable />}
    </div>
  );
}

export default UploaderRegrind;

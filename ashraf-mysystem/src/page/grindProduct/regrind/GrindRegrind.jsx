import { Segmented } from "antd";
import React, { useState } from "react";
import Section from "../../../components/common/section/Section";
import GrindRegrindOrderTable from "./components/GrindRegrindOrderTable";
import GrindRegrindProcess from "./components/GrindRegrindProcess";

function GrindRegrind() {
  const [segmentValue, setSegmentValue] = useState(1);

  return (
    <Section>
      <Segmented
        size="large"
        options={[
          {
            value: 1,
            label: 'Buyurtmalar',
            title: "Qayta maydalash uchun tushgan buyurtmalar",
          },
          {
            value: 2,
            label: "Qayta maydalash",
          },
        ]}
        value={segmentValue}
        onChange={setSegmentValue}
      />

      <div style={{ marginTop: "1rem" }}>
        {segmentValue === 1 ? <GrindRegrindOrderTable /> : <GrindRegrindProcess />}
      </div>
    </Section>
  );
}

export default GrindRegrind;

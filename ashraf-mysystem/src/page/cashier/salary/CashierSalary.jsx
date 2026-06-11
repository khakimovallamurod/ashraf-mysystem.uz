import React, { useState } from "react";
import Section from "../../../components/common/section/Section";
import { Tabs } from "antd";
import CashierSalaryWorker from "./components/CashierSalaryWorker";
import CashierSalaryButcher from "./components/CashierSalaryButcher";

const tabItems = [
  {
    label: "Ishchi",
    key: "worker",
  },
  {
    label: "Qassob",
    key: "butcher",
  },
];

function CashierSalary() {
  const [tableValue, setTabValue] = useState('worker');

  return (
    <Section>
      <Tabs
        style={{marginBottom:'2rem'}}
        activeKey={tableValue}
        onChange={setTabValue}
        type="card"
        items={tabItems}
      />


      {tableValue === "worker" ? (
        <CashierSalaryWorker />
      ) : (
        <CashierSalaryButcher />
      )}
    </Section>
  );
}

export default CashierSalary;

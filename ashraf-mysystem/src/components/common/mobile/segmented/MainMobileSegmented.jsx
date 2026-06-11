import { Segmented } from "antd";
import React from "react";

function MainMobileSegmented({ value, setValue, options = [] }) {
  return (
    <Segmented block options={[...options]} value={value} onChange={setValue} />
  );
}

export default MainMobileSegmented;

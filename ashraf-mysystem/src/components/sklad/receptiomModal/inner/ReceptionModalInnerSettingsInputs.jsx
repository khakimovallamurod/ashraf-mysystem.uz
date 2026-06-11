import { Form, InputNumber, Skeleton, Space } from "antd";
import React from "react";

function ReceptionModalInnerSettingsInputs({ onChange, isLoading }) {
  return isLoading ? (
    <Space>
      <Skeleton.Button active={true} block={true} />
      <Skeleton.Input active={true} />
    </Space>
  ) : (
    <Space style={{ display: "flex", marginTop: "-5px" }}>
      <Form.Item label="Katta yashik kg" name="largeBox">
        <InputNumber
          type="number"
          style={{ width: "100px" }}
          placeholder="0.00kg"
          onChange={(value) => onChange("largeBox", value)}
        />
      </Form.Item>
      <Form.Item label="Kichik yashik kg" name="smallBox">
        <InputNumber
          type="number"
          style={{ width: "100px" }}
          placeholder="0.00kg"
          onChange={(value) => onChange("smallBox", value)}
        />
      </Form.Item>
      <Form.Item label="Foiz" name="procent">
        <InputNumber
          type="number"
          style={{ width: "100px" }}
          placeholder="%"
          min={0}
          max={100}
          onChange={(value) => onChange("procent", value)}
        />
      </Form.Item>
    </Space>
  );
}

export default ReceptionModalInnerSettingsInputs;

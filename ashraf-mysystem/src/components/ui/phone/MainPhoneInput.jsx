import { Form, Input } from "antd";
import React from "react";
import InputMask from "react-input-mask";

function MainPhoneInput({
  status,
  name = "telefon",
  label = "Telefon",
  placeholder = "Telefon kiritish",
  reqMess = "Telefon talab qilinadi",
}) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          required: true,
          message: reqMess,
        },
      ]}
      validateStatus={status}
      hasFeedback
    >
      <InputMask mask="+999(99)999-99-99">
        {(inputProps) => (
          <Input {...inputProps} placeholder={placeholder} type="tel" />
        )}
      </InputMask>
    </Form.Item>
  );
}

export default MainPhoneInput;

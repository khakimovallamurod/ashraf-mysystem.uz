import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Select, Space } from "antd";
import React, { useMemo } from "react";
import { useGetProductProviderQuery } from "../../../../features/sklad/productProvider/productProviderApiSlice";

function ReceptionModalInnerSelectProvider({ status, openModal }) {
  /* API */
  const provider = useGetProductProviderQuery();

  /* Memo */
  /* Provider Options */
  const providerOptions = useMemo(() => {
    if (
      provider.data?.success === true &&
      provider.data?.data &&
      Array.isArray(provider.data?.data)
    ) {
      return provider.data.data;
    }
    return [];
  }, [provider.data]);
  return (
    <Space.Compact block style={{ width: "100%" }}>
      <Form.Item
        label="Taminotchi"
        name="provider"
        rules={[
          {
            required: true,
            message: "Taminotchini tanlang!",
          },
        ]}
        style={{ width: "70%" }}
        hasFeedback
        validateStatus={status}
      >
        <Select
          allowClear
          showSearch
          placeholder="Taminotchini tanlash"
          loading={provider.isLoading}
          filterOption={(inputValue, option) =>
            option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
          }
        >
          {providerOptions.map((option) => (
            <Select.Option value={option.id} key={option.id}>
              {option.fio}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="&nbsp;" style={{ width: "30%" }}>
        <Button icon={<PlusOutlined />} type="primary" onClick={openModal}>
          Qo'shish
        </Button>
      </Form.Item>
    </Space.Compact>
  );
}

export default ReceptionModalInnerSelectProvider;

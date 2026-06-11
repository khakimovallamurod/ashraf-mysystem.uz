import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Select, Space } from "antd";
import React, { useMemo } from "react";
import { useGetButcherQuery } from "../../../../features/sklad/butcher/butcherApiSlice";

function ReceptionModalInnerSelectButcher({ status, openModal }) {
  /* API */
  const butcher = useGetButcherQuery();

  /* Memo */
  /* Butcher Options */
  const butcherOptions = useMemo(() => {
    if (
      butcher.data?.success === true &&
      butcher.data?.data &&
      Array.isArray(butcher.data?.data)
    ) {
      return butcher.data.data;
    }
    return [];
  }, [butcher.data]);
  return (
    <Space.Compact block style={{ width: "100%" }}>
      <Form.Item
        label="Qassobni tanlang"
        name="butcher"
        style={{ width: "70%" }}
        rules={[
          {
            required: true,
            message: "Qassobni tanlang!",
          },
        ]}
      >
        <Select
          allowClear
          showSearch
          placeholder="Qassobni tanlash"
          loading={butcher.isLoading}
          filterOption={(inputValue, option) =>
            option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
          }
        >
          {butcherOptions.map((option) => (
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

export default ReceptionModalInnerSelectButcher;

import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useState } from "react";
import { useAddAdminPolkaMutation } from "../../../../features/admin/polka/adminPolkaApiSlice";

function AdminAddPolkaModal({ departmentLoading, departmentOptions }) {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */

  const [addPolka] = useAddAdminPolkaMutation();

  /* Handle Submit */
  const handleSubmit = async (values) => {
    /* Set Event */
    setIsSubmitting(true);
    /* Set status */
    setStatus("validating");
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const data = {
        name: values?.name,
        bulim_id: values?.departmentId,
      };
      const resData = await addPolka(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");
        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        setStatus("error");
        if (resData?.message) {
          messageApi.open({
            key,
            type: "error",
            content: resData?.message,
          });
        }
      }
      setTimeout(() => {
        setStatus("");
      }, 2000);
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        setStatus("warning");
        messageApi.open({
          key,
          type: "warning",
          content: `Ulanishda xatolik! Qaytadan urinib ko'ring!`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Bo'lim"
          name="departmentId"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Bo'lim talab qilinadi!",
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Bo'limni tanlash"
            loading={departmentLoading}
            filterOption={(inputValue, option) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0
            }
          >
            {departmentOptions.map((option) => (
              <Select.Option value={option.id} key={option.id}>
                {option?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Polka nomi"
          name="name"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Polka nomi talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="Polka nomi kiritish" autoFocus={true} />
        </Form.Item>

        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
          >
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default AdminAddPolkaModal;

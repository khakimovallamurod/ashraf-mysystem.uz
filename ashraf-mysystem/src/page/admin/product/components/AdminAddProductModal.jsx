import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useAddAdminProductMutation } from "../../../../features/admin/product/adminProductApiSlice";

function AdminAddProductModal({ onClose }) {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */
  const [addProduct] = useAddAdminProductMutation();

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
        article: values?.article,
        barcode: values?.barcode || values?.article,
        price: values?.price || 0,
        category_id: 0,
      };
      const resData = await addProduct(data).unwrap();
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
        if (onClose) onClose();
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
      setStatus("warning");
      messageApi.open({
        key,
        type: "warning",
        content: err?.data?.message || "Ulanishda xatolik! Qaytadan urinib ko'ring!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Mahsulot nomi"
          name="name"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Mahsulot nomi talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="Mahsulot nomi kiritish" autoFocus={true} />
        </Form.Item>
        <Form.Item
          label="Article"
          name="article"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Article talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="Article kiritish" autoFocus={true} />
        </Form.Item>
        <Form.Item
          label="Narx"
          name="price"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Narx talab qilinadi!",
            },
          ]}
        >
          <Input type="number" min={0} placeholder="Narx kiriting" />
        </Form.Item>
        <Form.Item label="Barcode" name="barcode">
          <Input placeholder="Bo'sh qoldirilsa article olinadi" />
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

export default AdminAddProductModal;

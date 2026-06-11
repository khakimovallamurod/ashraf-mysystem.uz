import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  useAddAdminCustomerMgmtMutation,
  useEditAdminCustomerMgmtMutation,
} from "../../../../features/admin/customerManagement/adminCustomerManagementApiSlice";

function AdminAddCustomerModal({ onClose, customer }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  const [addCustomer] = useAddAdminCustomerMgmtMutation();
  const [editCustomer] = useEditAdminCustomerMgmtMutation();

  useEffect(() => {
    if (customer?.id) {
      form.setFieldsValue({
        name: customer?.name || "",
        phone: customer?.phone || "",
        manzil: customer?.address || "",
      });
      return;
    }

    form.resetFields();
  }, [customer, form]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setStatus("validating");
    messageApi.open({ key, type: "loading", content: "Loading..." });
    try {
      const payload = {
        fio: values?.name,
        telefon: values?.phone,
        manzil: values?.manzil,
      };
      const resData = customer?.id
        ? await editCustomer({ id: customer.id, ...payload }).unwrap()
        : await addCustomer(payload).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");
        if (resData?.message) {
          messageApi.open({ key, type: "success", content: resData.message });
        }
        if (onClose) onClose();
      } else {
        setStatus("error");
        if (resData?.message) {
          messageApi.open({ key, type: "error", content: resData.message });
        }
      }
      setTimeout(() => setStatus(""), 2000);
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
          label="Mijoz ismi"
          name="name"
          hasFeedback
          validateStatus={status}
          rules={[{ required: true, message: "Ism talab qilinadi!" }]}
        >
          <Input allowClear placeholder="Mijoz ismini kiriting" />
        </Form.Item>
        <Form.Item
          label="Telefon raqam"
          name="phone"
          hasFeedback
          validateStatus={status}
          rules={[{ required: true, message: "Telefon talab qilinadi!" }]}
        >
          <Input allowClear placeholder="+998 __ ___ __ __" />
        </Form.Item>
        <Form.Item label="Manzil" name="manzil">
          <Input allowClear placeholder="Manzilni kiriting" />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
          >
            {customer?.id ? "Saqlash" : "Qo'shish"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default AdminAddCustomerModal;

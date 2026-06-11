import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  useAddAdminSupplierMgmtMutation,
  useEditAdminSupplierMgmtMutation,
} from "../../../../features/admin/supplierManagement/adminSupplierManagementApiSlice";

function AdminAddSupplierModal({ onClose, supplier }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const key = "addSupplier";

  const [addSupplier] = useAddAdminSupplierMgmtMutation();
  const [editSupplier] = useEditAdminSupplierMgmtMutation();

  useEffect(() => {
    if (supplier?.id) {
      form.setFieldsValue({
        name: supplier?.name || "",
        phone: supplier?.phone || "",
        chatId: supplier?.chatId || "",
      });
      return;
    }

    form.resetFields();
  }, [form, supplier]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setStatus("validating");
    messageApi.open({
      key,
      type: "loading",
      content: supplier?.id ? "Saqlanmoqda..." : "Loading...",
    });
    try {
      const payload = {
        fio: values?.name,
        telefon: values?.phone,
        telegram_id: values?.chatId?.trim?.() || "",
      };
      const resData = supplier?.id
        ? await editSupplier({ id: supplier.id, ...payload }).unwrap()
        : await addSupplier(payload).unwrap();
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
          label="Ta'minotchi ismi"
          name="name"
          hasFeedback
          validateStatus={status}
          rules={[{ required: true, message: "Ism talab qilinadi!" }]}
        >
          <Input allowClear placeholder="Ta'minotchi ismini kiriting" />
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
        <Form.Item label="Telegram chat id" name="chatId">
          <Input allowClear placeholder="Ixtiyoriy, keyin ham qo'shish mumkin" />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
        >
            {supplier?.id ? "Saqlash" : "Qo'shish"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default AdminAddSupplierModal;

import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useMemo, useState } from "react";
import ReactInputMask from "react-input-mask";
import { useGetAdminDepartmentQuery } from "../../../../features/admin/department/adminDepartmentApiSlice";
import { useAddAdminWorkerMutation } from "../../../../features/admin/worker/adminWorkerApiSlice";

function AdminAddWorkerModal({ onClose }) {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */
  const [addProduct] = useAddAdminWorkerMutation();
  const { data: departmentData, isLoading: departmentLoading } = useGetAdminDepartmentQuery();

  const departmentOptions = useMemo(() => {
    if (departmentData?.success === true && Array.isArray(departmentData?.data)) {
      return departmentData.data;
    }
    return [];
  }, [departmentData]);

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
        fio: values?.fio,
        telefon: values?.telefon,
        bulim_id: values?.bulim_id,
        chat_id: values?.chat_id || "",
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
        content: err?.data?.message || `Ulanishda xatolik! Qaytadan urinib ko'ring!`,
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
          label="FIO"
          name="fio"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "FIO talab qilinadi!",
            },
          ]}
        >
          <Input placeholder="FIO kiritish" autoFocus={true} />
        </Form.Item>
        <Form.Item
          label="Bo'lim"
          name="bulim_id"
          hasFeedback
          validateStatus={status}
          rules={[{ required: true, message: "Bo'lim tanlanishi kerak!" }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Bo'limni tanlang"
            loading={departmentLoading}
            filterOption={(input, option) =>
              String(option?.children || "").toLowerCase().includes(input.toLowerCase())
            }
          >
            {departmentOptions.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Telefon"
          name="telefon"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Telefon talab qilinadi!",
            },
          ]}
        >
          <ReactInputMask mask="+999(99)999-99-99">
            {(inputProps) => (
              <Input
                {...inputProps}
                placeholder="Telefon kiritish"
                type="tel"
              />
            )}
          </ReactInputMask>
        </Form.Item>
        <Form.Item
          label="Chat ID"
          name="chat_id"
          hasFeedback
          validateStatus={status}
        >
          <Input placeholder="Telegram chat ID ixtiyoriy" />
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

export default AdminAddWorkerModal;

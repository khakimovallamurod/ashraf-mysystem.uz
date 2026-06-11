import { SaveOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Select, message } from "antd";
import React, { useState } from "react";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";
import { useAddAdminFinanceSalaryMutation } from "../../../../features/admin/financeManagement/adminFinanceManagementApiSlice";
import removeComma from "../../../../util/removeComma";

function AdminSalaryModal({ workers = [], onClose }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const key = "addSalary";

  const [addSalary] = useAddAdminFinanceSalaryMutation();

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setStatus("validating");
    messageApi.open({ key, type: "loading", content: "Loading..." });
    try {
      const body = {
        worker_id: values?.worker_id,
        naqdsum: removeComma(values.summa),
        naqdusd: 0,
        bank: 0,
        karta: 0,
        valyuta: 0,
        izoh: values?.izoh || "Oylik to'lovi",
      };
      const resData = await addSalary(body).unwrap();
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
      if (err.status === "FETCH_ERROR") {
        setStatus("warning");
        messageApi.open({
          key,
          type: "warning",
          content: "Ulanishda xatolik! Qaytadan urinib ko'ring!",
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
        <Alert
          showIcon
          type="info"
          style={{ marginBottom: 16 }}
          message="Hozirgi backend oqimida oylik to'lovi to'g'ridan-to'g'ri yuboriladi."
        />
        <Form.Item
          label="Ishchi ismi"
          name="worker_id"
          hasFeedback
          validateStatus={status}
          rules={[{ required: true, message: "Ishchi talab qilinadi!" }]}
        >
          <Select allowClear showSearch placeholder="Ishchini tanlang"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {workers.map((w) => (
              <Select.Option value={w.id} key={w.id}>
                {w.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <MainInputPrice label="Summa" name="summa" status={status} />
        <Form.Item
          label="Izoh"
          name="izoh"
          rules={[{ required: true, message: "Izoh talab qilinadi!" }]}
        >
          <Input.TextArea allowClear rows={2} placeholder="Izoh" />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
          >
            To'lash
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default AdminSalaryModal;

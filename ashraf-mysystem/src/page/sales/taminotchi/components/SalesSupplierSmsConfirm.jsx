import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import MainLightTitle from "../../../../components/ui/title/MainLightTitle";
import MainText from "../../../../components/ui/title/MainText";
import { useAddSalesTaminotchiSmsConfirmMutation } from "../../../../features/sales/taminotchi/salesTaminotchiApiSlice";

function SalesSupplierSmsConfirm({ userData, handleClose }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "salesSmsConfirm";

  const [addConfirm] = useAddSalesTaminotchiSmsConfirmMutation();

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    messageApi.open({ key, type: "loading", content: "Loading..." });
    try {
      const data = {
        taminotchi_id: userData?.taminotchi_id,
        code: String(values?.code || "").trim(),
      };
      const resData = await addConfirm(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        messageApi.open({ key, type: "success", content: resData?.message || "Tasdiqlandi!" });
        setTimeout(() => handleClose(), 1000);
      } else {
        messageApi.open({ key, type: "error", content: resData?.message || "Xato kod!" });
      }
    } catch (err) {
      messageApi.open({ key, type: "warning", content: "Ulanishda xatolik!" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <MainLightTitle>Telegram kodini kiriting!</MainLightTitle>
        <MainText sm>
          <span style={{ opacity: 0.6 }}>
            Ta'minotchi: <b>{userData?.taminotchi}</b>
          </span>
        </MainText>
        <MainText sm>
          <span style={{ opacity: 0.6 }}>
            Telegram orqali yuborilgan 5 xonali kodni kiriting
          </span>
        </MainText>
      </div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="code"
          rules={[
            { required: true, message: "Kod talab qilinadi!" },
            { pattern: /^\d{5}$/, message: "Kod 5 xonali raqam bo'lishi kerak!" },
          ]}
        >
          <Input
            autoFocus
            disabled={isSubmitting}
            maxLength={5}
            inputMode="numeric"
            placeholder="12345"
          />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
          >
            Tasdiqlash
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default SalesSupplierSmsConfirm;

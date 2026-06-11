import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLightTitle from "../../../../components/ui/title/MainLightTitle";
import MainText from "../../../../components/ui/title/MainText";
import { useAddCashierSmsCodeConfirmMutation } from "../../../../features/cashier/productProvider/cashierProviderApiSlice";
import { SUPPLIER_HOME_ROUTE } from "../../../../util/path";

function CashierProviderSmsConfirm({ userData, handleClose }) {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "confirmSmsCode";

  /* API */
  const [addConfirmSmsKod] = useAddCashierSmsCodeConfirmMutation();

  /* Handle submit */
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setStatus("validating");
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const data = {
        taminotchi_id: userData?.taminotchi_id,
        code: String(values?.code || "").trim(),
      };
      const resData = await addConfirmSmsKod(data).unwrap();
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
        
        setTimeout(() => {
          handleClose();
        }, 1000);
        
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

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <MainLightTitle>SMS kodni kiriting!</MainLightTitle>
        <MainText sm>
          <span style={{ opacity: "0.6" }}>
            Taminotchi ismi: <b>{userData?.taminotchi}</b>
          </span>
        </MainText>
      </div>
      <Form
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="code"
          rules={[
            {
              required: true,
              message: "SMS kod talab qilinadi!",
            },
            {
              pattern: /^\d{5}$/,
              message: "Kod 5 xonali raqam bo'lishi kerak!",
            },
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
            Jo'natish
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CashierProviderSmsConfirm;

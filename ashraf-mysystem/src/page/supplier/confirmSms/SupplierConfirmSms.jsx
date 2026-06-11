import {
  Button,
  Card,
  Form,
  Input,
  message
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLightTitle from "../../../components/ui/title/MainLightTitle";
import { useAddSupplierConfirmSmsMutation } from "../../../features/supplier/orderSms/supplierConfirmSmsApiSlice";
import useParamQuery from "../../../hooks/useParamQuery";
import { SUPPLIER_HOME_ROUTE } from "../../../util/path";
import styles from "./supplierConfirmSms.module.css";

function SupplierConfirmSms() {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [paramOrderId, setParamOrderId] = useState(null);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "confirmSmsCode";

  /* API */
  const [addConfirmSmsKod] = useAddSupplierConfirmSmsMutation();

  /* Query */
  const query = useParamQuery();

  /* Navigate */
  const navigate = useNavigate();

  useEffect(() => {
    const paramId = query.get("orderId");
    if (paramId) {
      setParamOrderId(paramId);
    } else {
      navigate(SUPPLIER_HOME_ROUTE, { replace: true });
    }
  }, [navigate, query]);
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
        code: String(values?.code || "").trim(),
      };
      const resData = await addConfirmSmsKod({
        orderId: paramOrderId,
        body: { ...data },
      }).unwrap();
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
          navigate(SUPPLIER_HOME_ROUTE, { replace: true });
        }, 2000);
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

      <div className={styles.content}>
        <Card
          style={{
            width: "100%",
            boxShadow:
              "0px 4px 8px 0px rgba(0, 0, 0, 0.06), 0px 0px 4px 0px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <MainLightTitle>SMS kodni kiriting!</MainLightTitle>
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
        </Card>
      </div>
    </>
  );
}

export default SupplierConfirmSms;

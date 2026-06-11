import { Button, Divider, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { useAddSupplierGiveSalesOrderMutation } from "../../../../features/supplier/order/orderOfSales/supplierOrderOfSalesApiSlice";
import { useAddSupplierConfirmSmsMutation } from "../../../../features/supplier/orderSms/supplierConfirmSmsApiSlice";
import MainLightTitle from "../../../ui/title/MainLightTitle";

function SupplierOrderSalesGive({ orderId, onClose }) {
  const [confirmForm] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const [sendConfirmCode] = useAddSupplierGiveSalesOrderMutation();
  const [addConfirmSmsKod] = useAddSupplierConfirmSmsMutation();
  const sendKey = "sales-confirm-code-send";
  const confirmKey = "sales-confirm-code-check";

  const isSuccessResponse = (resData) =>
    resData?.success === true ||
    resData?.success === "true" ||
    resData?.success === 1 ||
    resData?.success === "1";

  const sendCode = async () => {
    if (!orderId) return;
    setIsSendingCode(true);
    message.open({
      key: sendKey,
      type: "loading",
      content: "Kod yuborilmoqda...",
      duration: 0,
    });
    try {
      const fallbackRepaymentDate = new Date(Date.now() + 86400000)
        .toISOString()
        .slice(0, 10);
      const resData = await sendConfirmCode({
        id: orderId,
        body: {
          naqd: 0,
          naqdusd: 0,
          valyuta: 0,
          plastik: 0,
          karta: 0,
          muddat: fallbackRepaymentDate,
        },
      }).unwrap();

      if (isSuccessResponse(resData)) {
        setCodeSent(true);
        message.open({
          key: sendKey,
          type: "success",
          content: resData?.message || "Tasdiqlash kodi yuborildi",
        });
      } else {
        setCodeSent(false);
        message.open({
          key: sendKey,
          type: "error",
          content: resData?.message || "Kod yuborilmadi",
        });
      }
    } catch (err) {
      setCodeSent(false);
      message.open({
        key: sendKey,
        type: "warning",
        content: "Ulanishda xatolik! Qaytadan urinib ko'ring!",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  useEffect(() => {
    confirmForm.resetFields();
    setCodeSent(false);
    sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleConfirmSubmit = async (values) => {
    setIsSubmitting(true);
    message.open({
      key: confirmKey,
      type: "loading",
      content: "Tasdiqlanmoqda...",
      duration: 0,
    });
    try {
      const resData = await addConfirmSmsKod({
        orderId,
        body: { code: String(values?.code || "").trim() },
      }).unwrap();

      if (isSuccessResponse(resData)) {
        message.open({
          key: confirmKey,
          type: "success",
          content: resData?.message || "Muvaffaqiyatli tasdiqlandi",
        });
        confirmForm.resetFields();
        if (typeof onClose === "function") {
          onClose();
        }
      } else {
        message.open({
          key: confirmKey,
          type: "error",
          content: resData?.message || "Tasdiqlash amalga oshmadi",
        });
      }
    } catch (err) {
      message.open({
        key: confirmKey,
        type: "warning",
        content: "Ulanishda xatolik! Qaytadan urinib ko'ring!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form
        form={confirmForm}
        onFinish={handleConfirmSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <MainLightTitle>SMS kodni kiriting</MainLightTitle>
        <Divider />
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
            disabled={isSubmitting || isSendingCode}
            maxLength={5}
            inputMode="numeric"
            placeholder="12345"
          />
        </Form.Item>
        <Form.Item style={{ width: "100%" }}>
          <div style={{ width: "100%", display: "flex", gap: "1rem" }}>
            <Button
              style={{ width: "100%" }}
              danger
              disabled={isSubmitting || isSendingCode}
              onClick={onClose}
            >
              Bekor qilish
            </Button>
            <Button
              style={{ width: "100%" }}
              onClick={sendCode}
              disabled={isSubmitting || isSendingCode}
            >
              Qayta kod yuborish
            </Button>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={!codeSent || isSendingCode}
            >
              Tasdiqlash
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}

export default SupplierOrderSalesGive;

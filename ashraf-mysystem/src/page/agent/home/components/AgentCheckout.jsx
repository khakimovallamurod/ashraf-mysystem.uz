import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, Typography, message } from "antd";
import React, { useState } from "react";
import MainLightTitle from "../../../../components/ui/title/MainLightTitle";
import MainText from "../../../../components/ui/title/MainText";
import { useAddSalesPlacingOrderToUploaderMutation } from "../../../../features/sales/salesApiSlice";

function AgentCheckout({ onSuccess, allProducts, totalPrice, onClose, customerData }) {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [status, setStatus] = React.useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* API */
  const [addOrder] = useAddSalesPlacingOrderToUploaderMutation();


  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "checkout";


  /* Handle submit */
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
        client_id: customerData?.id,
        product_list: allProducts.map((item) => ({
          product_id: item?.defaultProductData?.id,
          aritcle: item?.defaultProductData?.article,
          massa: item?.mass,
          price: item?.price,
        })),
        izoh: values?.eslatma,
      };
      const resData = await addOrder(data).unwrap();
      if (resData?.success === true) {
        onSuccess();

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

      {/* FORM */}
      <Form
        onFinish={handleSubmit}
        autoComplete="off"
        layout="horizontal"
        form={form}
      >
        <MainLightTitle>To'lov</MainLightTitle>
        <Divider />
        <MainText>Mijoz nomi: <b>{customerData?.fio}</b> </MainText>
        <MainText>Mahsulotlar <b>{allProducts.length} <span style={{ opacity: '0.5' }}>ta</span></b> </MainText>
        <Divider />
        <Typography.Text strong>
          Eslatma <span style={{ opacity: 0.5 }}>(agar joiz bo'lsa)</span>
        </Typography.Text>
        <Form.Item name={"eslatma"} hasFeedback validateStatus={status}>
          <Input.TextArea
            allowClear
            showCount
            placeholder="Izoh kiritish"
            rows={6}
          />
        </Form.Item>
        <Form.Item style={{ width: "100%" }}>
          <div style={{ width: "100%", display: "flex", gap: "1rem" }}>
            <Button
              style={{ width: "100%" }}
              type="primary"
              icon={<CloseOutlined />}
              danger
              disabled={isSubmitting}
              onClick={onClose}
            >
              Bekor qilish
            </Button>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              icon={<CheckOutlined />}
              loading={isSubmitting}
            >
              Saqlash
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}

export default AgentCheckout;

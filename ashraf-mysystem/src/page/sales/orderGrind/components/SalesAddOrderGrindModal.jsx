import { Button, Form, InputNumber, Typography, message } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import MainModal from "../../../../components/common/modal/MainModal";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { addSalesOrderProductsListGrind } from "../../../../features/sales/salesSlice";
const { Text } = Typography;

function SalesAddOrderGrindModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [openModal, setOpenModal] = useState({
    open: false,
    data: null,
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Dispatch */
  const dispatch = useDispatch();

  /* Modal */
  const handleOpenModal = (data) => setOpenModal({ open: true, data });
  const handleCloseModal = (data) => setOpenModal({ open: false, data: null });

  /* submit */
  const handleSubmit = (values) => {
    /* Validation */
    if (!openModal?.data) {
      setStatus("error");
      setIsSubmitting(false);
      message.error("Mahsulotni ID si topilmadi!");
      return;
    }
    // Loading
    setIsSubmitting(true);
    setStatus("validating");
    setTimeout(() => {
      /* Set data */
      dispatch(
        addSalesOrderProductsListGrind({
          product: openModal.data,
          mass: values.mass,
        })
      );
      handleCloseModal();
      // Finish
      form.resetFields();
      setIsSubmitting(false);
      setStatus("success");
      setTimeout(() => {
        setStatus("");
      }, [1000]);
    }, 500);
  };

  return (
    <MainModal
      title="Buyurtmaga qo'shish"
      open={openModal.open}
      onClose={handleCloseModal}
    >
      {!openModal.data?.id ? (
        <Text disabled>Mahsulotni ID si topilmadi! </Text>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name={"mass"}
            hasFeedback
            rules={[{ required: true, message: "Massa talab qilinadi!" }]}
            validateStatus={status}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Massa kiriting"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              style={{ width: "100%" }}
              icon={<AppstoreAddOutlined />}
              htmlType="submit"
              loading={isSubmitting}
            >
              Buyurtmalar ro'yxatiga qo'shish
            </Button>
          </Form.Item>
        </Form>
      )}
    </MainModal>
  );
}

export default forwardRef(SalesAddOrderGrindModal);

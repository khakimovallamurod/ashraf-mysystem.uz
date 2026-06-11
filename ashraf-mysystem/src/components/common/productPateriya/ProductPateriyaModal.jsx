import { Button, Form, Input, message } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useAddPateriyaMutation } from "../../../features/pateriya/pateriyaApiSlice";
import removeComma from "../../../util/removeComma";
import MainInputMass from "../../ui/inputMass/MainInputMass";
import MainModal from "../modal/MainModal";

function ProductPateriyaModal({ from }, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));

  /* Forom */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "setPolkaOrder";

  /* API */
  const [addPateriya] = useAddPateriyaMutation();

  /* State */
  const [openModal, setOpenModal] = useState({
    open: false,
    data: null,
  });

  /* Modal */
  const handleOpenModal = ({ id, product_id }) => {
    setOpenModal({
      open: true,
      data: {
        id,
        product_id,
      },
    });
  };
  const handleCloseModal = () => {
    form.resetFields();
    setOpenModal({
      open: false,
      data: null,
    });
  };

  /* Handle submit */
  const handleSubmit = async (values) => {
    if (!openModal?.data?.id || !openModal?.data?.product_id) {
      message.error("Item va mahsulot ID si topilmadi!");
      return;
    }

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
        id: openModal.data?.id,
        product_id: openModal.data?.product_id,
        massa: removeComma(values?.mass),
        izoh: values?.comment,
      };
      const resData = await addPateriya(data).unwrap();

      if (resData?.success === true) {
        handleCloseModal();
        form.resetFields();
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
      <MainModal open={openModal.open} onClose={handleCloseModal}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {/* Mass */}
          <MainInputMass status={status} />

          <Form.Item name={"comment"} hasFeedback validateStatus={status}>
            <Input.TextArea
              allowClear
              showCount
              placeholder="Izoh kiritish"
              rows={6}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={isSubmitting}
            >
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </MainModal>
    </>
  );
}

export default forwardRef(ProductPateriyaModal);

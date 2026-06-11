import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useAddProductProviderMutation } from "../../../../features/sklad/productProvider/productProviderApiSlice";
import MainModal from "../../../common/modal/MainModal";
import MainPhoneInput from "../../../ui/phone/MainPhoneInput";

function AddProductProviderModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));

  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  /* API */
  const [addProvider] = useAddProductProviderMutation();

  /* Modal */
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
        fio: values.fio,
        telefon: values.telefon,
      };
      const resData = await addProvider(data).unwrap();

      if (resData?.success === true) {
        /* Success */
        
        handleCloseModal()
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
        /* Error */
        
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

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <MainModal open={openModal} onClose={handleCloseModal}>
        <Form
          form={form}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Form.Item
            label="Taminotchi ismi"
            name={"fio"}
            rules={[
              {
                required: true,
                message: "Taminotchini ismi!",
              },
            ]}
            validateStatus={status}
            hasFeedback
          >
            <Input placeholder="Taminotchi ismi" />
          </Form.Item>

          <MainPhoneInput status={status} />

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              htmlType="submit"
              type="primary"
              icon={<PlusOutlined />}
              loading={isSubmitting}
            >
              Qo'shish
            </Button>
          </Form.Item>
        </Form>
      </MainModal>
    </>
  );
}

export default forwardRef(AddProductProviderModal);

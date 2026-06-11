import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import MainModal from "../../../../components/common/modal/MainModal";
import { useAddSalesOrderHistoryCloseOrderMutation } from "../../../../features/sales/orderHistory/salesOrderHistoryApiSlice";

function SalesOrderCloseModal(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenModal,
  }));
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [openMadal, setOpenModal] = useState({
    open: false,
    data: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const key = "closeOrder";

  /* API */
  const [addCloseOrder] = useAddSalesOrderHistoryCloseOrderMutation();

  /* Modal */
  const handleOpenModal = (data) => {
    setOpenModal({
      open: true,
      data,
    });
  };

  const handleCloseModal = () => {
    setOpenModal({
      open: false,
      data: null,
    });
  };

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
        sale_order_id: openMadal?.data?.orderId,
        sale_order_item_id: openMadal?.data?.productId,
        izoh: values?.comment,
      };
      const resData = await addCloseOrder(data).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");
        handleCloseModal();
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
      <MainModal open={openMadal?.open} onClose={handleCloseModal}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name={"comment"}
            rules={[
              {
                required: true,
                message: "Izoh talab qilinadi!",
              },
            ]}
            hasFeedback
            validateStatus={status}
          >
            <Input.TextArea
              allowClear
              showCount
              placeholder="Izoh kiritish"
              rows={6}
            />
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
      </MainModal>
    </>
  );
}

export default forwardRef(SalesOrderCloseModal);

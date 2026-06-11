import React, {useState} from 'react';
import {Button, DatePicker, Form, Input, InputNumber, message} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import {
  useAddSupplierDeadlineConfirmSmsMutation,
  useAddSupplierDeadlineUpMutation
} from "../../../../features/supplier/deadline/supplierDeadlineApiSlice";

function ChangeDeadlineConfirmSmsModal({onClose, id}) {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState('')

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */
  const [addConfirmSms] = useAddSupplierDeadlineConfirmSmsMutation();

  /* Handle Submit */
  const handleSubmit = async (values) => {
    if (!id) {
      message.error('Ushbu muddat topilmadi');
      return
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
        deadlineId: id,
        smsCode: values.smsCode
      };
      const resData = await addConfirmSms(data).unwrap();
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
        // Close modal
        onClose()
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="SMS kodni kiriting"
          name="smsCode"
          rules={[
            {
              required: true,
              message: "SMS kod talab qilinadi!",
            },
          ]}
        >
          <InputNumber
            style={{width: "100%"}}
            placeholder="00000"
            type="number"
            max={9999}
          />
        </Form.Item>

        <Form.Item>
          <Button
            style={{width: "100%"}}
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

export default ChangeDeadlineConfirmSmsModal;
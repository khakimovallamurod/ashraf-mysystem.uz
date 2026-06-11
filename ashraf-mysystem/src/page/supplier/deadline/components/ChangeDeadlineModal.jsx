import React, {useState} from 'react';
import {Button, DatePicker, Form, message} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import {useAddSupplierDeadlineUpMutation} from "../../../../features/supplier/deadline/supplierDeadlineApiSlice";

function ChangeDeadlineModal({onShowConfirmSms, id}) {
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
  const [addChangeDate] = useAddSupplierDeadlineUpMutation();

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
        date: selectedDate
      };
      const resData = await addChangeDate(data).unwrap();
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
        onShowConfirmSms(true)
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
          label="Sanani tanlang"
          name="date"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Sana talab qilinadi!",
            },
          ]}
        >
          <DatePicker style={{width: '100%'}} onChange={(_, val) => setSelectedDate(val)}/>
        </Form.Item>

        <Form.Item>
          <Button
            style={{width: "100%"}}
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined/>}
            loading={isSubmitting}
          >
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default ChangeDeadlineModal;
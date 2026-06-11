import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useMemo, useState } from "react";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";
import { useAddAdminExpensesMutation } from "../../../../features/admin/expenses/adminExpensesApiSlice";
import { useGetAdminExpensesCategoryQuery } from "../../../../features/admin/expensesCategory/adminExpensesCategoryApiSlice";
import removeComma from "../../../../util/removeComma";
import { useAddAdminDividendAncloseMutation } from "../../../../features/admin/dividendEnclose/adminDividendEncloseApiSlice";

function AdminAddDividendEncloseModal() {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */
  const [addDividendPut] = useAddAdminDividendAncloseMutation();

  /* Handle Submit */
  const handleSubmit = async (values) => {
    const { naqdsum, naqdusd, valyuta, bank, karta, izoh } = values;

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
        category_id: 0,
        naqdsum: removeComma(naqdsum),
        naqdusd: removeComma(naqdusd),
        valyuta: removeComma(valyuta),
        bank: removeComma(bank),
        karta: removeComma(karta),
        izoh: izoh,
        holat: "kirim"
      };
      const resData = await addDividendPut(data).unwrap();
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

        <MainInputPrice label="Naqd so'm" name="naqdsum" showLabel={true} status={status} />
        <MainInputPrice label="Naqd usd" name="naqdusd" showLabel={true} status={status} />
        <MainInputPrice label="Valyuta" name="valyuta" showLabel={true} status={status} />
        <MainInputPrice label="Bank" name="bank" showLabel={true} status={status} />
        <MainInputPrice label="Karta" name="karta" showLabel={true} status={status} />

        <Form.Item
          label="Izoh"
          name="izoh"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Izoh talab qilinadi!",
            },
          ]}
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
    </>
  );
}

export default AdminAddDividendEncloseModal;

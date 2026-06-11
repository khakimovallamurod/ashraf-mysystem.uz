import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useMemo, useState } from "react";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";
import { useAddAdminExpensesMutation } from "../../../../features/admin/expenses/adminExpensesApiSlice";
import { useGetAdminExpensesCategoryQuery } from "../../../../features/admin/expensesCategory/adminExpensesCategoryApiSlice";
import removeComma from "../../../../util/removeComma";

function AdminAddExpensesModal() {
  /* Form */
  const [form] = Form.useForm();

  /* State */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addCustomer";

  /* API */ 
  const { data, isLoading, isError, refetch } =
    useGetAdminExpensesCategoryQuery();
  const [addExpenses] = useAddAdminExpensesMutation();

  /* Memo */
  const expensesCategoryOptions = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  /* Handle Submit */
  const handleSubmit = async (values) => {
    const { expensesCategory,naqdsum, naqdusd, valyuta, bank, karta, izoh } = values;

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
        category_id: expensesCategory,
        naqdsum: removeComma(naqdsum),
        naqdusd: removeComma(naqdusd),
        valyuta: removeComma(valyuta),
        bank: removeComma(bank),
        karta: removeComma(karta),
        izoh: izoh,
      };
      const resData = await addExpenses(data).unwrap();
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
        <Form.Item
          label="Xarajat turi"
          name="expensesCategory"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Xarajat turi talab qilinadi!",
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Xarajat turini tanlash"
            loading={isLoading}
            filterOption={(inputValue, option) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0
            }
          >
            {expensesCategoryOptions.map((option) => (
              <Select.Option value={option.id} key={option.id}>
                {option?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <MainInputPrice label="Naqd so'm" name="naqdsum" status={status} />
        <MainInputPrice label="Naqd usd" name="naqdusd" status={status} />
        <MainInputPrice label="Valyuta" name="valyuta" status={status} />
        <MainInputPrice label="Bank" name="bank" status={status} />
        <MainInputPrice label="Karta" name="karta" status={status} />

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

export default AdminAddExpensesModal;

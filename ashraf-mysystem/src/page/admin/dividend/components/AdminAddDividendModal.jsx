import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useMemo, useState } from "react";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";
import removeComma from "../../../../util/removeComma";
import { useAddAdminDividendMutation, useGetAdminDividendQuery } from "../../../../features/admin/dividend/adminDividendApiSlice";
import { useGetAdminDividendCategoryQuery } from "../../../../features/admin/dividendCategory/adminDividendCategoryApiSlice";

function AdminAddDividend() {
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
    useGetAdminDividendCategoryQuery();
  const [addDividend] = useAddAdminDividendMutation();

  /* Memo */
  const dividendCategoryOptions = useMemo(() => {
    if (data?.success === true && data?.data && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);
  

  /* Handle Submit */
  const handleSubmit = async (values) => {
    const { dividendCategory, naqdsum, naqdusd, valyuta, bank, karta, izoh } = values;

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
        category_id: dividendCategory,
        naqdsum: removeComma(naqdsum),
        naqdusd: removeComma(naqdusd),
        valyuta: removeComma(valyuta),
        bank: removeComma(bank),
        karta: removeComma(karta),
        izoh: izoh,
        holat: "chiqim"
      };
      const resData = await addDividend(data).unwrap();
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
          label="Dividend turi"
          name="dividendCategory"
          hasFeedback
          validateStatus={status}
          rules={[
            {
              required: true,
              message: "Dividend turi talab qilinadi!",
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Dividend turini tanlash"
            loading={isLoading}
            filterOption={(inputValue, option) =>
              option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >=
              0
            }
          >
            {dividendCategoryOptions.map((option) => (
              <Select.Option value={option.id} key={option.id}>
                {option?.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

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

export default AdminAddDividend;

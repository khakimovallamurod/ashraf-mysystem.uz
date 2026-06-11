import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useMemo, useState } from "react";
import MainInputPrice from "../../../../components/ui/inputPrice/MainInputPrice";
import { useGetAdminProductsQuery } from "../../../../features/admin/product/adminProductApiSlice";
import { useAddAdminWarehouseTransferMutation } from "../../../../features/admin/warehouseManagement/adminWarehouseManagementApiSlice";
import removeComma from "../../../../util/removeComma";

function AdminTransferModal({ onClose }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const key = "addTransfer";

  const [addTransfer] = useAddAdminWarehouseTransferMutation();
  const { data: productsData, isLoading: productsLoading } = useGetAdminProductsQuery();

  const productOptions = useMemo(() => {
    if (productsData?.success === true && Array.isArray(productsData?.data)) {
      return productsData.data;
    }
    return [];
  }, [productsData]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setStatus("validating");
    messageApi.open({ key, type: "loading", content: "Loading..." });
    try {
      const body = {
        product_id: values?.product_id,
        massa: removeComma(values.massa),
      };
      const resData = await addTransfer(body).unwrap();
      if (resData?.success === true) {
        form.resetFields();
        setStatus("success");
        if (resData?.message) {
          messageApi.open({ key, type: "success", content: resData.message });
        }
        if (onClose) onClose();
      } else {
        setStatus("error");
        if (resData?.message) {
          messageApi.open({ key, type: "error", content: resData.message });
        }
      }
      setTimeout(() => setStatus(""), 2000);
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

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Mahsulot"
          name="product_id"
          hasFeedback
          validateStatus={status}
          rules={[{ required: true, message: "Mahsulot talab qilinadi!" }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Mahsulotni tanlang"
            loading={productsLoading}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {productOptions.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <MainInputPrice label="Massa (kg)" name="massa" status={status} />
        <Form.Item label="Izoh" name="izoh">
          <Input.TextArea allowClear rows={2} placeholder="Izoh" />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
          >
            O'tkazish
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default AdminTransferModal;

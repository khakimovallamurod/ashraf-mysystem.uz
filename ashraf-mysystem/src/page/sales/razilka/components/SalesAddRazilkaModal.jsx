import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Tag, message } from "antd";
import { useMemo, useState } from "react";
import {
  useAddRazilkaMutation,
  useGetRazilkaProductsQuery,
} from "../../../../features/sales/razilka/salesRazilkaApiSlice";

const { Option } = Select;

function SalesAddRazilkaModal({ onClose }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [manba, setManba] = useState("xolodelnik");
  const [messageApi, contextHolder] = message.useMessage();
  const key = "addRazilka";

  const { data: productsData, isLoading } = useGetRazilkaProductsQuery();
  const [addRazilka] = useAddRazilkaMutation();

  const products = useMemo(() => {
    if (productsData?.success && Array.isArray(productsData?.data)) {
      return productsData.data;
    }
    return [];
  }, [productsData]);

  const availableMassa =
    selectedProduct
      ? manba === "svejiy"
        ? selectedProduct.svejiy_massa
        : selectedProduct.xol_massa
      : 0;

  const handleProductChange = (id) => {
    const p = products.find((pr) => pr.id === id);
    setSelectedProduct(p || null);
    form.setFieldValue("massa", null);
  };

  const handleManbaChange = (val) => {
    setManba(val);
    form.setFieldValue("massa", null);
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    messageApi.open({ key, type: "loading", content: "Saqlanmoqda..." });
    try {
      const res = await addRazilka({
        product_id: values.product_id,
        massa: values.massa,
        manba: values.manba,
        izoh: values.izoh || "",
      }).unwrap();

      if (res?.success) {
        messageApi.open({ key, type: "success", content: res.message });
        form.resetFields();
        setSelectedProduct(null);
        setTimeout(() => onClose?.(), 800);
      } else {
        messageApi.open({ key, type: "error", content: res.message });
      }
    } catch {
      messageApi.open({ key, type: "warning", content: "Ulanishda xatolik!" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}
        initialValues={{ manba: "xolodelnik" }}>

        <Form.Item label="Manba" name="manba"
          rules={[{ required: true, message: "Manbani tanlang!" }]}>
          <Select onChange={handleManbaChange}>
            <Option value="xolodelnik">Xolodelnik</Option>
            <Option value="svejiy">Svejiy (bugungi kirim)</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Mahsulot" name="product_id"
          rules={[{ required: true, message: "Mahsulotni tanlang!" }]}>
          <Select
            showSearch
            allowClear
            loading={isLoading}
            placeholder="Mahsulotni tanlang"
            onChange={handleProductChange}
            filterOption={(input, option) =>
              option.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {products.map((p) => (
              <Option value={p.id} key={p.id}>
                {p.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedProduct && (
          <div style={{ marginBottom: 16 }}>
            <Tag color="blue">
              Xolodelnik: {selectedProduct.xol_massa} kg
            </Tag>
            <Tag color="green">
              Svejiy: {selectedProduct.svejiy_massa} kg
            </Tag>
            <Tag color={availableMassa > 0 ? "cyan" : "red"}>
              Mavjud ({manba === "svejiy" ? "svejiy" : "xolodelnik"}):{" "}
              {availableMassa} kg
            </Tag>
          </div>
        )}

        <Form.Item
          label="Massa (kg)"
          name="massa"
          rules={[
            { required: true, message: "Massani kiriting!" },
            {
              validator: (_, value) => {
                if (!value || value <= 0)
                  return Promise.reject("Massa 0 dan katta bo'lishi kerak!");
                if (value > availableMassa)
                  return Promise.reject(
                    `Mavjud massa yetarli emas (${availableMassa} kg)!`
                  );
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0.01}
            max={availableMassa || undefined}
            step={0.1}
            placeholder="Massani kiriting"
            addonAfter="kg"
          />
        </Form.Item>

        <Form.Item label="Izoh" name="izoh">
          <Input.TextArea rows={3} placeholder="Izoh (ixtiyoriy)" allowClear />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit"
            icon={<SaveOutlined />} loading={isSubmitting}>
            Razilkaga qo'shish
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default SalesAddRazilkaModal;

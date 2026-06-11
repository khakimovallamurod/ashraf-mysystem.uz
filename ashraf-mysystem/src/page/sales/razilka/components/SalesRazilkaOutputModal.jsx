import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button, Col, DatePicker, Form, Input, InputNumber,
  Row, Select, Space, Table, Tag, Typography, message,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  useGetRazilkaProductsQuery,
  useRazilkaOutputMutation,
} from "../../../../features/sales/razilka/salesRazilkaApiSlice";

const { Text } = Typography;

function SalesRazilkaOutputModal({ razilkaItem, onClose }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rows, setRows] = useState([
    { key: Date.now(), product_id: null, massa: null, manzil: "xolodelnik" },
  ]);
  const [messageApi, contextHolder] = message.useMessage();

  const { data: productsData, isLoading } = useGetRazilkaProductsQuery();
  const [razilkaOutput] = useRazilkaOutputMutation();

  const products = useMemo(() => {
    if (productsData?.success && Array.isArray(productsData?.data))
      return productsData.data;
    return [];
  }, [productsData]);

  const qolganMassa = razilkaItem?.massa || 0;

  const totalChiqim = rows.reduce(
    (sum, r) => sum + (Number(r.massa) || 0),
    0
  );

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { key: Date.now(), product_id: null, massa: null, manzil: "xolodelnik" },
    ]);

  const removeRow = (key) =>
    setRows((prev) => prev.filter((r) => r.key !== key));

  const updateRow = (key, field, value) =>
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
    );

  const handleSubmit = async (formValues) => {
    const mahsulotlar = rows.filter(
      (r) => r.product_id && r.massa > 0
    );

    if (mahsulotlar.length === 0) {
      messageApi.error("Kamida bitta mahsulot kiriting!");
      return;
    }

    if (totalChiqim > qolganMassa + 0.001) {
      messageApi.error(
        `Mahsulotlar jami (${totalChiqim.toFixed(2)} kg) razilkadagi qolgan massadan (${qolganMassa} kg) ko'p!`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await razilkaOutput({
        razilka_id: razilkaItem.id,
        mahsulotlar: mahsulotlar.map((r) => ({
          product_id: r.product_id,
          massa: r.massa,
          manzil: r.manzil,
        })),
        sana: formValues.sana
          ? formValues.sana.format("DD.MM.YYYY")
          : dayjs().format("DD.MM.YYYY"),
        izoh: formValues.izoh || "",
      }).unwrap();

      if (res?.success) {
        messageApi.success(res.message);
        setTimeout(() => onClose?.(), 800);
      } else {
        messageApi.error(res.message);
      }
    } catch {
      messageApi.warning("Ulanishda xatolik!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}

      {/* Razilka info */}
      <div
        style={{
          background: "#fef9c3",
          border: "1px solid #fde68a",
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 16,
        }}
      >
        <Text strong>{razilkaItem?.product_name}</Text>
        <Text type="secondary" style={{ marginLeft: 8 }}>
          — Razilkadagi qolgan massa:{" "}
          <Text strong style={{ color: "#b45309" }}>
            {qolganMassa} kg
          </Text>
        </Text>
        <Tag color="orange" style={{ marginLeft: 8 }}>
          {razilkaItem?.manba === "svejiy" ? "Svejiy" : "Xolodelnik"}dan kelgan
        </Tag>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ sana: dayjs() }}
      >
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item label="Sana" name="sana">
              <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Izoh" name="izoh">
              <Input placeholder="Izoh (ixtiyoriy)" allowClear />
            </Form.Item>
          </Col>
        </Row>

        {/* Chiqim mahsulotlar jadvali */}
        <div style={{ marginBottom: 8 }}>
          <Text strong>Chiqim mahsulotlari</Text>
          <Text type="secondary" style={{ marginLeft: 12, fontSize: 12 }}>
            Jami:{" "}
            <Text
              strong
              style={{ color: totalChiqim > qolganMassa ? "red" : "green" }}
            >
              {totalChiqim.toFixed(2)} kg
            </Text>
            {" / "}
            <Text type="secondary">{qolganMassa} kg</Text>
          </Text>
          {totalChiqim > 0 && totalChiqim <= qolganMassa && (
            <Text
              style={{ marginLeft: 12, fontSize: 12, color: "#b45309" }}
            >
              (Qoladi: {(qolganMassa - totalChiqim).toFixed(2)} kg)
            </Text>
          )}
        </div>

        <Table
          dataSource={rows}
          rowKey="key"
          pagination={false}
          size="small"
          style={{ marginBottom: 12 }}
          columns={[
            {
              title: "Mahsulot nomi",
              key: "product_id",
              render: (_, record) => (
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Mahsulot"
                  loading={isLoading}
                  value={record.product_id}
                  onChange={(v) => updateRow(record.key, "product_id", v)}
                  filterOption={(input, option) =>
                    option.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {products.map((p) => (
                    <Select.Option value={p.id} key={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              ),
            },
            {
              title: "Massa (kg)",
              key: "massa",
              width: 130,
              render: (_, record) => (
                <InputNumber
                  style={{ width: "100%" }}
                  min={0.01}
                  step={0.1}
                  value={record.massa}
                  onChange={(v) => updateRow(record.key, "massa", v)}
                  addonAfter="kg"
                />
              ),
            },
            {
              title: "Manzil",
              key: "manzil",
              width: 140,
              render: (_, record) => (
                <Select
                  style={{ width: "100%" }}
                  value={record.manzil}
                  onChange={(v) => updateRow(record.key, "manzil", v)}
                >
                  <Select.Option value="xolodelnik">Xolodelnik</Select.Option>
                  <Select.Option value="svejiy">Svejiy</Select.Option>
                </Select>
              ),
            },
            {
              title: "",
              key: "del",
              width: 40,
              render: (_, record) => (
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={rows.length === 1}
                  onClick={() => removeRow(record.key)}
                />
              ),
            },
          ]}
        />

        <Space style={{ marginBottom: 16 }}>
          <Button icon={<PlusOutlined />} onClick={addRow}>
            Mahsulot qo'shish
          </Button>
        </Space>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            disabled={totalChiqim <= 0 || totalChiqim > qolganMassa + 0.001}
          >
            Saqlash va xolodelnik/svejiyga qo'shish
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default SalesRazilkaOutputModal;

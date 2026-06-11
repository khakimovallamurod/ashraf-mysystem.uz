import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Steps,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import { useCallback, useMemo, useRef, useState } from "react";
import { useGetAdminIndexDataQuery } from "../../../features/admin/statistic/adminStatisticApiSlice";
import { useGetSalesCustomerQuery } from "../../../features/sales/customer/salesCustomerApiSlice";
import {
  useAddSalesPlacingOrderToUploaderMutation,
  useGetSalesProductsQuery,
} from "../../../features/sales/salesApiSlice";
import SalesAddCustomerModal from "../customer/components/SalesAddCustomerModal";

const { Text, Title } = Typography;

const STEPS = ["Mijoz", "Mahsulotlar", "Narx & Miqdor", "To'lov"];

function fmt(val) {
  return Number(val || 0).toLocaleString("uz-UZ");
}

/* ─── Step 0: Customer ─── */
function StepCustomer({ customer, onSelect, customerOptions, customerLoading, addCustomerRef }) {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <Title level={4} style={{ marginBottom: 16 }}>Mijozni tanlang</Title>
      <Space.Compact block style={{ width: "100%" }}>
        <Select
          allowClear
          showSearch
          placeholder="Mijozni qidirish..."
          loading={customerLoading}
          value={customer?.id ?? undefined}
          style={{ width: "100%" }}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          onChange={(val) => {
            onSelect(customerOptions.find((c) => c.id === val) ?? null);
          }}
        >
          {customerOptions.map((c) => (
            <Select.Option key={c.id} value={c.id}>
              {c.fio}
            </Select.Option>
          ))}
        </Select>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => addCustomerRef.current?.onOpen()}
        >
          Qo'shish
        </Button>
      </Space.Compact>

      {customer && (
        <Card style={{ marginTop: 16, borderRadius: 12 }}>
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <Text strong style={{ fontSize: 16 }}>{customer.fio}</Text>
            {customer.telefon && <Text type="secondary">Tel: {customer.telefon}</Text>}
            {customer.manzil && <Text type="secondary">Manzil: {customer.manzil}</Text>}
            <Tag color={Number(customer.balans) < 0 ? "red" : "green"}>
              Balans: {fmt(customer.balans)} so'm
            </Tag>
          </Space>
        </Card>
      )}
    </div>
  );
}

/* ─── Step 1: Product multi-select with tabs ─── */
function StepProducts({ salesProducts, indexData, selected, onToggle, customerCategoryId }) {
  const [search, setSearch] = useState("");

  /* Build a map from salesProducts for price + soni lookup by id */
  const salesMap = useMemo(() => {
    const m = {};
    (salesProducts || []).forEach((p) => { m[p.id] = p; });
    return m;
  }, [salesProducts]);

  /* Merge index data items with sales product data */
  const mergeProducts = useCallback((items, source) =>
    (items || []).map((item) => {
      const sp = salesMap[item.id] || {};
      const categoryPrice = (sp.price_list || []).find(
        (pl) => pl.client_category_id === customerCategoryId
      );
      return {
        id: item.id,
        name: item.name || item.article || sp.name || "",
        article: item.article || sp.article || "",
        massa: item.massa ?? sp.soni ?? 0,
        price: categoryPrice?.price ?? sp.price ?? 0,
        price_list: sp.price_list || [],
        source,
      };
    }), [customerCategoryId, salesMap]);

  const freshList = useMemo(
    () => mergeProducts(indexData?.svejiy, "svejiy"),
    [indexData?.svejiy, mergeProducts]
  );
  const coldList = useMemo(
    () => mergeProducts(indexData?.xolodelnik, "xolodelnik"),
    [indexData?.xolodelnik, mergeProducts]
  );

  const filterBySearch = (list) =>
    search
      ? list.filter(
          (p) =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.article?.toLowerCase().includes(search.toLowerCase())
        )
      : list;

  const ProductGrid = ({ list }) => (
    <Row gutter={[8, 8]} style={{ marginTop: 12 }}>
      {list.length === 0 && (
        <Col xs={24}>
          <Text type="secondary">Mahsulotlar topilmadi</Text>
        </Col>
      )}
      {list.map((p) => {
        const isSelected = selected.some((s) => s.id === p.id && s.source === p.source);
        return (
          <Col xs={24} sm={12} md={8} lg={6} key={`${p.source}-${p.id}`}>
            <Card
              hoverable
              onClick={() => onToggle(p)}
              style={{
                borderRadius: 10,
                border: isSelected ? "2px solid #1677ff" : "1px solid #f0f0f0",
                background: isSelected ? "#e6f4ff" : "#fff",
                cursor: "pointer",
                transition: "all 0.18s",
              }}
              styles={{ body: { padding: "10px 12px" } }}
            >
              <Text strong style={{ display: "block", marginBottom: 2 }}>{p.name}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {p.article} &nbsp;|&nbsp; {fmt(p.massa)} kg mavjud
              </Text>
              {p.price > 0 && (
                <div>
                  <Tag color="blue" style={{ marginTop: 4 }}>{fmt(p.price)} so'm</Tag>
                </div>
              )}
              {isSelected && (
                <Tag color="green" style={{ marginTop: 4 }}>Tanlandi ✓</Tag>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <div>
      <Title level={4} style={{ marginBottom: 12 }}>Mahsulotlarni tanlang</Title>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Qidirish..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
        style={{ marginBottom: 8 }}
      />
      {selected.length > 0 && (
        <Alert
          type="info"
          showIcon
          message={`${selected.length} ta mahsulot tanlandi`}
          style={{ marginBottom: 8, borderRadius: 8 }}
        />
      )}
      <Tabs
        defaultActiveKey="svejiy"
        items={[
          {
            key: "svejiy",
            label: `Sveshi (${freshList.length})`,
            children: <ProductGrid list={filterBySearch(freshList)} />,
          },
          {
            key: "xolodelnik",
            label: `Xolodilnik (${coldList.length})`,
            children: <ProductGrid list={filterBySearch(coldList)} />,
          },
        ]}
      />
    </div>
  );
}

/* ─── Step 2: All products at once ─── */
function StepAllDetails({ details, onChange, onBack, onNext }) {
  const [form] = Form.useForm();

  const handleValuesChange = (_, allValues) => {
    const updated = details.map((d, i) => {
      const price = parseFloat(allValues[`price_${i}`] || 0);
      const mass = parseFloat(allValues[`mass_${i}`] || 0);
      return { ...d, price, mass, total: price * mass };
    });
    onChange(updated);
  };

  const handleNext = () => {
    form
      .validateFields()
      .then(() => onNext())
      .catch(() => message.warning("Barcha maydonlarni to'ldiring!"));
  };

  const initialValues = {};
  details.forEach((d, i) => {
    initialValues[`price_${i}`] = d.price || 0;
    initialValues[`mass_${i}`] = d.mass || 1;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Narx va miqdorni kiriting</Title>
        <Tag color="blue">{details.length} ta mahsulot</Tag>
      </div>

      <Form
        form={form}
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
        layout="vertical"
      >
        {details.map((d, i) => {
          const price = form.getFieldValue(`price_${i}`) ?? d.price ?? 0;
          const mass = form.getFieldValue(`mass_${i}`) ?? d.mass ?? 1;
          const total = parseFloat(price) * parseFloat(mass) || 0;

          return (
            <Card
              key={`${d.source}-${d.id}-${i}`}
              style={{
                borderRadius: 12,
                marginBottom: 12,
                borderLeft: `4px solid ${d.source === "xolodelnik" ? "#0ea5e9" : "#22c55e"}`,
              }}
              styles={{ body: { padding: "14px 16px" } }}
            >
              <Row gutter={[16, 8]} align="bottom">
                <Col xs={24} sm={6}>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong>{d.productName}</Text>
                    <Tag
                      color={d.source === "xolodelnik" ? "blue" : "green"}
                      style={{ marginLeft: 6, fontSize: 11 }}
                    >
                      {d.source === "xolodelnik" ? "Xolodilnik" : "Sveshi"}
                    </Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Mavjud: {fmt(d.massa)} kg
                  </Text>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item
                    label="Narx (so'm)"
                    name={`price_${i}`}
                    rules={[{ required: true, message: "Narx kiriting" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Narx"
                      min={0}
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(v) => v.replace(/,/g, "")}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <Form.Item
                    label="Miqdor (kg)"
                    name={`mass_${i}`}
                    rules={[{ required: true, message: "Miqdor kiriting" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="kg"
                      min={0}
                      formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(v) => v.replace(/,/g, "")}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={6}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>Summa</Text>
                    <div>
                      <Text strong style={{ fontSize: 16, color: "#1677ff" }}>
                        {fmt(total)} so'm
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          );
        })}
      </Form>

      {/* Total */}
      <Card
        style={{ borderRadius: 12, background: "#f0f9ff", marginTop: 8, marginBottom: 16 }}
        styles={{ body: { padding: "12px 16px" } }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text strong>Jami:</Text>
          <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
            {fmt(details.reduce((a, d) => a + (d.total || 0), 0))} so'm
          </Title>
        </div>
      </Card>

      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Ortga
        </Button>
        <Button type="primary" icon={<ArrowRightOutlined />} onClick={handleNext}>
          Keyingisi
        </Button>
      </Space>
    </div>
  );
}

/* ─── Step 3: Payment ─── */
function StepPayment({ details, customer, onSubmit, onBack, isSubmitting }) {
  const [form] = Form.useForm();
  const [repaymentDate, setRepaymentDate] = useState(null);
  const [currency, setCurrency] = useState({ naqd: 0, plastik: 0, karta: 0, usd: 0, exchangeUsd: 0 });

  const totalPrice = useMemo(
    () => details.reduce((a, d) => a + (d.total || 0), 0),
    [details]
  );

  const paidTotal = useMemo(() => {
    const { naqd, plastik, karta, usd, exchangeUsd } = currency;
    return (
      (parseFloat(naqd) || 0) +
      (parseFloat(plastik) || 0) +
      (parseFloat(karta) || 0) +
      (parseFloat(usd) || 0) * (parseFloat(exchangeUsd) || 0)
    );
  }, [currency]);

  const debt = paidTotal - totalPrice;

  const handleChange = (name, val) =>
    setCurrency((prev) => ({ ...prev, [name]: val ?? 0 }));

  const handleFinish = (values) => {
    onSubmit({
      customer_id: customer?.id,
      naqd: values.naqd ?? 0,
      plastik: values.plastik ?? 0,
      karta: values.karta ?? 0,
      naqdusd: values.usd ?? 0,
      valyuta: values.exchangeUsd ?? 0,
      muddat: repaymentDate || 0,
      izoh: values.izoh ?? "",
    });
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>To'lov</Title>

      {/* Order summary */}
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Title level={5} style={{ marginBottom: 8 }}>Buyurtma xulosasi</Title>
        <Text type="secondary">Mijoz: <b>{customer?.fio}</b></Text>
        <Divider style={{ margin: "10px 0" }} />
        {details.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
              borderBottom: i < details.length - 1 ? "1px solid #f0f0f0" : "none",
            }}
          >
            <Space size={4}>
              <Tag
                color={d.source === "xolodelnik" ? "blue" : "green"}
                style={{ fontSize: 11, margin: 0 }}
              >
                {d.source === "xolodelnik" ? "X" : "S"}
              </Tag>
              <Text>{d.productName}</Text>
            </Space>
            <Text>
              {fmt(d.mass)} kg × {fmt(d.price)} ={" "}
              <b style={{ color: "#1677ff" }}>{fmt(d.total)} so'm</b>
            </Text>
          </div>
        ))}
        <Divider style={{ margin: "10px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text strong>Jami summa:</Text>
          <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
            {fmt(totalPrice)} so'm
          </Title>
        </div>
      </Card>

      {/* Payment form */}
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={[12, 0]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Naqd (UZS)" name="naqd" initialValue={0}>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="0"
                onChange={(v) => handleChange("naqd", v)}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v.replace(/,/g, "")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Plastik" name="plastik" initialValue={0}>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="0"
                onChange={(v) => handleChange("plastik", v)}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v.replace(/,/g, "")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Karta" name="karta" initialValue={0}>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="0"
                onChange={(v) => handleChange("karta", v)}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v.replace(/,/g, "")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Naqd (USD miqdor)" name="usd" initialValue={0}>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="0"
                onChange={(v) => handleChange("usd", v)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Valyuta kursi (1 USD)" name="exchangeUsd" initialValue={0}>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="0"
                onChange={(v) => handleChange("exchangeUsd", v)}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(v) => v.replace(/,/g, "")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="M.B. (muddat bo'yicha)"
              name="repayment"
              rules={[{ required: debt < 0, message: "Muddat talab qilinadi!" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Sana tanlang"
                onChange={(_, val) => setRepaymentDate(val)}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Debt / change summary */}
        <Card
          style={{
            borderRadius: 10,
            marginBottom: 12,
            background: debt < 0 ? "#fff1f0" : "#f6ffed",
          }}
          styles={{ body: { padding: "12px 16px" } }}
        >
          <Row gutter={16}>
            <Col xs={8}>
              <Text type="secondary" style={{ fontSize: 12 }}>To'langan</Text>
              <div><b>{fmt(paidTotal)} so'm</b></div>
            </Col>
            <Col xs={8}>
              <Text type="danger" style={{ fontSize: 12 }}>Qarz</Text>
              <div>
                <b style={{ color: "#cf1322" }}>
                  {debt < 0 ? fmt(Math.abs(debt)) : 0} so'm
                </b>
              </div>
            </Col>
            <Col xs={8}>
              <Text type="success" style={{ fontSize: 12 }}>Qaytim</Text>
              <div>
                <b style={{ color: "#389e0d" }}>
                  {debt > 0 ? fmt(debt) : 0} so'm
                </b>
              </div>
            </Col>
          </Row>
        </Card>

        <Form.Item label="Izoh" name="izoh">
          <Input.TextArea rows={3} placeholder="Izoh (ixtiyoriy)" allowClear />
        </Form.Item>

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            Ortga
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<CheckOutlined />}
            loading={isSubmitting}
            size="large"
          >
            Tasdiqlash
          </Button>
        </Space>
      </Form>
    </div>
  );
}

/* ─── Main Drawer ─── */
function SalesMakeOrderDrawer({ open, onClose, onSuccess }) {
  const addCustomerRef = useRef(null);
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]); // [{id, name, article, massa, price, price_list, source}]
  const [productDetails, setProductDetails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* API */
  const customerRes = useGetSalesCustomerQuery();
  const salesProductsRes = useGetSalesProductsQuery();
  const indexDataRes = useGetAdminIndexDataQuery();
  const [addOrder] = useAddSalesPlacingOrderToUploaderMutation();

  const customerOptions = useMemo(() => {
    if (customerRes?.data?.success && Array.isArray(customerRes?.data?.data))
      return customerRes.data.data;
    return [];
  }, [customerRes?.data]);

  const salesProducts = useMemo(() => {
    if (salesProductsRes?.data?.success && Array.isArray(salesProductsRes?.data?.data))
      return salesProductsRes.data.data;
    return [];
  }, [salesProductsRes?.data]);

  const indexData = useMemo(() => {
    if (indexDataRes?.data?.success && indexDataRes?.data?.data)
      return indexDataRes.data.data;
    return null;
  }, [indexDataRes?.data]);

  const reset = () => {
    setStep(0);
    setCustomer(null);
    setSelectedProducts([]);
    setProductDetails([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  /* Toggle product selection */
  const handleToggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id && p.source === product.source);
      return exists
        ? prev.filter((p) => !(p.id === product.id && p.source === product.source))
        : [...prev, product];
    });
  };

  /* Build product details from selected products */
  const buildDetails = () => {
    return selectedProducts.map((p) => ({
      productId: p.id,
      productName: p.name,
      article: p.article,
      massa: p.massa,
      source: p.source,
      price: parseFloat(p.price || 0),
      mass: 1,
      total: parseFloat(p.price || 0),
    }));
  };

  /* Navigation */
  const handleNext = () => {
    if (step === 0) {
      if (!customer) { message.warning("Mijozni tanlang!"); return; }
      setStep(1);
    } else if (step === 1) {
      if (!selectedProducts.length) { message.warning("Kamida 1 ta mahsulot tanlang!"); return; }
      setProductDetails(buildDetails());
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 1) setStep(0);
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  /* Step 2 → Step 3 */
  const handleDetailsNext = () => setStep(3);

  /* Final submit */
  const handleSubmit = async ({ customer_id, naqd, plastik, karta, naqdusd, valyuta, muddat, izoh }) => {
    setIsSubmitting(true);
    try {
      // PHP isXolodelnik: true/false kutadi (xolodelnik mahsulot bo'lsa true)
      const hasColProducts = productDetails.some((d) => d.source === "xolodelnik");
      const paidTotal =
        Number(naqd || 0) +
        Number(plastik || 0) +
        Number(karta || 0) +
        Number(naqdusd || 0) * Number(valyuta || 0);

      const payload = {
        tolov: String(paidTotal),
        client_id: customer_id,
        product_list: productDetails.map((d) => ({
          product_id: d.productId,
          article: d.article,
          massa: d.mass,
          price: d.price,
          isXolodelnik: d.source === "xolodelnik",
        })),
        summa: productDetails.reduce((a, d) => a + (d.total || 0), 0),
        isXolodelnik: hasColProducts,
        naqd: naqd || 0,
        plastik: plastik || 0,
        karta: karta || 0,
        naqdusd: naqdusd || 0,
        valyuta: valyuta || 0,
        muddat: muddat || "",
        izoh: izoh || "",
      };
      const res = await addOrder(payload).unwrap();
      if (res?.success === true) {
        message.success(res?.message || "Buyurtma muvaffaqiyatli yaratildi!");
        reset();
        onClose();
        onSuccess?.();
      } else {
        message.error(res?.message || "Xatolik yuz berdi!");
      }
    } catch {
      message.error("Ulanishda xatolik! Qaytadan urinib ko'ring!");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Footer for step 0 and 1 */
  const showFooterNav = step === 0 || step === 1;
  const footer = showFooterNav ? (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {step > 0 ? (
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Ortga
        </Button>
      ) : (
        <span />
      )}
      <Button type="primary" icon={<ArrowRightOutlined />} onClick={handleNext}>
        Keyingisi
      </Button>
    </div>
  ) : null;

  return (
    <>
      <SalesAddCustomerModal ref={addCustomerRef} />

      <Drawer
        title="Sotuv qilish"
        open={open}
        onClose={handleClose}
        width={Math.min(window.innerWidth - 16, 1100)}
        footer={footer}
        destroyOnClose
        styles={{ body: { paddingBottom: 80 } }}
      >
        <Steps
          current={step}
          items={STEPS.map((s) => ({ title: s }))}
          style={{ marginBottom: 28 }}
          size="small"
        />

        {step === 0 && (
          <StepCustomer
            customer={customer}
            onSelect={setCustomer}
            customerOptions={customerOptions}
            customerLoading={customerRes.isLoading}
            addCustomerRef={addCustomerRef}
          />
        )}

        {step === 1 && (
          <StepProducts
            salesProducts={salesProducts}
            indexData={indexData}
            selected={selectedProducts}
            onToggle={handleToggleProduct}
            customerCategoryId={customer?.category_id}
          />
        )}

        {step === 2 && (
          <StepAllDetails
            details={productDetails}
            onChange={setProductDetails}
            onBack={handleBack}
            onNext={handleDetailsNext}
          />
        )}

        {step === 3 && (
          <StepPayment
            details={productDetails}
            customer={customer}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}
      </Drawer>
    </>
  );
}

export default SalesMakeOrderDrawer;

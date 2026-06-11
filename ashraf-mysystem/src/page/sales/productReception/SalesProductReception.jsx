import {
  MessageOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import { useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import MainModal from "../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import Section from "../../../components/common/section/Section";
import { useGetSalesProductsQuery } from "../../../features/sales/salesApiSlice";
import { useGetSalesTaminotchiQuery } from "../../../features/sales/taminotchi/salesTaminotchiApiSlice";
import { useGetButcherQuery } from "../../../features/sklad/butcher/butcherApiSlice";
import {
  useAddProdRecMutation,
  useGetProdRecQuery,
  useSendProdRecSmsMutation,
} from "../../../features/sklad/productReception/ProductReceptionApiSlice";
import removeComma from "../../../util/removeComma";

const { Text } = Typography;

const toNumber = (value) => Number(removeComma(value) || 0);
const roundMass = (value) => Math.round((Number(value) || 0) * 1000) / 1000;

function MoneyInput({ placeholder, ...props }) {
  return (
    <NumericFormat
      {...props}
      customInput={Input}
      thousandSeparator=","
      min={0}
      inputMode="decimal"
      placeholder={placeholder}
    />
  );
}

function SalesProductReceptionModal({ onClose }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { data: supplierData, isLoading: supplierLoading } =
    useGetSalesTaminotchiQuery();
  const { data: butcherData, isLoading: butcherLoading } = useGetButcherQuery();
  const { data: productsData, isLoading: productsLoading } =
    useGetSalesProductsQuery();
  const [addReception] = useAddProdRecMutation();

  const suppliers = useMemo(() => {
    if (supplierData?.success && Array.isArray(supplierData?.data)) {
      return supplierData.data;
    }
    return [];
  }, [supplierData]);

  const butchers = useMemo(() => {
    if (butcherData?.success && Array.isArray(butcherData?.data)) {
      return butcherData.data;
    }
    return [];
  }, [butcherData]);

  const products = useMemo(() => {
    if (productsData?.success && Array.isArray(productsData?.data)) {
      return productsData.data;
    }
    return [];
  }, [productsData]);

  const watchedWeights = Form.useWatch("weights", form);
  const weights = useMemo(() => watchedWeights || [], [watchedWeights]);
  const dona = Form.useWatch("dona", form);
  const price = Form.useWatch("price", form);

  const totals = useMemo(() => {
    return weights.reduce(
      (acc, item) => {
        const gross = toNumber(item?.gross);
        const tara = toNumber(item?.tara);
        const net = Math.max(gross - tara, 0);
        return {
          gross: roundMass(acc.gross + gross),
          tara: roundMass(acc.tara + tara),
          net: roundMass(acc.net + net),
        };
      },
      { gross: 0, tara: 0, net: 0 }
    );
  }, [weights]);

  const totalSum = roundMass(totals.net * toNumber(price));

  const handleSubmit = async (values) => {
    if (totals.net <= 0) {
      messageApi.warning("Toza massa 0 dan katta bo'lishi kerak!");
      return;
    }
    if (toNumber(values.dona) <= 0) {
      messageApi.warning("Jami dona 0 dan katta bo'lishi kerak!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        taminotchi_id: values.taminotchi_id,
        qassob_id: values.qassob_id,
        product_id: values.product_id,
        dona: toNumber(values.dona),
        massa: totals.net,
        price: toNumber(values.price),
        malumot: {
          bolaklar: (values.weights || []).map((item) => ({
            gross: toNumber(item?.gross),
            tara: toNumber(item?.tara),
            net: roundMass(toNumber(item?.gross) - toNumber(item?.tara)),
          })),
          jami_brutto: totals.gross,
          jami_tara: totals.tara,
          jami_toza: totals.net,
        },
      };

      const resData = await addReception(payload).unwrap();
      if (resData?.success) {
        messageApi.success(resData?.message || "Kirim saqlandi");
        form.resetFields();
        form.setFieldsValue({ weights: [{}] });
        setTimeout(() => onClose?.(), 700);
      } else {
        messageApi.error(resData?.message || "Kirim saqlanmadi");
      }
    } catch (err) {
      messageApi.warning("Ulanishda xatolik yoki ruxsat yo'q!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ weights: [{}] }}
      >
        <Row gutter={12}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Ta'minotchi"
              name="taminotchi_id"
              rules={[{ required: true, message: "Ta'minotchini tanlang!" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Ta'minotchini tanlash"
                loading={supplierLoading}
                optionFilterProp="label"
                options={suppliers.map((item) => ({
                  value: item.id,
                  label: item.fio,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Qassob"
              name="qassob_id"
              rules={[{ required: true, message: "Qassobni tanlang!" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Qassobni tanlash"
                loading={butcherLoading}
                optionFilterProp="label"
                options={butchers.map((item) => ({
                  value: item.id,
                  label: item.fio,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Mahsulot"
              name="product_id"
              rules={[{ required: true, message: "Mahsulotni tanlang!" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Mahsulotni tanlash"
                loading={productsLoading}
                optionFilterProp="label"
                options={products.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Narxi"
              name="price"
              rules={[{ required: true, message: "Narxni kiriting!" }]}
            >
              <MoneyInput placeholder="1 kg narxi" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Jami dona"
              name="dona"
              rules={[{ required: true, message: "Jami donani kiriting!" }]}
            >
              <MoneyInput placeholder="Jami dona" />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="weights">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                const item = weights[index] || {};
                const net = roundMass(toNumber(item.gross) - toNumber(item.tara));
                return (
                  <Row gutter={12} key={field.key} align="middle">
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...field}
                        label="Mass"
                        name={[field.name, "gross"]}
                        rules={[{ required: true, message: "Massani kiriting!" }]}
                      >
                        <MoneyInput placeholder="Brutto kg" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...field}
                        label="Tara massasi"
                        name={[field.name, "tara"]}
                        rules={[{ required: true, message: "Tarani kiriting!" }]}
                      >
                        <MoneyInput placeholder="Tara kg" />
                      </Form.Item>
                    </Col>
                    <Col xs={16} md={9}>
                      <Text strong>Toza: {net > 0 ? net : 0} kg</Text>
                    </Col>
                    <Col xs={8} md={3}>
                      <Button danger block disabled={fields.length === 1} onClick={() => remove(field.name)}>
                        O'chirish
                      </Button>
                    </Col>
                  </Row>
                );
              })}
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => add()} block>
                Bo'lib kiritish
              </Button>
            </>
          )}
        </Form.List>

        <Row gutter={12} style={{ marginTop: 16 }}>
          <Col xs={12} md={6}>Jami dona: <Text strong>{toNumber(dona)}</Text></Col>
          <Col xs={12} md={6}>Mass: <Text strong>{totals.gross} kg</Text></Col>
          <Col xs={12} md={6}>Tara: <Text strong>{totals.tara} kg</Text></Col>
          <Col xs={12} md={6}>Toza: <Text strong>{totals.net} kg</Text></Col>
          <Col xs={24} style={{ marginTop: 8 }}>
            Summa: <Text strong><MainNumberFormat value={totalSum} /></Text>
          </Col>
        </Row>

        <Space style={{ width: "100%", marginTop: 18 }} direction="vertical">
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSubmitting} block>
            Saqlash
          </Button>
          <Popconfirm
            title="Tozalash"
            description="Kiritilgan ma'lumotlar tozalansinmi?"
            onConfirm={() => {
              form.resetFields();
              form.setFieldsValue({ weights: [{}] });
            }}
          >
            <Button icon={<ReloadOutlined />} danger block>
              Tozalash
            </Button>
          </Popconfirm>
        </Space>
      </Form>
    </>
  );
}

function SalesProductReception() {
  const [open, setOpen] = useState(false);
  const [smsSendingId, setSmsSendingId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isLoading, isError, refetch } = useGetProdRecQuery();
  const [sendSms] = useSendProdRecSmsMutation();

  const tableData = useMemo(() => {
    if (data?.success && Array.isArray(data?.data?.krim_list)) {
      return data.data.krim_list;
    }
    return [];
  }, [data]);

  const handleSendSms = async (record) => {
    setSmsSendingId(record.id);
    try {
      const resData = await sendSms({ id: record.id }).unwrap();
      if (resData?.success) {
        messageApi.success(resData?.message || "SMS yuborildi");
      } else {
        messageApi.error(resData?.message || "SMS yuborilmadi");
      }
    } catch (err) {
      messageApi.warning("SMS yuborishda xatolik!");
    } finally {
      setSmsSendingId(null);
    }
  };

  const columns = [
    { title: "Partiya", dataIndex: "partiyanomer", key: "partiyanomer", width: 110 },
    { title: "Ta'minotchi", dataIndex: "taminotchi", key: "taminotchi", width: 180 },
    { title: "Qassob", dataIndex: "qassob", key: "qassob", width: 160 },
    { title: "Dona", dataIndex: "dona", key: "dona", width: 90, render: (v) => <MainNumberFormat value={v} /> },
    { title: "Massa", dataIndex: "massa", key: "massa", width: 110, render: (v) => <>{v} kg</> },
    { title: "Narx", dataIndex: "price", key: "price", width: 120, render: (v) => <MainNumberFormat value={v} /> },
    { title: "Summa", dataIndex: "summa", key: "summa", width: 140, render: (v) => <MainNumberFormat value={v} /> },
    { title: "Status", dataIndex: "status", key: "status", width: 110 },
    { title: "Vaqt", dataIndex: "sana", key: "sana", width: 150 },
    {
      title: "SMS",
      key: "sms",
      width: 90,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Button
          shape="circle"
          type="primary"
          icon={<MessageOutlined />}
          loading={smsSendingId === record.id}
          disabled={smsSendingId !== null && smsSendingId !== record.id}
          onClick={() => handleSendSms(record)}
        />
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <MainModal open={open} onClose={() => setOpen(false)}>
        <SalesProductReceptionModal onClose={() => { setOpen(false); refetch(); }} />
      </MainModal>
      <Section>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)} block>
              Mahsulot kirim qilish
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button icon={<ReloadOutlined />} onClick={refetch} block>
              Qayta yuklash
            </Button>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 1000, y: 620 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>Jami</Table.Summary.Cell>
              <Table.Summary.Cell index={3}><MainNumberFormat value={data?.data?.jamidona || 0} /></Table.Summary.Cell>
              <Table.Summary.Cell index={4}>{data?.data?.jamimassa || 0} kg</Table.Summary.Cell>
              <Table.Summary.Cell index={5} />
              <Table.Summary.Cell index={6}><MainNumberFormat value={data?.data?.jamisumma || 0} /></Table.Summary.Cell>
              <Table.Summary.Cell index={7} colSpan={2} />
            </Table.Summary.Row>
          )}
          locale={{
            emptyText: () => {
              if (isError && !isLoading) return <MainRefetchBtn refetch={refetch} />;
              return <Empty />;
            },
          }}
        />
      </Section>
    </>
  );
}

export default SalesProductReception;

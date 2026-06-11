import {
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import { useMemo, useState } from "react";
import MainModal from "../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import Section from "../../../components/common/section/Section";
import MainInputPrice from "../../../components/ui/inputPrice/MainInputPrice";
import {
  useAddSalesCustomerCashInMutation,
  useGetSalesCustomerQuery,
} from "../../../features/sales/customer/salesCustomerApiSlice";
import removeComma from "../../../util/removeComma";

function SalesCustomerCashInModal({ onClose }) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isLoading } = useGetSalesCustomerQuery();
  const [addCashIn] = useAddSalesCustomerCashInMutation();

  const customers = useMemo(() => {
    if (data?.success && Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  const handleSubmit = async (values) => {
    const payload = {
      mijoz_id: values.mijoz_id,
      naqdsum: removeComma(values.naqdsum) || 0,
      naqdusd: removeComma(values.naqdusd) || 0,
      valyuta: removeComma(values.valyuta) || 0,
      bank: removeComma(values.bank) || 0,
      karta: removeComma(values.karta) || 0,
      izoh: values.izoh,
    };
    const total =
      Number(payload.naqdsum) +
      Number(payload.bank) +
      Number(payload.karta) +
      Number(payload.naqdusd) * Number(payload.valyuta || 0);

    if (total <= 0) {
      messageApi.warning("Pul miqdorini kiriting!");
      return;
    }

    setIsSubmitting(true);
    try {
      const resData = await addCashIn(payload).unwrap();
      if (resData?.success) {
        messageApi.success(resData?.message || "Pul olindi");
        form.resetFields();
        setTimeout(() => onClose?.(), 700);
      } else {
        messageApi.error(resData?.message || "Saqlanmadi");
      }
    } catch (err) {
      messageApi.warning("Ulanishda xatolik!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Mijoz"
          name="mijoz_id"
          rules={[{ required: true, message: "Mijozni tanlang!" }]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Mijozni tanlash"
            loading={isLoading}
            optionFilterProp="label"
            options={customers.map((item) => ({
              value: item.id,
              label: `${item.fio} | Balans: ${item.balans || 0}`,
            }))}
          />
        </Form.Item>

        <MainInputPrice label="Naqd so'm" name="naqdsum" showLabel />
        <MainInputPrice label="Naqd USD" name="naqdusd" showLabel />
        <MainInputPrice label="Valyuta kursi" name="valyuta" showLabel />
        <MainInputPrice label="Bank" name="bank" showLabel />
        <MainInputPrice label="Karta" name="karta" showLabel />

        <Form.Item
          label="Izoh"
          name="izoh"
          rules={[{ required: true, message: "Izoh kiriting!" }]}
        >
          <Input.TextArea rows={4} placeholder="Izoh" />
        </Form.Item>

        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSubmitting} block>
          Pul olish
        </Button>
      </Form>
    </>
  );
}

function SalesCustomerCashIn() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetSalesCustomerQuery();

  const tableData = useMemo(() => {
    if (data?.success && Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(event) => event.stopPropagation()}>
        <Input
          placeholder="Qidirish"
          value={selectedKeys[0]}
          onChange={(event) =>
            setSelectedKeys(event.target.value ? [event.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            onClick={() => confirm()}
          >
            Qidirish
          </Button>
          <Button
            size="small"
            onClick={() => {
              clearFilters?.();
              confirm();
            }}
          >
            Tozalash
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      String(record?.[dataIndex] || "")
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  });

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70, ...getColumnSearchProps("id") },
    { title: "Mijoz", dataIndex: "fio", key: "fio", width: 220, ...getColumnSearchProps("fio") },
    { title: "Telefon", dataIndex: "telefon", key: "telefon", width: 140, ...getColumnSearchProps("telefon") },
    {
      title: "Balans",
      dataIndex: "balans",
      key: "balans",
      width: 150,
      render: (value) => <MainNumberFormat value={value || 0} />,
      sorter: (a, b) => Number(a.balans || 0) - Number(b.balans || 0),
      ...getColumnSearchProps("balans"),
    },
  ];

  return (
    <>
      <MainModal open={open} onClose={() => setOpen(false)}>
        <SalesCustomerCashInModal onClose={() => { setOpen(false); refetch(); }} />
      </MainModal>
      <Section>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)} block>
              Mijozdan pul olish
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
          scroll={{ x: 620, y: 620 }}
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

export default SalesCustomerCashIn;

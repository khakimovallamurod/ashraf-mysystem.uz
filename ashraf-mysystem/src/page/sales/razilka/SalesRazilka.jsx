import {
  PlusOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import {
  Button, Col, DatePicker, Empty, Row, Select, Tag, Tooltip, Table, Typography,
} from "antd";
import { useMemo, useState } from "react";
import MainModal from "../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import Section from "../../../components/common/section/Section";
import {
  useGetRazilkaListQuery,
} from "../../../features/sales/razilka/salesRazilkaApiSlice";
import SalesAddRazilkaModal from "./components/SalesAddRazilkaModal";
import SalesRazilkaOutputModal from "./components/SalesRazilkaOutputModal";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const STATUS_COLORS = {
  razilkada: "orange",
  tugallandi: "green",
};

const STATUS_LABELS = {
  razilkada: "Razilkada",
  tugallandi: "Tugallandi",
};

const MANBA_COLORS = {
  svejiy: "green",
  xolodelnik: "blue",
};

function SalesRazilka() {
  const [openAdd, setOpenAdd] = useState(false);
  const [outputModal, setOutputModal] = useState({ open: false, item: null });
  const [statusFilter, setStatusFilter] = useState("");
  const [dates, setDates] = useState({ sana1: "", sana2: "" });

  const { data, isLoading, isError, refetch } = useGetRazilkaListQuery({
    sana1: dates.sana1,
    sana2: dates.sana2,
    status: statusFilter,
  });

  const tableData = useMemo(() => {
    if (data?.success && Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  const handleDateUpdate = (key, formatted) => {
    setDates((prev) => ({ ...prev, [key]: formatted || "" }));
  };

  const expandedRowRender = (record) => {
    if (!record.outputs || record.outputs.length === 0) {
      return <Text type="secondary">Chiqim mahsulotlari yo'q</Text>;
    }
    return (
      <Table
        size="small"
        dataSource={record.outputs}
        rowKey="id"
        pagination={false}
        columns={[
          { title: "Mahsulot", dataIndex: "product_name", key: "product_name" },
          {
            title: "Massa",
            dataIndex: "massa",
            key: "massa",
            render: (v) => <><MainNumberFormat value={v} /> kg</>,
          },
          {
            title: "Manzil",
            dataIndex: "manzil",
            key: "manzil",
            render: (v) => (
              <Tag color={v === "svejiy" ? "green" : "blue"}>
                {v === "svejiy" ? "Svejiy" : "Xolodelnik"}
              </Tag>
            ),
          },
          { title: "Vaqt", dataIndex: "vaqt", key: "vaqt" },
        ]}
      />
    );
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Mahsulot", dataIndex: "product_name", key: "product_name", width: 160 },
    {
      title: "Massa",
      dataIndex: "massa",
      key: "massa",
      width: 110,
      render: (v) => (
        <span>
          <MainNumberFormat value={v} /> kg
        </span>
      ),
    },
    {
      title: "Manba",
      dataIndex: "manba",
      key: "manba",
      width: 130,
      render: (v) => (
        <Tag color={MANBA_COLORS[v] || "default"}>
          {v === "svejiy" ? "Svejiy" : "Xolodelnik"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (v) => (
        <Tag color={STATUS_COLORS[v] || "default"}>
          {STATUS_LABELS[v] || v}
        </Tag>
      ),
    },
    { title: "Izoh", dataIndex: "izoh", key: "izoh", width: 180 },
    { title: "Vaqt", dataIndex: "vaqt", key: "vaqt", width: 150 },
    {
      title: "Amal",
      key: "action",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Chiqim qilish">
          <Button
            size="small"
            type="primary"
            icon={<ArrowRightOutlined />}
            disabled={record.status !== "razilkada"}
            onClick={() => setOutputModal({ open: true, item: record })}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <MainModal open={openAdd} onClose={() => setOpenAdd(false)}>
        <SalesAddRazilkaModal
          onClose={() => {
            setOpenAdd(false);
            refetch();
          }}
        />
      </MainModal>

      <MainModal
        open={outputModal.open}
        onClose={() => setOutputModal({ open: false, item: null })}
      >
        {outputModal.item && (
          <SalesRazilkaOutputModal
            razilkaItem={outputModal.item}
            onClose={() => {
              setOutputModal({ open: false, item: null });
              refetch();
            }}
          />
        )}
      </MainModal>

      <Section>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={6}>
            <Button
              block
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenAdd(true)}
            >
              Razilkaga qo'shish
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Row gutter={[8, 8]}>
              <Col xs={12} sm={12}>
                <DatePicker
                  format="DD.MM.YYYY"
                  style={{ width: "100%" }}
                  placeholder="Boshlanish"
                  onChange={(_, dateStr) => handleDateUpdate("sana1", dateStr)}
                />
              </Col>
              <Col xs={12} sm={12}>
                <DatePicker
                  format="DD.MM.YYYY"
                  style={{ width: "100%" }}
                  placeholder="Tugash"
                  onChange={(_, dateStr) => handleDateUpdate("sana2", dateStr)}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Status bo'yicha filter"
              allowClear
              onChange={(v) => setStatusFilter(v || "")}
            >
              <Select.Option value="razilkada">Razilkada</Select.Option>
              <Select.Option value="tugallandi">Tugallandi</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={4}>
            <Button block onClick={refetch}>
              Yangilash
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 700, y: 600 }}
          expandable={{ expandedRowRender }}
          locale={{
            emptyText: () => {
              if (isError && !isLoading)
                return <MainRefetchBtn refetch={refetch} />;
              return <Empty />;
            },
          }}
        />
      </Section>
    </>
  );
}

export default SalesRazilka;

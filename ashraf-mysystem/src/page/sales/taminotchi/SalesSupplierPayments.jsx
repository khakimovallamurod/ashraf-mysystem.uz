import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Empty, Row, Select, Tag, Tooltip } from "antd";
import React, { useMemo, useState } from "react";
import MainModal from "../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";
import Section from "../../../components/common/section/Section";
import {
  useGetSalesTaminotchiPayHistoryQuery,
  useGetSalesTaminotchiQuery,
} from "../../../features/sales/taminotchi/salesTaminotchiApiSlice";
import SalesPaySupplierModal from "./components/SalesPaySupplierModal";
import SalesSupplierSmsConfirm from "./components/SalesSupplierSmsConfirm";
import { Table } from "antd";

const { RangePicker } = DatePicker;

function SalesSupplierPayments() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dates, setDates] = useState({ start: "", end: "" });
  const [openPayModal, setOpenPayModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, data: {} });

  const { data: taminotchiList, isLoading: taminotchiLoading } =
    useGetSalesTaminotchiQuery();

  const { data, isLoading, isError, refetch } =
    useGetSalesTaminotchiPayHistoryQuery({
      taminotchiId: selectedSupplier || 0,
      start: dates.start,
      end: dates.end,
    });

  const supplierOptions = useMemo(() => {
    if (taminotchiList?.success && Array.isArray(taminotchiList?.data)) {
      return taminotchiList.data;
    }
    return [];
  }, [taminotchiList]);

  const tableData = useMemo(() => {
    if (data?.success && Array.isArray(data?.data)) {
      return data.data;
    }
    return [];
  }, [data]);

  const handleDateUpdate = (key, formatted) => {
    setDates((prev) => ({ ...prev, [key]: formatted || "" }));
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Ta'minotchi", dataIndex: "taminotchi", key: "taminotchi", width: 160 },
    {
      title: "Summa",
      dataIndex: "summa",
      key: "summa",
      width: 140,
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Naqd so'm",
      dataIndex: "naqdsum",
      key: "naqdsum",
      width: 130,
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Naqd USD",
      dataIndex: "naqdusd",
      key: "naqdusd",
      width: 120,
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
      width: 120,
      render: (v) => <MainNumberFormat value={v} />,
    },
    {
      title: "Karta",
      dataIndex: "karta",
      key: "karta",
      width: 120,
      render: (v) => <MainNumberFormat value={v} />,
    },
    { title: "Izoh", dataIndex: "izoh", key: "izoh", width: 180 },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status) => (
        <Tag color={status === "checked" ? "cyan-inverse" : "red-inverse"}>
          {status === "checked" ? "TASDIQLANGAN" : "TASDIQLANMAGAN"}
        </Tag>
      ),
    },
    { title: "Vaqt", dataIndex: "vaqt", key: "vaqt", width: 140 },
    {
      title: "Amal",
      key: "action",
      width: 70,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Telegram kodni tasdiqlash">
          <Button
            disabled={record.status === "checked"}
            size="small"
            shape="circle"
            icon={<CheckOutlined />}
            type="primary"
            onClick={() =>
              setConfirmModal({
                open: true,
                data: {
                  taminotchi_id: record.taminotchi_id,
                  taminotchi: record.taminotchi,
                },
              })
            }
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <MainModal open={openPayModal} onClose={() => setOpenPayModal(false)}>
        <SalesPaySupplierModal onClose={() => { setOpenPayModal(false); refetch(); }} />
      </MainModal>

      <MainModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, data: {} })}
      >
        <SalesSupplierSmsConfirm
          userData={confirmModal.data}
          handleClose={() => setConfirmModal({ open: false, data: {} })}
        />
      </MainModal>

      <Section>
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenPayModal(true)}
              block
            >
              Taminotchiga pul berish
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              style={{ width: "100%" }}
              placeholder="Ta'minotchini tanlang"
              allowClear
              showSearch
              loading={taminotchiLoading}
              onChange={(val) => setSelectedSupplier(val || null)}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {supplierOptions.map((t) => (
                <Select.Option value={t.id} key={t.id}>
                  {t.fio}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Row gutter={[8, 8]}>
              <Col xs={12} sm={12}>
                <DatePicker
                  format="DD.MM.YYYY"
                  style={{ width: "100%" }}
                  placeholder="Boshlanish"
                  onChange={(_, dateStr) => handleDateUpdate("start", dateStr)}
                />
              </Col>
              <Col xs={12} sm={12}>
                <DatePicker
                  format="DD.MM.YYYY"
                  style={{ width: "100%" }}
                  placeholder="Tugash"
                  onChange={(_, dateStr) => handleDateUpdate("end", dateStr)}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 600, y: 600 }}
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

export default SalesSupplierPayments;

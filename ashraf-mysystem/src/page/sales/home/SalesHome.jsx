import {
  Button,
  Card,
  Col,
  Empty,
  message,
  Pagination,
  Row,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PhoneOutlined,
  PrinterOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MainModal from "../../../components/common/modal/MainModal";
import MainNumberFormat from "../../../components/common/numberFormat/MainNumberFormat";
import PrintChekOfSales from "../../../components/common/printChek/PrintChekOfSales";
import Section from "../../../components/common/section/Section";
import { useGetSalesOrderHistoryQuery } from "../../../features/sales/orderHistory/salesOrderHistoryApiSlice";
import { useAddSupplierGiveSalesOrderMutation } from "../../../features/supplier/order/orderOfSales/supplierOrderOfSalesApiSlice";
import { usePutSalesPrintChekConfirmMutation } from "../../../features/sales/salesApiSlice";
import SalesOrderCloseModal from "../orderHistory/components/SalesOrderCloseModal";
import SalesMakeOrderDrawer from "./SalesMakeOrderDrawer";

const parseAmount = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/\s/g, "").replace(/,/g, ".");
  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : 0;
};

const getDirectPaidFromItem = (item) => {
  if (!item || typeof item !== "object") return null;

  const directCandidates = [
    item?.tolov,
    item?.tulov,
    item?.to_lov,
    item?.paid_amount,
    item?.paid_summa,
    item?.mijoz_bergani,
  ];

  for (const val of directCandidates) {
    if (val !== undefined && val !== null && val !== "") {
      return parseAmount(val);
    }
  }

  const matchKeys = ["tolov", "tulov", "paidamount", "paidsumma", "mijozbergani"];
  for (const key of Object.keys(item)) {
    const normalizedKey = String(key).toLowerCase().replace(/[^a-z]/g, "");
    if (matchKeys.includes(normalizedKey)) {
      const val = item[key];
      if (val !== undefined && val !== null && val !== "") {
        return parseAmount(val);
      }
    }
  }

  return null;
};

const getOrderPaidAmount = (item) => {
  const directPaid = getDirectPaidFromItem(item);
  if (directPaid !== null) return directPaid;

  const naqd = parseAmount(item?.naqdsum ?? item?.naqd);
  const bank = parseAmount(item?.bank ?? item?.plastik);
  const karta = parseAmount(item?.karta);
  const usd = parseAmount(item?.naqdusd ?? item?.usd);
  const kurs = parseAmount(item?.valyuta ?? item?.kurs);
  return naqd + bank + karta + usd * kurs;
};

const statusColorMap = {
  new: "magenta",
  "tayyorlanmoqda": "cyan",
  tayyorlandi: "gold",
  tugatildi: "red",
  dostavka: "blue",
  topshirilmadi: "red",
  topshirildi: "green",
};

function SalesOrderCard({ order, onOpen }) {
  return (
    <Card
      hoverable
      variant="borderless"
      onClick={() => onOpen(order)}
      style={{
        borderRadius: 20,
        height: "100%",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        background: order.status === "topshirilmadi" ? "#fff1f2" : "#ffffff",
      }}
      styles={{ body: { display: "flex", flexDirection: "column", gap: 16 } }}
    >
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {order.customer.name || "Noma'lum mijoz"}
          </Typography.Title>
          <Tag color={statusColorMap[order.status] || "default"}>{order.status}</Tag>
        </Space>
        <Typography.Text type="secondary">
          <PhoneOutlined /> {order.customer.phone || "-"}
        </Typography.Text>
        <Typography.Text strong style={{ fontSize: 18 }}>
          {Number(order.totalPrice || 0).toLocaleString("uz-UZ")} so'm
        </Typography.Text>
      </Space>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        <div>
          <Typography.Text type="secondary">Sana</Typography.Text>
          <div>{order.date || "-"}</div>
        </div>
        <div>
          <Typography.Text type="secondary">Mahsulot</Typography.Text>
          <div>{order.productList.length} ta</div>
        </div>
      </div>

      <Button type="primary" block>
        Batafsil ko'rish
      </Button>
    </Card>
  );
}

function SalesHome() {
  const printRef = useRef(null);
  const closeModalRef = useRef(null);
  const {
    data: ordersResponse,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useGetSalesOrderHistoryQuery();
  const [confirmPrinted] = usePutSalesPrintChekConfirmMutation();
  const [confirmOrderDirect, { isLoading: confirmingOrder }] =
    useAddSupplierGiveSalesOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openMakeOrderDrawer, setOpenMakeOrderDrawer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const orders = useMemo(() => {
    if (ordersResponse?.success === true && Array.isArray(ordersResponse?.data)) {
      return ordersResponse.data.map((item) => ({
        id: item?.id,
        title: "Buyurtmani yopish",
        systemName: "OFFICE ASHRAF SYSTEM",
        totalPrice: Number(item?.all_summa || 0),
        mass: Number(item?.mass || item?.all_mass || 0),
        dona: Number(item?.count || item?.dona || item?.all_count || 0),
        yashik: Number(item?.box_count || item?.all_box_count || 0),
        status: item?.status || "new",
        date: item?.vaqt || "",
        izoh: item?.izoh || "",
        afterBalance: item?.after_balans || 0,
        paidAmount: getOrderPaidAmount(item),
        printedStatus: Boolean(item?.print || item?.printed_status),
        customer: {
          name: item?.client?.fio || "",
          phone:
            item?.client?.telefon ||
            item?.client?.telefon2 ||
            item?.client?.telefon3 ||
            "",
          location: item?.client?.manzil || "",
          allTelefon: [
            item?.client?.telefon,
            item?.client?.telefon2,
            item?.client?.telefon3,
          ].filter(Boolean),
          old_balance: item?.old_client_balans || 0,
          balance: item?.client?.balans || 0,
        },
        supplier: {
          name: item?.dostavchik || "",
          telefon: item?.dostavchik_telefon || "",
        },
        agent: item?.agent || "",
        productList: Array.isArray(item?.product_list)
          ? item.product_list.map((innerItem) => ({
              id: innerItem?.id,
              productName: innerItem?.product_name,
              price: innerItem?.price,
              mass: innerItem?.massa,
              completedMass: innerItem?.tayyorlandi || innerItem?.massa,
              total: innerItem?.summa,
            }))
          : [],
      }));
    }

    return [];
  }, [ordersResponse]);

  const pagedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, currentPage]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(orders.length / pageSize));
    if (currentPage > maxPage) {
      setCurrentPage(1);
    }
  }, [orders.length, currentPage]);

  const printData = useMemo(() => {
    if (!selectedOrder) {
      return {};
    }

    return {
      orderId: selectedOrder.id,
      productList: selectedOrder.productList,
      customer: selectedOrder.customer,
      afterBalance: selectedOrder.afterBalance,
      date: selectedOrder.date,
      allPoductTotalPrice: selectedOrder.totalPrice,
      supplier: selectedOrder.supplier,
      agent: selectedOrder.agent,
    };
  }, [selectedOrder]);

  const handlePrint = (order) => {
    setSelectedOrder(order);

    setTimeout(async () => {
      printRef.current?.print();
      try {
        await confirmPrinted({ orderId: order.id }).unwrap();
      } catch (error) {
        // printni to'xtatmaymiz
      }
    }, 200);
  };

  const handleDelete = (order) => {
    if (!order?.productList?.length) {
      return;
    }

    closeModalRef.current?.onOpen({
      orderId: order.id,
      productId: order.productList[0]?.id,
    });
  };

  const handleConfirmOrder = async (orderId) => {
    if (!orderId) return;
    try {
      const fallbackRepaymentDate = new Date(Date.now() + 86400000)
        .toISOString()
        .slice(0, 10);
      const res = await confirmOrderDirect({
        id: orderId,
        body: {
          naqd: 0,
          naqdusd: 0,
          valyuta: 0,
          plastik: 0,
          karta: 0,
          muddat: fallbackRepaymentDate,
          auto_confirm: true,
        },
      }).unwrap();

      if (res?.success === true) {
        message.success(res?.message || "Muvaffaqiyatli tasdiqlandi");
        setSelectedOrder(null);
        refetchOrders();
      } else {
        message.error(res?.message || "Tasdiqlashda xatolik yuz berdi");
      }
    } catch (err) {
      message.error("Ulanishda xatolik! Qaytadan urinib ko'ring!");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <PrintChekOfSales ref={printRef} printData={printData} />
      <SalesOrderCloseModal ref={closeModalRef} />

      <SalesMakeOrderDrawer
        open={openMakeOrderDrawer}
        onClose={() => setOpenMakeOrderDrawer(false)}
        onSuccess={refetchOrders}
      />

      <MainModal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder?.title}
        width={960}
      >
        {selectedOrder && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Space
              style={{
                width: "100%",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {selectedOrder.title}
                </Typography.Title>
                <Typography.Text type="secondary">
                  {selectedOrder.systemName}
                </Typography.Text>
              </div>

              <Space wrap>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDelete(selectedOrder)}
                >
                  O'chirish
                </Button>
                <Button
                  icon={<PrinterOutlined />}
                  onClick={() => handlePrint(selectedOrder)}
                >
                  Pechat
                </Button>
              </Space>
            </Space>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card
                  variant="borderless"
                  style={{ borderRadius: 16, background: "#f8fafc" }}
                >
                  <Statistic
                    title="Summa"
                    value={selectedOrder.totalPrice}
                    formatter={(value) =>
                      `${Number(value || 0).toLocaleString("uz-UZ")} so'm`
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card
                  variant="borderless"
                  style={{ borderRadius: 16, background: "#ecfeff" }}
                >
                  <Statistic
                    title="Mijoz bergani"
                    value={selectedOrder.paidAmount || 0}
                    formatter={(value) =>
                      `${Number(value || 0).toLocaleString("uz-UZ")} so'm`
                    }
                  />
                </Card>
              </Col>
              <Col xs={24}>
                <Card
                  variant="borderless"
                  style={{ borderRadius: 16, background: "#fff7ed" }}
                >
                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={8}>
                      <Typography.Text type="secondary">Massa</Typography.Text>
                      <div>
                        <b>{selectedOrder.mass || 0}</b>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Typography.Text type="secondary">Dona</Typography.Text>
                      <div>
                        <b>{selectedOrder.dona || 0}</b>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Typography.Text type="secondary">Yashik</Typography.Text>
                      <div>
                        <b>{selectedOrder.yashik || 0}</b>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Card
              variant="borderless"
              style={{ borderRadius: 16, background: "#f8fafc" }}
            >
              <Typography.Title level={5}>Mijoz</Typography.Title>
              <Row gutter={[16, 12]}>
                <Col xs={24} md={8}>
                  <Typography.Text type="secondary">Ism</Typography.Text>
                  <div>{selectedOrder.customer.name || "-"}</div>
                </Col>
                <Col xs={24} md={8}>
                  <Typography.Text type="secondary">Telefon</Typography.Text>
                  <div>{selectedOrder.customer.phone || "-"}</div>
                </Col>
                <Col xs={24} md={8}>
                  <Typography.Text type="secondary">Sana</Typography.Text>
                  <div>{selectedOrder.date || "-"}</div>
                </Col>
              </Row>
            </Card>

            <div>
              <Typography.Title level={5}>Mahsulotlar</Typography.Title>
              <Table
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: "max-content" }}
                dataSource={selectedOrder.productList}
                columns={[
                  {
                    title: "Nomi",
                    dataIndex: "productName",
                  },
                  {
                    title: "Miqdori",
                    key: "quantity",
                    render: (_, row) => (
                      <span>
                        <MainNumberFormat value={row.mass} /> {"\u2192"}{" "}
                        <MainNumberFormat value={row.completedMass || row.mass} /> kg
                      </span>
                    ),
                  },
                  {
                    title: "Mijoz bergani",
                    key: "paidAmount",
                    render: (_, __, index) =>
                      index === 0 ? (
                        <b>
                          {Number(selectedOrder?.paidAmount || 0).toLocaleString(
                            "uz-UZ"
                          )}{" "}
                          so'm
                        </b>
                      ) : (
                        "-"
                      ),
                  },
                ]}
              />
            </div>

            <Card
              variant="borderless"
              style={{ borderRadius: 16, background: "#fefce8" }}
            >
              <Typography.Text type="secondary">Izoh</Typography.Text>
              <div style={{ marginTop: 8, fontWeight: 600 }}>
                {selectedOrder.izoh || "-"}
              </div>
            </Card>

            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <Button
                icon={<CloseOutlined />}
                onClick={() => setSelectedOrder(null)}
              >
                Bekor qilish
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                loading={confirmingOrder}
                disabled={
                  !["tayyorlandi", "dostavka", "topshirilmadi"].includes(
                    selectedOrder.status
                  )
                }
                onClick={() => handleConfirmOrder(selectedOrder.id)}
              >
                Tasdiqlash
              </Button>
            </Space>
          </div>
        )}
      </MainModal>

      <Section>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            Buyurtmalar
          </Typography.Title>
          <Space wrap>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => setOpenMakeOrderDrawer(true)}
            >
              Sotuv qilish
            </Button>
            <Button icon={<ReloadOutlined />} onClick={refetchOrders}>
              Yangilash
            </Button>
          </Space>
        </Space>

        {ordersLoading ? (
          <Row gutter={[16, 16]}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Col xs={24} md={12} xl={8} key={index}>
                <Card variant="borderless" style={{ borderRadius: 16 }}>
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : ordersError ? (
          <Empty description="Buyurtmalarni yuklashda xatolik yuz berdi" />
        ) : orders.length === 0 ? (
          <Empty description="Hozircha buyurtmalar topilmadi" />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {pagedOrders.map((order) => (
                <Col xs={24} md={12} xl={8} key={order.id}>
                  <SalesOrderCard order={order} onOpen={setSelectedOrder} />
                </Col>
              ))}
            </Row>
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={orders.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Section>
    </div>
  );
}

export default SalesHome;

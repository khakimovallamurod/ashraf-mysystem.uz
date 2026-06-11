import { Card, Col, Row, Skeleton, Typography } from "antd";
import { useMemo } from "react";
import { useGetAdminIndexDataQuery } from "../../../features/admin/statistic/adminStatisticApiSlice";

const PALETTE = {
  pageBg:       "#f6fdf7",
  sectionBg:    "#ffffff",
  sectionBorder:"#d1fae5",

  cardGreen:    "linear-gradient(135deg, #bbf7d0, #86efac)",
  cardOrange:   "linear-gradient(135deg, #fed7aa, #fdba74)",
  cardFreshBg:  "linear-gradient(135deg, #fef9c3, #fde68a)",
  cardColdBg:   "linear-gradient(135deg, #d1fae5, #a7f3d0)",

  titleGreen:   "#15803d",
  titleOrange:  "#c2410c",
  titleFresh:   "#92400e",
  titleCold:    "#065f46",

  subtitleColor:"#6b7280",
};

function ProductKgCard({ title, value, cardBg, titleColor }) {
  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 14,
        height: "100%",
        background: cardBg,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <Typography.Text style={{ color: PALETTE.subtitleColor, fontSize: 13 }}>
        {title}
      </Typography.Text>
      <Typography.Title
        level={4}
        style={{ margin: "6px 0 0", color: titleColor }}
      >
        {Number(value || 0).toLocaleString("uz-UZ")} kg
      </Typography.Title>
    </Card>
  );
}

function SalesDashboard() {
  const { data, isLoading } = useGetAdminIndexDataQuery();

  const { freshProducts, coldProducts, umumiyMassa, bugungiSvejiyKg, svejiyFoiz } =
    useMemo(() => {
      if (data?.success === true && data?.data) {
        const cold = Array.isArray(data.data.xolodelnik) ? data.data.xolodelnik : [];
        const fresh = Array.isArray(data.data.svejiy) ? data.data.svejiy : [];
        const totalFreshKg = fresh.reduce(
          (acc, item) => acc + Number(item?.massa || item?.mass || item?.soni || 0),
          0
        );
        const totalMeatKg = Number(data.data.umumiy_massa || 0);
        const freshPercent = totalMeatKg > 0 ? (totalFreshKg / totalMeatKg) * 100 : 0;

        return {
          freshProducts: fresh,
          coldProducts: cold,
          umumiyMassa: totalMeatKg,
          bugungiSvejiyKg: totalFreshKg,
          svejiyFoiz: freshPercent,
        };
      }
      return {
        freshProducts: [],
        coldProducts: [],
        umumiyMassa: 0,
        bugungiSvejiyKg: 0,
        svejiyFoiz: 0,
      };
    }, [data]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        background: PALETTE.pageBg,
        minHeight: "100vh",
        padding: "8px",
        borderRadius: 12,
      }}
    >
      {/* Top stat cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} lg={12}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 20,
              background: PALETTE.cardGreen,
              minHeight: 160,
              border: "none",
              boxShadow: "0 4px 16px rgba(22,163,74,0.18)",
            }}
          >
            <Typography.Text style={{ color: "#166534", fontWeight: 500 }}>
              Bugungi umumiy go'sht (kg)
            </Typography.Text>
            <Typography.Title
              level={2}
              style={{ margin: "12px 0 0", color: PALETTE.titleGreen }}
            >
              {isLoading ? (
                <Skeleton.Input active block />
              ) : (
                `${umumiyMassa.toLocaleString("uz-UZ")} kg`
              )}
            </Typography.Title>
          </Card>
        </Col>
        <Col xs={12} lg={12}>
          <Card
            variant="borderless"
            style={{
              borderRadius: 20,
              background: PALETTE.cardOrange,
              minHeight: 160,
              border: "none",
              boxShadow: "0 4px 16px rgba(234,88,12,0.18)",
            }}
          >
            <Typography.Text style={{ color: "#7c2d12", fontWeight: 500 }}>
              Bugungi svejiy ulushi (%)
            </Typography.Text>
            <Typography.Title
              level={2}
              style={{ margin: "12px 0 0", color: PALETTE.titleOrange }}
            >
              {isLoading ? (
                <Skeleton.Input active block />
              ) : (
                `${svejiyFoiz.toFixed(2)}%`
              )}
            </Typography.Title>
            {!isLoading && (
              <Typography.Text style={{ color: "#7c2d12" }}>
                Bugungi svejiy: {bugungiSvejiyKg.toLocaleString("uz-UZ")} kg
              </Typography.Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* Svejiy section */}
      <div
        style={{
          background: PALETTE.sectionBg,
          borderRadius: 16,
          border: `1px solid ${PALETTE.sectionBorder}`,
          padding: "16px 20px",
        }}
      >
        <Typography.Title level={4} style={{ marginBottom: 2, color: "#92400e" }}>
          Svejiy mahsulotlar
        </Typography.Title>
        <Typography.Paragraph style={{ color: PALETTE.subtitleColor, marginBottom: 16 }}>
          Bugungi kirim bo'yicha mahsulot turlari kilogrammda.
        </Typography.Paragraph>
        <Row gutter={[14, 14]}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Col xs={12} sm={12} lg={8} xl={6} key={index}>
                  <Card variant="borderless" style={{ borderRadius: 14 }}>
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </Card>
                </Col>
              ))
            : freshProducts.map((item) => (
                <Col xs={12} sm={12} lg={8} xl={6} key={`fresh-${item.id}`}>
                  <ProductKgCard
                    title={item?.name || item?.article}
                    value={item?.massa}
                    cardBg={PALETTE.cardFreshBg}
                    titleColor={PALETTE.titleFresh}
                  />
                </Col>
              ))}
        </Row>
      </div>

      {/* Xolodelnik section */}
      <div
        style={{
          background: PALETTE.sectionBg,
          borderRadius: 16,
          border: `1px solid ${PALETTE.sectionBorder}`,
          padding: "16px 20px",
        }}
      >
        <Typography.Title level={4} style={{ marginBottom: 2, color: "#065f46" }}>
          Xolodelnik mahsulotlari
        </Typography.Title>
        <Typography.Paragraph style={{ color: PALETTE.subtitleColor, marginBottom: 16 }}>
          Xolodelnikdagi barcha mahsulot turlari kilogrammda.
        </Typography.Paragraph>
        <Row gutter={[14, 14]}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Col xs={12} sm={12} lg={8} xl={6} key={index}>
                  <Card variant="borderless" style={{ borderRadius: 14 }}>
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </Card>
                </Col>
              ))
            : coldProducts.map((item) => (
                <Col xs={12} sm={12} lg={8} xl={6} key={`cold-${item.id}`}>
                  <ProductKgCard
                    title={item?.name || item?.article}
                    value={item?.massa}
                    cardBg={PALETTE.cardColdBg}
                    titleColor={PALETTE.titleCold}
                  />
                </Col>
              ))}
        </Row>
      </div>
    </div>
  );
}

export default SalesDashboard;

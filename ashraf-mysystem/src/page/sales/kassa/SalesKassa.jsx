import { Card, Col, DatePicker, Divider, Row, Statistic, Typography } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import Section from "../../../components/common/section/Section";
import { useGetCashierBalanceByDateMutation } from "../../../features/cashier/balance/cashierBalanceApiSlice";
import formatCurrency from "../../../util/formatCurrency";

const { RangePicker } = DatePicker;

function KassaCard({ title, data, loading }) {
  return (
    <Card style={{ borderRadius: 12 }}>
      <Typography.Text strong>{title}</Typography.Text>
      <Divider style={{ margin: "8px 0" }} />
      <Row gutter={[12, 12]}>
        {[
          { label: "Naqd so'm", key: "naqdsum" },
          { label: "Naqd USD", key: "naqdusd" },
          { label: "Plastik/Bank", key: "bank" },
          { label: "Karta", key: "karta" },
        ].map(({ label, key }) => (
          <Col xs={12} sm={6} key={key}>
            <Statistic
              title={label}
              value={formatCurrency(data?.[key] || 0)}
              loading={loading}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
}

function SalesKassa() {
  const today = dayjs();
  const [dates, setDates] = useState({
    start: today.format("DD.MM.YYYY"),
    end: today.add(1, "day").format("DD.MM.YYYY"),
  });
  const [balansData, setBalansData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [getBalans] = useGetCashierBalanceByDateMutation();

  const handleDateUpdate = async (key, formatted) => {
    if (!formatted) return;
    const newDates = { ...dates, [key]: formatted };
    setDates(newDates);
    setLoading(true);
    try {
      const res = await getBalans(newDates).unwrap();
      if (res?.success) setBalansData(res.data);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getBalans(dates).unwrap();
        if (res?.success) setBalansData(res.data);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jami =
    (balansData?.kunlik_krim?.naqdsum || 0) +
    (balansData?.kunlik_krim?.bank || 0) +
    (balansData?.kunlik_krim?.karta || 0);

  const totalExpenses =
    (balansData?.chiqim_harajat?.naqdsum || 0) +
    (balansData?.chiqim_harajat?.bank || 0) +
    (balansData?.chiqim_harajat?.karta || 0);

  const ostatka =
    (balansData?.qoldiq_balans?.naqdsum || 0) +
    (balansData?.qoldiq_balans?.bank || 0) +
    (balansData?.qoldiq_balans?.karta || 0);

  const kredit = balansData?.jami_hisobot?.jami_kredit || 0;
  const debet = balansData?.jami_hisobot?.jami_debet || 0;
  const balans = balansData?.jami_hisobot?.balans || 0;

  return (
    <Section>
      <div style={{ marginBottom: 16 }}>
        <Row gutter={[8, 8]}>
          <Col xs={12} sm={12}>
            <DatePicker
              format="DD.MM.YYYY"
              defaultValue={dayjs(dates.start, "DD.MM.YYYY")}
              onChange={(_, dateStr) => handleDateUpdate("start", dateStr)}
              style={{ width: "100%" }}
              placeholder="Boshlanish"
              allowClear={false}
            />
          </Col>
          <Col xs={12} sm={12}>
            <DatePicker
              format="DD.MM.YYYY"
              defaultValue={dayjs(dates.end, "DD.MM.YYYY")}
              onChange={(_, dateStr) => handleDateUpdate("end", dateStr)}
              style={{ width: "100%" }}
              placeholder="Tugash"
              allowClear={false}
            />
          </Col>
        </Row>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Jami ko'rsatkichlar */}
        <Card style={{ borderRadius: 12 }}>
          <Typography.Text strong>Jami ko'rsatkichlar</Typography.Text>
          <Divider style={{ margin: "8px 0" }} />
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Statistic title="Jami kirim" value={formatCurrency(jami)} loading={loading} />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Statistic
                title="Jami xarajat"
                value={formatCurrency(totalExpenses)}
                loading={loading}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Statistic title="Jami ostatka" value={formatCurrency(ostatka)} loading={loading} />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Statistic title="Kredit (ta'minotchi)" value={formatCurrency(kredit)} loading={loading} />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Statistic title="Debet (mijoz)" value={formatCurrency(debet)} loading={loading} />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Statistic title="Balans" value={formatCurrency(balans)} loading={loading} />
            </Col>
          </Row>
        </Card>

        {/* Kunlik kirimlar */}
        <KassaCard
          title="Kunlik kirimlar (Card / Naqt / Karta / Plastik)"
          data={balansData?.kunlik_krim}
          loading={loading}
        />

        {/* Xarajatlar */}
        <KassaCard
          title="Xarajatlar"
          data={balansData?.chiqim_harajat}
          loading={loading}
        />

        {/* Oylik */}
        <KassaCard
          title="Oylik to'lovlar"
          data={balansData?.chiqim_oylik}
          loading={loading}
        />

        {/* Qoldiq balans */}
        <KassaCard
          title="Qoldiq balans"
          data={balansData?.qoldiq_balans}
          loading={loading}
        />
      </div>
    </Section>
  );
}

export default SalesKassa;

import { Card, Divider, Row } from "antd";
import React from "react";
import MainText from "../../../../components/ui/title/MainText";
import AdminStatisticCard from "../../../../components/admin/statistic/AdminStatisticCard";
import formatCurrency from "../../../../util/formatCurrency";

function WrapperItem({ title = "", data, isLoading }) {
  return (
    <Card>
      <MainText sm>{title}</MainText>
      <Divider />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Row gutter={[16, 16]}>
          <AdminStatisticCard
            indicatorHidden={true}
            title={"Naqd so'm"}
            value={formatCurrency(data?.naqdsum || 0)}
            isLoading={isLoading}
          />
          <AdminStatisticCard
            indicatorHidden={true}
            title={"Naqd usd"}
            value={formatCurrency(data?.naqdusd || 0)}
            isLoading={isLoading}
            suffix="$"
          />
          <AdminStatisticCard
            indicatorHidden={true}
            title={"Bank"}
            value={formatCurrency(data?.bank || 0)}
            isLoading={isLoading}
          />
          <AdminStatisticCard
            indicatorHidden={true}
            title={"Karta"}
            value={formatCurrency(data?.karta || 0)}
            isLoading={isLoading}
          />
        </Row>
      </div>
    </Card>
  );
}

export default WrapperItem;

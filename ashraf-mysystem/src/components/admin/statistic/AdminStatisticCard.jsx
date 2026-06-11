import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Statistic } from "antd";
import React from "react";
import DevModeTag from "../../common/devModeTag/DevModeTag";

function AdminStatisticCard({
  danger,
  title,
  value,
  isLoading,
  suffix = "so'm",
  indicatorHidden,
  devMode,
}) {
  return (
    <Col lg={6} md={12} xs={24}>
      <Card bordered={false} style={{ height: "100%" }}>
        <Statistic
          loading={isLoading}
          title={title}
          value={value}
          precision={suffix === "kg" ? 1 : 2}
          valueStyle={{
            color: danger ? "#cf1322" : "#3f8600",
          }}
          prefix={
            !indicatorHidden &&
            (danger ? <ArrowDownOutlined /> : <ArrowUpOutlined />)
          }
          suffix={suffix}
        />
        {devMode ? <DevModeTag /> : null}
      </Card>
    </Col>
  );
}

export default AdminStatisticCard;

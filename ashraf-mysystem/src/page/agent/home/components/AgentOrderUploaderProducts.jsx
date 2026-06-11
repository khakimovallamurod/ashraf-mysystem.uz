import { Card, Col, Divider, Row } from "antd";
import React from "react";
import MainLightTitle from "../../../../components/ui/title/MainLightTitle";
import MainText from "../../../../components/ui/title/MainText";
import styles from "./agentOrderUploaderOrderCard.module.css";

function AgentOrderUploaderProducts({ productsList, handleAddInputs }) {
  return (
    <Card
      style={{ height: "100%", overflow: "auto" }}
      bodyStyle={{ padding: "12px" }}
    >
      <MainLightTitle>Mahsulotlar</MainLightTitle>
      <Divider />
      <Row gutter={[16, 16]}>
        {productsList.map((item) => (
          <Col key={item?.id} xs={12} sm={12}>
            <Card
              bodyStyle={{ padding: "10px" }}
              className={styles.card}
              onClick={() => handleAddInputs({ ...item })}
            >
              <MainText>{item?.name}</MainText>
              <div style={{ opacity: "0.5" }}>
                <MainText sm>{item?.soni} kg</MainText>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

export default AgentOrderUploaderProducts;

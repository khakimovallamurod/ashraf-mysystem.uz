import { Card, Col, Divider, Input, Row, Skeleton, Typography } from "antd";
import React, { memo, useEffect, useState } from "react";
import MainEmptyTable from "../../../../components/common/errors/empty/table/MainEmptyTable";
import MainNumberFormat from "../../../../components/common/numberFormat/MainNumberFormat";
import MainText from "../../../../components/ui/title/MainText";
import styles from "./salesOrderUploaderOrderCard.module.css";

function SalesOrderUploaderProducts({ productsList = [], handleAddInputs }) {
  /* State */
  const [filterData, setFilterData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (productsList?.length) {
      setFilterData([...productsList]);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [productsList]);

  /* Handle select table page size */
  const filterBySearch = (val) => {
    setFilterData(
      productsList.filter((item) =>
        item?.name?.toLowerCase().includes(val.toLowerCase())
      )
    );
  };

  return (
    <Card style={{ height: "100%", overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: "220px" }}>
          <Typography.Text>Mahsulotlar</Typography.Text>
        </div>
        <Input
          placeholder="Izlash..."
          onChange={(e) => filterBySearch(e.target.value)}
          allowClear
        />
      </div>
      <Divider style={{margin:'10px 0'}} />
      <Row gutter={[16, 16]}>
        {isLoading ? (
          Array(7)
            .fill("")
            .map((_, index) => (
              <div
                key={index}
                style={{
                  width: "135px",
                  padding: "1rem",
                  border: "1px solid #F0F0F0",
                  borderRadius: "6px",
                  marginLeft: 8,
                  marginRight: 8,
                }}
              >
                <Skeleton.Button
                  active={true}
                  size="small"
                  style={{ margin: "1rem 0", height: "1.4rem", width: "70%" }}
                  block={true}
                />
                <Skeleton.Button
                  style={{ height: "1.2rem", width: "100%" }}
                  active={true}
                  size="small"
                  block={true}
                />
              </div>
            ))
        ) : !filterData?.length ? (
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <MainEmptyTable />
          </div>
        ) : (
          filterData.map((item) => (
            <Col key={item?.id} span={8}>
              <Card
                styles={{ body: { padding: "10px" } }}
                className={styles.card}
                onClick={() => handleAddInputs({ ...item })}
              >
                <MainText sm>{item?.name}</MainText>
                <div style={{ opacity: "0.5" }}>
                  <MainText xl><MainNumberFormat value={item?.soni} /> kg</MainText>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Card>
  );
}

export default memo(SalesOrderUploaderProducts);

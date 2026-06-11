import { Avatar, Card, Col, Empty, Row } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useMemo } from "react";
import { useGetOrderUploadingStorageQuery } from "../../../features/productStorage/order/storageOrderApiSlice";
import OrderCard from "./orderCard/OrderCard";

import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";

function StorageOrderReception() {
  const { data, isError, isLoading, refetch } =
    useGetOrderUploadingStorageQuery();

  const orderReceptionData = useMemo(() => {
    if (data?.success === true && data?.data && data?.data?.length) {
      return data.data;
    }
    return [];
  }, [data]);

  return !isLoading && isError ? (
    <MainRefetchBtn refetch={refetch} />
  ) : isLoading ? (
    <Row gutter={16}>
      {Array(3)
        .fill("")
        .map((item, index) => (
          <Col key={index} span={8}>
            <Card
              style={{
                width: 300,
                marginTop: 16,
              }}
              loading={isLoading}
            >
              <Meta
                avatar={
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />
                }
                title="Card title"
                description="This is the description"
              />
            </Card>
          </Col>
        ))}
    </Row>
  ) : orderReceptionData.length ? (
    <Row gutter={16}>
      {orderReceptionData?.map((item) => (
        <OrderCard {...item} key={item.id} />
      ))}
    </Row>
  ) : <Empty />;
}

export default StorageOrderReception;

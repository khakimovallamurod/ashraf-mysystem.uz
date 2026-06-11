import { Avatar, Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useMemo } from "react";
import { useGetOrderUploadingFromGrindStorageQuery } from "../../../features/productStorage/order/storageOrderApiSlice";
import OrderCard from "./orderCard/OrderCard";

import MainEmptyTable from "../../../components/common/errors/empty/table/MainEmptyTable";
import MainRefetchBtn from "../../../components/common/refechBtn/MainRefetchBtn";

function StorageOrderGrind() {
  const { data, isError, isLoading, refetch } =
    useGetOrderUploadingFromGrindStorageQuery();

  const orderGrindData = useMemo(() => {
    if (data?.success === true && data?.data && data?.data?.length) {
      return data.data;
    }
    return [];
  }, [data]);

  return !isLoading && isError ? (
    <MainRefetchBtn refetch={refetch} />
  ) : isLoading ? (
    <Row gutter={16}>
      {Array(7)
        .fill("")
        .map((item, index) => (
          <Col key={index} span={32}>
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
  ) : orderGrindData.length ? (
    <Row gutter={16}>
      {orderGrindData?.map((item) => (
        <OrderCard {...item} key={item.id} />
      ))}
    </Row>
  ) : (
    <MainEmptyTable refetchStatus={isError} />
  );
}

export default StorageOrderGrind;

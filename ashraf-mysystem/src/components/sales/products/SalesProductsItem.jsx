import { Button, Card, Col, List, Skeleton, Space, Tooltip } from "antd";
import React, { useMemo } from "react";
import styles from "./salesProducts.module.css";
import { SendOutlined, DeleteOutlined } from "@ant-design/icons";
import { selectSalesOrderAllProductsGrind } from "../../../features/sales/salesSlice";
import { useSelector } from "react-redux";
import MainCol from "../../ui/col/MainCol";

function SalesProductsItem({
  isLoading,
  id,
  title,
  article,
  barcode,
  count,
  category_id,
  handleAdd,
  handleRemove,
  component,
  mass,
}) {
  /* Slice data */
  const products = useSelector(selectSalesOrderAllProductsGrind);

  const isActive = useMemo(() => {
    return products?.find((item) => item.id === id);
  }, [products]);

  return (
    <MainCol component={component}>
      <Card
        className={styles.card}
        style={{
          background: isActive && component !== "drawer" ? "#d7fce0" : null,
        }}
      >
        {isLoading ? (
          <div className={styles.loadingCard}>
            <Skeleton size="small" active></Skeleton>
            <Skeleton.Button
              style={{ height: "18px" }}
              block
              size="small"
              active
            ></Skeleton.Button>
            <Skeleton.Button
              block
              size="small"
              active
              className={styles.button}
            ></Skeleton.Button>
          </div>
        ) : (
          <>
            <h3 className={styles.titles}>{title}</h3>
            <List className={styles.text} size="small">
              <List.Item>
                <span>article</span>
                <b>{article}</b>
              </List.Item>
              <List.Item>
                <span>barcode</span>
                <b>{barcode}</b>
              </List.Item>
              <List.Item>
                <span>soni</span>
                <b>{count}</b>
              </List.Item>
              <List.Item>
                <span>category ID</span>
                <b>{category_id}</b>
              </List.Item>
              {mass ? (
                <List.Item>
                  <span>Massa</span>
                  <span>
                    <b>{mass}</b>&nbsp;kg
                  </span>
                </List.Item>
              ) : null}
            </List>
            {component === "drawer" ? (
              <Tooltip title="Buyurtma qilishdan o'chirish">
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  className={styles.button}
                  onClick={() => handleRemove(id)}
                >
                  O'chirish
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Buyurtma berish qatoriga qo'shish">
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  className={styles.button}
                  onClick={() => handleAdd(id)}
                >
                  Buyurtma berish
                </Button>
              </Tooltip>
            )}
          </>
        )}
      </Card>
    </MainCol>
  );
}

export default SalesProductsItem;

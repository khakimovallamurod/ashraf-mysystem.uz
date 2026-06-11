import { CheckOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Button, Card, List, Skeleton, Tooltip } from "antd";
import React from "react";
import MainCol from "../../../ui/col/MainCol";
import styles from "./supplierOrderSales.module.css";

function UploaderOrderSalesItem({
  isLoading,
  id,
  clientName,
  clientTelefon,
  clientLocation,
  date,
  productsCount,
  productsList,
  handleOpenChangeOrderModal,
  handleOpenModal,
  handleOpenProductsModal,
}) {
  return (
    <MainCol>
      <Card className={styles.card}>
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Tooltip title="Buyurtmani almashtirish">
                <Button
                  size="large"
                  type="text"
                  style={{ color: "blue" }}
                  icon={<ShareAltOutlined />}
                  onClick={() => handleOpenChangeOrderModal(id)}
                />
              </Tooltip>
            </div>
            <h3 className={styles.titles}>
              <span style={{ opacity: "0.6" }}>Mijoz:</span> {clientName}
            </h3>
            <List className={styles.text} size="small">
              <List.Item>
                <span>Telefon:</span>
                <b>{clientTelefon}</b>
              </List.Item>
              <List.Item>
                <span>Manzil</span>
                <b>{clientLocation}</b>
              </List.Item>
              <List.Item>
                <span>Sana: </span>
                <b>{date}</b>
              </List.Item>
              <List.Item>
                <span>Mahsulotlar:</span>
                <Tooltip title="Mahsulotlarni ko'rish">
                  <Button
                    type="link"
                    onClick={() =>
                      handleOpenProductsModal({ id, items: [...productsList] })
                    }
                  >
                    Mahsulotlar &nbsp;<b>{productsCount}</b>
                  </Button>
                </Tooltip>
              </List.Item>
            </List>

            <Tooltip title="Buyurtmani topshirish">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                className={styles.button}
                onClick={() => handleOpenModal({ id })}
              >
                Topshirish
              </Button>
            </Tooltip>
          </>
        )}
      </Card>
    </MainCol>
  );
}

export default UploaderOrderSalesItem;

import { CheckOutlined } from "@ant-design/icons";
import { Button, Card, List, Skeleton, Tag } from "antd";
import React from "react";
import MainCol from "../../../../components/ui/col/MainCol";
import styles from "./uploaderOrderGrind.module.css";

function UploaderOrderGrindItem({
  isLoading,
  id,
  article,
  massa,
  maydalovchi,
  product_name,
  status,
  handleOpenModal,
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
            <h3 className={styles.titles}>{product_name}</h3>
            <List className={styles.text} size="small">
              <List.Item>
                <span>article</span>
                <b>{article}</b>
              </List.Item>
              <List.Item>
                <span>Massa</span>
                <b>{massa} kg</b>
              </List.Item>
              <List.Item>
                <span>Maydalovchi</span>
                <b>{maydalovchi}</b>
              </List.Item>

              <List.Item>
                <span>Status</span>
                <Tag color="cyan-inverse">
                  {status ? status.toUpperCase() : ""}
                </Tag>
              </List.Item>
            </List>

            <Button
              type="primary"
              icon={<CheckOutlined />}
              className={styles.button}
              onClick={() => handleOpenModal(id)}
            >
              Polkaga urish
            </Button>
          </>
        )}
      </Card>
    </MainCol>
  );
}

export default UploaderOrderGrindItem;

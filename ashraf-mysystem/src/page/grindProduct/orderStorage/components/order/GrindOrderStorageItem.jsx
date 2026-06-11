import {
  Button,
  Card,
  List,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";

import { CloseOutlined } from "@ant-design/icons";
import MainModal from "../../../../../components/common/modal/MainModal";
import MainCol from "../../../../../components/ui/col/MainCol";
import { useAddGrindOrderStorageCloseMutation } from "../../../../../features/grindProduct/order/grindOrderStorageApiSlice";
import MainNumberFormat from "../../../../../components/common/numberFormat/MainNumberFormat";
import { formatFloatNumber } from "../../../../../util/formatFloatNumber";
const { Text } = Typography;

function GrindOrderStorageItem({
  id,
  sotuvchi,
  sana,
  status,
  product_list,
  massa,
  maydalangani,
  maydalangani_foiz,
  handleOpenDrawer,
}) {
  /* State */
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* API */
  const [addCloseOrder] = useAddGrindOrderStorageCloseMutation();

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "closeOrder";

  /* Modal */
  // products
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  /* Handle close order */
  const handleCloseOrder = async (orderId) => {
    setIsSubmitting(true);
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const data = {
        zayavka_id: orderId,
      };
      const resData = await addCloseOrder(data).unwrap();
      if (resData?.success === true) {
        if (resData?.message) {
          messageApi.open({
            key,
            type: "success",
            content: resData?.message,
          });
        }
      } else if (resData?.success === false) {
        if (resData?.message) {
          messageApi.open({
            key,
            type: "error",
            content: resData?.message,
          });
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        messageApi.open({
          key,
          type: "warning",
          content: `Ulanishda xatolik! Qaytadan urinib ko'ring!`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {contextHolder}

      {/* Products Modal */}
      <MainModal open={openModal} onClose={handleCloseModal}>
        <Table
          columns={[
            {
              title: "ID",
              dataIndex: "product_id",
              key: "product_id",
            },
            {
              title: "Nomi",
              dataIndex: "product_name",
              key: "product_name",
            },
            {
              title: "Massa(kg)",
              dataIndex: "buyurtmamassa",
              key: "buyurtmamassa",
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (_, { status }) => {
                const color =
                  status === "new" ? "cyan-inverse" : "blue-inverse";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
              },
            },
          ]}
          rowKey={"product_id"}
          dataSource={product_list}
        />
      </MainModal>

      <MainCol>
        <Card bodyStyle={{ position: "relative" }}>
          {/* Close order */}
          <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}>
            <Tooltip title="Buyurtmani tugatish">
              <Popconfirm
                title="Buyurtmani tugatish"
                description="Buyurtmani tugatmoqchimisiz?"
                okText="Albatta"
                cancelText="Yo'q"
                onConfirm={() => handleCloseOrder(id)}
                okButtonProps={{
                  loading: isSubmitting,
                }}
                // onCancel={handleCancel}
              >
                <Button
                  type="primary"
                  shape="round"
                  icon={<CloseOutlined />}
                  danger
                />
              </Popconfirm>
            </Tooltip>
          </div>

          {/* Card list */}
          <List>
            <List.Item>
              <b>{sotuvchi || "Sotuvchi ismi noma'lum"}</b>
            </List.Item>
            <List.Item>
              <span>Sana:</span>
              <span>{sana}</span>
            </List.Item>
            <List.Item>
              <span>Status:</span>
              <Tag color="blue-inverse">{status}</Tag>
            </List.Item>
            <List.Item>
              <span>Mahsulotlar:</span>
              <Tooltip title="Mahsulotlarni ko'rish">
                <Button type="link" onClick={handleOpenModal}>
                  Mahsulotlar &nbsp;<b>{product_list?.length}</b>
                </Button>
              </Tooltip>
            </List.Item>
            <List.Item>
              <span>Massa:</span>
              <Text>
                <MainNumberFormat value={massa} />&nbsp;
                kg
              </Text>
            </List.Item>
            <List.Item>
              <span>Maydalangani:</span>
              <Text>
                <MainNumberFormat value={maydalangani} />&nbsp;
                kg
              </Text>
            </List.Item>
            <List.Item>
              <span>Maydalangan foizi:</span>
              <Text>{formatFloatNumber(maydalangani_foiz)}%</Text>
            </List.Item>
            <List.Item>
              <Tooltip title="Maydalashdan chiqarish">
                <Button
                  style={{ width: "100%", marginTop: "1rem" }}
                  type="primary"
                  onClick={() => handleOpenDrawer(id)}
                >
                  Maydalashdan chiqarish
                </Button>
              </Tooltip>
            </List.Item>
          </List>
        </Card>
      </MainCol>
    </>
  );
}

export default GrindOrderStorageItem;

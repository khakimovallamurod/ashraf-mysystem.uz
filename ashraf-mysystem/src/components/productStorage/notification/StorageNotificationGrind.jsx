import { BellOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  List,
  Tooltip,
  Typography,
  message
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGetStorageNotifListFromGrindQuery,
  useGetStorageNotifMessageFromGrindQuery
} from "../../../features/productStorage/notification/storageNotifcationApiSlice";
import { useAddOrderConfirmFromGrindStorageMutation } from "../../../features/productStorage/order/storageOrderApiSlice";
import MainNotificationDrawer from "../../common/drawer/MainNotificationDrawer";
import { REFETCH_NOTIF_TIME } from "../../../util/const";
const { Text } = Typography;

function StorageNotificationGrind({ setSoundPlay, notificationApi }) {
  /* Message */
  const [messageApi, messContextHolder] = message.useMessage();
  const key = "confirmOrderGrind";

  /* State */
  const [openDrawerGrindProd, setOpenDrawerGrindProd] = useState(false);

  /* API */
  const notifGrindRes = useGetStorageNotifMessageFromGrindQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });

  const notifListGrindRes = useGetStorageNotifListFromGrindQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });

  const [confirmOrderGrind] = useAddOrderConfirmFromGrindStorageMutation();

  const handleOpenNotifGrind = () => setOpenDrawerGrindProd(true);
  const handleCloseGrind = () => setOpenDrawerGrindProd(false);

  /* Handle notification sound */
  useEffect(() => {
    if (notifGrindRes?.data?.n > 0) setSoundPlay(true);
    else setSoundPlay(false);
  }, [notifGrindRes?.data, setSoundPlay]);

  /* Notification */
  useEffect(() => {
    if (notifGrindRes.isLoading) return;
    if (notifGrindRes.data?.message) {
      const value = notifGrindRes.data?.message;
      notificationApi.info({
        message: `Maydalash bo'limidan`,
        description: value,
        placement: "bottomRight",
        duration: 4,
      });
    }
  }, [notificationApi, notifGrindRes.data, notifGrindRes.isLoading]);

  /* Notifcation count */
  const notifCountOfGrindProduct = useMemo(() => {
    if (notifGrindRes.isLoading) return;

    return parseInt(notifGrindRes?.data?.n) || 0;
  }, [notifGrindRes]);

  const notifListGrind = useMemo(() => {
    if (
      notifListGrindRes?.data?.success === true &&
      notifListGrindRes?.data?.data?.length
    ) {
      return notifListGrindRes.data.data;
    }
    return [];
  }, [notifListGrindRes]);

  /* Handle confirm submit */
  const addOrderToConfirmForGrind = async (id) => {
    if (!id) return;

    messageApi.open({
      key: key,
      type: "loading",
      content: "Loading...",
    });

    try {
      const resData = await confirmOrderGrind(id).unwrap();

      if (resData?.success === true) {
        if (resData?.message) {
          messageApi.open({
            key: key,
            type: "success",
            content: resData?.message,
            duration: 2,
          });
        }
      } else if (resData?.success === false) {
        if (resData?.message) {
          messageApi.open({
            key: key,
            type: "error",
            content: resData?.message,
            duration: 2,
          });
        }
      }
    } catch (err) {
      if (err.status === "FETCH_ERROR") {
        messageApi.open({
          key: key,
          type: "warning",
          content: "Ulanishda xatolik! Qaytadan urinib ko'ring!",
          duration: 2,
        });
      }
    }
  };

  return (
    <>
      {messContextHolder}

      <Tooltip title="Maydalash">
        <Badge count={notifCountOfGrindProduct} size="small">
          <Button icon={<BellOutlined />} onClick={handleOpenNotifGrind} />
        </Badge>
      </Tooltip>

      <MainNotificationDrawer
        onClose={handleCloseGrind}
        open={openDrawerGrindProd}
      >
        <List
          itemLayout="horizontal"
          size="small"
          header={
            <Text style={{ padding: "0 1rem" }}>Maydalash bo'limidan</Text>
          }
          dataSource={notifListGrind}
          renderItem={(item, index) => (
            <List.Item
              style={{ cursor: "pointer" }}
              onClick={() => addOrderToConfirmForGrind(item.id)}
            >
              <List.Item.Meta
                title={`${item?.massa} massa, ${item?.nomer} raqami`}
                description={`Vaqti: ${item?.sana}`}
              />
            </List.Item>
          )}
        />
      </MainNotificationDrawer>
    </>
  );
}

export default StorageNotificationGrind;

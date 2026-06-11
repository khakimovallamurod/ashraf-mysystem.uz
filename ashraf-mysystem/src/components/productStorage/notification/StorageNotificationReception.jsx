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
  useGetStorageNotifListFromReceptionQuery,
  useGetStorageNotifMessageFromReceptionQuery
} from "../../../features/productStorage/notification/storageNotifcationApiSlice";
import { useAddOrderConfirmStorageMutation } from "../../../features/productStorage/order/storageOrderApiSlice";
import MainNotificationDrawer from "../../common/drawer/MainNotificationDrawer";
import { REFETCH_NOTIF_TIME } from "../../../util/const";
const { Text } = Typography;

function StorageNotificationReception({ setSoundPlay, notificationApi }) {
  /* Message */
  const [messageApi, messContextHolder] = message.useMessage();
  const key = "confirmOrderReception";

  /* State */
  const [openDrawerReceptionProd, setOpenDrawerReceptionProd] = useState(false);

  /* API */
  const notifReceptionRes = useGetStorageNotifMessageFromReceptionQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });

  const notifListReceptionRes = useGetStorageNotifListFromReceptionQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });

  const [confirmOrderReception] = useAddOrderConfirmStorageMutation();

  /* Drawer */
  const handleOpenNotifReception = () => setOpenDrawerReceptionProd(true);
  const handleCloseGrind = () => setOpenDrawerReceptionProd(false);

  /* Handle notification sound */
  useEffect(() => {
    if (notifReceptionRes?.data?.n > 0) setSoundPlay(true);
    else setSoundPlay(false);
  }, [notifReceptionRes?.data, setSoundPlay]);

  /* Notification */
  useEffect(() => {
    if (notifReceptionRes.isLoading) return;
    if (notifReceptionRes.data?.message) {
      const value = notifReceptionRes.data?.message;
      notificationApi.info({
        message: `Qabul qilish bo'limidan`,
        description: value,
        placement: "bottomRight",
        duration: 4,
      });
    }
  }, [notificationApi, notifReceptionRes.data, notifReceptionRes.isLoading]);

  /* Notifcation count */
  const notifCountOfReceptionProduct = useMemo(() => {
    if (notifReceptionRes.isLoading) return;

    return parseInt(notifReceptionRes?.data?.n) || 0;
  }, [notifReceptionRes]);

  const notifListReception = useMemo(() => {
    if (
      notifListReceptionRes?.data?.success === true &&
      notifListReceptionRes?.data?.data?.length
    ) {
      return notifListReceptionRes.data.data;
    }
    return [];
  }, [notifListReceptionRes]);

  /* Handle confirm submit */
  const addOrderToConfirm = async (id) => {
    if (!id) return;

    messageApi.open({
      key: key,
      type: "loading",
      content: "Loading...",
    });

    try {
      const resData = await confirmOrderReception(id).unwrap();

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

      <Tooltip title="Qabul qilish">
        <Badge count={notifCountOfReceptionProduct} size="small">
          <Button icon={<BellOutlined />} onClick={handleOpenNotifReception} />
        </Badge>
      </Tooltip>

      {/* Notification drawer for Reception */}
      <MainNotificationDrawer
        onClose={handleCloseGrind}
        open={openDrawerReceptionProd}
      >
        <List
          itemLayout="horizontal"
          size="small"
          header={
            <Text style={{ padding: "0 1rem" }}>Qabul qilish bo'limidan</Text>
          }
          dataSource={notifListReception}
          renderItem={(item, index) => (
            <List.Item
              style={{ cursor: "pointer" }}
              onClick={() => addOrderToConfirm(item.id)}
            >
              <List.Item.Meta
                title={`${item?.massa} massa, ${item?.partiyanomer} raqami`}
                description={`Vaqti: ${item?.sana}`}
              />
            </List.Item>
          )}
        />
      </MainNotificationDrawer>
    </>
  );
}

export default StorageNotificationReception;

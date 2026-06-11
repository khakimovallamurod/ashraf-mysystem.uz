import { BellOutlined } from "@ant-design/icons";
import { Badge, Button, List, Tooltip, Typography, message } from "antd";
import React, { memo, useEffect, useMemo, useState } from "react";
import {
  useGetGrindNotifListFromSalesQuery,
  useGetGrindNotifMessageFromSalesQuery,
} from "../../../features/grindProduct/notification/grindNotificationApiSlice";
import { useAddGrindOrderSalesConfirmMutation } from "../../../features/grindProduct/order/grindOrderSalesApiSlice";
import MainNotificationDrawer from "../../common/drawer/MainNotificationDrawer";
import { REFETCH_NOTIF_TIME } from "../../../util/const";
const { Text } = Typography;

function GrindNotificationSales({ setSoundPlay, notificationApi }) {
  /* Message */
  const [messageApi, messContextHolder] = message.useMessage();
  const key = "confirmOrderGrind";

  /* State */
  const [openDrawerSales, setOpenDrawerSales] = useState(false);

  /* API */
  const notifSalesRes = useGetGrindNotifMessageFromSalesQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });
  const notifListSalesRes = useGetGrindNotifListFromSalesQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });
  const [addConfirmOrderSales] = useAddGrindOrderSalesConfirmMutation();

  /* Drawer */
  const handleOpenNotifSales = () => setOpenDrawerSales(true);
  const handleCloseNotifSales = () => setOpenDrawerSales(false);

  /* Handle notification sound */
  useEffect(() => {
    if (notifSalesRes?.data?.n > 0) setSoundPlay(true);
    else setSoundPlay(false);
  }, [notifSalesRes?.data?.n, setSoundPlay]);

  /* Notification */
  useEffect(() => {
    if (notifSalesRes.isLoading) return;
    if (notifSalesRes.data?.message) {
      const value = notifSalesRes.data?.message;
      notificationApi.info({
        message: `Sotuv bo'limidan`,
        description: value,
        placement: "bottomRight",
        duration: 4,
      });
    }
  }, [notificationApi, notifSalesRes.data, notifSalesRes.isLoading]);

  /* Notifcation count */
  const notifCountOfSalesProduct = useMemo(() => {
    if (notifSalesRes.isLoading) return;

    return parseInt(notifSalesRes?.data?.n) || 0;
  }, [notifSalesRes]);
  const notifListSales = useMemo(() => {
    if (
      notifListSalesRes?.data?.success === true &&
      notifListSalesRes?.data?.data?.length
    ) {
      return notifListSalesRes.data.data;
    }
    return [];
  }, [notifListSalesRes]);

  /* Handle confirm submit */
  const addOrderToConfirmForSales = async (id) => {
    if (!id) return;

    messageApi.open({
      key: key,
      type: "loading",
      content: "Loading...",
    });

    try {
      const resData = await addConfirmOrderSales(id).unwrap();

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

      <Tooltip title="Sotuv">
        <Badge count={notifCountOfSalesProduct} size="small">
          <Button icon={<BellOutlined />} onClick={handleOpenNotifSales} />
        </Badge>
      </Tooltip>

      <MainNotificationDrawer
        open={openDrawerSales}
        onClose={handleCloseNotifSales}
      >
        <List
          itemLayout="horizontal"
          size="small"
          header={
            <Text style={{ padding: "0 1rem" }}>Sotuv bo'limidan</Text>
          }
          dataSource={notifListSales}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: "pointer" }}
              onClick={() => addOrderToConfirmForSales(item.id)}
            >
              <List.Item.Meta
                title={`Sotuvchi: ${item?.sotuvchi || "Noma'lum"}`}
                description={
                  <>
                    <p>{item?.izoh}</p>
                    <p>Vaqti: {item?.sana}</p>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </MainNotificationDrawer>
    </>
  );
}

export default memo(GrindNotificationSales);

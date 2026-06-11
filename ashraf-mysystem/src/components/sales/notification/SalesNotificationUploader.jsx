import { BellOutlined } from "@ant-design/icons";
import { Badge, Button, List, Tooltip, Typography, message } from "antd";
import React, { memo, useEffect, useMemo, useState } from "react";
import {
  useGetSalesNotifListFromUploaderQuery,
  useGetSalesNotifMessageFromUploaderQuery,
  usePutSalesNotifUploaderOrderConfirmMutation,
} from "../../../features/sales/notification/salesNotificationApiSlice";
import MainNotificationDrawer from "../../common/drawer/MainNotificationDrawer";
import MainNumberFormat from "../../common/numberFormat/MainNumberFormat";
import { REFETCH_NOTIF_TIME } from "../../../util/const";
const { Text } = Typography;

function SalesNotificationUploader({ setSoundPlay, notificationApi }) {
  /* Message */
  const [messageApi, messContextHolder] = message.useMessage();
  const key = "confirmOrderGrind";

  /* State */
  const [openDrawerSales, setOpenDrawerSales] = useState(false);

  /* API */
  const notifMessageUploaderRes = useGetSalesNotifMessageFromUploaderQuery(
    null,
    {
      pollingInterval: REFETCH_NOTIF_TIME,
    }
  );
  const notifListUploaderRes = useGetSalesNotifListFromUploaderQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });
  const [addConfirmOrder] = usePutSalesNotifUploaderOrderConfirmMutation();
  /* Drawer */
  const handleOpenNotifSales = () => setOpenDrawerSales(true);
  const handleCloseNotifSales = () => setOpenDrawerSales(false);

  /* Handle notification sound */
  useEffect(() => {
    if (notifMessageUploaderRes?.data?.n > 0) setSoundPlay(true);
    else setSoundPlay(false);
  }, [notifMessageUploaderRes?.data?.n, setSoundPlay]);

  /* Notification */
  useEffect(() => {
    if (notifMessageUploaderRes.isLoading) return;
    if (notifMessageUploaderRes.data?.message) {
      const value = notifMessageUploaderRes.data?.message;
      notificationApi.info({
        message: `Sotuv bo'limidan`,
        description: value,
        placement: "bottomRight",
        duration: 4,
      });
    }
  }, [
    notificationApi,
    notifMessageUploaderRes.data,
    notifMessageUploaderRes.isLoading,
  ]);

  /* Notifcation count */
  const notifCountOfSalesProduct = useMemo(() => {
    if (notifMessageUploaderRes.isLoading) return;

    return parseInt(notifMessageUploaderRes?.data?.n) || 0;
  }, [notifMessageUploaderRes]);

  const notifListSales = useMemo(() => {
    if (
      notifListUploaderRes?.data?.success === true &&
      notifListUploaderRes?.data?.data?.length
    ) {
      return notifListUploaderRes.data.data;
    }
    return [];
  }, [notifListUploaderRes]);

  /* Handle confirm submit */
  const addOrderToConfirmForSales = async (id) => {
    if (!id) return;

    messageApi.open({
      key: key,
      type: "loading",
      content: "Loading...",
    });

    try {
      const resData = await addConfirmOrder({ id }).unwrap();

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

      <Tooltip title="Yuklovchidan">
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
          header={<Text style={{ padding: "0 1rem" }}>Yuklovchidan</Text>}
          dataSource={notifListSales}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: "pointer" }}
              onClick={() => addOrderToConfirmForSales(item.id)}
            >
              <List.Item.Meta
                title={item?.article}
                description={
                  <>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        borderTop: "1px solid #ccc",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      <i>{item?.client}</i>
                      <i>{item?.client_telefon}</i>
                    </div>
                    <p>Izoh: {item?.izoh}</p>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <b>
                        Massa: <MainNumberFormat value={item?.massa} />
                        kg
                      </b>
                      <p> {item?.vaqt}</p>
                    </div>
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

export default memo(SalesNotificationUploader);

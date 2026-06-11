import { BellOutlined } from "@ant-design/icons";
import { Badge, Button, List, Tooltip, Typography, message } from "antd";
import React, { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAddGrindOrderSalesConfirmMutation } from "../../../../features/grindProduct/order/grindOrderSalesApiSlice";
import { selectNotifData } from "../../../../features/notification/notificationSlice";
import MainNotificationDrawer from "../../../common/drawer/MainNotificationDrawer";
const { Text } = Typography;

function SupplierNotifFromMeDrawer({ setSoundPlay, notificationApi }) {
  /* Message */
  const [messageApi, messContextHolder] = message.useMessage();
  const key = "confirmOrderGrind";

  /* State */
  const [openDrawerSales, setOpenDrawerSales] = useState(false);

  /* API */
  const [addConfirmOrderSales] = useAddGrindOrderSalesConfirmMutation();

  /* Notification data */
  const notifData = useSelector(selectNotifData);

  /* Memo */
  /* Get notif data */
  const { meNotifCount, meNotifList } = useMemo(() => {
    if (notifData) {
      return {
        meNotifCount: notifData?.find((item) => item?.name === "meTodo")?.count,
        meNotifList: notifData?.find((item) => item?.name === "meTodo")?.list,
      };
    }
    return {
      salesNotifCount: 0,
    };
  }, [notifData]);

  /* Drawer */
  const handleOpenNotifSales = () => setOpenDrawerSales(true);
  const handleCloseNotifSales = () => setOpenDrawerSales(false);

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
        <Badge count={meNotifCount} size="small">
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
          header={<Text style={{ padding: "0 1rem" }}>Eslatmalarim</Text>}
          dataSource={meNotifList}
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

export default memo(SupplierNotifFromMeDrawer);

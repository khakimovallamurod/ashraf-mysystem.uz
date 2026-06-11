import { List, message } from "antd";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import MainText from "../../../components/ui/title/MainText";
import { selectNotifData } from "../../../features/notification/notificationSlice";
import { useAddSupplierOrderSalesConfirmMutation } from "../../../features/supplier/order/orderOfSales/supplierOrderOfSalesApiSlice";

function SupplierNotifFromSales() {
  /* Notification list */
  const notifData = useSelector(selectNotifData);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "confirmOrderSales";

  /* API */
  const [addConfirm] = useAddSupplierOrderSalesConfirmMutation();

  /* Get notification notif data */
  const list = useMemo(() => {
    const res = notifData?.find((item) => item.name === "sales");
    if (res) {
      return res?.list;
    }
    return [];
  }, [notifData]);

  /* Order confirm */
  const addOrderToConfirm = async (id) => {
    /* Message */
    messageApi.open({
      key,
      type: "loading",
      content: "Loading...",
    });
    try {
      const resData = await addConfirm(id).unwrap();
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
    }
  };

  return (
    <>
      {contextHolder}

      <List
        itemLayout="horizontal"
        size="small"
        header={<MainText sm>Sotuv bo'limidan</MainText>}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: "pointer" }}
            onClick={() => addOrderToConfirm(item.id)}
          >
            <List.Item.Meta
              title={
                <b>
                  <span style={{ opacity: 0.5 }}>Mijoz nomi:</span>{" "}
                  {item?.client?.fio || "Noma'lum"}
                </b>
              }
              description={
                <>
                  <p>{item?.izoh}</p>
                  <p>
                    Mahsulot soni: <b>{item?.product_list?.length} ta</b>
                  </p>
                  <p>
                    Manzili: <b>{item?.client?.manzil}</b>
                  </p>

                  <p>Vaqti: {item?.vaqt}</p>
                </>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
}

export default SupplierNotifFromSales;

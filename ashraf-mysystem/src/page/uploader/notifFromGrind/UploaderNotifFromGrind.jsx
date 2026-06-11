import { List, message } from "antd";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import MainText from "../../../components/ui/title/MainText";
import { selectNotifData } from "../../../features/notification/notificationSlice";
import { useAddUploaderOrderGrindConfirmMutation } from "../../../features/uploader/order/orderOfGrind/uploaderOrderOfGrindApiSlice";

function UploaderNotifFromGrind() {
  /* Notification list */
  const notifData = useSelector(selectNotifData);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "confirmOrderGrind";

  /* API */
  const [addConfirm] = useAddUploaderOrderGrindConfirmMutation();

  const list = useMemo(() => {
    const res = notifData?.find((item) => item.name === "grind");
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
        header={<MainText sm>Maydalash bo'limidan</MainText>}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: "pointer" }}
            onClick={() => addOrderToConfirm(item.id)}
          >
            <List.Item.Meta
              title={`Maydalovchi nomi: ${item?.maydlovchi || "Noma'lum"}`}
              description={
                <>
                  <p>{item?.izoh}</p>
                  <p>Mahsulot nomi: {item?.product_name}</p>
                  <p>
                    Massasi: <b>{item?.massa} kg</b>
                  </p>
                  <p>Vaqti: {item?.sana}</p>
                </>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
}

export default UploaderNotifFromGrind;

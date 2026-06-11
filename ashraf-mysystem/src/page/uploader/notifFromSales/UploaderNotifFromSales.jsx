import { CloseOutlined } from "@ant-design/icons";
import { Button, List, Tag, message } from "antd";
import React, { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import MainText from "../../../components/ui/title/MainText";
import { selectNotifData } from "../../../features/notification/notificationSlice";
import { useAddUploaderOrderSalesConfirmMutation } from "../../../features/uploader/order/orderOfSales/uploaderOrderOfSalesApiSlice";
import UploaderNotifCloseOrderModal from "./components/UploaderNotifCloseOrderModal";

function UploaderNotifFromSales() {
  /* Ref */
  const closeModalRef = useRef(null);

  /* Notification list */
  const notifData = useSelector(selectNotifData);

  /* Message */
  const [messageApi, contextHolder] = message.useMessage();
  const key = "confirmOrderGrind";

  /* API */
  const [addConfirm] = useAddUploaderOrderSalesConfirmMutation();

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

  const handleOpenModalClose = (data) => {
    closeModalRef?.current?.onOpen(data);
  };

  return (
    <>
      {contextHolder}

      {/* Close order modal */}
      <UploaderNotifCloseOrderModal ref={closeModalRef} />

      <List
        itemLayout="horizontal"
        size="small"
        header={<MainText sm>Sotuv bo'limidan</MainText>}
        dataSource={list}
        renderItem={(item) => (
          <List.Item style={{ cursor: "pointer" }}>
            <List.Item.Meta
              onClick={() => addOrderToConfirm(item.id)}
              title={`Sotuvchi nomi: ${item?.sotuvchi || "Noma'lum"}`}
              description={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p>
                      Mijoz: <b>{item?.client}</b>
                    </p>

                    <p>Vaqti: {item?.vaqt}</p>
                    <Tag>
                      {item?.product_list
                        ?.map((item) => item?.product_name)
                        ?.join(",  ")}
                    </Tag>
                  </div>
                </div>
              }
            />

            <Button
              type="primary"
              shape="round"
              icon={<CloseOutlined />}
              danger
              onClick={() => handleOpenModalClose(item)}
            />
          </List.Item>
        )}
      />
    </>
  );
}

export default UploaderNotifFromSales;

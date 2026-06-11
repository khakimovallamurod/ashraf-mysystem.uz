import { Space, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  pauseSound,
  playSound,
} from "../../../features/notification/notificationSlice";
import StorageNotificationGrind from "./StorageNotificationGrind";
import StorageNotificationReception from "./StorageNotificationReception";

function StorageNotification() {
  /* Notification */
  const [notificationApi, contextHolder] = notification.useNotification();

  /* Sound */
  const [soundPlay, setSoundPlay] = useState(false);

  /* Dispatch */
  const dispatch = useDispatch();

  /* Sound handle */
  useEffect(() => {
    if (soundPlay) {
      dispatch(playSound());
    } else {
      dispatch(pauseSound());
    }
  }, [dispatch, soundPlay]);

  return (
    <>
      {contextHolder}

      <Space size={16}>
        {/* Reception */}
        <StorageNotificationReception
          setSoundPlay={setSoundPlay}
          notificationApi={notificationApi}
        />

        {/* Grind  */}
        {/* <StorageNotificationGrind
          setSoundPlay={setSoundPlay}
          notificationApi={notificationApi}
        /> */}
      </Space>
    </>
  );
}

export default StorageNotification;

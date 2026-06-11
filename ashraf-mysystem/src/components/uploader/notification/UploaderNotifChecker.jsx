import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import {
  pauseSound,
  playSound,
} from "../../../features/notification/notificationSlice";
import UploaderNotifCheckerFromGrind from "./UploaderNotifCheckerFromGrind";
import UploaderNotifCheckerFromSales from "./UploaderNotifCheckerFromSales";

function UploaderNotifChecker() {
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
      <UploaderNotifCheckerFromGrind
        setSoundPlay={setSoundPlay}
        notificationApi={notificationApi}
      />
      <UploaderNotifCheckerFromSales
        setSoundPlay={setSoundPlay}
        notificationApi={notificationApi}
      />
      <Outlet />
    </>
  );
}

export default UploaderNotifChecker;

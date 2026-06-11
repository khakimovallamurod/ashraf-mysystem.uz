import { notification } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import {
  pauseSound,
  playSound,
} from "../../../features/notification/notificationSlice";
import SupplierNotifCheckerFromSales from "./SuplierNotifCheckerFromSales";

function SupplierNotifChecker() {
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
      <SupplierNotifCheckerFromSales
        setSoundPlay={setSoundPlay}
        notificationApi={notificationApi}
      />
      {/* <SuplierNotifCheckerForMe
        setSoundPlay={setSoundPlay}
        notificationApi={notificationApi}
      /> */}
      <Outlet />
    </>
  );
}

export default SupplierNotifChecker;

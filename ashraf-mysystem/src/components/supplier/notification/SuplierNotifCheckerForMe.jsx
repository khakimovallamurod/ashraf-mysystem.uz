import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addNotificationData } from "../../../features/notification/notificationSlice";
import {
  useGetSupplierNotifListForMeQuery,
  useGetSupplierNotifMessageForMeQuery,
} from "../../../features/supplier/notification/supplierNotificationApiSlice";
import { REFETCH_NOTIF_TIME } from "../../../util/const";

function SuplierNotifCheckerForMe({ setSoundPlay, notificationApi }) {
  /* Dispatch */
  const dispatch = useDispatch();

  /* API */
  const notifMessage = useGetSupplierNotifMessageForMeQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });
  const notifList = useGetSupplierNotifListForMeQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });

  /* Handle notification sound */
  useEffect(() => {
    if (notifMessage?.data?.n > 0) setSoundPlay(true);
    else setSoundPlay(false);
  }, [notifMessage?.data?.n, setSoundPlay]);

  /* Notification */
  useEffect(() => {
    if (notifMessage.isLoading) return;
    if (notifMessage.data?.message) {
      const value = notifMessage.data?.message;
      notificationApi.info({
        message: `Eslatmalarim`,
        description: value,
        placement: "bottomRight",
        duration: 4,
      });
    }
  }, [notificationApi, notifMessage.data, notifMessage.isLoading]);

  /* Notifcation count */
  const notifCount = useMemo(() => {
    if (notifMessage.isLoading) return;

    return parseInt(notifMessage?.data?.n) || 0;
  }, [notifMessage]);

  const notifListSales = useMemo(() => {
    if (notifList?.data?.success === true && notifList?.data?.data?.length) {
      return notifList.data.data;
    }
    return [];
  }, [notifList]);

  useEffect(() => {
    dispatch(
      addNotificationData({
        name: "meTodo",
        list: notifListSales,
        count: notifCount,
      })
    );
  }, [dispatch, notifCount, notifListSales]);
}

export default SuplierNotifCheckerForMe;

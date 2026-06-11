import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addNotificationData } from "../../../features/notification/notificationSlice";
import {
  useGetUploaderNotifListFromGrindQuery,
  useGetUploaderNotifMessageFromGrindQuery,
} from "../../../features/uploader/notification/notifFromGrind/uploaderNotifFromGrindApiSlice";
import { REFETCH_NOTIF_TIME } from "../../../util/const";

function UploaderNotifCheckerFromGrind({ setSoundPlay, notificationApi }) {
  /* Dispatch */
  const dispatch = useDispatch();

  /* API */
  const notifMessage = useGetUploaderNotifMessageFromGrindQuery(null, {
    pollingInterval: REFETCH_NOTIF_TIME,
  });
  const notifList = useGetUploaderNotifListFromGrindQuery(null, {
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
        message: `Maydalash bo'limidan`,
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

  const notifListGrind = useMemo(() => {
    if (notifList?.data?.success === true && notifList?.data?.data?.length) {
      return notifList.data.data;
    }
    return [];
  }, [notifList]);

  useEffect(() => {
    dispatch(
      addNotificationData({
        name: "grind",
        list: notifListGrind,
        count: notifCount,
      })
    );
  }, [dispatch, notifCount, notifListGrind]);
}

export default UploaderNotifCheckerFromGrind;

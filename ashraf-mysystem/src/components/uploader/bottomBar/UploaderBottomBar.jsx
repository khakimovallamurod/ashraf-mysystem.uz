import {
  AppstoreAddOutlined,
  BellFilled,
  HomeOutlined,
  RotateRightOutlined
} from "@ant-design/icons";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectNotifData } from "../../../features/notification/notificationSlice";
import {
  UPLOADER_HOME_ROUTE,
  UPLOADER_NOTIF_FROM_MAYDALASH_ROUTE,
  UPLOADER_NOTIF_FROM_SALES_ROUTE,
  UPLOADER_POLKA_ROUTE
} from "../../../util/path";
import BottomBar from "../../common/bottomBar/BottomBar";

export default function UploaderBottomBar() {
  /* Notification data */
  const notifData = useSelector(selectNotifData);

  /* Get notif data */
  const { grindNotifCount, salesNotifCount } = useMemo(() => {
    if (notifData) {
      return {
        grindNotifCount: notifData?.find((item) => item?.name === "grind")
          ?.count,
        salesNotifCount: notifData?.find((item) => item?.name === "sales")
          ?.count,
      };
    }
    return {
      grindNotifCount: 0,
      salesNotifCount: 0,
    };
  }, [notifData]);

  return (
    <BottomBar
      items={[
        {
          path: UPLOADER_HOME_ROUTE,
          icon: <HomeOutlined className={"bottomBarIcon"} />,
          title: "Asosiy",
          tooltipTitle: "Bosh sahifa",
        },
        // {
        //   path: UPLOADER_NOTIF_FROM_MAYDALASH_ROUTE,
        //   icon: <AppstoreAddOutlined className={"bottomBarIcon"} />,
        //   title: "Maydalash",
        //   tooltipTitle: "Maydalashdan tushgan buyurtmalar",
        //   notifCount: grindNotifCount,
        // },
        {
          path: UPLOADER_NOTIF_FROM_SALES_ROUTE,
          icon: <BellFilled className={"bottomBarIcon"} />,
          title: "Sotuv",
          tooltipTitle: "Sotuvdan tushgan buyurtmalar",
          notifCount: salesNotifCount,
        },
        {
          path: UPLOADER_POLKA_ROUTE,
          icon: <RotateRightOutlined className={"bottomBarIcon"} />,
          title: "Almashtirish",
          tooltipTitle: "Joyini almashtirish",
        },
      ]}
    />
  );
}

import {
  BellOutlined,
  CreditCardOutlined,
  DollarOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectNotifData } from "../../../features/notification/notificationSlice";
import {
  SUPPLIER_BALANCE_ROUTE,
  SUPPLIER_CHANGE_ORDER_ROUTE,
  SUPPLIER_DEBT_ROUTE,
  SUPPLIER_NOTIF_FROM_SALES_ROUTE,
} from "../../../util/path";
import BottomBar from "../../common/bottomBar/BottomBar";

function SupplierBottomBar() {
  /* Notification data */
  const notifData = useSelector(selectNotifData);

  /* Memo */
  /* Get notif data */
  const { salesNotifCount } = useMemo(() => {
    if (notifData) {
      return {
        salesNotifCount: notifData?.find((item) => item?.name === "sales")
          ?.count,
      };
    }
    return {
      salesNotifCount: 0,
    };
  }, [notifData]);

  return (
    <BottomBar
      items={[
        {
          path: SUPPLIER_NOTIF_FROM_SALES_ROUTE,
          icon: <BellOutlined className={"bottomBarIcon"} />,
          title: 'Sotuv',
          tooltipTitle: "Sotuvdan kelgan buyurtmalar",
          notifCount: salesNotifCount,
        },
        {
          path: SUPPLIER_DEBT_ROUTE,
          icon: <DollarOutlined className={"bottomBarIcon"} />,
          title: 'Qarz',
          tooltipTitle: "Qarz yechish",
        },
        {
          path: SUPPLIER_BALANCE_ROUTE,
          title: 'Balans',
          icon: <CreditCardOutlined className={"bottomBarIcon"} />,
          tooltipTitle: "Balans",
        },
        {
          path: SUPPLIER_CHANGE_ORDER_ROUTE,
          title: 'Almashtirish',
          icon: <ShareAltOutlined className={"bottomBarIcon"} />,
          tooltipTitle: "Buyurtmani almashtirish",
        },
      ]}
    />
  );
}

export default SupplierBottomBar;

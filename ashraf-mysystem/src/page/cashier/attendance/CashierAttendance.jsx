import {
  ExclamationCircleOutlined,
  FilterOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Tabs } from "antd";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Section from "../../../components/common/section/Section";
import {
  CASHIER_ATTENDANCE_ALWAYS_LATE_ROUTE,
  CASHIER_ATTENDANCE_ROUTE,
} from "../../../util/path";
import PageNotFound from "../../error/PageNotFound";
import CashierAttendanceAlwaysLate from "./CashierAttendanceAlwaysLate";
import CashierAttendanceHistory from "./CashierAttendanceHistory";
import CashierAttendanceDrawer from "./components/CashierAttendanceModal";

const tabItems = [
  {
    label: (
      <>
        <HistoryOutlined />
        Davomat tarixi
      </>
    ),
    key: CASHIER_ATTENDANCE_ROUTE,
  },
  {
    label: (
      <>
        <ExclamationCircleOutlined />
        Har doim kechikadiganlar
      </>
    ),
    key: CASHIER_ATTENDANCE_ALWAYS_LATE_ROUTE,
  },
];

function CashierAttendance() {
  // Location
  const { pathname } = useLocation();

  // State
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tableValue, setTableValue] = useState(pathname);

  // Navigate
  const navigate = useNavigate();

  // Modal
  const onOpenDrawer = () => setOpenDrawer(true);
  const onCloseDrawer = () => setOpenDrawer(false);

  // Navigate
  const onNavigate = (path) => {
    navigate(path);
    setTableValue(path);
  };

  return (
    <>
      <Drawer
        title="Davomat tekshirish"
        placement="left"
        width={1000}
        onClose={onCloseDrawer}
        open={openDrawer}
      >
        <CashierAttendanceDrawer />
      </Drawer>

      <Section>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          {/* Tabs */}
          <Tabs
            defaultActiveKey={pathname}
            items={tabItems}
            onChange={onNavigate}
            style={{ width: "100%" }}
          />

          {/* Add btn */}
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={onOpenDrawer}
          >
            Davomat tekshirish
          </Button>
        </div>

        {/* Body */}
        {tableValue === CASHIER_ATTENDANCE_ROUTE ? (
          <CashierAttendanceHistory />
        ) : tableValue === CASHIER_ATTENDANCE_ALWAYS_LATE_ROUTE ? (
          <CashierAttendanceAlwaysLate />
        ) : (
          <PageNotFound />
        )}
      </Section>
    </>
  );
}

export default CashierAttendance;

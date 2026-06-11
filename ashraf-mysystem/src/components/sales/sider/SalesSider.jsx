import {
  BankOutlined,
  ContactsOutlined,
  DownloadOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  FundOutlined,
  InboxOutlined,
  PieChartOutlined,
  ScissorOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  WalletOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../../../features/auth/authSlice";
import { sales_routes } from "../../../util/path";
import LazyImage from "../../common/lazyLoad/LazyImage";

const { Sider } = Layout;

const siderLocalName = "salesSiderCollapsed";

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem("Dashboard", sales_routes.dashboard, <FundOutlined />),
  getItem("Sotuv", sales_routes.home, <PieChartOutlined />),
  getItem("Kassa", sales_routes.kassa, <BankOutlined />),
  getItem(
    "Ta'minotchi qo'shish",
    sales_routes.supplierManagement,
    <ShoppingCartOutlined />
  ),
  getItem("Mijoz qo'shish", sales_routes.customerManagement, <TeamOutlined />),
  getItem("Mahsulot kirim", sales_routes.productReception, <DownloadOutlined />),
  getItem(
    "Xolodilnikka o'tkazish",
    sales_routes.warehouseTransfer,
    <ShoppingCartOutlined />
  ),
  getItem(
    "Ta'minotchiga berilgan pullar",
    sales_routes.supplierManagementPayments,
    <BankOutlined />
  ),
  getItem(
    "Mijozdan pul olish",
    sales_routes.customerCashIn,
    <WalletOutlined />
  ),
  getItem(
    "Hisobot ta'minotchi",
    sales_routes.supplierManagementAllReport,
    <FileTextOutlined />
  ),
  getItem("Hisobot massa", sales_routes.warehouseMassReport, <InboxOutlined />),
  getItem(
    "Hisobot mijoz",
    sales_routes.customerManagementReport,
    <ContactsOutlined />
  ),
  getItem(
    "Mijozlardan kirim chiqim",
    sales_routes.customerManagementTransactions,
    <WalletOutlined />
  ),
  getItem("Xarajatlar", sales_routes.financeExpenses, <ExperimentOutlined />),
  getItem("Oylik", sales_routes.financeSalary, <BankOutlined />),
  { type: "divider" },
  getItem("Razilka", sales_routes.razilka, <ScissorOutlined />),
  getItem("Sozlamalar", "sub-settings", <SettingOutlined />, [
    getItem("Bo'lim qo'shish", sales_routes.settingsDepartment),
    getItem("Polka qo'shish", sales_routes.settingsPolka),
    getItem("Mahsulot qo'shish", sales_routes.settingsProduct),
    getItem("Ishchi qo'shish", sales_routes.settingsWorkers),
    getItem("Mijoz kategoriyasi", sales_routes.settingsCustomerCategory),
    getItem("Xarajat turi", sales_routes.settingsExpensesCategory),
  ]),
];

const checkOpen = (menuItems, pathname) => {
  const result = menuItems.find((item) => {
    if (item.key === pathname) return item.key;
    if (item.children) {
      const child = item.children.find(
        (menuChild) => menuChild.key === pathname
      );
      if (child) return item.key;
    }
    return null;
  });
  return result?.toString();
};

function SalesSider({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  const active = useMemo(
    () => ({
      sub: checkOpen(items, pathname),
      item: pathname,
    }),
    [pathname]
  );

  useEffect(() => {
    const res = localStorage.getItem(siderLocalName);
    setCollapsed(res === "active");
  }, [setCollapsed]);

  useEffect(() => {
    setOpenKeys(active.sub ? [active.sub] : []);
  }, [active.sub]);

  const onCollapse = (val) => {
    setCollapsed(val);
    localStorage.setItem(siderLocalName, val ? "active" : "notActive");
  };

  return (
    <Sider
      className="sales-sider"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      collapsedWidth="0"
      trigger={null}
      style={{
        height: "100dvh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1001,
        display: "flex",
        flexDirection: "column",
      }}
      width={280}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Link to={sales_routes.dashboard}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: collapsed ? "12px 0" : "12px 16px",
            borderBottom: "1px solid #d1fae5",
            marginBottom: 4,
          }}
        >
          {collapsed ? (
            <LazyImage imgUrl={"/images/custom-logo.png"} width={36} />
          ) : (
            <LazyImage imgUrl={"/images/custom-logo.png"} width={110} />
          )}
        </div>
      </Link>
      <div style={{ flex: 1, overflowX: "hidden", overflowY: "auto" }}>
        <Menu
          className="sales-sider-menu"
          selectedKeys={[active.item]}
          openKeys={openKeys}
          mode="inline"
          items={items}
          onOpenChange={(keys) => setOpenKeys(keys)}
          onClick={({ key }) => {
            navigate(key);
            if (window.innerWidth < 992) {
              setCollapsed(true);
            }
          }}
        />
      </div>
      <div style={{ padding: "16px", borderTop: "1px solid #065f46" }}>
        <Button 
          type="primary" 
          danger 
          block 
          icon={<LogoutOutlined />} 
          onClick={() => dispatch(logOut())}
          style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center" 
          }}
        >
          {!collapsed && "Chiqish"}
        </Button>
      </div>
      </div>
    </Sider>
  );
}

export default SalesSider;

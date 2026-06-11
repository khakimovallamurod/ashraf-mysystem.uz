import { Button, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logOut } from "../../features/auth/authSlice";
import { sales_routes } from "../../util/path";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  DownloadOutlined,
  WalletOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import MainOutlet from "../../components/common/outlet/MainOutlet";
import MainHeader from "../../components/common/mainHeader/MainHeader";
import SalesSider from "../../components/sales/sider/SalesSider";
import styles from "./salesLayout.module.css";

function SalesLayout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: "100vh" }}>
      <SalesSider collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className={`${styles.layout} ${!collapsed ? styles.active : ""}`}>
        <MainHeader
          menuFor="admin"
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <Content
          className="layout-content-wrapper"
          style={{
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <MainOutlet />
        </Content>
      </Layout>

      <div className="mobile-bottom-nav">
        <Link to={sales_routes.dashboard} className={pathname === sales_routes.dashboard ? "active" : ""}>
          <AppstoreOutlined />
          <span>Asosiy</span>
        </Link>
        <Link to={sales_routes.home} className={pathname === sales_routes.home ? "active" : ""}>
          <ShoppingCartOutlined />
          <span>Sotuv</span>
        </Link>
        <Link to={sales_routes.productReception} className={pathname === sales_routes.productReception ? "active" : ""}>
          <DownloadOutlined />
          <span>Qabul qilish</span>
        </Link>
        <Link to={sales_routes.kassa} className={pathname === sales_routes.kassa ? "active" : ""}>
          <WalletOutlined />
          <span>Kassa</span>
        </Link>
        <div onClick={() => setCollapsed(!collapsed)}>
          <MenuOutlined />
          <span>Menu</span>
        </div>
      </div>
    </Layout>
  );
}

export default SalesLayout;

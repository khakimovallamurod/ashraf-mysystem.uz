import { RollbackOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useRef } from "react";
import MainMobileHeader from "../../components/common/mobile/header/MainMobileHeader";
import MobileHeaderDrawer from "../../components/common/mobileHeaderDrawer/MobileHeaderDrawer";
import MainOutlet from "../../components/common/outlet/MainOutlet";
import { SUPPLIER_RETURN_PRODUCT_ROUTE } from "../../util/path";

function AgentLayout() {
  /* Ref */
  const headerDrawerRef = useRef(null);

  const handleOpenHeaderDrawerMenu = () => {
    headerDrawerRef.current?.onOpen();
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Header */}
      <MainMobileHeader onClickMenu={handleOpenHeaderDrawerMenu} />

      {/* Drawer menu */}
      <MobileHeaderDrawer ref={headerDrawerRef} />

      {/* Content */}
      <Content
        style={{
          padding: 16,
          paddingRight: 0,
          minHeight: 280,
          height: "100vh",
          // width: "100%",
          overflow: "auto",
          paddingBottom: "100px",
        }}
      >
        {/* Outlet */}
        <MainOutlet />
      </Content>
    </Layout>
  );
}

export default AgentLayout;

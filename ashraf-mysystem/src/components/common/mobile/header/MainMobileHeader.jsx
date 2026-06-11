import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Header } from "antd/es/layout/layout";
import React from "react";

function MainMobileHeader({ onClickMenu, customItems = "", styles = {} }) {
  return (
    // Header
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 99,
        width: "100%",
        background: "white",
        padding: "0 10px",
        borderBottom: "1px solid #f1f1f1",
        ...styles,
      }}
    >
      <Button
        type="text"
        size="large"
        icon={<MenuOutlined />}
        onClick={onClickMenu}
      />
      {customItems}
    </Header>
  );
}

export default MainMobileHeader;

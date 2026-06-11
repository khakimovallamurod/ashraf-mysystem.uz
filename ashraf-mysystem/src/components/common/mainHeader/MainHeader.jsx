import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";

function MainHeader({ menu, menuFor, collapsed, setCollapsed }) {
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 99,
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #f0f0f0",
        padding: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingRight: "1rem",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: "16px", width: 64, height: 64, color: "#111827" }}
        />
        {/* Logo */}
        {menuFor !== "admin" ? (
          <Link to={""} style={{ display: "inline-block", height: "100%" }}>
            <img
              style={{ width: "140px" }}
              src="/images/logo-light.png"
              alt="Logo"
            />
          </Link>
        ) : null}
        {menu}
      </div>
    </Header>
  );
}

export default MainHeader;

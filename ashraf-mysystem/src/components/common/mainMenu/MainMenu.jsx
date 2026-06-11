import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../../../features/auth/authSlice";

const items = [
  {
    label: "Sozlamalar",
    icon: <SettingOutlined />,
    key: "settings",
  },
  {
    label: "Chiqish",
    icon: <LogoutOutlined />,
    danger: true,
    key: "logout",
  },
];

function MainMenu({ otherItems = "" }) {
  /* Dispatch */
  const dispatch = useDispatch();

  /* Handle logout */
  const handleLogout = () => {
    dispatch(logOut());
  };

  /* Handle Dropdown item */
  const handleDropdownItemClick = (e) => {
    switch (e.key) {
      case "logout":
        handleLogout();
        break;
      case "settings":
        console.log("settings");
        break;
      default:
        return;
    }
  };
  return (
    <>
      <Space
        wrap
        size={16}
        style={{ justifyContent: "end", width: "100%", height: "100%" }}
      >
        {/* Calculator */}
        {/* <Button icon={<Calculator />} onClick={() => setCalculatorOpen(true)} /> */}

        {/* Other items */}
        {otherItems}

        {/* Dropdown */}
        <Dropdown
          menu={{
            onClick: handleDropdownItemClick,
            items,
          }}
          trigger={["click"]}
        >
          {/* Person */}
          <Button type="primary" shape="circle" icon={<UserOutlined />} />
        </Dropdown>
      </Space>
    </>
  );
}

export default MainMenu;

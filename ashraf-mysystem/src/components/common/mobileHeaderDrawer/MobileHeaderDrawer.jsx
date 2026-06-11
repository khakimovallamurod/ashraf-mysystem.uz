import { LogoutOutlined } from "@ant-design/icons";
import { Button, Drawer, List } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../../features/auth/authSlice";
import { LOGIN_ROUTE } from "../../../util/path";

function MobileHeaderDrawer({ listItems = [] }, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenDrawer,
  }));

  /* State */
  const [openDrawer, setOpenDrawer] = useState(false);

  /* Drawer */
  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);

  /* Dispatch */
  const dispatch = useDispatch();

  /* Navigate */
  const navigate = useNavigate();

  /* Handle navigate */
  const handleNavigate = (path) => {
    if (!path) return;

    handleCloseDrawer();

    navigate(path);
  };

  const handleLogout = () => {
    /* Logout */
    dispatch(logOut());
  };

  return (
    <Drawer
      placement="left"
      width={"80%"}
      onClose={handleCloseDrawer}
      closeIcon={false}
      open={openDrawer}
      styles={{ body: {
        padding: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingBottom: "3rem",
      } }}
    >
      <List>
        {listItems?.map((item, index) => (
          <List.Item key={index}>
            <Button
              style={{ width: "100%", textAlign: "left" }}
              size="large"
              type="text"
              icon={item.icon}
              onClick={() => handleNavigate(item.path)}
            >
              {item.title}
            </Button>
          </List.Item>
        ))}
      </List>

      <Button
        type="primary"
        danger
        style={{ width: "100%" }}
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Chiqish
      </Button>
    </Drawer>
  );
}

export default forwardRef(MobileHeaderDrawer);

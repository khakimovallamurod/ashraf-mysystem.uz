import { Drawer } from "antd";
import React from "react";

function MainNotificationDrawer({open, onClose, children}) {
  return (
    <Drawer
      width={320}
      onClose={onClose}
      closeIcon={false}
      open={open}
      styles={{ body: { padding: 0 } }}
    >{children}</Drawer>
  );
}

export default MainNotificationDrawer;

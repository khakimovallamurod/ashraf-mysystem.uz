import { Drawer } from "antd";
import React from "react";
import styles from "./bottomDrawer.module.css";

function BottomDrawer({ onClose, children }) {
  return (
    <Drawer
      className={styles.drawer}
      rootStyle={{
        borderTopLeftRadius: "22px",
        borderTopRightRadius: "22px",
        bottom: "80px",
      }}
      styles={{ body: { padding: '10px' } }}
      height={"70vh"}
      destroyOnClose={true}
      placement={"bottom"}
      closable={false}
      onClose={onClose}
      open={true}
      autoFocus={false}
    >
      <div className={styles.divider} />
      {children}
    </Drawer>
  );
}

export default BottomDrawer;

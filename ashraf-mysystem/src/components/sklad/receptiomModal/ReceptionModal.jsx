import { PlusOutlined } from "@ant-design/icons";
import { Drawer, FloatButton } from "antd";
import React, { useState } from "react";
import ReceptionModalInner from "./inner/ReceptionModalInner";

function ReceptionModal() {
  /* State */
  const [openDrawer, setOpenDrawer] = useState(false);

  /* Drawer actions */
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };
  const showDrawer = () => {
    setOpenDrawer(true);
  };

  return (
    <>
      {/* Fload button */}
      <FloatButton
        shape="circle"
        type="primary"
        style={{
          right: 24,
        }}
        icon={<PlusOutlined />}
        onClick={showDrawer}
      />

      <Drawer
        title="Kirim qilish"
        placement="left"
        width={720}
        onClose={onCloseDrawer} 
        open={openDrawer}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        {openDrawer ? <ReceptionModalInner /> : null}
      </Drawer>
    </>
  );
}

export default ReceptionModal;

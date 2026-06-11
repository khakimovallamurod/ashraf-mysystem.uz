import { Drawer } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import UploaderRegrindForm from "../../../page/uploader/regrind/components/UploaderRegrindForm";

function CreateRegrindDrawer(props, ref) {
  useImperativeHandle(ref, () => ({
    onOpen: handleOpenDrawer,
  }));

  /* State */
  const [openDrawer, setOpenDrawer] = useState(false);

  /* Modal */
  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);

  return (
    <Drawer
      title="Kirim qilish"
      placement="left"
      width={720}
      onClose={handleCloseDrawer} 
      open={openDrawer}
      styles={{ body: {
        paddingBottom: 80,
      } }}
    >
      <UploaderRegrindForm />
    </Drawer>
  );
}

export default forwardRef(CreateRegrindDrawer);

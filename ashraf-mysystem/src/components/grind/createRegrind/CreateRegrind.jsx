import { FileSyncOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useRef } from "react";
import CreateRegrindDrawer from "./CreateRegrindDrawer";

function CreateRegrind() {
  /* Ref */
  const regrindDrawer = useRef(null);

  const handleOpenRegrindDrawer = () => regrindDrawer.current.onOpen();

  return (
    <>
      <CreateRegrindDrawer ref={regrindDrawer} />
      <Tooltip title="Qayta maydalash yaratish">
        <Button icon={<FileSyncOutlined />} onClick={handleOpenRegrindDrawer} />
      </Tooltip>
    </>
  );
}

export default CreateRegrind;

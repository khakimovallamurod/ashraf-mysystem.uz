import { FolderAddOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";
import MainModal from "../../common/modal/MainModal";
import StorageProdCombineModal from "./StorageProdCombineModal";

function StorageProdCombine() {
  /* State */
  const [openModal, setOpenModal] = useState(false);

  /* Modal */
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      <Tooltip title="Partiyani birlashtirish">
        <Button icon={<FolderAddOutlined />} onClick={handleOpenModal} />
      </Tooltip>
      <MainModal open={openModal} onClose={handleCloseModal}>
        <StorageProdCombineModal onClose={handleCloseModal} />
      </MainModal>
    </>
  );
}

export default StorageProdCombine;

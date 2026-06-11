import { FolderAddOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";
import MainModal from "../../common/modal/MainModal";
import UploaderProdCombineModal from "./UploaderProdCombineModal";

function UploaderProdCombine() {
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
        <UploaderProdCombineModal onClose={handleCloseModal} />
      </MainModal>
    </>
  );
}

export default UploaderProdCombine;

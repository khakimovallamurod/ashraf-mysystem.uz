import { FolderAddOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";
import MainModal from "../../common/modal/MainModal";
import GrindProdCombineModal from "./GrindProdCombineModal";

function GrindProdCombine() {
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
        <GrindProdCombineModal onClose={handleCloseModal} />
      </MainModal>
    </>
  );
}

export default GrindProdCombine;

import {Modal} from "antd";
import React, {memo} from "react";

function MainModal({open, onClose, title = "", children, width, closeIcon = true}) {
  return (
    <Modal
      footer={false}
      centered
      open={open}
      onCancel={onClose}
      title={title}
      width={width}
      style={{padding: "1rem 0"}}
      closeIcon={closeIcon}
    >
      <div style={{paddingTop: "2rem"}}>{children}</div>
    </Modal>
  );
}

export default memo(MainModal);

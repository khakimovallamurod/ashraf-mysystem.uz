import { Segmented } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./mainSegment.module.css";

function MainSegmented({ options }) {
  const navigate = useNavigate();
  return (
    <div className={styles.body}>
      <Segmented
        style={{ borderRadius: "12px!important" }}
        width={"500"}
        options={options}
        onChange={(e) => navigate(e)}
        value={window.location.pathname}
      />
    </div>
  );
}

export default MainSegmented;

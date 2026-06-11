import React from "react";

import styles from "./springMode.module.css";

import BgImag from "../../../assets/images/spring-bg.webp";

function SpringMode() {
  return (
    <div className={styles.bgContent}>
      <img className={styles.themeModeBg} src={BgImag} alt="Spring" />
    </div>
  );
}

export default SpringMode;

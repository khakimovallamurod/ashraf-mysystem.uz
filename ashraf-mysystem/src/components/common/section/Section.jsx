import React from "react";
import styles from "./mainSection.module.css";

function Section({ children, style={} }) {
  return <div className={styles.section} style={style}>{children}</div>
}

export default Section;

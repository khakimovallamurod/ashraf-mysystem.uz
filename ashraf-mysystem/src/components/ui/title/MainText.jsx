import React from "react";
import styles from "./mainTitle.module.css";

export default function MainText({
  children,
  lg = false,
  md = false,
  sm = false,
  xs = false,
  xl = false,
}) {
  return lg ? (
    <p className={styles.lgTitle}>{children}</p>
  ) : sm ? (
    <p className={styles.smTitle}>{children}</p>
  ) : xs ? (
    <p className={styles.xsTitle}>{children}</p>
  ) : xl ? (
    <p className={styles.xlTitle}>{children}</p>
  ) : (
    <p className={styles.mdTitle}>{children}</p>
  );
}

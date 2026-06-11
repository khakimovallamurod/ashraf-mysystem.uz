import { Skeleton } from "antd";
import React, { memo, useMemo } from "react";
import styles from "./mainTableHeader.module.css";

function MainTableCard({
  style,
  title,
  caption,
  mode,
  size,
  isLoading = false,
}) {
  const classes = useMemo(() => {
    const newClass = [styles.tableCard];
    /* Size */
    switch (size) {
      case "medium":
        newClass.push(styles.medium);
        break;
      case "small":
        newClass.push(styles.small);
        break;
      default:
        newClass.push(styles.defaultSize);
    }

    // Colors
    switch (mode) {
      case "danger":
        newClass.push(styles.danger);
        break;
      case "success":
        newClass.push(styles.success);
        break;
      case "brown":
        newClass.push(styles.brown);
        break;
      case "blue":
        newClass.push(styles.blue);
        break;
      default:
        newClass.push(styles.default);
        break;
    }
    return newClass.join(" ");
  }, [mode, size]);
  
  return (
    <div className={classes} style={style}>
      {isLoading ? (
        <Skeleton.Input size="small" />
      ) : (
        <>
          <h2 className={styles.tableCardTitle}>{title}</h2>
          <p className={styles.tableCardCaption}>{caption}</p>
        </>
      )}
    </div>
  );
}

export default memo(MainTableCard);

import { Badge, Tooltip } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./bottomBar.module.css";

function BottomBarItem({
  onNavigate,
  icon,
  title,
  tooltipTitle,
  to,
  notifCount = 0,
}) {
  /* Location */
  const { pathname } = useLocation();
  return (
    <Tooltip title={tooltipTitle}>
      <li
        className={[
          styles.navbarItem,
          to === pathname ? styles.activeBtn : null,
        ].join(" ")}
        onClick={() => onNavigate(to)}
      >
        <Badge className={styles.badge} count={notifCount} offset={[0, -10]} />

        <div className={styles.navbarItemIcon}>{icon}</div>

        <div className={styles.navbarItemTitle}>{title}</div>
      </li>
    </Tooltip>
  );
}

export default BottomBarItem;

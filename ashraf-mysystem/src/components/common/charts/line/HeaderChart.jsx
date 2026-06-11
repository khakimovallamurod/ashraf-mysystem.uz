import React from "react";
import styles from "./headerChart.module.css";
import LineChart from "./LineChart";

function HeaderChart() {
  return (
    <div className={styles.content}>
      <h2 className={styles.title}>Rejalar</h2>
      <p>Foyda haqida statistika</p>
      <LineChart />
    </div>
  );
}

export default HeaderChart;

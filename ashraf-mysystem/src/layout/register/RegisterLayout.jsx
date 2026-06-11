import React from "react";
import LazyImage from "../../components/common/lazyLoad/LazyImage";
import MainOutlet from "../../components/common/outlet/MainOutlet";
import styles from "./registerLayout.module.css";

function RegisterLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.body}>
        <LazyImage imgUrl={"/images/custom-logo.png"} width={120} />
        {/* Outlet */}
        <MainOutlet />
      </div>
    </div>
  );
}

export default RegisterLayout;

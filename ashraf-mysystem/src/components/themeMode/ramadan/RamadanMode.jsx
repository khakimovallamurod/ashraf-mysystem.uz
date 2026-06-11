import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import {LOGIN_ROUTE, PASSWORD_RESET_ROUTE} from "../../../util/path";
import styles from "./ramadanMode.module.css";

import BgImag from "../../../assets/images/ramadan-bg.jpg";
import {ReactTyped} from "react-typed";

function RamadanMode() {
  /* State */
  const [showImage, setShowImage] = useState(false);

  const {pathname} = useLocation();

  useEffect(() => {
    if (pathname === LOGIN_ROUTE || pathname === PASSWORD_RESET_ROUTE) {
      setShowImage(true);
    }
  }, [pathname]);

  if (!showImage) return ''

  return (
    <div className={styles.bgContent}>
      <img
        className={styles.themeModeBg}
        src={BgImag}
        alt="Spring"
      />
      <div className={styles.body}>
        <div className={styles.bgTitle}>
          <ReactTyped strings={["Ramazon"]} typeSpeed={45} showCursor={false}/>
        </div>
        <div className={styles.bgTitleSec}>
          <ReactTyped strings={["Muborak"]} typeSpeed={45} showCursor={false} startDelay={600}/>
        </div>
      </div>
    </div>
  );
}

export default RamadanMode;

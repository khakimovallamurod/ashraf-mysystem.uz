import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { LOGIN_ROUTE, PASSWORD_RESET_ROUTE } from "../../../util/path";
import Snowflake from "./snowflake/SnowFlake";
import styles from "./winterMode.module.css";

function WinterMode() {
  /* State */
  const [showImage, setShowImage] = useState(false);

  const { pathname } = useLocation();

  const snow = () => {
    let animationDelay = "0s";
    let fontSize = "100px";
    let left = "0";
    let arr = Array.from(
      "Snowflakes are awesome!!! They are like little pieces of magic!!! Love snowflakes!!!"
    );
    return arr.map((el, i) => {
      animationDelay = `${(Math.random() * 16).toFixed(2)}s`;
      fontSize = `${Math.floor(Math.random() * 10) + 10}px`;
      left = `${Math.floor(Math.random() * 100)}%`;
      let style = {
        animationDelay,
        fontSize,
        left,
      };
      return <Snowflake key={i} id={i} style={style} />;
    });
  };

  useEffect(() => {
    if (pathname === LOGIN_ROUTE || pathname === PASSWORD_RESET_ROUTE) {
      setShowImage(true);
    }
  }, [pathname]);

  return (
    <>
      {showImage && (
        <img
          className={styles.themeModeBg}
          src={
            process.env.PUBLIC_URL + "./images/themeMode/winter-image-bg.webp"
          }
          width={300}
          alt="Winter"
        />
      )}
      {snow()}
    </>
  );
}

export default WinterMode;

import { Spin } from "antd";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./loading.module.css";

function Loading({ height }) {
  return (
    <div className={styles.content} style={{ height: height }}>
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 40,
            }}
            spin
          />
        }
      />
    </div>
  );
}

export default Loading;

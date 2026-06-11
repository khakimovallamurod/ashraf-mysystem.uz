import { Button, List } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { UPLOADER_SALES_ORDER_PROCESS_ROUTE } from "../../../util/path";

function UploaderHome() {
  return (
    <div style={{ padding: "15px 0" }}>
      <List size="small" bordered>
        <ListItem path={UPLOADER_SALES_ORDER_PROCESS_ROUTE}>
          Sotuvdan tushgan buyurtmalar
        </ListItem>
      </List>
    </div>
  );
}

function ListItem({ children, path }) {
  /* Navigate */
  const navigate = useNavigate();

  return (
    <List.Item style={{ padding: 0 }}>
      <Button
        style={{
          width: "100%",
          textAlign: "left",
        }}
        size="large"
        type="text"
        onClick={() => navigate(path)}
      >
        {children}
      </Button>
    </List.Item>
  );
}

export default UploaderHome;

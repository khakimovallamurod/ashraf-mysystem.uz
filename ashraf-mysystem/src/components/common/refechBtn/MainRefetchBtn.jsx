import { ReloadOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import React from "react";

function MainRefetchBtn({ refetch }) {
  return (
    <div
      style={{
        minHeight: "400px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <svg
        width="84"
        height="81"
        viewBox="0 0 24 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.75 20.6L10.35 11.15C9.56667 11.3333 8.83767 11.6083 8.163 11.975C7.48833 12.3417 6.884 12.8 6.35 13.35L4.25 11.2C4.78333 10.6667 5.35833 10.2 5.975 9.79999C6.59167 9.39999 7.25 9.04999 7.95 8.74999L5.7 6.49999C5.01667 6.84999 4.379 7.23765 3.787 7.66299C3.195 8.08832 2.63267 8.56732 2.1 9.09999L0 6.94999C0.533333 6.41665 1.08767 5.93765 1.663 5.51299C2.23833 5.08832 2.85067 4.68399 3.5 4.29999L1.4 2.19999L2.8 0.799988L21.2 19.2L19.75 20.6ZM12 19C11.3 19 10.7083 18.754 10.225 18.262C9.74167 17.77 9.5 17.1827 9.5 16.5C9.5 15.8 9.74167 15.2083 10.225 14.725C10.7083 14.2417 11.3 14 12 14C12.7 14 13.2917 14.2417 13.775 14.725C14.2583 15.2083 14.5 15.8 14.5 16.5C14.5 17.1833 14.2583 17.771 13.775 18.263C13.2917 18.755 12.7 19.0007 12 19ZM17.9 13.05L17.175 12.325L16.45 11.6L12.85 7.99999C14.2 8.13332 15.4623 8.47499 16.637 9.02499C17.8117 9.57499 18.8493 10.3 19.75 11.2L17.9 13.05ZM21.9 9.09999C20.6167 7.81665 19.129 6.81265 17.437 6.08799C15.745 5.36332 13.9327 5.00065 12 4.99999C11.65 4.99999 11.3127 5.01265 10.988 5.03799C10.6633 5.06332 10.334 5.10065 10 5.14999L7.45 2.59999C8.18333 2.39999 8.92933 2.24999 9.688 2.14999C10.4467 2.04999 11.2173 1.99999 12 1.99999C14.3667 1.99999 16.575 2.44165 18.625 3.32499C20.675 4.20832 22.4667 5.41665 24 6.94999L21.9 9.09999Z"
          fill="#B1B1B1"
        />
      </svg>

      <Typography.Title level={4}>Ulanishda xatolik!</Typography.Title>
      <Typography.Text type="secondary" style={{ marginBottom: "1.2rem" }}>
        Siz oflaynsiz. Aloqani tekshiring.
      </Typography.Text>
      <Button onClick={refetch} type="primary" icon={<ReloadOutlined />}>
        Qayta urinish
      </Button>
    </div>
  );
}

export default MainRefetchBtn;

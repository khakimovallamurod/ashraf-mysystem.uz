import { Button, Result } from "antd";
import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  /* Navigate */
  const navigate = useNavigate();

  /* Handle navigate */
  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Kechirasiz, siz tashrif buyurgan sahifa mavjud emas!"
      extra={
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={handleNavigate}
        >
          Orqaga qaytish
        </Button>
      }
    />
  );
}

export default PageNotFound;

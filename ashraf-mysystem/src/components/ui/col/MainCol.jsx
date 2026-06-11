import { Col } from "antd";

function MainCol({ component, children }) {
  return component === "drawer" ? (
    <Col span={12}>{children}</Col>
  ) : (
    <Col xs={24} md={12} xl={6} xxl={4}>
      {children}
    </Col>
  );
}

export default MainCol;
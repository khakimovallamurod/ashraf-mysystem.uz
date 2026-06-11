import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { Component } from "react";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    return this.state.hasError ? <ErrorContent /> : this.props.children;
  }
}

function ErrorContent() {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Sorry, something went wrong."
      extra={
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => console.log(window.history.back())}
        >
          Orqaga qaytish
        </Button>
      }
    />
  );
}
export default ErrorBoundary;

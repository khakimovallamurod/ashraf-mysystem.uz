import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import AppRouter from "./AppRouter";
import MainProvider from "./provider/MainProvider";
import ErrorBoundary from "./page/error/ErrorBoundary";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#10b981' } }}>
      <ErrorBoundary>
        <MainProvider>
          <Router>
            {/* basename="/build" */}
            <AppRouter />
          </Router>
        </MainProvider>
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default App;

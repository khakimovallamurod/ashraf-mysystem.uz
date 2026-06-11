import React from "react";
import { Outlet } from "react-router-dom";

function ThemeMode() {
  return (
    <>
      {/* <SpringMode /> */}

      <Outlet />
    </>
  );
}

export default ThemeMode;

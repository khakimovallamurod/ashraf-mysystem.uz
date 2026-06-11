import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loading from "../loading/Loading";

function MainOutlet() {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
}

export default MainOutlet;

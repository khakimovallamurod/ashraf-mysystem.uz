import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectCurrentAccessToken,
  selectCurrentRole,
} from "../../../features/auth/authSlice";
import { LOGIN_ROUTE } from "../../../util/path";

function AuthRequired({ allowRoles }) {
  /* User data */
  const token = useSelector(selectCurrentAccessToken);
  const role = useSelector(selectCurrentRole);

  return token && allowRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to={LOGIN_ROUTE} replace={true} />
  );
}

export default AuthRequired;

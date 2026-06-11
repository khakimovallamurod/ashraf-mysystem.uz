import { lazy } from "react";

/* Layout */
export const RegisterLayout = lazy(() =>
  import("../../layout/register/RegisterLayout")
);

/* Pages */
export const SignIn = lazy(() => import("./SignIn"));
export const PasswordReset = lazy(() => import("./PasswordReset"));

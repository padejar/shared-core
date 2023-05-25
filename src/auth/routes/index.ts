import React from "react";
import { PageRoute } from "../../common/types/PageRoute";

const ResetPassword = React.lazy(
  () => import("../pages/ResetPassword/ResetPassword")
);

const routes: PageRoute[] = [
  {
    path: "/auth/reset-password",
    component: ResetPassword,
  },
];

export default routes;

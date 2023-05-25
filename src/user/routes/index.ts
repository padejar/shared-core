import React from "react";
import { PageRoute } from "../../common/types/PageRoute";

const ChangePassword = React.lazy(
  () => import("../pages/ChangePassword/ChangePassword")
);

const routes: PageRoute[] = [
  {
    path: "/user/change-password",
    name: "Change Password",
    component: ChangePassword,
  },
];

export default routes;

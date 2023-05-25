import React from "react";
import { PageRoute } from "../../common/types/PageRoute";

const KitchenSink = React.lazy(() => import("../pages/KitchenSink"));

const routes: PageRoute[] = [
  {
    path: "/kitchen-sink",
    component: KitchenSink,
  },
];

export default routes;

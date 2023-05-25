import React from "react";
import { PageRoute } from "../../common/types/PageRoute";

const ApplicationDetailsPage = React.lazy(
  () => import("../pages/ApplicationDetail")
);
const ApplicationList = React.lazy(
  () => import("../pages/ApplicationList/ApplicationList")
);
const QuickQuote = React.lazy(() => import("../pages/QuickQuote"));

const routes: PageRoute[] = [
  {
    name: "Quick Quote",
    path: "/application/quotes/quick-quote",
    exact: true,
    component: QuickQuote,
  },
  {
    name: "Application Details",
    path: [
      "/application/applications/:applicationId",
      "/application/applications/:applicationId/:tabName",
    ],
    component: ApplicationDetailsPage,
    exact: true,
  },
  {
    name: "Application List",
    path: "/application/applications",
    exact: true,
    component: ApplicationList,
  },
];

export default routes;

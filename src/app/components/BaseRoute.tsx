import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import {
  getIsAuthenticatedSelector,
  checkAuthState,
  useAuthenticationDispatch,
  Login,
  logout,
  ForgotPassword,
} from "../../auth";
import Loading from "../../common/components/Loading";
import NotFoundPage from "../../common/components/NotFoundPage";
import ScrollToTop from "../../common/components/ScrollToTop";
import { PERMISSION_ACCESS_TYPES } from "../../common/constants/permissionAccessTypes";
import APIService from "../../common/services/APIService";
import { PageRoute } from "../../common/types/PageRoute";
import { Notification } from "../../notification";
import { AutoPageReload } from "../../version-manager";

const BaseLayout = React.lazy(() => import("./BaseLayout"));

type BaseRouteProps = {
  bannerRefreshShown?: boolean;
  routes: {
    publicRoutes: PageRoute[];
    privateRoutes: PageRoute[];
  };
};
const BaseRoute: React.FunctionComponent<BaseRouteProps> = ({
  bannerRefreshShown,
  routes,
}: BaseRouteProps) => {
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const authDispatch = useAuthenticationDispatch();
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    authDispatch(checkAuthState());
    APIService.onTokenRefresh = (error) => {
      if (error) return authDispatch(logout());

      authDispatch(checkAuthState());
    };
  }, [authDispatch, isAuthenticated]);

  return (
    <Router>
      <Notification />
      <ScrollToTop />
      {isProduction && <AutoPageReload />}
      <React.Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/auth/login" exact={true}>
            <Login
              redirectPath="/application/applications"
              source={PERMISSION_ACCESS_TYPES.INTRODUCER_PORTAL}
            />
          </Route>
          <Route path="/auth/forgot-password" exact={true}>
            <ForgotPassword
              source={PERMISSION_ACCESS_TYPES.INTRODUCER_PORTAL}
            />
          </Route>
          {routes.publicRoutes.map((route, index) => (
            <Route
              key={index}
              exact={route.exact}
              path={route.path}
              render={(props) => <route.component {...props} />}
            />
          ))}
          {routes.privateRoutes.map((route, index) => (
            <Route
              key={index}
              exact={route.exact}
              path={route.path}
              render={(props) => (
                <BaseLayout bannerRefreshShown={bannerRefreshShown}>
                  <route.component {...props} />
                </BaseLayout>
              )}
            />
          ))}
          <Route
            exact
            path="/"
            render={() => (
              <Redirect
                to={
                  !isAuthenticated ? "/auth/login" : "/application/applications"
                }
              />
            )}
          />
          <Route
            render={() => (
              <NotFoundPage
                redirectLink="/application/applications"
                redirectLinkText="Back to dashboard"
              />
            )}
          />
        </Switch>
      </React.Suspense>
    </Router>
  );
};

export default BaseRoute;

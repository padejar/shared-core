import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loading from "../common/components/Loading";
import { ErrorHandler } from "../error-handler";
import routes from "./routes";

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <React.Suspense fallback={<Loading />}>
        <ErrorHandler>
          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                exact={route.exact}
                path={route.path}
                render={(props) => <route.component {...props} />}
              />
            ))}
          </Switch>
        </ErrorHandler>
      </React.Suspense>
    </Router>
  );
};

export default App;

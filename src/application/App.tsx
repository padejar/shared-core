import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loading from "../common/components/Loading";
import routes from "./routes";

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <React.Suspense fallback={<Loading />}>
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
      </React.Suspense>
    </Router>
  );
};

export default App;

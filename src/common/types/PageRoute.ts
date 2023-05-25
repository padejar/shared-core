import { RouteComponentProps } from "react-router-dom";

export interface PageRoute {
  path: string | string[];
  name?: string;
  exact?: boolean;
  component:
    | React.FunctionComponent<RouteComponentProps>
    | React.FunctionComponent;
  routes?: PageRoute[];
}

import { useEffect } from "react";
import { useLocation } from "react-router";

/*
`ScrollToTop` component must be called inside `react-router-dom`'s `BrowserRouter` component, otherwise it will throw errors.
*/
const ScrollToTop: React.FunctionComponent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;

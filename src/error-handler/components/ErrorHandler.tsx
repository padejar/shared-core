import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { HTTP_STATUS_CODES } from "../../common/constants/httpStatusCodes";
import { useErrorDispatch } from "../dispatchers";
import { getHttpStatusCodeSelector } from "../selectors";

type ErrorHandlerProps = {
  children?: JSX.Element;
};

const ErrorHandler: React.FunctionComponent<ErrorHandlerProps> = ({
  children,
}: ErrorHandlerProps) => {
  const history = useHistory();
  const httpStatusCode = useSelector(getHttpStatusCodeSelector);
  const dispatch = useErrorDispatch();

  useEffect(() => {
    if (httpStatusCode === HTTP_STATUS_CODES.UNAUTHORIZED) {
      history.replace("/auth/login");
    }
  }, [httpStatusCode, history, dispatch]);

  return children ? children : null;
};

export default ErrorHandler;

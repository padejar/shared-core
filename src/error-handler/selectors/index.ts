import { createSelector } from "reselect";
import { ErrorHandlerState, ErrorState } from "../types";

export const errorSelector = (state: ErrorHandlerState): ErrorState =>
  state.errorHandler;

export const getHttpStatusCodeSelector = createSelector(
  errorSelector,
  (state) => state.httpStatusCode
);

export const getErrorCodeSelector = createSelector(errorSelector, (state) => {
  return state.errorCode;
});

export const getErrorMessageSelector = createSelector(
  errorSelector,
  (state) => {
    return state.errorMessage;
  }
);

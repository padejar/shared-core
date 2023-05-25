import {
  onError,
  clearErrors,
  setCustomErrorMessage,
} from "./actions/creators";
import ErrorHandler from "./components/ErrorHandler";
import { ERROR_CODES } from "./constants/errorCodes";
import {
  DEFAULT_ERROR_MESSAGE,
  RESOURCE_NOT_FOUND_MESSAGE,
  RESTRICTED_ACCESS,
  SUSPENDED,
} from "./constants/errorMessages";
import { useErrorDispatch } from "./dispatchers";
import errorHandlerReducers from "./reducers";
import errorHandlerSagas from "./sagas";
import {
  getErrorCodeSelector,
  getErrorMessageSelector,
  getHttpStatusCodeSelector,
} from "./selectors";
import SentryService from "./services/SentryService";
import { FieldErrors } from "./types";
import { setFormErrors, shouldReportToSentry, errorReporting } from "./utils";

/*
`FieldErrors` is one of the error types beside `string`, it will be thrown if there are validation errors from the api
*/
export type { FieldErrors };

/*
`errorHandlerReducers` must be combined into `src/app/rootReducer.ts`
`errorHandlerSagas` must be combined into `src/app/rootSaga.ts`
*/
export { errorHandlerReducers, errorHandlerSagas };

/*
`onError` can be used inside a `catch` block inside `try ... catch` 
`clearErrors` can be used to clear api errors and can be called before or after the api call
`setCustomErrorMessage` can be used to set a custom `string` error message for custom validation purpose
*/
export { onError, clearErrors, setCustomErrorMessage };

/*
`ErrorHandler` is a React functional component and can be used in the root of the application (e.g. `src/app/components/App.tsx`)
*/
export { ErrorHandler };

/* 
`setFormErrors` is a util function to parse and set api field validation errors. It accepts 2 arguments: the `errors` itself, and `react-hook-form`'s `setError` function
`shouldReportToSentry` is a util function to check the error object if it has certain error messages from the api that should be ignored.
*/
export { setFormErrors, shouldReportToSentry, errorReporting };

/*
`ERROR_CODES` is an `enum` consisting `quest-api`'s error codes
*/
export { ERROR_CODES };

/* 
`useErrorDispatch` is a dispatcher function to dispatch actions to the `error-handler`'s reducer.
*/
export { useErrorDispatch };

/*
`SentryService` is a service class that can be used to initialise Sentry and report errors to the service.
*/
export { SentryService };

/* 
Error handler's selectors can be passed  into the `useSelector`'s argument. (e.g. `useSelector(getErrorMessageSelector)`)
`getErrorCodeSelector` is a selector to get error code from `quest-api`. Returns a type of `ERROR_CODES` enum.
`getErrorMessageSelector` is a selecor to get an error message. Can be a type of `FieldErrors` or `string`
`getHttpStatusCodeSelector` is a selector to get http status code response from the api. Returns a type of `number`.
*/
export {
  getErrorCodeSelector,
  getErrorMessageSelector,
  getHttpStatusCodeSelector,
};

/* 
`DEFAULT_ERROR_MESSAGE` is a constant that returns a type of string. Can be used if the error is unknown (e.g. connection problem)
*/
export {
  DEFAULT_ERROR_MESSAGE,
  RESOURCE_NOT_FOUND_MESSAGE,
  RESTRICTED_ACCESS,
  SUSPENDED,
};

import {
  CLEAR_ERRORS,
  ErrorActions,
  SET_CUSTOM_ERROR_MESSAGE,
  SET_ERROR,
  SET_HTTP_STATUS_CODE,
} from "../actions/types";
import { ErrorState } from "../types";

const errorState: ErrorState = {
  errorCode: null,
  errorMessage: null,
  httpStatusCode: null,
};

const reducer = (
  state: ErrorState = errorState,
  action: ErrorActions
): ErrorState => {
  switch (action.type) {
    case SET_ERROR: {
      return {
        ...state,
        errorMessage: action.errorMessage,
        errorCode: action.errorCode,
      };
    }
    case SET_CUSTOM_ERROR_MESSAGE: {
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    }
    case CLEAR_ERRORS: {
      return {
        errorMessage: null,
        errorCode: null,
        httpStatusCode: null,
      };
    }
    case SET_HTTP_STATUS_CODE: {
      return {
        ...state,
        httpStatusCode: action.httpStatusCode,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

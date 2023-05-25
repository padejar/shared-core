import {
  all,
  AllEffect,
  call,
  fork,
  ForkEffect,
  put,
  takeLatest,
} from "@redux-saga/core/effects";
import { Breadcrumb, Severity } from "@sentry/types";
import axios from "axios";
import { deleteTokens } from "../../auth";
import { HTTP_STATUS_CODES } from "../../common/constants/httpStatusCodes";
import { isObjectNotEmpty } from "../../common/utils/object";
import { actionCreator } from "../../notification";
import { setHttpStatusCode } from "../actions/creators";
import { OnError, ON_ERROR } from "../actions/types";
import {
  DEFAULT_ERROR_MESSAGE,
  EXCESS_PROPERTY_MESSAGE,
  RESOURCE_NOT_FOUND_MESSAGE,
  UNKNOWN_ERROR_MESSAGE,
} from "../constants/errorMessages";
import SentryService from "../services/SentryService";
import { FieldErrors } from "../types";

function* errorHandlerWorker({
  error,
  customMessage,
  notifProps,
  sendToSentry,
}: OnError) {
  let errorMessage: string | FieldErrors = DEFAULT_ERROR_MESSAGE;
  const breadCrumb: Breadcrumb = {};
  if (typeof error === "string") {
    errorMessage = error;
    breadCrumb.message = errorMessage;
  } else if (axios.isAxiosError(error) && error.response) {
    if (error.response.status === HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY) {
      errorMessage = error.response.data.errorMessage;

      breadCrumb.data = JSON.parse(error.config.data);
      breadCrumb.level = Severity.Error;
      breadCrumb.category = error.response.data
        ? error.response.data.errorCode
        : undefined;
      breadCrumb.message =
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage);

      if (typeof errorMessage !== "string") {
        for (const key in errorMessage) {
          errorMessage = errorMessage as FieldErrors;
          const message = errorMessage[key].message;
          if (message.search(EXCESS_PROPERTY_MESSAGE) !== -1) {
            errorMessage = DEFAULT_ERROR_MESSAGE;
          } else {
            errorMessage = UNKNOWN_ERROR_MESSAGE;
          }
        }
      }
    } else if (error.response.status === HTTP_STATUS_CODES.NOT_FOUND) {
      errorMessage = RESOURCE_NOT_FOUND_MESSAGE;
      sendToSentry = false;
    } else if (error.response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      errorMessage = "Unauthorized";
      sendToSentry = false;
      deleteTokens();
    } else if (error.response.status === HTTP_STATUS_CODES.FORBIDDEN) {
      errorMessage = error.response.data.errorMessage;
    }

    errorMessage = customMessage ?? errorMessage;

    yield put(setHttpStatusCode(error.response.status));
  }

  if (sendToSentry) {
    if (isObjectNotEmpty(breadCrumb)) {
      yield call(SentryService.addBreadCrumb, breadCrumb);
    }
    yield call(SentryService.report, error);
  }

  yield put(
    actionCreator.setNotification({
      ...notifProps,
      body: errorMessage as string,
      className: "qst-notif-danger",
    })
  );
}

function* watchError() {
  yield takeLatest(ON_ERROR, errorHandlerWorker);
}

function* errorHandlerSagas(): Generator<
  AllEffect<ForkEffect<void>>,
  void,
  unknown
> {
  yield all([fork(watchError)]);
}

export default errorHandlerSagas;

import { type } from "../../../notification";
import { ERROR_CODES } from "../../constants/errorCodes";
import { FieldErrors } from "../../types";
import {
  ClearErrors,
  CLEAR_ERRORS,
  OnError,
  ON_ERROR,
  SetCustomErrorMessage,
  SetError,
  SetHttpStatusCode,
  SET_CUSTOM_ERROR_MESSAGE,
  SET_ERROR,
  SET_HTTP_STATUS_CODE,
} from "../types";

export const onError = (
  error: Error | string,
  customMessage?: string,
  notifProps?: type.NotifItem,
  sendToSentry = true
): OnError => ({
  type: ON_ERROR,
  error,
  customMessage,
  notifProps,
  sendToSentry,
});

export const setError = (
  errorCode: ERROR_CODES,
  errorMessage: string | FieldErrors
): SetError => ({
  type: SET_ERROR,
  errorCode,
  errorMessage,
});

export const setCustomErrorMessage = (
  errorMessage: string
): SetCustomErrorMessage => ({
  type: SET_CUSTOM_ERROR_MESSAGE,
  errorMessage,
});

export const setHttpStatusCode = (
  httpStatusCode: number | null
): SetHttpStatusCode => ({
  type: SET_HTTP_STATUS_CODE,
  httpStatusCode,
});

export const clearErrors = (): ClearErrors => ({
  type: CLEAR_ERRORS,
});

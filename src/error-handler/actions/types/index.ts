import { Action } from "redux";
import { type } from "../../../notification";
import { ERROR_CODES } from "../../constants/errorCodes";
import { FieldErrors } from "../../types";

export const ON_ERROR = "ON_ERROR";
export interface OnError extends Action {
  type: typeof ON_ERROR;
  error: Error | string;
  customMessage?: string;
  notifProps?: type.NotifItem;
  sendToSentry?: boolean;
}

export const SET_ERROR = "SET_ERROR";
export interface SetError extends Action {
  type: typeof SET_ERROR;
  errorCode: ERROR_CODES;
  errorMessage: string | FieldErrors;
}

export const SET_CUSTOM_ERROR_MESSAGE = "SET_CUSTOM_ERROR_MESSAGE";
export interface SetCustomErrorMessage extends Action {
  type: typeof SET_CUSTOM_ERROR_MESSAGE;
  errorMessage: string;
}

export const SET_HTTP_STATUS_CODE = "SET_HTTP_STATUS_CODE";
export interface SetHttpStatusCode extends Action {
  type: typeof SET_HTTP_STATUS_CODE;
  httpStatusCode: number | null;
}

export const CLEAR_ERRORS = "CLEAR_ERRORS";
export interface ClearErrors extends Action {
  type: typeof CLEAR_ERRORS;
}

export type ErrorActions =
  | SetError
  | SetCustomErrorMessage
  | SetHttpStatusCode
  | ClearErrors
  | OnError;

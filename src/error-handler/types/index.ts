import { ERROR_CODES } from "../constants/errorCodes";

export interface FieldErrors {
  [key: string]: { message: string };
}

export interface APIError {
  errorCode: string;
  errorMessage: string | FieldErrors;
}

export interface ErrorState {
  errorCode: ERROR_CODES | null;
  errorMessage: FieldErrors | string | null;
  httpStatusCode: number | null;
}

export interface ErrorHandlerState {
  errorHandler: ErrorState;
}

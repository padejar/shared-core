import { Breadcrumb, Severity } from "@sentry/react";
import axios, { AxiosError, AxiosInstance } from "axios";
import { ErrorOption } from "react-hook-form";
import { HTTP_STATUS_CODES } from "../../common/constants/httpStatusCodes";
import { isObjectNotEmpty, propertyCheck } from "../../common/utils/object";
import {
  DEFAULT_ERROR_MESSAGE,
  EXCESS_PROPERTY_MESSAGE,
  RESOURCE_NOT_FOUND_MESSAGE,
  UNKNOWN_ERROR_MESSAGE,
} from "../constants/errorMessages";
import SentryService from "../services/SentryService";
import { FieldErrors } from "../types";

export const setFormErrors = <T>(
  fieldErrors: FieldErrors,
  setErrorFn: (name: keyof T, error: ErrorOption) => void,
  fieldPrefix?: string
): void => {
  const keys = Object.keys(fieldErrors);
  keys.forEach((key) => {
    if (propertyCheck<FieldErrors>(fieldErrors, key)) {
      let fieldName = key;
      if (fieldPrefix) {
        fieldName = key.replace(`${fieldPrefix}.`, "");
      }
      setErrorFn(fieldName as keyof T, {
        message: fieldErrors[fieldName].message,
        type: "validate",
      });
    }
  });
};

export const shouldReportToSentry = (
  apiError: Error,
  expectedErrors: string[]
): boolean => {
  if (
    axios.isAxiosError(apiError) &&
    apiError.response &&
    apiError.response.data
  ) {
    for (const expectedError of expectedErrors) {
      if (
        typeof apiError.response.data.errorMessage === "string" &&
        apiError.response.data.errorMessage.search(expectedError) !== -1
      ) {
        return false;
      }
    }
  }

  return true;
};

export const errorReporting = (
  error: Error | string,
  sendToSentry?: boolean
): void => {
  let errorMessage = DEFAULT_ERROR_MESSAGE;
  const breadCrumb: Breadcrumb = {};

  if (axios.isAxiosError(error) && error.response) {
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
    }

    if (sendToSentry) {
      if (isObjectNotEmpty(breadCrumb)) {
        SentryService.addBreadCrumb(breadCrumb);
      }
      SentryService.report(error);
    }
  }
};

/**
 * @param {Object} axiosInstance - the axios instance we wanted to intercept
 * @param {func[]} errorWhitelist - list of errors we wanted to avoid to be sent to Sentry
 */
export const initAxiosInterceptor = (
  axiosInstance: AxiosInstance,
  config?: {
    errorBlackList: { (error: AxiosError): boolean }[];
    errorWhiteList: { (error: AxiosError): boolean }[];
  }
): void => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      let sendToSentry = false;

      if (config) {
        const shouldIgnore = config.errorBlackList.some((condition) =>
          condition(error)
        );

        if (shouldIgnore) return Promise.reject(error);

        sendToSentry = config.errorWhiteList.some((condition) =>
          condition(error)
        );
      }

      errorReporting(error, sendToSentry);
      return Promise.reject(error);
    }
  );
};

export const processErrorMessage = (error: AxiosError): string => {
  let errorMessage = DEFAULT_ERROR_MESSAGE;
  if (error.isAxiosError && error.response) {
    if (error.response.status === HTTP_STATUS_CODES.NOT_FOUND) {
      errorMessage = RESOURCE_NOT_FOUND_MESSAGE;
    } else if (error.response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      errorMessage = "Unauthorized";
    } else if (error.response.status === HTTP_STATUS_CODES.FORBIDDEN) {
      errorMessage = error.response.data.errorMessage;
    } else if (
      error.response.status === HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY
    ) {
      if (typeof error.response.data.errorMessage !== "string") {
        const errors = error.response.data.errorMessage;
        for (const key in errors) {
          const message = errors[key].message;
          if (message.search(EXCESS_PROPERTY_MESSAGE) !== -1) {
            errorMessage = DEFAULT_ERROR_MESSAGE;
          } else {
            errorMessage = UNKNOWN_ERROR_MESSAGE;
          }
        }
      } else {
        errorMessage = error.response.data.errorMessage;
      }
    }
  }
  return errorMessage;
};

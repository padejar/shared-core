import axios, { AxiosError } from "axios";
import { HTTP_STATUS_CODES } from "../constants/httpStatusCodes";

const ignoreStatusCodes = (error: AxiosError): boolean => {
  if (error.isAxiosError && error.response) {
    if (
      [HTTP_STATUS_CODES.NOT_FOUND, HTTP_STATUS_CODES.UNAUTHORIZED].includes(
        error.response.status
      )
    ) {
      return true;
    }
  }
  return false;
};

const ignoreAxiosCancelRequest = (error: AxiosError): boolean => {
  if (axios.isCancel(error)) return true;
  return false;
};

const reportStatusCodes = (error: AxiosError): boolean => {
  if (error.isAxiosError && error.response) {
    if (
      [
        HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY,
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS_CODES.FORBIDDEN,
      ].includes(error.response.status)
    ) {
      return true;
    }
  }
  return false;
};

export const errorBlackList: { (error: AxiosError): boolean }[] = [
  ignoreAxiosCancelRequest,
  ignoreStatusCodes,
];

export const errorWhiteList: { (error: AxiosError): boolean }[] = [
  reportStatusCodes,
];

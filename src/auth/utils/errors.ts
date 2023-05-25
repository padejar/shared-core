import { AxiosError } from "axios";
import { ERROR_CODES } from "../../error-handler";

export const ignoreInvalidCredentials = (error: AxiosError): boolean => {
  if (error.config.url?.search("/iam/auth/login") !== -1) {
    if (
      [ERROR_CODES.VALIDATION_ERROR].includes(error.response?.data.errorCode)
    ) {
      return true;
    }
  }
  return false;
};

export const errorBlackList: { (error: AxiosError): boolean }[] = [
  ignoreInvalidCredentials,
];

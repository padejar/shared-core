import { AxiosError } from "axios";
import { QUOTE_AMOUNT_BROKERAGE_RATE_ERROR } from "../constants/errorWhitelist";

export const brokerageAmount = (error: AxiosError): boolean => {
  if (error.isAxiosError) {
    if (
      error.response &&
      typeof error.response.data.errorMessage === "string" &&
      error.response?.data.errorMessage.search(
        QUOTE_AMOUNT_BROKERAGE_RATE_ERROR
      ) !== -1
    ) {
      return true;
    }
  }

  return false;
};

export const errorBlackList: { (error: AxiosError): boolean }[] = [
  brokerageAmount,
];

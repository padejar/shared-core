import { FINANCE_TYPE_CHATTEL_MORTGAGE } from "../constants/quote";
import {
  QuoteFormCalculate,
  quoteFormCalculateDefaultValue,
} from "./QuoteFormCalculate";

export interface QuoteFormSave extends QuoteFormCalculate {
  financeType?: string;
  assetType?: string;
  hasStructuredPayment?: boolean;
  structuredPaymentNthPaymentAmount?: string;
  structuredPaymentAmount?: string;
}

export const quoteFormSaveDefaultValue: QuoteFormSave = {
  ...quoteFormCalculateDefaultValue,
  financeType: FINANCE_TYPE_CHATTEL_MORTGAGE,
  assetType: "",
  hasStructuredPayment: false,
  structuredPaymentNthPaymentAmount: "",
  structuredPaymentAmount: "",
};

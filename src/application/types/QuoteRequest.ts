import {
  quoteCalculateRequestDefaultValue,
  QuoteCalculateRequest,
} from "./QuoteCalculateRequest";

export interface QuoteRequest extends QuoteCalculateRequest {
  isDraft?: boolean;
  financeType: string;
  assetType: string;
  hasStructuredPayment: boolean;
  structuredPaymentNthPaymentAmount: number;
  structuredPaymentAmount: number;
}

export const quoteRequestDefaultValue: QuoteRequest = {
  ...quoteCalculateRequestDefaultValue,
  financeType: "CHATTEL_MORTGAGE",
  assetType: "",
  hasStructuredPayment: false,
  structuredPaymentNthPaymentAmount: 0,
  structuredPaymentAmount: 0,
};

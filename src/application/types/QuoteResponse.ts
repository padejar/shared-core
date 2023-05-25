import {
  QuoteCalculateResponse,
  quoteCalculateResponseDefaultValue,
} from "./QuoteCalculateResponse";
import { QuoteRequest, quoteRequestDefaultValue } from "./QuoteRequest";

export interface QuoteResponse extends QuoteRequest, QuoteCalculateResponse {
  id?: string;
  applicationId: string;
  state?: boolean;
}

export const quoteResponseDefaultValue: QuoteResponse = {
  ...quoteRequestDefaultValue,
  ...quoteCalculateResponseDefaultValue,
  id: "",
  applicationId: "",
  state: false,
};

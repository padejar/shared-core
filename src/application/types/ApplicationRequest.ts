import { QuoteRequest } from "./QuoteRequest";

export interface ApplicationRequest {
  name: string | null;
  isDraft: boolean;
  quote?: QuoteRequest;
}

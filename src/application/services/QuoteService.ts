import APIService from "../../common/services/APIService";
import { SingleResponse } from "../../common/types/SingleResponse";
import { QuoteCalculateRequest } from "../types/QuoteCalculateRequest";
import { QuoteCalculateResponse } from "../types/QuoteCalculateResponse";

class QuoteService {
  public static async calculateQuote(
    data: QuoteCalculateRequest
  ): Promise<SingleResponse<QuoteCalculateResponse> | undefined> {
    const result = await APIService.jsonRequest<
      SingleResponse<QuoteCalculateResponse>,
      QuoteCalculateRequest
    >(
      {
        method: "POST",
        path: "/application/quotes/calculate",
        data,
      },
      true
    );
    return result;
  }
}

export default QuoteService;

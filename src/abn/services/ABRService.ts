import APIService from "../../common/services/APIService";
import { SingleResponse } from "../../common/types/SingleResponse";
import { ABNRequest, ABNResponse } from "../types/ABN";
import { ACNRequest, ACNResponse } from "../types/ACN";

class ABRService {
  public static async abnSearch(
    abn: string
  ): Promise<SingleResponse<ABNResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<ABNResponse>,
      ABNRequest
    >(
      {
        method: "POST",
        path: `/abn/abn-search`,
        data: {
          abn,
        },
      },
      true
    );

    return result;
  }

  public static async acnSearch(
    acn: string
  ): Promise<SingleResponse<ACNResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<ACNResponse>,
      ACNRequest
    >(
      {
        method: "POST",
        path: `/abn/acn-search`,
        data: {
          acn,
        },
      },
      true
    );

    return result;
  }
}

export default ABRService;

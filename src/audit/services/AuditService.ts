import { Method } from "axios";
import APIService from "../../common/services/APIService";
import { ListResponse } from "../../common/types/ListResponse";
import { convertToQueryParams } from "../../common/utils/object";
import { AuditLogListRequest, AuditLogResponse } from "../types";

class AuditService {
  public static async getAuditList(
    payload: AuditLogListRequest
  ): Promise<ListResponse<AuditLogResponse>> {
    const queryParams = convertToQueryParams(payload);
    const method: Method = "GET";
    const path = `/audit/audits${queryParams}`;

    const result = await APIService.jsonRequest<
      ListResponse<AuditLogResponse>,
      unknown
    >(
      {
        method,
        path,
      },
      true
    );
    return result;
  }
}

export default AuditService;

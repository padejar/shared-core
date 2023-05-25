import APIService from "../../common/services/APIService";
import { ListResponse } from "../../common/types/ListResponse";
import { ApplicationDocument } from "../types/ApplicationDocument";
import { DocumentGenerateRequest } from "../types/DocumentGenerateRequest";

class ApplicationDocumentService {
  public static async generateDocuments(
    applicationId: string,
    types: string[],
    isEsign: boolean
  ): Promise<ListResponse<ApplicationDocument> | undefined> {
    const result = await APIService.jsonRequest<
      ListResponse<ApplicationDocument>,
      DocumentGenerateRequest
    >(
      {
        method: "POST",
        path: `/application/applications/${applicationId}/documents/generate`,
        data: {
          types,
          isEsign,
        },
      },
      true
    );
    return result;
  }
}

export default ApplicationDocumentService;

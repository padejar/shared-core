import { Method } from "axios";
import APIService from "../../common/services/APIService";
import { ListResponse } from "../../common/types/ListResponse";
import { SingleResponse } from "../../common/types/SingleResponse";
import { convertToQueryParams } from "../../common/utils/object";
import { ApplicantRequest } from "../types/ApplicantRequest";
import { ApplicantResponse } from "../types/ApplicantResponse";
import { ApplicationListRequest } from "../types/ApplicationListRequest";
import { ApplicationRequest } from "../types/ApplicationRequest";
import { ApplicationResponse } from "../types/ApplicationResponse";
import { ApprovalConditionsResponse } from "../types/ApprovalConditionsResponse";
import { Guarantor } from "../types/Guarantor";
import { GuarantorsRequest } from "../types/GuarantorsRequest";
import { NoteRequest } from "../types/NoteRequest";
import { NoteResponse } from "../types/NoteResponse";
import { QuoteRequest } from "../types/QuoteRequest";
import { QuoteResponse } from "../types/QuoteResponse";
import { RequiredDocuments } from "../types/RequiredDocuments";
import { SecurityRequest } from "../types/SecurityRequest";
import { SecurityResponse } from "../types/SecurityResponse";
import { WithdrawRequest, StatusReason } from "../types/WithdrawRequest";

class ApplicationService {
  public static async getApplicationList(
    payload: ApplicationListRequest
  ): Promise<ListResponse<ApplicationResponse>> {
    const { search, ...requestPayload } = payload;
    if (search) {
      Object.assign(requestPayload, { query: search });
    }
    const queryParams = convertToQueryParams(requestPayload);
    const method: Method = "GET";
    const path = `/application/applications${queryParams}`;

    const result = await APIService.jsonRequest<
      ListResponse<ApplicationResponse>,
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

  public static async getApplicationDetails(
    applicationId: string
  ): Promise<SingleResponse<ApplicationResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<ApplicationResponse>,
      unknown
    >(
      {
        method: "GET",
        path: `/application/applications/${applicationId}`,
      },
      true
    );
    return result;
  }

  public static async saveApplication(
    data: ApplicationRequest
  ): Promise<SingleResponse<ApplicationResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<ApplicationResponse>,
      ApplicationRequest
    >(
      {
        method: "POST",
        path: `/application/applications`,
        data,
      },
      true
    );
    return result;
  }

  public static async saveQuote(
    data: QuoteRequest,
    applicationId: string
  ): Promise<SingleResponse<QuoteResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<QuoteResponse>,
      QuoteRequest
    >(
      {
        method: "POST",
        path: `/application/applications/${applicationId}/quotes`,
        data,
      },
      true
    );
    return result;
  }

  public static async saveApplicant(
    data: ApplicantRequest,
    applicationId: string
  ): Promise<SingleResponse<ApplicantResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<ApplicantResponse>,
      ApplicantRequest
    >(
      {
        method: "POST",
        path: `/application/applications/${applicationId}/applicants`,
        data,
      },
      true
    );
    return result;
  }

  public static async saveGuarantors(
    data: GuarantorsRequest,
    applicationId: string
  ): Promise<ListResponse<Guarantor>> {
    const result = await APIService.jsonRequest<
      ListResponse<Guarantor>,
      GuarantorsRequest
    >(
      {
        method: "POST",
        path: `/application/applications/${applicationId}/guarantors`,
        data,
      },
      true
    );
    return result;
  }

  public static async saveSecurity(
    data: SecurityRequest,
    applicationId: string
  ): Promise<SingleResponse<SecurityResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<SecurityResponse>,
      SecurityRequest
    >(
      {
        method: "POST",
        path: `/application/applications/${applicationId}/securities`,
        data,
      },
      true
    );
    return result;
  }

  public static async saveNote(
    data: NoteRequest,
    applicationId: string
  ): Promise<SingleResponse<NoteResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<NoteResponse>,
      NoteRequest
    >(
      {
        method: "POST",
        path: `/application/applications/${applicationId}/notes`,
        data,
      },
      true
    );
    return result;
  }

  public static async submitApplication(
    applicationId: string
  ): Promise<SingleResponse<ApplicationResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<ApplicationResponse>,
      unknown
    >(
      {
        method: "PUT",
        path: `/application/applications/${applicationId}/submit`,
      },
      true
    );
    return result;
  }

  public static async submitSettlement(
    applicationId: string
  ): Promise<SingleResponse<ApplicationResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<ApplicationResponse>,
      unknown
    >(
      {
        method: "PUT",
        path: `/application/applications/${applicationId}/submit-settlement`,
      },
      true
    );
    return result;
  }

  public static async getRequiredDocuments(
    applicationId: string
  ): Promise<SingleResponse<RequiredDocuments>> {
    const result = await APIService.jsonRequest<
      SingleResponse<RequiredDocuments>,
      unknown
    >(
      {
        method: "GET",
        path: `/application/applications/${applicationId}/required-documents`,
      },
      true
    );

    return result;
  }

  public static async cloneApplication(
    applicationId: string
  ): Promise<SingleResponse<ApplicationResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<ApplicationResponse>,
      unknown
    >(
      {
        method: "POST",
        path: `/application/applications/${applicationId}/clone`,
      },
      true
    );
    return result;
  }

  public static async withdrawApplication(
    applicationId: string,
    data: WithdrawRequest
  ): Promise<SingleResponse<ApplicationResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<ApplicationResponse>,
      WithdrawRequest
    >(
      {
        method: "PUT",
        path: `/application/applications/${applicationId}/withdraw`,
        data,
      },
      true
    );
    return result;
  }

  public static async getApprovalConditions(
    applicationId: string
  ): Promise<SingleResponse<ApprovalConditionsResponse>> {
    const result = await APIService.jsonRequest<
      SingleResponse<ApprovalConditionsResponse>,
      unknown
    >(
      {
        method: "GET",
        path: `/application/applications/${applicationId}/approval-conditions`,
      },
      true
    );
    return result;
  }

  public static async getStatusReasons(
    statusGroup: string[]
  ): Promise<ListResponse<StatusReason>> {
    const result = await APIService.jsonRequest<
      ListResponse<StatusReason>,
      unknown
    >(
      {
        method: "GET",
        path: `/assessment/assessments/status-reason?statusGroups=${statusGroup}`,
      },
      true
    );
    return result;
  }
}

export default ApplicationService;

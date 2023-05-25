import { CancelToken } from "axios";
import APIService, { ProgressEvent } from "../../common/services/APIService";
import { ListResponse } from "../../common/types/ListResponse";
import { SingleResponse } from "../../common/types/SingleResponse";
import { UploadRequest } from "../types/UploadRequest";

class DocumentService {
  public static async getDocumentList<T>(
    path: string
  ): Promise<ListResponse<T> | undefined> {
    const result = await APIService.jsonRequest<ListResponse<T>, unknown>(
      {
        method: "GET",
        path,
      },
      true
    );

    return result;
  }

  public static async deleteDocument(
    path: string
  ): Promise<SingleResponse<string> | undefined> {
    const result = await APIService.jsonRequest<
      SingleResponse<string>,
      unknown
    >(
      {
        method: "DELETE",
        path,
      },
      true
    );
    return result;
  }

  public static async uploadDocument<T, R extends UploadRequest>(
    uploadPath: string,
    data: R,
    onUpload?: (progressEvent: ProgressEvent) => void,
    cancelToken?: CancelToken
  ): Promise<SingleResponse<T> | undefined> {
    const result = await APIService.uploadRequest<SingleResponse<T>, R>(
      {
        method: "POST",
        path: uploadPath,
        data,
        onUpload,
      },
      true,
      cancelToken
    );
    return result;
  }
  public static async downloadDocument(
    path: string
  ): Promise<SingleResponse<string>> {
    const result = await APIService.jsonRequest<
      SingleResponse<string>,
      unknown
    >(
      {
        method: "GET",
        path,
      },
      true
    );
    return result;
  }
}

export default DocumentService;

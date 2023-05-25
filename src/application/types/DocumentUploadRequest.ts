import { UploadRequest } from "../../files";

export interface DocumentUploadRequest extends UploadRequest {
  purpose: string;
  document: File;
}

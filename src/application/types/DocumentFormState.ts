import { ApplicationDocument } from "./ApplicationDocument";

export interface DocumentFormState {
  getDocumentsLoading: boolean;
  documentList: ApplicationDocument[];
  uploadProgress: number;
  isUploading: boolean;
}

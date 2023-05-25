import { Action } from "redux";
import { DOCUMENT_PURPOSES } from "../../constants/documentPurposes";
import { ApplicationDocument } from "../../types/ApplicationDocument";

export const GET_DOCUMENT_LIST = "GET_DOCUMENT_LIST";
export interface GetDocumentList extends Action {
  type: typeof GET_DOCUMENT_LIST;
  purpose: string;
  applicationId: string;
}

export const GET_DOCUMENT_LIST_SUCCESS = "GET_DOCUMENT_LIST_SUCCESS";
export interface GetDocumentListSuccess {
  type: typeof GET_DOCUMENT_LIST_SUCCESS;
  documentList: ApplicationDocument[];
}

export const GET_DOCUMENT_LIST_FAILED = "GET_DOCUMENT_LIST_FAILED";
export interface GetDocumentListFailed {
  type: typeof GET_DOCUMENT_LIST_FAILED;
}

export const UPLOAD_DOCUMENT = "UPLOAD_DOCUMENT";
export interface UploadDocument extends Action {
  type: typeof UPLOAD_DOCUMENT;
  document: File;
  purpose: DOCUMENT_PURPOSES;
  applicationId: string;
}

export const SET_UPLOAD_PROGRESS = "SET_UPLOAD_PROGRESS";
export interface SetUploadProgress extends Action {
  type: typeof SET_UPLOAD_PROGRESS;
  progress: number;
}

export const UPLOAD_DOCUMENT_SUCCESS = "UPLOAD_DOCUMENT_SUCCESS";
export interface UploadDocumentSuccess extends Action {
  type: typeof UPLOAD_DOCUMENT_SUCCESS;
  document: ApplicationDocument;
}

export const UPLOAD_DOCUMENT_FAILED = "UPLOAD_DOCUMENT_FAILED";
export interface UploadDocumentFailed extends Action {
  type: typeof UPLOAD_DOCUMENT_FAILED;
}

export const DELETE_DOCUMENT = "DELETE_DOCUMENT";
export interface DeleteDocument extends Action {
  type: typeof DELETE_DOCUMENT;
  applicationId: string;
  documentId: string;
}

export const DELETE_DOCUMENT_SUCCESS = "DELETE_DOCUMENT_SUCCESS";
export interface DeleteDocumentSuccess extends Action {
  type: typeof DELETE_DOCUMENT_SUCCESS;
  applicationId: string;
  documentId: string;
}

export type DocumentActions =
  | GetDocumentList
  | GetDocumentListSuccess
  | GetDocumentListFailed
  | UploadDocument
  | SetUploadProgress
  | UploadDocumentSuccess
  | UploadDocumentFailed
  | DeleteDocument
  | DeleteDocumentSuccess;

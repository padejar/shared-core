import { DOCUMENT_PURPOSES } from "../../constants/documentPurposes";
import { ApplicationDocument } from "../../types/ApplicationDocument";
import { UPLOAD_DOCUMENT_FAILED } from "../types/contracts";
import {
  DeleteDocument,
  DeleteDocumentSuccess,
  DELETE_DOCUMENT,
  DELETE_DOCUMENT_SUCCESS,
  GetDocumentList,
  GetDocumentListFailed,
  GetDocumentListSuccess,
  GET_DOCUMENT_LIST,
  GET_DOCUMENT_LIST_FAILED,
  GET_DOCUMENT_LIST_SUCCESS,
  SetUploadProgress,
  SET_UPLOAD_PROGRESS,
  UploadDocument,
  UploadDocumentFailed,
  UploadDocumentSuccess,
  UPLOAD_DOCUMENT,
  UPLOAD_DOCUMENT_SUCCESS,
} from "../types/documentForm";

export const getDocumentList = (
  applicationId: string,
  purpose: string
): GetDocumentList => ({
  type: GET_DOCUMENT_LIST,
  applicationId,
  purpose,
});

export const getDocumentListSuccess = (
  documentList: ApplicationDocument[]
): GetDocumentListSuccess => ({
  type: GET_DOCUMENT_LIST_SUCCESS,
  documentList,
});

export const getDocumentListFailed = (): GetDocumentListFailed => ({
  type: GET_DOCUMENT_LIST_FAILED,
});

export const uploadDocument = (
  applicationId: string,
  document: File,
  purpose: DOCUMENT_PURPOSES
): UploadDocument => ({
  type: UPLOAD_DOCUMENT,
  applicationId,
  document,
  purpose,
});

export const setUploadProgress = (progress: number): SetUploadProgress => ({
  type: SET_UPLOAD_PROGRESS,
  progress,
});

export const uploadDocumentSuccess = (
  document: ApplicationDocument
): UploadDocumentSuccess => ({
  type: UPLOAD_DOCUMENT_SUCCESS,
  document,
});

export const uploadDocumentFailed = (): UploadDocumentFailed => ({
  type: UPLOAD_DOCUMENT_FAILED,
});

export const deleteDocument = (
  applicationId: string,
  documentId: string
): DeleteDocument => ({
  type: DELETE_DOCUMENT,
  applicationId,
  documentId,
});

export const deleteDocumentSuccess = (
  documentId: string,
  applicationId: string
): DeleteDocumentSuccess => ({
  type: DELETE_DOCUMENT_SUCCESS,
  documentId,
  applicationId,
});

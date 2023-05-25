import { Action } from "redux";
import { DOCUMENT_PURPOSES } from "../../constants/documentPurposes";
import { ApplicationDocument } from "../../types/ApplicationDocument";
import { ApprovalConditionsResponse } from "../../types/ApprovalConditionsResponse";

export const SET_SELECTED_TYPES = "SET_SELECTED_TYPES";
export interface SetSelectedTypes extends Action {
  type: typeof SET_SELECTED_TYPES;
  selectedTypes: string[];
}

export const TOGGLE_ESIGN_WARNING = "TOGGLE_ESIGN_WARNING";
export interface ToggleEsignWarning extends Action {
  type: typeof TOGGLE_ESIGN_WARNING;
  showEsignWarning: boolean;
}

export const GENERATE_DOCUMENTS = "GENERATE_DOCUMENTS";
export interface GenerateDocuments extends Action {
  type: typeof GENERATE_DOCUMENTS;
  applicationId: string;
  isEsign: boolean;
  types: string[];
}

export const GENERATE_DOCUMENTS_SUCCESS = "GENERATE_DOCUMENTS_SUCCESS";
export interface GenerateDocumentsSuccess extends Action {
  type: typeof GENERATE_DOCUMENTS_SUCCESS;
  documents: ApplicationDocument[];
}

export const SET_ESIGN_SUCCESS_MODAL = "SET_ESIGN_SUCCESS_MODAL";
export interface SetEsignSuccessModal extends Action {
  type: typeof SET_ESIGN_SUCCESS_MODAL;
  esignSuccessModalShown: boolean;
}

export const GENERATE_DOCUMENTS_FAILED = "GENERATE_DOCUMENTS_FAILED";
export interface GenerateDocumentsFailed extends Action {
  type: typeof GENERATE_DOCUMENTS_FAILED;
}

export const UPLOAD_DOCUMENTS = "UPLOAD_DOCUMENTS";
export interface UploadDocuments extends Action {
  type: typeof UPLOAD_DOCUMENTS;
  applicationId: string;
  purpose: DOCUMENT_PURPOSES;
  document: File;
}

export const UPLOAD_DOCUMENT_SUCCESS = "UPLOAD_DOCUMENT_SUCCESS";
export interface UploadDocumentsSuccess extends Action {
  type: typeof UPLOAD_DOCUMENT_SUCCESS;
  document: ApplicationDocument;
}

export const UPLOAD_DOCUMENT_FAILED = "UPLOAD_DOCUMENT_FAILED";
export interface UploadDocumentsFailed extends Action {
  type: typeof UPLOAD_DOCUMENT_FAILED;
}

export const SET_UPLOAD_PROGRESS = "SET_UPLOAD_PROGRESS";
export interface SetUploadProgress extends Action {
  type: typeof SET_UPLOAD_PROGRESS;
  progress: number;
}

export const GET_GENERATED_DOCUMENTS = "GET_GENERATED_DOCUMENTS";
export interface GetGeneratedDocuments extends Action {
  type: typeof GET_GENERATED_DOCUMENTS;
  applicationId: string;
}

export const GET_GENERATED_DOCUMENTS_SUCCESS =
  "GET_GENERATED_DOCUMENTS_SUCCESS";
export interface GetGeneratedDocumentsSuccess extends Action {
  type: typeof GET_GENERATED_DOCUMENTS_SUCCESS;
  documents: ApplicationDocument[];
}

export const GET_GENERATED_DOCUMENTS_FAILED = "GET_GENERATED_DOCUMENTS_FAILED";
export interface GetGeneratedDocumentsFailed extends Action {
  type: typeof GET_GENERATED_DOCUMENTS_FAILED;
}

export const GET_UPLOADED_DOCUMENTS = "GET_UPLOADED_DOCUMENTS";
export interface GetUploadedDocuments extends Action {
  type: typeof GET_UPLOADED_DOCUMENTS;
  applicationId: string;
}

export const GET_UPLOADED_DOCUMENTS_SUCCESS = "GET_UPLOADED_DOCUMENTS_SUCCESS";
export interface GetUploadedDocumentsSuccess extends Action {
  type: typeof GET_UPLOADED_DOCUMENTS_SUCCESS;
  documents: ApplicationDocument[];
}

export const GET_UPLOADED_DOCUMENTS_FAILED = "GET_UPLOADED_DOCUMENTS_FAILED";
export interface GetUploadedDocumentsFailed extends Action {
  type: typeof GET_UPLOADED_DOCUMENTS_FAILED;
}

export const DELETE_CONTRACTS_DOCUMENT = "DELETE_CONTRACTS_DOCUMENT";
export interface DeleteContractsDocument extends Action {
  type: typeof DELETE_CONTRACTS_DOCUMENT;
  applicationId: string;
  documentId: string;
  purpose: DOCUMENT_PURPOSES;
}

export const DELETE_CONTRACTS_DOCUMENT_SUCCESS =
  "DELETE_CONTRACTS_DOCUMENT_SUCCESS";
export interface DeleteContractsDocumentSuccess extends Action {
  type: typeof DELETE_CONTRACTS_DOCUMENT_SUCCESS;
  purpose: DOCUMENT_PURPOSES;
  applicationId: string;
}

export const DELETE_CONTRACTS_DOCUMENT_FAILED =
  "DELETE_CONTRACTS_DOCUMENT_FAILED";
export interface DeleteContractsDocumentFailed extends Action {
  type: typeof DELETE_CONTRACTS_DOCUMENT_FAILED;
  purpose: DOCUMENT_PURPOSES;
}

export const SUBMIT_SETTLEMENT = "SUBMIT_SETTLEMENT";
export interface SubmitSettlement extends Action {
  type: typeof SUBMIT_SETTLEMENT;
  applicationId: string;
}

export const SUBMIT_SETTLEMENT_SUCCESS = "SUBMIT_SETTLEMENT_SUCCESS";
export interface SubmitSettlmentSuccess extends Action {
  type: typeof SUBMIT_SETTLEMENT_SUCCESS;
}

export const SUBMIT_SETTLEMENT_FAILED = "SUBMIT_SETTLEMENT_FAILED";
export interface SubmitSettlementFailed extends Action {
  type: typeof SUBMIT_SETTLEMENT_FAILED;
}

export const SET_SUBMITTED_FOR_SETTLEMENT = "SET_SUBMITTED_FOR_SETTLEMENT";
export interface SetSubmittedForSettlement extends Action {
  type: typeof SET_SUBMITTED_FOR_SETTLEMENT;
  isApplicationSubmittedForSettlement: boolean;
}

export const GET_APPROVAL_CONDITIONS = "GET_APPROVAL_CONDITIONS";
export interface GetApprovalConditions extends Action {
  type: typeof GET_APPROVAL_CONDITIONS;
  applicationId: string;
}

export const GET_APPROVAL_CONDITIONS_SUCCESS =
  "GET_APPROVAL_CONDITIONS_SUCCESS";
export interface GetApprovalConditionsSuccess extends Action {
  type: typeof GET_APPROVAL_CONDITIONS_SUCCESS;
  approvalConditionsResponse: ApprovalConditionsResponse;
}

export const GET_APPROVAL_CONDITIONS_FAILED = "GET_APPROVAL_CONDITIONS_FAILED";
export interface GetApprovalConditionsFailed extends Action {
  type: typeof GET_APPROVAL_CONDITIONS_FAILED;
}

export type ContractsActions =
  | SetSelectedTypes
  | ToggleEsignWarning
  | GenerateDocuments
  | GenerateDocumentsSuccess
  | GenerateDocumentsFailed
  | UploadDocuments
  | UploadDocumentsSuccess
  | UploadDocumentsFailed
  | SetUploadProgress
  | GetGeneratedDocuments
  | GetGeneratedDocumentsSuccess
  | SetEsignSuccessModal
  | GetGeneratedDocumentsFailed
  | GetUploadedDocuments
  | GetUploadedDocumentsSuccess
  | GetUploadedDocumentsFailed
  | DeleteContractsDocument
  | DeleteContractsDocumentSuccess
  | DeleteContractsDocumentFailed
  | SubmitSettlement
  | SubmitSettlmentSuccess
  | SubmitSettlementFailed
  | SetSubmittedForSettlement
  | GetApprovalConditions
  | GetApprovalConditionsSuccess
  | GetApprovalConditionsFailed;

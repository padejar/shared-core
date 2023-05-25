import { DOCUMENT_PURPOSES } from "../../constants/documentPurposes";
import { ApplicationDocument } from "../../types/ApplicationDocument";
import { ApprovalConditionsResponse } from "../../types/ApprovalConditionsResponse";
import * as actionTypes from "../types/contracts";

export const setSelectedTypes = (
  selectedTypes: string[]
): actionTypes.SetSelectedTypes => ({
  type: actionTypes.SET_SELECTED_TYPES,
  selectedTypes,
});

export const toggleEsignWarning = (
  showEsignWarning: boolean
): actionTypes.ToggleEsignWarning => ({
  type: actionTypes.TOGGLE_ESIGN_WARNING,
  showEsignWarning,
});

export const generateDocuments = (
  applicationId: string,
  types: string[],
  isEsign: boolean
): actionTypes.GenerateDocuments => ({
  type: actionTypes.GENERATE_DOCUMENTS,
  applicationId,
  types,
  isEsign,
});

export const generateDocumentsSuccess = (
  documents: ApplicationDocument[]
): actionTypes.GenerateDocumentsSuccess => ({
  type: actionTypes.GENERATE_DOCUMENTS_SUCCESS,
  documents,
});

export const setEsignSuccessModal = (
  esignSuccessModalShown: boolean
): actionTypes.SetEsignSuccessModal => ({
  type: actionTypes.SET_ESIGN_SUCCESS_MODAL,
  esignSuccessModalShown,
});

export const generateDocumentsFailed = (): actionTypes.GenerateDocumentsFailed => ({
  type: actionTypes.GENERATE_DOCUMENTS_FAILED,
});

export const getGeneratedDocuments = (
  applicationId: string
): actionTypes.GetGeneratedDocuments => ({
  type: actionTypes.GET_GENERATED_DOCUMENTS,
  applicationId,
});

export const uploadDocuments = (
  applicationId: string,
  purpose: DOCUMENT_PURPOSES,
  document: File
): actionTypes.UploadDocuments => ({
  type: actionTypes.UPLOAD_DOCUMENTS,
  applicationId,
  purpose,
  document,
});

export const uploadDocumentsSuccess = (
  document: ApplicationDocument
): actionTypes.UploadDocumentsSuccess => ({
  type: actionTypes.UPLOAD_DOCUMENT_SUCCESS,
  document,
});

export const uploadDocumentsFailed = (): actionTypes.UploadDocumentsFailed => ({
  type: actionTypes.UPLOAD_DOCUMENT_FAILED,
});

export const setUploadProgress = (
  progress: number
): actionTypes.SetUploadProgress => ({
  type: actionTypes.SET_UPLOAD_PROGRESS,
  progress,
});

export const getGeneratedDocumentsSuccess = (
  documents: ApplicationDocument[]
): actionTypes.GetGeneratedDocumentsSuccess => ({
  type: actionTypes.GET_GENERATED_DOCUMENTS_SUCCESS,
  documents,
});

export const getGeneratedDocumentsFailed = (): actionTypes.GetGeneratedDocumentsFailed => ({
  type: actionTypes.GET_GENERATED_DOCUMENTS_FAILED,
});

export const getUploadedDocuments = (
  applicationId: string
): actionTypes.GetUploadedDocuments => ({
  type: actionTypes.GET_UPLOADED_DOCUMENTS,
  applicationId,
});

export const getUploadedDocumentsSuccess = (
  documents: ApplicationDocument[]
): actionTypes.GetUploadedDocumentsSuccess => ({
  type: actionTypes.GET_UPLOADED_DOCUMENTS_SUCCESS,
  documents,
});

export const getUploadedDocumentsFailed = (): actionTypes.GetUploadedDocumentsFailed => ({
  type: actionTypes.GET_UPLOADED_DOCUMENTS_FAILED,
});

export const deleteContractsDocument = (
  applicationId: string,
  documentId: string,
  purpose: DOCUMENT_PURPOSES
): actionTypes.DeleteContractsDocument => ({
  type: actionTypes.DELETE_CONTRACTS_DOCUMENT,
  applicationId,
  documentId,
  purpose,
});

export const deleteDocumentsSuccess = (
  purpose: DOCUMENT_PURPOSES,
  applicationId: string
): actionTypes.DeleteContractsDocumentSuccess => ({
  type: actionTypes.DELETE_CONTRACTS_DOCUMENT_SUCCESS,
  purpose,
  applicationId,
});

export const deleteContractsDocumentFailed = (
  purpose: DOCUMENT_PURPOSES
): actionTypes.DeleteContractsDocumentFailed => ({
  type: actionTypes.DELETE_CONTRACTS_DOCUMENT_FAILED,
  purpose,
});

export const submitSettlement = (
  applicationId: string
): actionTypes.SubmitSettlement => ({
  type: actionTypes.SUBMIT_SETTLEMENT,
  applicationId,
});

export const submitSettlementSuccess = (): actionTypes.SubmitSettlmentSuccess => ({
  type: actionTypes.SUBMIT_SETTLEMENT_SUCCESS,
});

export const submitSettlementFailed = (): actionTypes.SubmitSettlementFailed => ({
  type: actionTypes.SUBMIT_SETTLEMENT_FAILED,
});

export const setSubmittedForSettlement = (
  isApplicationSubmittedForSettlement: boolean
): actionTypes.SetSubmittedForSettlement => ({
  type: actionTypes.SET_SUBMITTED_FOR_SETTLEMENT,
  isApplicationSubmittedForSettlement,
});

export const getApprovalConditions = (
  applicationId: string
): actionTypes.GetApprovalConditions => ({
  type: actionTypes.GET_APPROVAL_CONDITIONS,
  applicationId,
});

export const getApprovalConditionsSuccess = (
  approvalConditionsResponse: ApprovalConditionsResponse
): actionTypes.GetApprovalConditionsSuccess => ({
  type: actionTypes.GET_APPROVAL_CONDITIONS_SUCCESS,
  approvalConditionsResponse,
});

export const getApprovalConditionsFailed = (): actionTypes.GetApprovalConditionsFailed => ({
  type: actionTypes.GET_APPROVAL_CONDITIONS_FAILED,
});

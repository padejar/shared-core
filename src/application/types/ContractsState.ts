import { DOCUMENT_TYPES } from "../constants/documentTypes";
import { ApproverResponse } from "../types/ApproverResponse";
import { ApplicationDocument } from "./ApplicationDocument";

export interface ContractsState {
  selectedTypes: string[];
  isAllTypesChecked: boolean;
  generateLoading: boolean;
  generatedDocuments: ApplicationDocument[];
  getGeneratedDocumentsLoading: boolean;
  uploadedDocuments: ApplicationDocument[];
  getUploadedDocumentsLoading: boolean;
  eSignWarningShown: boolean;
  uploadProgress: number;
  isUploading: boolean;
  isSubmittingSettlement: boolean;
  isApplicationSubmittedForSettlement: boolean;
  esignSuccessModalShown: boolean;
  approvalConditions: string[];
  approver: ApproverResponse | null;
  approvalConditionsLoading: boolean;
}

export const contractsStateDefaultValue: ContractsState = {
  selectedTypes: [DOCUMENT_TYPES.CONTRACT_PACK],
  isAllTypesChecked: false,
  generateLoading: false,
  generatedDocuments: [],
  getGeneratedDocumentsLoading: false,
  uploadedDocuments: [],
  getUploadedDocumentsLoading: false,
  eSignWarningShown: false,
  uploadProgress: 0,
  isUploading: false,
  isSubmittingSettlement: false,
  isApplicationSubmittedForSettlement: false,
  esignSuccessModalShown: false,
  approvalConditions: [],
  approver: null,
  approvalConditionsLoading: false,
};

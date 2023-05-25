import { createSelector } from "reselect";
import { ApplicationState } from "../types/ApplicationState";
import { ContractsState } from "../types/ContractsState";

export const contractsStateSelector = (
  state: ApplicationState
): ContractsState => state.application.contracts;

export const getSelectedTypesSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.selectedTypes
);

export const getGenerateLoadingSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.generateLoading
);

export const getGeneratedDocumentsSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.generatedDocuments
);

export const getGeneratedDocumentsLoadingSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.getGeneratedDocumentsLoading
);

export const getUploadedDocumentListSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.uploadedDocuments
);

export const getUploadedDocumentsLoadingSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.getUploadedDocumentsLoading
);

export const getEsignWarningSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.eSignWarningShown
);

export const getSubmitSettlementLoading = createSelector(
  contractsStateSelector,
  (contracts) => contracts.isSubmittingSettlement
);

export const getIsUploadingSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.isUploading
);

export const getUploadProgressSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.uploadProgress
);
export const getisApplicationSubmittedForSettlementSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.isApplicationSubmittedForSettlement
);

export const getEsignSuccessModalShownSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.esignSuccessModalShown
);

export const getApprovalConditionsSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.approvalConditions
);

export const getApproverSelector = createSelector(
  contractsStateSelector,
  (contracts) => contracts.approver
);

export const getApprovalConditionsLoading = createSelector(
  contractsStateSelector,
  (contracts) => contracts.approvalConditionsLoading
);

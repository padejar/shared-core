import { ContractsActions } from "../actions/types/contracts";
import * as actionTypes from "../actions/types/contracts";
import { DOCUMENT_PURPOSES } from "../constants/documentPurposes";
import { DOCUMENT_TYPES } from "../constants/documentTypes";
import {
  ContractsState,
  contractsStateDefaultValue,
} from "../types/ContractsState";

export const contractState: ContractsState = contractsStateDefaultValue;

export const reducer = (
  state: ContractsState = contractState,
  action: ContractsActions
): ContractsState => {
  switch (action.type) {
    case actionTypes.SET_SELECTED_TYPES: {
      const allTypes = Object.keys(DOCUMENT_TYPES);
      let isAllTypesChecked = false;
      if (allTypes.length === action.selectedTypes.length)
        isAllTypesChecked = true;
      return {
        ...state,
        selectedTypes: action.selectedTypes,
        isAllTypesChecked,
      };
    }
    case actionTypes.TOGGLE_ESIGN_WARNING: {
      return {
        ...state,
        eSignWarningShown: action.showEsignWarning,
      };
    }
    case actionTypes.GENERATE_DOCUMENTS: {
      return {
        ...state,
        generateLoading: true,
      };
    }
    case actionTypes.GENERATE_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        generateLoading: false,
      };
    }
    case actionTypes.SET_ESIGN_SUCCESS_MODAL: {
      return {
        ...state,
        esignSuccessModalShown: action.esignSuccessModalShown,
      };
    }
    case actionTypes.GENERATE_DOCUMENTS_FAILED: {
      return {
        ...state,
        generateLoading: false,
      };
    }
    case actionTypes.GET_GENERATED_DOCUMENTS: {
      return {
        ...state,
        getGeneratedDocumentsLoading: true,
      };
    }
    case actionTypes.UPLOAD_DOCUMENTS: {
      return {
        ...state,
        isUploading: true,
        uploadProgress: 0,
      };
    }
    case actionTypes.UPLOAD_DOCUMENT_SUCCESS: {
      const uploadedDocuments = [...state.uploadedDocuments, action.document];
      return {
        ...state,
        uploadedDocuments,
        isUploading: false,
      };
    }
    case actionTypes.UPLOAD_DOCUMENT_FAILED: {
      return {
        ...state,
        isUploading: false,
      };
    }
    case actionTypes.SET_UPLOAD_PROGRESS: {
      return {
        ...state,
        uploadProgress: action.progress,
      };
    }
    case actionTypes.GET_GENERATED_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        generatedDocuments: action.documents,
        getGeneratedDocumentsLoading: false,
      };
    }
    case actionTypes.GET_GENERATED_DOCUMENTS_FAILED: {
      return {
        ...state,
        getGeneratedDocumentsLoading: false,
      };
    }
    case actionTypes.GET_UPLOADED_DOCUMENTS: {
      return {
        ...state,
        getUploadedDocumentsLoading: true,
      };
    }
    case actionTypes.GET_UPLOADED_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        uploadedDocuments: action.documents,
        getUploadedDocumentsLoading: false,
      };
    }
    case actionTypes.GET_UPLOADED_DOCUMENTS_FAILED: {
      return {
        ...state,
        getUploadedDocumentsLoading: false,
      };
    }
    case actionTypes.DELETE_CONTRACTS_DOCUMENT: {
      if (action.purpose === DOCUMENT_PURPOSES.GENERATED) {
        let generatedDocuments = [...state.generatedDocuments];
        generatedDocuments = generatedDocuments.filter(
          (document) => document.id !== action.documentId
        );

        return {
          ...state,
          generatedDocuments,
        };
      }

      let uploadedDocuments = [...state.uploadedDocuments];
      uploadedDocuments = uploadedDocuments.filter(
        (document) => document.id !== action.documentId
      );

      return {
        ...state,
        uploadedDocuments,
      };
    }
    case actionTypes.SUBMIT_SETTLEMENT: {
      return {
        ...state,
        isSubmittingSettlement: true,
      };
    }
    case actionTypes.SUBMIT_SETTLEMENT_SUCCESS: {
      return {
        ...state,
        isSubmittingSettlement: false,
        isApplicationSubmittedForSettlement: true,
      };
    }
    case actionTypes.SUBMIT_SETTLEMENT_FAILED: {
      return {
        ...state,
        isSubmittingSettlement: false,
      };
    }
    case actionTypes.SET_SUBMITTED_FOR_SETTLEMENT: {
      return {
        ...state,
        isApplicationSubmittedForSettlement: false,
      };
    }
    case actionTypes.GET_APPROVAL_CONDITIONS: {
      return {
        ...state,
        approvalConditionsLoading: true,
      };
    }
    case actionTypes.GET_APPROVAL_CONDITIONS_SUCCESS: {
      return {
        ...state,
        approvalConditionsLoading: false,
        approvalConditions: action.approvalConditionsResponse.conditions.map(
          (approvalCondition) => approvalCondition.condition
        ),
        approver: action.approvalConditionsResponse.approver,
      };
    }
    case actionTypes.GET_APPROVAL_CONDITIONS_FAILED: {
      return {
        ...state,
        approvalConditionsLoading: false,
      };
    }
    default: {
      return state;
    }
  }
};

import {
  DELETE_DOCUMENT_SUCCESS,
  DocumentActions,
  GET_DOCUMENT_LIST,
  GET_DOCUMENT_LIST_FAILED,
  GET_DOCUMENT_LIST_SUCCESS,
  SET_UPLOAD_PROGRESS,
  UPLOAD_DOCUMENT,
  UPLOAD_DOCUMENT_FAILED,
  UPLOAD_DOCUMENT_SUCCESS,
} from "../actions/types/documentForm";
import { DocumentFormState } from "../types/DocumentFormState";

const documentFormState: DocumentFormState = {
  getDocumentsLoading: false,
  isUploading: false,
  documentList: [],
  uploadProgress: 0,
};

export const reducer = (
  state: DocumentFormState = documentFormState,
  action: DocumentActions
): DocumentFormState => {
  switch (action.type) {
    case GET_DOCUMENT_LIST: {
      return {
        ...state,
        getDocumentsLoading: true,
      };
    }
    case GET_DOCUMENT_LIST_SUCCESS: {
      return {
        ...state,
        getDocumentsLoading: false,
        documentList: action.documentList,
      };
    }
    case GET_DOCUMENT_LIST_FAILED: {
      return {
        ...state,
        getDocumentsLoading: false,
      };
    }
    case UPLOAD_DOCUMENT: {
      return {
        ...state,
        isUploading: true,
        uploadProgress: 0,
      };
    }
    case SET_UPLOAD_PROGRESS: {
      return {
        ...state,
        uploadProgress: action.progress,
      };
    }
    case UPLOAD_DOCUMENT_SUCCESS: {
      const documentList = [...state.documentList, action.document];
      return {
        ...state,
        isUploading: false,
        documentList,
      };
    }
    case UPLOAD_DOCUMENT_FAILED: {
      return {
        ...state,
        isUploading: false,
      };
    }
    case DELETE_DOCUMENT_SUCCESS: {
      let documentList = [...state.documentList];
      documentList = documentList.filter(
        (document) => document.id !== action.documentId
      );
      return {
        ...state,
        documentList,
      };
    }
    default: {
      return state;
    }
  }
};

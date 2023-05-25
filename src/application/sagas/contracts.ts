import { EventChannel } from "@redux-saga/core";
import { AxiosError } from "axios";
import {
  put,
  call,
  ForkEffect,
  takeLatest,
  take,
  takeEvery,
  select,
} from "redux-saga/effects";
import { ListResponse } from "../../common/types/ListResponse";
import { SingleResponse } from "../../common/types/SingleResponse";
import { isObjectNotEmpty } from "../../common/utils/object";
import { clearErrors } from "../../error-handler";
import { processErrorMessage } from "../../error-handler/utils";
import DocumentService from "../../files/services/DocumentService";
import { createUploadFileChannel } from "../../files/utils/document";
import { actionCreator } from "../../notification";
import {
  getApplicationDetails,
  setContractGenerationErrors,
} from "../actions/creators/applicationForm";
import * as actionCreators from "../actions/creators/contracts";
import * as actionTypes from "../actions/types/contracts";
import { DOCUMENT_PURPOSES } from "../constants/documentPurposes";
import { NOTIFICATION_IDS } from "../constants/notificationIds";
import { getApplicationSecuritySelector } from "../selectors/applicationForm";
import { getSelectedTypesSelector } from "../selectors/contracts";
import ApplicationDocumentService from "../services/ApplicationDocumentService";
import ApplicationService from "../services/ApplicationService";
import { ApplicationDocument } from "../types/ApplicationDocument";
import { ApprovalConditionsResponse } from "../types/ApprovalConditionsResponse";
import { SecurityResponse } from "../types/SecurityResponse";
import { UploadChannelEmittedData } from "../types/UploadChannelEmittedData";
function* getGeneratedDocumentsWorker({
  applicationId,
}: actionTypes.GenerateDocuments) {
  try {
    yield put(
      actionCreator.unsetNotification(NOTIFICATION_IDS.GET_DOCUMENTS_ERROR)
    );
    const documents: ListResponse<ApplicationDocument> = yield call(
      DocumentService.getDocumentList,
      `/application/applications/${applicationId}/documents?purposes=${DOCUMENT_PURPOSES.GENERATED}&purposes=${DOCUMENT_PURPOSES.GENERATED_ESIGN}`
    );
    yield put(actionCreators.getGeneratedDocumentsSuccess(documents.data));
  } catch (e) {
    const error = e as AxiosError;
    const body = processErrorMessage(error);
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.GET_DOCUMENTS_ERROR,
        body,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.getGeneratedDocumentsFailed());
  }
}

function* getUploadedDocumentsWorker({
  applicationId,
}: actionTypes.GetUploadedDocuments) {
  try {
    yield put(
      actionCreator.unsetNotification(NOTIFICATION_IDS.GET_DOCUMENTS_ERROR)
    );
    const documents: ListResponse<ApplicationDocument> = yield call(
      DocumentService.getDocumentList,
      `/application/applications/${applicationId}/documents?purposes=${DOCUMENT_PURPOSES.SETTLEMENT_DOCUMENT}`
    );
    yield put(actionCreators.getUploadedDocumentsSuccess(documents.data));
  } catch (e) {
    const error = e as AxiosError;
    const body = processErrorMessage(error);
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.GET_DOCUMENTS_ERROR,
        body,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.getUploadedDocumentsFailed());
  }
}

function* validateSecurity(security: SecurityResponse | null) {
  if (!security) return false;

  if (security !== null) {
    let contractsGenerationErrors: Record<string, string> = {};
    if (!security.serialNumber) {
      contractsGenerationErrors = {
        serialNumber: "Vin / serial# is required for contracts generation",
      };
    }
    if (!security.supplierName) {
      contractsGenerationErrors = {
        ...contractsGenerationErrors,
        supplierName: "Supplier name is required for contracts generation",
      };
    }
    if (isObjectNotEmpty(contractsGenerationErrors)) {
      yield put(setContractGenerationErrors(contractsGenerationErrors));
      return false;
    }
  }

  return true;
}

function* validateContractsGeneration() {
  yield put(clearErrors());
  const applicationSecurity: SecurityResponse | null = yield select(
    getApplicationSecuritySelector
  );

  const isSecurityValid: boolean = yield call(
    validateSecurity,
    applicationSecurity
  );

  if (!isSecurityValid) {
    return {
      isValid: false,
      message:
        "Please complete Vin / serial# and supplier name on the security screen",
    };
  }

  const selectedTypes: string[] = yield select(getSelectedTypesSelector);

  if (selectedTypes.length <= 0) {
    return {
      isValid: false,
      message: "You need to select at least 1 type of document.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
}

function* generateDocumentsWorker({
  applicationId,
  types,
  isEsign,
}: actionTypes.GenerateDocuments) {
  yield put(actionCreators.toggleEsignWarning(false));
  const validateContractsGenerationResult: {
    isValid: boolean;
    message: string;
  } = yield call(validateContractsGeneration);

  if (validateContractsGenerationResult.isValid) {
    try {
      clearErrors();

      const documents: ListResponse<ApplicationDocument> = yield call(
        ApplicationDocumentService.generateDocuments,
        applicationId,
        types,
        isEsign
      );
      yield put(actionCreators.generateDocumentsSuccess(documents.data));
      if (isEsign) yield put(actionCreators.setEsignSuccessModal(true));
      yield put(actionCreators.getGeneratedDocuments(applicationId));
    } catch (e) {
      const error = e as AxiosError;
      const body = processErrorMessage(error);
      yield put(
        actionCreator.setNotification({
          id: NOTIFICATION_IDS.CONTRACT_GENERATION_ERRORS,
          body,
          className: "qst-notif-danger",
        })
      );
      yield put(actionCreators.generateDocumentsFailed());
    }
  } else {
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.CONTRACT_GENERATION_ERRORS,
        body: validateContractsGenerationResult.message,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.generateDocumentsFailed());
  }
}

function* deleteDocumentWorker({
  applicationId,
  documentId,
  purpose,
}: actionTypes.DeleteContractsDocument) {
  try {
    yield put(
      actionCreator.unsetNotification(NOTIFICATION_IDS.DELETE_DOCUMENT_ERROR)
    );
    yield call(
      DocumentService.deleteDocument,
      `/application/applications/${applicationId}/documents/${documentId}`
    );
    yield put(actionCreators.deleteDocumentsSuccess(purpose, applicationId));
  } catch (e) {
    const error = e as AxiosError;
    const body = processErrorMessage(error);
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.DELETE_DOCUMENT_ERROR,
        body,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.deleteContractsDocumentFailed(purpose));
  }
}

function* deletDocumentSuccessWorker({
  purpose,
  applicationId,
}: actionTypes.DeleteContractsDocumentSuccess) {
  if (purpose === DOCUMENT_PURPOSES.GENERATED) {
    yield put(actionCreators.getGeneratedDocuments(applicationId));
  } else {
    yield put(actionCreators.getUploadedDocuments(applicationId));
  }
}

function* uploadDocumentsWorker({
  document,
  applicationId,
  purpose,
}: actionTypes.UploadDocuments) {
  const uploadChannel: EventChannel<UploadChannelEmittedData> = yield call(
    createUploadFileChannel,
    `/application/applications/${applicationId}/documents/upload`,
    {
      document,
      purpose,
    }
  );
  try {
    while (true) {
      const {
        progress = 0,
        result,
        error,
      }: UploadChannelEmittedData = yield take(uploadChannel);
      if (progress) {
        yield put(actionCreators.setUploadProgress(progress));
      }
      if (result) {
        yield put(actionCreators.uploadDocumentsSuccess(result.data));
      }
      if (error) {
        throw error;
      }
    }
  } catch (e) {
    const error = e as AxiosError;
    const body = processErrorMessage(error);
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.UPLOAD_DOCUMENT_ERROR,
        body,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.uploadDocumentsFailed());
  }
}

function* submitSettlementWorker({
  applicationId,
}: actionTypes.SubmitSettlement) {
  try {
    yield put(
      actionCreator.unsetNotification(NOTIFICATION_IDS.SUBMIT_SETTLEMENT_ERROR)
    );
    yield call(ApplicationService.submitSettlement, applicationId);
    yield put(actionCreators.submitSettlementSuccess());
    yield put(getApplicationDetails(applicationId));
  } catch (e) {
    const error = e as AxiosError;
    const body = processErrorMessage(error);
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.SUBMIT_SETTLEMENT_ERROR,
        body,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.submitSettlementFailed());
  }
}

function* getApprovalConditionsWorker({
  applicationId,
}: actionTypes.GetApprovalConditions) {
  try {
    yield put(
      actionCreator.unsetNotification(
        NOTIFICATION_IDS.GET_APPROVAL_CONDITION_ERROR
      )
    );
    const result: SingleResponse<ApprovalConditionsResponse> = yield call(
      ApplicationService.getApprovalConditions,
      applicationId
    );
    yield put(actionCreators.getApprovalConditionsSuccess(result.data));
  } catch (e) {
    const error = e as AxiosError;
    const body = processErrorMessage(error);
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.GET_APPROVAL_CONDITION_ERROR,
        body,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.getApprovalConditionsFailed());
  }
}

function* watchContracts(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest(
    actionTypes.GET_GENERATED_DOCUMENTS,
    getGeneratedDocumentsWorker
  );
  yield takeLatest(
    actionTypes.GET_UPLOADED_DOCUMENTS,
    getUploadedDocumentsWorker
  );
  yield takeLatest(actionTypes.GENERATE_DOCUMENTS, generateDocumentsWorker);
  yield takeLatest(actionTypes.DELETE_CONTRACTS_DOCUMENT, deleteDocumentWorker);
  yield takeLatest(
    actionTypes.DELETE_CONTRACTS_DOCUMENT_SUCCESS,
    deletDocumentSuccessWorker
  );
  yield takeEvery(actionTypes.UPLOAD_DOCUMENTS, uploadDocumentsWorker);
  yield takeLatest(actionTypes.SUBMIT_SETTLEMENT, submitSettlementWorker);
  yield takeLatest(
    actionTypes.GET_APPROVAL_CONDITIONS,
    getApprovalConditionsWorker
  );
}

export default watchContracts;

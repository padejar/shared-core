import { EventChannel } from "@redux-saga/core";
import {
  call,
  ForkEffect,
  put,
  take,
  takeEvery,
  takeLatest,
} from "@redux-saga/core/effects";
import { AxiosError } from "axios";
import { ListResponse } from "../../common/types/ListResponse";
import { processErrorMessage } from "../../error-handler/utils";
import DocumentService from "../../files/services/DocumentService";
import { createUploadFileChannel } from "../../files/utils/document";
import { actionCreator } from "../../notification";
import {
  deleteDocumentSuccess,
  getDocumentListFailed,
  getDocumentListSuccess,
  setUploadProgress,
  uploadDocumentFailed,
  uploadDocumentSuccess,
} from "../actions/creators/documentForm";
import {
  DeleteDocument,
  DELETE_DOCUMENT,
  GetDocumentList,
  GET_DOCUMENT_LIST,
  UploadDocument,
  UPLOAD_DOCUMENT,
} from "../actions/types/documentForm";
import { NOTIFICATION_IDS } from "../constants/notificationIds";
import { ApplicationDocument } from "../types/ApplicationDocument";
import { UploadChannelEmittedData } from "../types/UploadChannelEmittedData";

function* getDocumentListWorker({ applicationId, purpose }: GetDocumentList) {
  try {
    yield put(
      actionCreator.unsetNotification(NOTIFICATION_IDS.GET_DOCUMENTS_ERROR)
    );
    const result: ListResponse<ApplicationDocument> = yield call(
      DocumentService.getDocumentList,
      `/application/applications/${applicationId}/documents?purposes=${purpose}`
    );
    yield put(getDocumentListSuccess(result.data));
  } catch (error) {
    const body = processErrorMessage(error as AxiosError);
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.GET_DOCUMENTS_ERROR,
        body,
        className: "qst-notif-danger",
      })
    );
    yield put(getDocumentListFailed());
  }
}

function* uploadDocumentWorker({
  document,
  applicationId,
  purpose,
}: UploadDocument) {
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
      const { progress, result, error }: UploadChannelEmittedData = yield take(
        uploadChannel
      );
      if (progress) {
        yield put(setUploadProgress(progress));
      }
      if (result) {
        yield put(uploadDocumentSuccess(result.data));
      }
      if (error) {
        throw error;
      }
    }
  } catch (error) {
    const body = processErrorMessage(error as AxiosError);
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.UPLOAD_DOCUMENT_ERROR,
        body,
        className: "qst-notif-danger",
      })
    );
    yield put(uploadDocumentFailed());
  }
}

function* deleteDocumentWorker({ applicationId, documentId }: DeleteDocument) {
  try {
    yield put(
      actionCreator.unsetNotification(NOTIFICATION_IDS.DELETE_DOCUMENT_ERROR)
    );
    yield call(
      DocumentService.deleteDocument,
      `/application/applications/${applicationId}/documents/${documentId}`
    );
    yield put(deleteDocumentSuccess(documentId, applicationId));
  } catch (error) {
    const body = processErrorMessage(error as AxiosError);
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.DELETE_DOCUMENT_ERROR,
        body,
        className: "qst-notif-danger",
      })
    );
  }
}

function* watchDocumentForm(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest(GET_DOCUMENT_LIST, getDocumentListWorker);
  yield takeEvery(UPLOAD_DOCUMENT, uploadDocumentWorker);
  yield takeLatest(DELETE_DOCUMENT, deleteDocumentWorker);
}

export default watchDocumentForm;

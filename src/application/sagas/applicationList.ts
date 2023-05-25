import { AxiosError } from "axios";
import { put, call, takeEvery, ForkEffect } from "redux-saga/effects";
import { ListResponse } from "../../common/types/ListResponse";
import { processErrorMessage } from "../../error-handler/utils";
import { actionCreator as notifAction } from "../../notification";
import {
  getApplicationListError,
  getApplicationListSuccess,
} from "../actions/creators/applicationList";
import {
  GetApplicationList,
  GET_APPLICATION_LIST,
} from "../actions/types/applicationList";
import ApplicationService from "../services/ApplicationService";
import { ApplicationResponse } from "../types/ApplicationResponse";

function* getApplicationListWorker({ payload }: GetApplicationList) {
  try {
    const applications: ListResponse<ApplicationResponse> = yield call(
      ApplicationService.getApplicationList,
      payload
    );
    yield put(getApplicationListSuccess(applications));
  } catch (e) {
    const apiError = e as AxiosError;
    const message = processErrorMessage(apiError);

    yield put(
      notifAction.setNotification({
        id: "APPLICATION_LIST_ERROR",
        body: message,
        className: "qst-notif-danger",
        toast: true,
      })
    );
    yield put(getApplicationListError());
  }
}

function* watchApplicationList(): Generator<ForkEffect<never>, void, unknown> {
  yield takeEvery(GET_APPLICATION_LIST, getApplicationListWorker);
}

export default watchApplicationList;

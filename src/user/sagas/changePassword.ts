import { call, ForkEffect, put, takeLatest } from "@redux-saga/core/effects";
import { AxiosError } from "axios";
import { processErrorMessage } from "../../error-handler/utils";
import { actionCreator } from "../../notification";
import {
  changePasswordSuccess,
  setIsLoading,
} from "../actions/creators/changePassword";
import {
  ChangePasswordRequest,
  CHANGE_PASSWORD_REQUEST,
} from "../actions/types/changePassword";
import { NOTIFICATION_IDS } from "../constants/notificationIds";
import UserService from "../services/UserService";

function* changePasswordWorker({ changePassword }: ChangePasswordRequest) {
  try {
    yield call(UserService.changePassword, changePassword);
    yield put(changePasswordSuccess());
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.CHANGE_PASSWORD,
        body: "Password successfully changed!",
        className: "qst-notif-success",
      })
    );
  } catch (e) {
    const body = processErrorMessage(e as AxiosError);
    yield put(
      actionCreator.setNotification({
        id: NOTIFICATION_IDS.CHANGE_PASSWORD,
        body,
        className: "qst-notif-danger",
      })
    );
    yield put;
    yield put(setIsLoading(false));
  }
}

function* watchChangePassword(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest(CHANGE_PASSWORD_REQUEST, changePasswordWorker);
}

export default watchChangePassword;

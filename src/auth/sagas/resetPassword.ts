import { call, ForkEffect, put, takeLatest } from "@redux-saga/core/effects";
import { AxiosError } from "axios";
import { processErrorMessage } from "../../error-handler/utils";
import { actionCreator as notifAction } from "../../notification";
import { setIsFormLoading } from "../actions/creators/authentication";
import {
  sendResetLinkSuccess,
  updatePasswordSuccess,
} from "../actions/creators/resetPassword";
import {
  SendResetLink,
  SEND_RESET_LINK,
  UpdatePassword,
  UPDATE_PASSWORD,
} from "../actions/types/resetPassword";
import { NOTIFICATION_IDS } from "../constants/notificationIds";
import AuthService from "../services/AuthService";
import { ResetPasswordRequest } from "../types/ResetPasswordRequest";
import { UpdatePasswordRequest } from "../types/UpdatePassword";

function* sendResetLinkWorker({ email, source }: SendResetLink) {
  try {
    const resetPasswordRequest: ResetPasswordRequest = {
      email,
      source,
    };
    yield call(AuthService.resetPasswordRequest, resetPasswordRequest);
    yield put(sendResetLinkSuccess());
  } catch (e) {
    const apiError = e as AxiosError;
    const message = processErrorMessage(apiError);

    yield put(
      notifAction.setNotification({
        id: NOTIFICATION_IDS.RESET_PASSWORD,
        body: message,
        className: "qst-notif-danger",
        toast: true,
      })
    );
  } finally {
    yield put(setIsFormLoading(false));
  }
}

function* updatePasswordWorker({ newPassword, code }: UpdatePassword) {
  try {
    const updatePasswordRequest: UpdatePasswordRequest = {
      newPassword,
      code,
    };
    yield call(AuthService.updatePassword, updatePasswordRequest);
    yield put(updatePasswordSuccess());
  } catch (e) {
    const apiError = e as AxiosError;
    const message = processErrorMessage(apiError);

    yield put(
      notifAction.setNotification({
        id: NOTIFICATION_IDS.RESET_PASSWORD,
        body: message,
        className: "qst-notif-danger",
        toast: true,
      })
    );
  } finally {
    yield put(setIsFormLoading(false));
  }
}

function* watchResetPassword(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest(SEND_RESET_LINK, sendResetLinkWorker);
  yield takeLatest(UPDATE_PASSWORD, updatePasswordWorker);
}

export default watchResetPassword;

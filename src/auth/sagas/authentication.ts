import { call, ForkEffect, put, takeLatest } from "@redux-saga/core/effects";
import { AxiosError } from "axios";
import { HTTP_STATUS_CODES } from "../../common/constants/httpStatusCodes";
import { SingleResponse } from "../../common/types/SingleResponse";
import { DEFAULT_ERROR_MESSAGE } from "../../error-handler";
import { processErrorMessage } from "../../error-handler/utils";
import { actionCreator as notifAction } from "../../notification";
import {
  authenticateSuccess,
  checkAuthState,
  logout,
  refreshTokenFailed,
  refreshTokenSuccess,
  setIsFormLoading,
  setRefreshTokenExpiry,
  setUserData,
  updateAuthForm,
} from "../actions/creators/authentication";
import {
  Authenticate,
  AUTHENTICATE,
  AuthenticateSuccess,
  AUTHENTICATE_SUCCESS,
  CHECK_AUTH_STATE,
  LOGOUT,
  RefreshTokenSuccess,
  REFRESH_TOKEN,
  REFRESH_TOKEN_SUCCESS,
} from "../actions/types/authentication";
import { NOTIFICATION_IDS } from "../constants/notificationIds";
import AuthService from "../services/AuthService";
import { AuthenticateRequest } from "../types/AuthenticateRequest";
import { authenticationFormDefaultValue } from "../types/AuthenticationForm";
import { TokenResponse } from "../types/TokenResponse";
import {
  deleteTokens,
  getRefreshToken,
  refreshTokens,
  storeTokens,
  decodeJwtToken,
} from "../utils";

function* authenticateWorker({ authForm, source }: Authenticate) {
  try {
    const authRequest: AuthenticateRequest = {
      ...authForm,
      source,
    };
    const result: SingleResponse<TokenResponse> = yield call(
      AuthService.authenticate,
      authRequest
    );
    yield put(authenticateSuccess(result.data));
    yield put(updateAuthForm(authenticationFormDefaultValue));
  } catch (e) {
    const apiError = e as AxiosError;
    let message = processErrorMessage(apiError);

    if (apiError.response?.status === HTTP_STATUS_CODES.FORBIDDEN) {
      message = apiError.response.data.errorCode;
    }

    yield put(
      notifAction.setNotification({
        id: NOTIFICATION_IDS.AUTHENTICATION,
        body: message,
        className: "qst-notif-danger",
        toast: false,
      })
    );
  } finally {
    yield put(setIsFormLoading(false));
  }
}

function* authenticateSuccessWorker({ tokenResponse }: AuthenticateSuccess) {
  try {
    const tokenData = decodeJwtToken(tokenResponse.accessToken);
    if (!tokenData) {
      throw new Error("Empty token data");
    }

    storeTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
    yield put(setUserData(tokenData.data));
    yield put(setRefreshTokenExpiry(tokenData.exp));
  } catch (e) {
    yield put(
      notifAction.setNotification({
        body: DEFAULT_ERROR_MESSAGE,
        className: "qst-notif-danger",
      })
    );
  }
}

function* logoutWorker() {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) yield call(AuthService.logout, refreshToken);
    deleteTokens();
  } catch (e) {
    // do nothing
  }
}

function* checkAuthStateWorker() {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    const tokenData = decodeJwtToken(refreshToken);
    if (tokenData) {
      const currentDate = new Date();
      const currentTime = currentDate.getTime() / 1000;
      if (tokenData.exp > currentTime) {
        yield put(setUserData(tokenData.data));
        yield put(setRefreshTokenExpiry(tokenData.exp));
        return;
      }
    }
  }

  yield put(logout());
}

function* refreshTokenWorker() {
  try {
    const refreshToken = getRefreshToken();
    const result: SingleResponse<TokenResponse> = yield call(
      refreshTokens,
      refreshToken
    );
    yield put(refreshTokenSuccess(result.data));
  } catch (error) {
    yield put(refreshTokenFailed());
    yield put(
      notifAction.setNotification({
        body: DEFAULT_ERROR_MESSAGE,
        className: "qst-notif-danger",
      })
    );
  }
}

function* refreshTokenSuccessWorker({ tokens }: RefreshTokenSuccess) {
  try {
    const tokenData = decodeJwtToken(tokens.accessToken);
    if (!tokenData) {
      throw new Error("Empty token data");
    }

    storeTokens(tokens.accessToken, tokens.refreshToken);
    yield put(setUserData(tokenData.data));
    yield put(setRefreshTokenExpiry(tokenData.exp));
    yield put(checkAuthState());
  } catch (error) {
    yield put(
      notifAction.setNotification({
        body: DEFAULT_ERROR_MESSAGE,
        className: "qst-notif-danger",
      })
    );
  }
}

function* watchAuthentication(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest(AUTHENTICATE, authenticateWorker);
  yield takeLatest(AUTHENTICATE_SUCCESS, authenticateSuccessWorker);
  yield takeLatest(LOGOUT, logoutWorker);
  yield takeLatest(CHECK_AUTH_STATE, checkAuthStateWorker);
  yield takeLatest(REFRESH_TOKEN, refreshTokenWorker);
  yield takeLatest(REFRESH_TOKEN_SUCCESS, refreshTokenSuccessWorker);
}

export default watchAuthentication;

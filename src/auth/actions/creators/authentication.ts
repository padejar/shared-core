import { PERMISSION_ACCESS_TYPES } from "../../../common/constants/permissionAccessTypes";
import { AuthenticationForm } from "../../types/AuthenticationForm";
import { TokenResponse } from "../../types/TokenResponse";
import { UserData } from "../../types/UserData";
import {
  AUTHENTICATE,
  Authenticate,
  AuthenticateSuccess,
  AUTHENTICATE_SUCCESS,
  CheckAuthState,
  CHECK_AUTH_STATE,
  LOGOUT,
  Logout,
  RefreshToken,
  RefreshTokenFailed,
  RefreshTokenSuccess,
  REFRESH_TOKEN,
  REFRESH_TOKEN_FAILED,
  REFRESH_TOKEN_SUCCESS,
  SetIsFormLoading,
  SetIsTokenExpiring,
  SetRefreshTokenExpiry,
  SetUserData,
  SET_IS_FORM_LOADING,
  SET_IS_TOKEN_EXPIRING,
  SET_REFRESH_TOKEN_EXPIRY,
  SET_USER_DATA,
  UpdateAuthForm,
  UPDATE_AUTH_FORM,
} from "../types/authentication";

export const updateAuthForm = (
  authenticationForm: Partial<AuthenticationForm>
): UpdateAuthForm => ({
  type: UPDATE_AUTH_FORM,
  authenticationForm,
});

export const authenticate = (
  authForm: AuthenticationForm,
  source: PERMISSION_ACCESS_TYPES
): Authenticate => ({
  type: AUTHENTICATE,
  authForm,
  source,
});

export const refreshToken = (): RefreshToken => ({
  type: REFRESH_TOKEN,
});

export const refreshTokenSuccess = (
  tokens: TokenResponse
): RefreshTokenSuccess => ({
  type: REFRESH_TOKEN_SUCCESS,
  tokens,
});

export const refreshTokenFailed = (): RefreshTokenFailed => ({
  type: REFRESH_TOKEN_FAILED,
});

export const authenticateSuccess = (
  tokenResponse: TokenResponse
): AuthenticateSuccess => ({
  type: AUTHENTICATE_SUCCESS,
  tokenResponse,
});

export const setUserData = (userData: UserData | null): SetUserData => ({
  type: SET_USER_DATA,
  userData,
});

export const setIsFormLoading = (isFormLoading: boolean): SetIsFormLoading => ({
  type: SET_IS_FORM_LOADING,
  isFormLoading,
});

export const setRefreshTokenExpiry = (
  expiryTime: number
): SetRefreshTokenExpiry => ({
  type: SET_REFRESH_TOKEN_EXPIRY,
  expiryTime,
});

export const setIsTokenExpiring = (
  isTokenExpiring: boolean
): SetIsTokenExpiring => ({
  type: SET_IS_TOKEN_EXPIRING,
  isTokenExpiring,
});

export const checkAuthState = (): CheckAuthState => ({
  type: CHECK_AUTH_STATE,
});

export const logout = (): Logout => ({
  type: LOGOUT,
});

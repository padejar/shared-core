import { Action } from "redux";
import { PERMISSION_ACCESS_TYPES } from "../../../common/constants/permissionAccessTypes";
import { AuthenticationForm } from "../../types/AuthenticationForm";
import { TokenResponse } from "../../types/TokenResponse";
import { UserData } from "../../types/UserData";

export const UPDATE_AUTH_FORM = "UPDATE_AUTH_FORM";
export interface UpdateAuthForm extends Action {
  type: typeof UPDATE_AUTH_FORM;
  authenticationForm: Partial<AuthenticationForm>;
}

export const AUTHENTICATE = "AUTHENTICATE";
export interface Authenticate extends Action {
  type: typeof AUTHENTICATE;
  authForm: AuthenticationForm;
  source: PERMISSION_ACCESS_TYPES;
}

export const AUTHENTICATE_SUCCESS = "AUTHENTICATE_SUCCESS";
export interface AuthenticateSuccess extends Action {
  type: typeof AUTHENTICATE_SUCCESS;
  tokenResponse: TokenResponse;
}

export const REFRESH_TOKEN = "REFRESH_TOKEN";
export interface RefreshToken extends Action {
  type: typeof REFRESH_TOKEN;
}

export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";
export interface RefreshTokenSuccess extends Action {
  type: typeof REFRESH_TOKEN_SUCCESS;
  tokens: TokenResponse;
}

export const REFRESH_TOKEN_FAILED = "REFRESH_TOKEN_FAILED";
export interface RefreshTokenFailed extends Action {
  type: typeof REFRESH_TOKEN_FAILED;
}

export const SET_USER_DATA = "SET_USER_DATA";
export interface SetUserData extends Action {
  type: typeof SET_USER_DATA;
  userData: UserData | null;
}

export const SET_IS_FORM_LOADING = "SET_IS_FORM_LOADING";
export interface SetIsFormLoading extends Action {
  type: typeof SET_IS_FORM_LOADING;
  isFormLoading: boolean;
}

export const SET_REFRESH_TOKEN_EXPIRY = "SET_REFRESH_TOKEN_EXPIRY";
export interface SetRefreshTokenExpiry extends Action {
  type: typeof SET_REFRESH_TOKEN_EXPIRY;
  expiryTime: number;
}

export const SET_IS_TOKEN_EXPIRING = "SET_IS_TOKEN_EXPIRING";
export interface SetIsTokenExpiring extends Action {
  type: typeof SET_IS_TOKEN_EXPIRING;
  isTokenExpiring: boolean;
}

export const LOGOUT = "LOGOUT";
export interface Logout extends Action {
  type: typeof LOGOUT;
}

export const CHECK_AUTH_STATE = "CHECK_AUTH_STATE";
export interface CheckAuthState extends Action {
  type: typeof CHECK_AUTH_STATE;
}

export type AuthenticateActions =
  | UpdateAuthForm
  | Authenticate
  | RefreshToken
  | RefreshTokenSuccess
  | RefreshTokenFailed
  | AuthenticateSuccess
  | SetIsFormLoading
  | SetUserData
  | Logout
  | CheckAuthState
  | SetRefreshTokenExpiry
  | SetIsTokenExpiring;

import { Action } from "redux";
import { PERMISSION_ACCESS_TYPES } from "../../../common/constants/permissionAccessTypes";

export const SEND_RESET_LINK = "SEND_RESET_LINK";
export interface SendResetLink extends Action {
  type: typeof SEND_RESET_LINK;
  email: string;
  source: PERMISSION_ACCESS_TYPES;
}

export const SEND_RESET_LINK_SUCCESS = "SEND_RESET_LINK_SUCCESS";
export interface SendResetLinkSuccess extends Action {
  type: typeof SEND_RESET_LINK_SUCCESS;
}

export const SET_IS_FORM_LOADING = "SET_IS_FORM_LOADING";
export interface SetIsFormLoading extends Action {
  type: typeof SET_IS_FORM_LOADING;
  isFormLoading: boolean;
}

export const SET_IS_FORM_SUBMITTED = "SET_IS_FORM_SUBMITTED";
export interface SetIsFormSubmitted extends Action {
  type: typeof SET_IS_FORM_SUBMITTED;
  isFormSubmitted: boolean;
}

export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export interface UpdatePassword extends Action {
  type: typeof UPDATE_PASSWORD;
  newPassword: string;
  code: string;
}

export const UPDATE_PASSWORD_SUCCESS = "UPDATE_PASSWORD_SUCCESS";
export interface UpdatePasswordSuccess extends Action {
  type: typeof UPDATE_PASSWORD_SUCCESS;
}

export type ResetFormActions =
  | SendResetLink
  | SendResetLinkSuccess
  | SetIsFormLoading
  | SetIsFormSubmitted
  | UpdatePassword
  | UpdatePasswordSuccess;

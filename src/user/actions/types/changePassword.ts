import { Action } from "redux";
import { ChangePassword } from "../../types/ChangePassword";
export const UPDATE_FORM = "UPDATE_FORM";
export interface UpdateForm extends Action {
  type: typeof UPDATE_FORM;
  changePassword: Partial<ChangePassword>;
}

export const CHANGE_PASSWORD_REQUEST = "CHANGE_PASSWORD_REQUEST";
export interface ChangePasswordRequest extends Action {
  type: typeof CHANGE_PASSWORD_REQUEST;
  changePassword: ChangePassword;
}

export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";
export interface ChangePasswordSuccess extends Action {
  type: typeof CHANGE_PASSWORD_SUCCESS;
}

export const SET_IS_SUCCESS = "SET_IS_SUCCESS";
export interface SetIsSuccess extends Action {
  type: typeof SET_IS_SUCCESS;
  isSuccess: boolean;
}

export const SET_IS_LOADING = "SET_IS_LOADING";
export interface SetIsLoading extends Action {
  type: typeof SET_IS_LOADING;
  isLoading: boolean;
}

export type ChangePasswordActions =
  | UpdateForm
  | ChangePasswordRequest
  | ChangePasswordSuccess
  | SetIsSuccess
  | SetIsLoading;

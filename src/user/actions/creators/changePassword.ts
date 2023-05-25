import { ChangePassword } from "../../types/ChangePassword";
import {
  ChangePasswordRequest,
  ChangePasswordSuccess,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  SetIsLoading,
  SetIsSuccess,
  SET_IS_LOADING,
  SET_IS_SUCCESS,
  UpdateForm,
  UPDATE_FORM,
} from "../types/changePassword";

export const updateForm = (
  changePassword: Partial<ChangePassword>
): UpdateForm => ({
  type: UPDATE_FORM,
  changePassword,
});

export const changePasswordRequest = (
  changePassword: ChangePassword
): ChangePasswordRequest => ({
  type: CHANGE_PASSWORD_REQUEST,
  changePassword,
});

export const changePasswordSuccess = (): ChangePasswordSuccess => ({
  type: CHANGE_PASSWORD_SUCCESS,
});

export const setIsSuccess = (isSuccess: boolean): SetIsSuccess => ({
  type: SET_IS_SUCCESS,
  isSuccess,
});

export const setIsLoading = (isLoading: boolean): SetIsLoading => ({
  type: SET_IS_LOADING,
  isLoading,
});

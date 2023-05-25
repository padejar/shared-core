import { PERMISSION_ACCESS_TYPES } from "../../../common/constants/permissionAccessTypes";
import {
  SendResetLink,
  SendResetLinkSuccess,
  SEND_RESET_LINK,
  SEND_RESET_LINK_SUCCESS,
  SetIsFormLoading,
  SET_IS_FORM_LOADING,
  UpdatePassword,
  UPDATE_PASSWORD,
  UpdatePasswordSuccess,
  UPDATE_PASSWORD_SUCCESS,
  SetIsFormSubmitted,
  SET_IS_FORM_SUBMITTED,
} from "../types/resetPassword";

export const sendResetLink = (
  email: string,
  source: PERMISSION_ACCESS_TYPES
): SendResetLink => ({
  type: SEND_RESET_LINK,
  email,
  source,
});

export const sendResetLinkSuccess = (): SendResetLinkSuccess => ({
  type: SEND_RESET_LINK_SUCCESS,
});

export const setIsResetFormLoading = (
  isFormLoading: boolean
): SetIsFormLoading => ({
  type: SET_IS_FORM_LOADING,
  isFormLoading,
});

export const setIsFormSubmitted = (
  isFormSubmitted: boolean
): SetIsFormSubmitted => ({
  type: SET_IS_FORM_SUBMITTED,
  isFormSubmitted,
});

export const updatePassword = (
  newPassword: string,
  code: string
): UpdatePassword => ({
  type: UPDATE_PASSWORD,
  newPassword,
  code,
});

export const updatePasswordSuccess = (): UpdatePasswordSuccess => ({
  type: UPDATE_PASSWORD_SUCCESS,
});

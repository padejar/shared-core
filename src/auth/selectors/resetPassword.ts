import { createSelector } from "reselect";
import { AuthState } from "../types/AuthState";
import { ResetPasswordState } from "../types/ResetPasswordState";

const resetPasswordSelector = (state: AuthState): ResetPasswordState =>
  state.auth.resetPassword;

export const getIsFormSubmittedSelector = createSelector(
  resetPasswordSelector,
  (state) => state.isFormSubmitted
);

export const getIsFormLoadingSelector = createSelector(
  resetPasswordSelector,
  (state) => state.isFormLoading
);

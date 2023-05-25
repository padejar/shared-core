import { createSelector } from "reselect";
import { ChangePasswordState } from "../types/ChangePasswordState";
import { UserState } from "../types/UserState";

const changePasswordSelector = (state: UserState): ChangePasswordState =>
  state.user.changePassword;

export const getFormSelector = createSelector(
  changePasswordSelector,
  (state) => state.form
);

export const getIsLoadingSelector = createSelector(
  changePasswordSelector,
  (state) => state.isFormLoading
);

export const getIsSuccessSelector = createSelector(
  changePasswordSelector,
  (state) => state.isSuccess
);

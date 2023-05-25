import {
  ChangePasswordActions,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  SET_IS_LOADING,
  SET_IS_SUCCESS,
  UPDATE_FORM,
} from "../actions/types/changePassword";
import { ChangePasswordState } from "../types/ChangePasswordState";

const changePasswordState: ChangePasswordState = {
  form: {
    oldPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  },
  isFormLoading: false,
  isSuccess: false,
};

export const reducer = (
  state: ChangePasswordState = changePasswordState,
  action: ChangePasswordActions
): ChangePasswordState => {
  switch (action.type) {
    case UPDATE_FORM: {
      return {
        ...state,
        form: {
          ...state.form,
          ...action.changePassword,
        },
      };
    }
    case CHANGE_PASSWORD_REQUEST: {
      return {
        ...state,
        isSuccess: false,
        isFormLoading: true,
      };
    }
    case CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        isFormLoading: false,
        isSuccess: true,
      };
    }
    case SET_IS_SUCCESS: {
      return {
        ...state,
        isSuccess: action.isSuccess,
      };
    }
    case SET_IS_LOADING: {
      return {
        ...state,
        isFormLoading: action.isLoading,
      };
    }
    default: {
      return state;
    }
  }
};

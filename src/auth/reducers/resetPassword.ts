import { SET_IS_FORM_LOADING } from "../actions/types/authentication";
import {
  ResetFormActions,
  SEND_RESET_LINK,
  SEND_RESET_LINK_SUCCESS,
  SET_IS_FORM_SUBMITTED,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_SUCCESS,
} from "../actions/types/resetPassword";
import { ResetPasswordState } from "../types/ResetPasswordState";

export const resetPasswordState: ResetPasswordState = {
  isFormSubmitted: false,
  isFormLoading: false,
};

export const reducer = (
  state: ResetPasswordState = resetPasswordState,
  action: ResetFormActions
): ResetPasswordState => {
  switch (action.type) {
    case SEND_RESET_LINK: {
      return {
        ...state,
        isFormSubmitted: false,
        isFormLoading: true,
      };
    }
    case SEND_RESET_LINK_SUCCESS: {
      return {
        ...state,
        isFormLoading: false,
        isFormSubmitted: true,
      };
    }
    case SET_IS_FORM_LOADING: {
      return {
        ...state,
        isFormLoading: action.isFormLoading,
      };
    }
    case SET_IS_FORM_SUBMITTED: {
      return {
        ...state,
        isFormSubmitted: action.isFormSubmitted,
      };
    }
    case UPDATE_PASSWORD: {
      return {
        ...state,
        isFormLoading: true,
      };
    }
    case UPDATE_PASSWORD_SUCCESS: {
      return {
        ...state,
        isFormSubmitted: true,
      };
    }

    default: {
      return state;
    }
  }
};

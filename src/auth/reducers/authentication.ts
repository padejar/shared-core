import {
  AUTHENTICATE,
  AuthenticateActions,
  AUTHENTICATE_SUCCESS,
  LOGOUT,
  REFRESH_TOKEN,
  REFRESH_TOKEN_FAILED,
  REFRESH_TOKEN_SUCCESS,
  SET_IS_FORM_LOADING,
  SET_REFRESH_TOKEN_EXPIRY,
  SET_USER_DATA,
  UPDATE_AUTH_FORM,
} from "../actions/types/authentication";
import { authenticationFormDefaultValue } from "../types/AuthenticationForm";
import { AuthenticationState } from "../types/AuthenticationState";

const authFormState: AuthenticationState = {
  authForm: authenticationFormDefaultValue,
  userData: null,
  isFormLoading: false,
  refreshTokenExpiry: 0,
  isTokenExpiring: false,
  refreshTokenLoading: false,
};

export const reducer = (
  state: AuthenticationState = authFormState,
  action: AuthenticateActions
): AuthenticationState => {
  switch (action.type) {
    case UPDATE_AUTH_FORM: {
      return {
        ...state,
        authForm: {
          ...state.authForm,
          ...action.authenticationForm,
        },
      };
    }
    case AUTHENTICATE: {
      return {
        ...state,
        isFormLoading: true,
      };
    }
    case AUTHENTICATE_SUCCESS: {
      return {
        ...state,
        isFormLoading: false,
      };
    }
    case SET_USER_DATA: {
      return {
        ...state,
        userData: action.userData,
      };
    }
    case SET_IS_FORM_LOADING: {
      return {
        ...state,
        isFormLoading: action.isFormLoading,
      };
    }
    case SET_REFRESH_TOKEN_EXPIRY: {
      return {
        ...state,
        refreshTokenExpiry: action.expiryTime,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        userData: null,
      };
    }
    case REFRESH_TOKEN: {
      return {
        ...state,
        refreshTokenLoading: true,
      };
    }
    case REFRESH_TOKEN_FAILED:
    case REFRESH_TOKEN_SUCCESS: {
      return {
        ...state,
        refreshTokenLoading: false,
      };
    }
    default: {
      return state;
    }
  }
};

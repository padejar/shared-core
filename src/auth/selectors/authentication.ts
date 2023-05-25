import diffInSeconds from "date-fns/differenceInSeconds";
import { createSelector } from "reselect";
import { TOKEN_EXPIRY_LIMIT } from "../constants/authentication";
import { AuthenticationState } from "../types/AuthenticationState";
import { AuthState } from "../types/AuthState";

const authenticationSelector = (state: AuthState): AuthenticationState =>
  state.auth.authentication;

export const getUserDataSelector = createSelector(
  authenticationSelector,
  (state) => state.userData
);

export const getAuthFormSelector = createSelector(
  authenticationSelector,
  (state) => state.authForm
);

export const getIsFormLoadingSelector = createSelector(
  authenticationSelector,
  (state) => state.isFormLoading
);

export const getIsAuthenticatedSelector = createSelector(
  authenticationSelector,
  (state) => (state.userData !== null ? true : false)
);

export const getExpiryTimeSelector = createSelector(
  authenticationSelector,
  (state) => state.refreshTokenExpiry
);

export const getIsTokenExpiringSelector = createSelector(
  authenticationSelector,
  (state) => {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const differenceInSeconds = diffInSeconds(
      state.refreshTokenExpiry * 1000,
      currentTime
    );
    if (differenceInSeconds <= TOKEN_EXPIRY_LIMIT) return true;
    return false;
  }
);

export const getExpiryTimeLeftSelector = createSelector(
  authenticationSelector,
  (state) => {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();
    const differenceInSeconds = diffInSeconds(
      state.refreshTokenExpiry * 1000,
      currentTime
    );
    return differenceInSeconds;
  }
);

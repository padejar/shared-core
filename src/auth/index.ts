import { logout, checkAuthState } from "./actions/creators/authentication";
import ModalExpired from "./components/ModalExpired";
import RefreshBanner from "./components/RefreshBanner";
import { useAuthenticationDispatch } from "./dispatchers";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Login from "./pages/Login/Login";
import authReducers from "./reducers";
import routes from "./routes";
import authSagas from "./sagas";
import {
  getUserDataSelector,
  getIsAuthenticatedSelector,
  getExpiryTimeSelector,
  getIsTokenExpiringSelector,
} from "./selectors/authentication";
import {
  getAccessToken,
  getRefreshToken,
  refreshTokens,
  deleteTokens,
} from "./utils";
import { errorBlackList } from "./utils/errors";

export {
  Login,
  ForgotPassword,
  ModalExpired,
  RefreshBanner,
  routes,
  authReducers,
  checkAuthState,
  authSagas,
  getUserDataSelector,
  getIsAuthenticatedSelector,
  getExpiryTimeSelector,
  getIsTokenExpiringSelector,
  useAuthenticationDispatch,
  logout,
  deleteTokens,
  getAccessToken,
  getRefreshToken,
  refreshTokens,
  errorBlackList,
};

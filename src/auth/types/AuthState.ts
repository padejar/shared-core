import { AuthenticationState } from "./AuthenticationState";
import { ResetPasswordState } from "./ResetPasswordState";

export interface AuthState {
  auth: {
    authentication: AuthenticationState;
    resetPassword: ResetPasswordState;
  };
}

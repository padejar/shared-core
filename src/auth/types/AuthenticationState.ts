import { AuthenticationForm } from "./AuthenticationForm";
import { UserData } from "./UserData";

export interface AuthenticationState {
  authForm: AuthenticationForm;
  userData: UserData | null;
  isFormLoading: boolean;
  refreshTokenExpiry: number;
  isTokenExpiring: boolean;
  refreshTokenLoading: boolean;
}

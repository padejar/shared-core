import { ChangePasswordState } from "./ChangePasswordState";

export interface UserState {
  user: {
    changePassword: ChangePasswordState;
  };
}

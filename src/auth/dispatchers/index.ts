import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { AuthenticateActions } from "../actions/types/authentication";
import { ResetFormActions } from "../actions/types/resetPassword";

export const useAuthenticationDispatch = (): Dispatch<AuthenticateActions> =>
  useDispatch();

export const useResetFormDispatch = (): Dispatch<ResetFormActions> =>
  useDispatch();

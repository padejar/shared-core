import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { ChangePasswordActions } from "../actions/types/changePassword";

export const useChangePasswordDispatch = (): Dispatch<ChangePasswordActions> =>
  useDispatch();

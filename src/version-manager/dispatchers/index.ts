import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { VersionManagerActions } from "../actions/types";

export const useVersionManagerDispatch = (): Dispatch<VersionManagerActions> =>
  useDispatch();

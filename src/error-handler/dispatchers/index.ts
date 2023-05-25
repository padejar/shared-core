import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { ErrorActions } from "../actions/types";

export const useErrorDispatch = (): Dispatch<ErrorActions> => useDispatch();

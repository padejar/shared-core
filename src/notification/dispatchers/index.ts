import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { NotificationActions } from "../actions/types";

export const useNotificationDispatch = (): Dispatch<NotificationActions> =>
  useDispatch();

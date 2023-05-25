import { Action } from "redux";
import { NotifItem } from "../../types/";

export const SET_NOTIFICATION = "SET_NOTIFICATION";
export interface SetNotification extends Action {
  type: typeof SET_NOTIFICATION;
  notification: NotifItem;
}

export const UNSET_NOTIFICATION = "UNSET_NOTIFICATION";
export interface UnsetNotification extends Action {
  type: typeof UNSET_NOTIFICATION;
  id: string;
}

export const CLEAR_NOTIFICATION = "CLEAR_NOTIFICATION";
export interface ClearNotification extends Action {
  type: typeof CLEAR_NOTIFICATION;
}

export type NotificationActions =
  | SetNotification
  | UnsetNotification
  | ClearNotification;

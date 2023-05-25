import { v4 as uuidv4 } from "uuid";
import { SentryService } from "../../../error-handler";
import { NotifItem, SetNotifParameter } from "../../types";
import {
  SET_NOTIFICATION,
  SetNotification,
  UNSET_NOTIFICATION,
  UnsetNotification,
  CLEAR_NOTIFICATION,
  ClearNotification,
} from "../types";

export const setNotification = (
  notifItem: SetNotifParameter,
  logEntry?: unknown
): SetNotification => {
  if (logEntry) {
    const entry =
      logEntry === true ? `${notifItem.header}-${notifItem.body}` : logEntry;
    SentryService.report(entry);
  }

  const notification: NotifItem = {
    ...notifItem,
    id: notifItem.id || uuidv4(),
  };
  return {
    type: SET_NOTIFICATION,
    notification,
  };
};

export const unsetNotification = (id: string): UnsetNotification => ({
  type: UNSET_NOTIFICATION,
  id,
});

export const clearNotification = (): ClearNotification => ({
  type: CLEAR_NOTIFICATION,
});

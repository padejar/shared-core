import { createSelector, Selector } from "reselect";
import { NotificationState, Notification, NotifItem } from "../types";

export const notificationSelector = (state: NotificationState): Notification =>
  state.notification;

export const notificationItemSelector = (
  id: string
): Selector<NotificationState, NotifItem> =>
  createSelector(
    notificationSelector,
    (notification: Notification) => notification[id]
  );

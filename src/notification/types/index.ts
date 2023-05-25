import { ReactElement } from "react";

export enum NotificationPosition {
  static = "static",
  topRight = "top-right",
  topLeft = "top-left",
  topCenter = "top-center",
  topFull = "top-full",
  bottomRight = "bottom-right",
  bottomLeft = "bottom-left",
  bottomCenter = "bottom-center",
  bottomFull = "bottom-full",
}

export type NotificationProps = {
  children?: React.ReactNode;
  duration?: number | boolean;
  maxVisible?: number;
};

export interface NotifItem {
  id: string;
  className?: string;
  header?: string;
  body?: string;
  position?: NotificationPosition;
  duration?: number | boolean;
  toast?: boolean;
  component?: {
    id: string;
    props?: unknown;
  };
}

export type GroupedNotification = {
  [key in NotificationPosition]?: ReactElement[];
};

export type NotifState = boolean | "closing";

export interface Notification {
  [key: string]: NotifItem;
}

export interface NotificationState {
  notification: Notification;
}

export type SetNotifParameter = Omit<NotifItem, "id"> & {
  id?: string;
};

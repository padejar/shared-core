import {
  SET_NOTIFICATION,
  UNSET_NOTIFICATION,
  CLEAR_NOTIFICATION,
  NotificationActions,
} from "../actions/types";
import { Notification } from "../types";

const reducer = (
  state: Notification = {},
  action: NotificationActions
): Notification => {
  switch (action.type) {
    case SET_NOTIFICATION: {
      const { [action.notification.id]: notif, ...restState } = state;
      return {
        [action.notification.id]: action.notification,
        ...restState,
      };
    }
    case UNSET_NOTIFICATION: {
      const { [action.id]: notif, ...restState } = state;
      return {
        ...restState,
      };
    }
    case CLEAR_NOTIFICATION: {
      return {};
    }
    default: {
      return state;
    }
  }
};

export default reducer;

import React, { useMemo } from "react";
import { CToaster, CToast, CToastBody, CToastHeader } from "@coreui/react";
import classNames from "classnames";
import { useSelector } from "react-redux";
import * as notificationModule from "../";
import { notificationSelector } from "../selectors";
import {
  NotificationProps,
  NotificationPosition,
  GroupedNotification,
  NotifState,
} from "../types";

import "./Notification.scss";

const defaultProps = {
  duration: 3000,
  maxVisible: 3,
};

export const NotificationTester: React.FunctionComponent = () => {
  const {
    actionCreator: { setNotification, unsetNotification, clearNotification },
    dispatch: { useNotificationDispatch },
    type: { NotificationPosition },
  } = notificationModule;
  const dispatchNotification = useNotificationDispatch();

  const addNotif = () => {
    dispatchNotification(
      setNotification(
        {
          id: "test",
          position: NotificationPosition.topFull,
          header: "Notification",
          body: "Test log from notif",
        },
        true
      )
    );
  };
  const addRandom = () => {
    dispatchNotification(
      setNotification(
        {
          id: Date.now().toString(),
          position: NotificationPosition.topFull,
          duration: 0,
          className: "width-to-content qst-notif-success",
          header: "Test Notification",
          body: "Random notif",
        },
        new Error("Test log from notif")
      )
    );
  };
  const removeNotif = () => {
    dispatchNotification(unsetNotification("test"));
  };
  const clearNotif = () => {
    dispatchNotification(clearNotification());
  };

  return (
    <div className="position-fixed fixed-bottom" style={{ zIndex: 10000 }}>
      <button onClick={addNotif}>Add notif</button>
      <button onClick={removeNotif}>Remove notif</button>
      <button onClick={clearNotif}>Clear notif</button>
      <button onClick={addRandom}>Add Random</button>
    </div>
  );
};

const Notification: React.FunctionComponent<NotificationProps> = (
  props: NotificationProps
) => {
  const {
    actionCreator: { unsetNotification },
    dispatch: { useNotificationDispatch },
    type: { NotificationPosition },
  } = notificationModule;
  const notifications = useSelector(notificationSelector);
  const dispatchNotification = useNotificationDispatch();
  const maxVisible = props.maxVisible || defaultProps.maxVisible;

  const notifs: GroupedNotification = useMemo(() => {
    return Object.values(notifications).reduce(
      (notifs: GroupedNotification, notif, i) => {
        const {
          id,
          className,
          header,
          body,
          position = NotificationPosition.topFull,
          duration = props.duration,
          toast = true,
        } = notif;
        const onStateChange = (state: NotifState) => {
          if (!state && id) {
            dispatchNotification(unsetNotification(id));
          }
        };

        if (toast) {
          notifs[position] = notifs[position] || [];
          notifs[position]?.push(
            <CToast
              key={id}
              show={i < maxVisible}
              autohide={duration}
              className={classNames(className, { closable: !header })}
              onStateChange={onStateChange}
              data-testid={id}
            >
              {header && <CToastHeader>{header}</CToastHeader>}
              {body && (
                <CToastBody>
                  {body}
                  <button
                    className="close"
                    onClick={() => onStateChange(false)}
                  >
                    &#x2715;
                  </button>
                </CToastBody>
              )}
            </CToast>
          );
        }

        return notifs;
      },
      {}
    );
  }, [
    notifications,
    NotificationPosition,
    dispatchNotification,
    unsetNotification,
    props.duration,
    maxVisible,
  ]);

  const notifComps = Object.keys(notifs).map((key) => {
    const pos = key as NotificationPosition;
    return (
      <CToaster
        className="qst-notif mt-2"
        position={pos}
        key={key}
        data-testid="notification"
      >
        {notifs[pos]}
      </CToaster>
    );
  });

  return <>{notifComps}</>;
};

Notification.defaultProps = defaultProps;

export default Notification;

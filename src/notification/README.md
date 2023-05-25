## Notification Component

This component utilizes [CoreUI's Toast](https://coreui.io/react/docs/3.3/components/-Toast) component  and Redux to render notifications/messages within the application.  

### Configuration
Notification component utilizes Redux for state management. Please make sure that the notification reducer is properly configured. 

```
import { combineReducers } from  "redux";
import { reducer  as  notification } from  "@quest-finance/quest-fe-shared/dist/notification";

export  const  rootReducer = combineReducers({
  ...other reducers...
  notification,
});
```


### Rendering

```
import { Notification } from  "@quest-finance/quest-fe-shared/dist/notification";
const  App = () => {
  return (
    <div>
      <Notification  />    
    </div>
  );
};

export default App;
```    

### Component Properties
|Key  |Data type  | Default | Description
|--|--|--|--|
|duration  | number\|boolean | 3000 | Default delay(ms) applied to all notifications
|maxVisible  | number | 3 | Max number of notifications visible at a time.


### Notification Item Options
|Key  |Data type  | Default | Description
|--|--|--|--|
| id | string | Auto generated uuid  | Unique Id |
| className | string |  | Class name to assign for the notif html element. |
| header | string | | Notif header text content. |
| body | string | | Notif body text content |
| position |string |top-full | Inherits [CoreUI's Toast](https://coreui.io/react/docs/3.3/components/-Toast/) position property  |
| duration | number\|boolean | *Notification.duration* | Time in milliseconds for the item to stay visible. |
| toast | boolean | true | Renders notif item as a child of `Notification` component if set to true |


#### Adding a notification item
```
const {
  actionCreator: { setNotification },
  dispatch: { useNotificationDispatch },
} = notificationModule;
const dispatchNotification = useNotificationDispatch();

const addNotif = () => {
  dispatchNotification(
    setNotification({
      id: "welcome-notif"
      header: "Welcome to Quest Finance",
      body: "Fast equipment loans. No commission, no hidden fees",
    })
  );
};
	
addNotif();
```

### Removing a notification item
```
const {
  actionCreator: { unsetNotification },
  dispatch: { useNotificationDispatch },
} = notificationModule;
const dispatchNotification = useNotificationDispatch();

const removeNotif = () => {
  dispatchNotification(unsetNotification("welcome-notif"));
};

removeNotif();
```

### Clear all notification items

```
const {
  actionCreator: { clearNotification },
  dispatch: { useNotificationDispatch },
} = notificationModule;
const dispatchNotification = useNotificationDispatch();

const clearNotif = () => {
  dispatchNotification(clearNotification());
};

clearNotif();
```
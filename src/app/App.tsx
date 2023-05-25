import React from "react";
import "./App.scss";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { axiosInstance } from "../common/services/APIService";
import initTagManager from "../common/utils/gtm";
import { SentryService } from "../error-handler";
import { initAxiosInterceptor } from "../error-handler/utils";
import BaseRoute from "./components/BaseRoute";
import { errorBlackList, errorWhiteList } from "./errorListConfig";
import { rootReducer } from "./rootReducer";
import rootSaga from "./rootSaga";
import * as routes from "./routes";

SentryService.initMonitoring();
initTagManager(process.env.REACT_APP_GTM_ID ?? "");
initAxiosInterceptor(axiosInstance, {
  errorBlackList,
  errorWhiteList,
});

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }),
    sagaMiddleware,
  ],
});

sagaMiddleware.run(rootSaga);

const App: React.FunctionComponent = () => {
  return (
    <Provider store={store}>
      <BaseRoute routes={routes} />
    </Provider>
  );
};

export default App;

import { SagaMiddleware } from "@redux-saga/core";
import {
  configureStore,
  EnhancedStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { Action, CombinedState, combineReducers, Reducer } from "redux";
import createSagaMiddleware from "redux-saga";

export const reduxSagaSetup = <S, A extends Action = Action>(
  reducers: {
    [K in keyof S]: Reducer<S[K], A>;
  }
): {
  store: EnhancedStore<CombinedState<S>, A>;
  sagaMiddleware: SagaMiddleware<Record<string, string>>;
} => {
  const sagaMiddleware = createSagaMiddleware();
  const combinedReducers = combineReducers(reducers);
  const store = configureStore({
    reducer: combinedReducers,
    middleware: [
      ...getDefaultMiddleware({
        thunk: false,
        serializableCheck: false,
      }),
      sagaMiddleware,
    ],
  });

  return { store, sagaMiddleware };
};

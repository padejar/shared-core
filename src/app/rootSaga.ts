import { all, AllEffect, fork, ForkEffect } from "redux-saga/effects";
import { applicationSagas } from "../application";
import { authSagas } from "../auth";
import { errorHandlerSagas } from "../error-handler";
import { userSagas } from "../user";
import { versionManagerSagas } from "../version-manager";

export default function* rootSaga(): Generator<
  AllEffect<ForkEffect<void>>,
  void,
  unknown
> {
  yield all([
    fork(applicationSagas),
    fork(authSagas),
    fork(userSagas),
    fork(errorHandlerSagas),
    fork(versionManagerSagas),
  ]);
}

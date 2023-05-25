import {
  all,
  AllEffect,
  call,
  fork,
  ForkEffect,
  put,
  takeLatest,
  delay,
  select,
} from "@redux-saga/core/effects";
import { setHasNewVersion } from "../actions/creators";
import * as actionTypes from "../actions/types";
import { hasNewVersionSelector } from "../selectors";
import { getCurrenAppVersion } from "../utils";

function* initVersionCheckWorker({ interval }: actionTypes.InitVersionCheck) {
  const currentVersion: string = yield call(getCurrenAppVersion);
  let hasNewVersion = false;

  function* versionCheck() {
    const latestVersion: string = yield call(getCurrenAppVersion);
    if (latestVersion && latestVersion !== currentVersion) {
      yield put(setHasNewVersion(true));
    }
  }

  while (!hasNewVersion) {
    yield delay(interval * 1000);
    yield call(versionCheck);
    hasNewVersion = yield select(hasNewVersionSelector);
  }
}

function* watchVersionManager() {
  yield takeLatest(actionTypes.INIT_VERSION_CHECK, initVersionCheckWorker);
}

function* versionManagerSagas(): Generator<
  AllEffect<ForkEffect<void>>,
  void,
  unknown
> {
  yield all([fork(watchVersionManager)]);
}

export default versionManagerSagas;

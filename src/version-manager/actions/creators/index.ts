import * as types from "../types";

export const initVersionCheck = (interval = 60): types.InitVersionCheck => ({
  type: types.INIT_VERSION_CHECK,
  interval,
});

export const setHasNewVersion = (
  hasNewVersion: boolean
): types.SetHasNewVersion => ({
  type: types.SET_HAS_NEW_VERSION,
  hasNewVersion,
});

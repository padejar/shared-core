import { VersionManagerActions, SET_HAS_NEW_VERSION } from "../actions/types";
import { VersionManager } from "../types";

const versionManagerState: VersionManager = {
  hasNewVersion: false,
};

const reducer = (
  state: VersionManager = versionManagerState,
  action: VersionManagerActions
): VersionManager => {
  switch (action.type) {
    case SET_HAS_NEW_VERSION: {
      const { hasNewVersion } = action;
      return { hasNewVersion };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

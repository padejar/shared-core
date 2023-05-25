import { createSelector } from "reselect";
import { VersionManagerState, VersionManager } from "../types";

export const versionManagerSelector = (
  state: VersionManagerState
): VersionManager => state.versionManager;

export const hasNewVersionSelector = createSelector(
  versionManagerSelector,
  (versionManager): boolean => versionManager.hasNewVersion
);

import { Action } from "redux";

export const INIT_VERSION_CHECK = "INIT_VERSION_CHECK";
export interface InitVersionCheck extends Action {
  type: typeof INIT_VERSION_CHECK;
  interval: number;
}

export const SET_HAS_NEW_VERSION = "SET_HAS_NEW_VERSION";
export interface SetHasNewVersion extends Action {
  type: typeof SET_HAS_NEW_VERSION;
  hasNewVersion: boolean;
}

export type VersionManagerActions = InitVersionCheck | SetHasNewVersion;

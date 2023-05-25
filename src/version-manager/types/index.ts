export type VersionManager = {
  hasNewVersion: boolean;
};

export interface VersionManagerState {
  versionManager: VersionManager;
}

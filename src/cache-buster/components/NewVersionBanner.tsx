import "./NewVersionBanner.scss";
import React from "react";
import { refreshCacheAndReload } from "../utils/cache";

type NewVersionBannerProps = {
  appName: string;
};

const NewVersionBanner: React.FunctionComponent<NewVersionBannerProps> = ({
  appName,
}: NewVersionBannerProps) => {
  const handleRefreshPage = () => {
    refreshCacheAndReload();
  };

  return (
    <div className="new-version-banner">
      There&apos;s a new version of the {appName} website. Click{" "}
      <button
        type="button"
        className="refresh-button"
        onClick={() => handleRefreshPage()}
      >
        here
      </button>{" "}
      to reload the page and get the latest version.
    </div>
  );
};

export default NewVersionBanner;

import React, { useCallback, useEffect, useState } from "react";
import ConfirmationModal, {
  MODAL_TYPE,
} from "../../common/components/ConfirmationModal";
import { refreshCacheAndReload } from "../utils/cache";

type CacheBusterProps = {
  appName: string;
  currentVersion: string;
  intervalInSeconds: number;
  isEnabled: boolean;
  renderChild: (bannerRefreshShown?: boolean) => JSX.Element;
};

const CacheBuster: React.FunctionComponent<CacheBusterProps> = ({
  appName,
  currentVersion,
  intervalInSeconds,
  isEnabled,
  renderChild,
}: CacheBusterProps) => {
  const [isLatestVersion, setIsLatestVersion] = useState(true);
  const [modalRefreshShown, setModalRefreshShown] = useState(false);
  const [bannerRefreshShown, setBannerRefreshShown] = useState(false);

  const isThereNewVersion = (metaVersion: string, currentVersion: string) => {
    if (!currentVersion) {
      return false;
    }

    if (metaVersion !== currentVersion) {
      return true;
    }

    return false;
  };

  const checkCacheStatus = useCallback(async () => {
    try {
      const res = await fetch("/meta.json");
      const { version: metaVersion } = await res.json();
      const shouldForceRefresh = isThereNewVersion(metaVersion, currentVersion);

      if (shouldForceRefresh) {
        if (!bannerRefreshShown) {
          setModalRefreshShown(true);
        }

        setIsLatestVersion(false);
      }
    } catch (error) {
      // do nothing
    }
  }, [currentVersion, bannerRefreshShown]);

  useEffect(() => {
    if (isEnabled) {
      const interval = setInterval(() => {
        checkCacheStatus();
      }, intervalInSeconds * 1000);
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [checkCacheStatus, intervalInSeconds, isEnabled]);

  const handleModalRefresh = () => {
    refreshCacheAndReload();
  };

  const handleCancelReload = () => {
    setModalRefreshShown(false);
    setBannerRefreshShown(true);
  };

  if (!isEnabled) {
    return renderChild();
  }

  return (
    <>
      {renderChild(bannerRefreshShown)}
      {!isLatestVersion && (
        <ConfirmationModal
          isShown={modalRefreshShown}
          modalType={MODAL_TYPE.WARNING}
          showCloseButton={false}
          toggler={() => {
            setModalRefreshShown((previousState) => !previousState);
          }}
          onCancel={() => handleCancelReload()}
          cancelButtonText="Ignore"
          onConfirm={() => handleModalRefresh()}
          renderBody={() => (
            <>
              <h4 className="f-quest-navy f-bold">{appName} needs to reload</h4>
              <p className="f-quest-navy">
                There&apos;s a new version of the {appName} website. We
                recommend that you click the &quot;Reload page&quot; button
                below to get the latest version.
              </p>
              <p className="f-quest-navy">
                You can choose to ignore this message now, but you might
                encounter issue if you do so. If you choose to ignore, you can
                click the reload page link at the top of the page when you are
                ready.
              </p>
            </>
          )}
          confirmButtonText="Reload page"
          testId="reload-page-modal"
        />
      )}
    </>
  );
};

export default CacheBuster;

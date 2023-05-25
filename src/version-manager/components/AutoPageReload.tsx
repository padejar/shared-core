import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  useVersionManagerDispatch,
  actionCreator as versionMgrAction,
} from "../";
import { hasNewVersionSelector } from "../selectors";

interface AutoPageReloadProps {
  checkInterval?: number;
}
const AutoPageReload: React.FC<AutoPageReloadProps> = ({
  checkInterval = 60,
}: AutoPageReloadProps) => {
  const history = useHistory();
  const hasNewVersion = useSelector(hasNewVersionSelector);
  const versionMgrDisptach = useVersionManagerDispatch();

  useEffect(() => {
    versionMgrDisptach(versionMgrAction.initVersionCheck(checkInterval));
  }, [versionMgrDisptach, checkInterval]);

  useEffect(() => {
    const historyUnlisten = history.listen(() => {
      if (hasNewVersion) {
        window.location.reload();
      }
    });

    return () => {
      historyUnlisten();
    };
  }, [hasNewVersion, history]);

  return null;
};

export default AutoPageReload;

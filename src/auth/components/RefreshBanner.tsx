import React, { useCallback, useEffect, useState } from "react";
import diffInSeconds from "date-fns/differenceInSeconds";
import { useSelector } from "react-redux";
import { useAuthenticationDispatch } from "..";
import {
  refreshToken,
  checkAuthState,
} from "../actions/creators/authentication";
import { TOKEN_EXPIRY_LIMIT } from "../constants/authentication";
import { getExpiryTimeSelector } from "../selectors/authentication";
import "./RefreshBanner.scss";

const RefreshBanner: React.FunctionComponent = () => {
  const dispatch = useAuthenticationDispatch();
  const handleRefresh = () => {
    dispatch(refreshToken());
  };
  const [showBanner, setShowBanner] = useState(false);
  const refreshTokenExpiry = useSelector(getExpiryTimeSelector);
  const [textContent, setTextContent] = useState("");
  const secondsBeforeExpiry = diffInSeconds(
    refreshTokenExpiry * 1000,
    new Date().getTime()
  );

  const renderExpiryTime = useCallback(() => {
    const date = new Date(secondsBeforeExpiry * 1000);
    setTextContent(`${date.getMinutes()} minutes ${date.getSeconds()} seconds`);
  }, [secondsBeforeExpiry]);

  useEffect(() => {
    const timeout = secondsBeforeExpiry - TOKEN_EXPIRY_LIMIT;
    if (secondsBeforeExpiry > TOKEN_EXPIRY_LIMIT || secondsBeforeExpiry < 0) {
      setShowBanner(false);
      setTextContent("");
    }

    let timer: NodeJS.Timeout;
    setTimeout(() => {
      if (timer) clearTimeout(timer);
      setShowBanner(true);
    }, timeout * 1000);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [secondsBeforeExpiry, showBanner, dispatch]);

  useEffect(() => {
    let timeInterval: NodeJS.Timeout | undefined;

    if (showBanner) {
      if (timeInterval) {
        clearInterval(timeInterval as NodeJS.Timeout);
      }
      timeInterval = setInterval(renderExpiryTime, 1000);
    }

    return () => {
      if (timeInterval) clearTimeout(timeInterval);
      dispatch(checkAuthState());
    };
  }, [showBanner, renderExpiryTime, dispatch]);

  if (!showBanner) return null;

  return (
    <div className="refresh-banner">
      Your session will expire in{" "}
      <span className="time-expire">{textContent}</span>.{" "}
      <button className="refresh-button" onClick={() => handleRefresh()}>
        Continue your session here.
      </button>
    </div>
  );
};

export default RefreshBanner;

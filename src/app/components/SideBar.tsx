import React, { useCallback, useEffect } from "react";
import { CSidebar, CLink } from "@coreui/react";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import {
  getIsTokenExpiringSelector,
  getUserDataSelector,
  getIsAuthenticatedSelector,
} from "../../auth";
import iconMenuClose from "../../common/assets/images/icon-menu-close.svg";
import iconMenuOpen from "../../common/assets/images/icon-menu-open.svg";
import iconNewApplication from "../assets/images/icon-nav-new-app.svg";
import iconQuickQuote from "../assets/images/icon-nav-quick-quote.svg";
import { SidebarShown, useLayoutContext } from "../contexts/LayoutContext";
import "./SideBar.scss";

type SideBarProps = {
  bannerRefreshShown?: boolean;
};

const SideBar: React.FunctionComponent<SideBarProps> = ({
  bannerRefreshShown,
}: SideBarProps) => {
  const userData = useSelector(getUserDataSelector);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const isTokenExpiring = useSelector(getIsTokenExpiringSelector);
  const sessionBannerShown = isAuthenticated && isTokenExpiring;
  const {
    isSidebarMinimized,
    setIsSidebarMinimized,
    showSidebar,
    setShowSidebar,
  } = useLayoutContext();

  const setShowSidebarCallback = useCallback(
    (showSidebar: SidebarShown) => setShowSidebar(showSidebar),
    [setShowSidebar]
  );

  useEffect(() => {
    if (!isSidebarMinimized) {
      setShowSidebarCallback(true);
    } else {
      setShowSidebarCallback("responsive");
    }
  }, [isSidebarMinimized, setShowSidebarCallback]);

  const toggleSidebar = () => {
    setShowSidebar(true);
    setIsSidebarMinimized((previousState) => !previousState);
  };
  return (
    <CSidebar
      show={showSidebar}
      minimize={isSidebarMinimized}
      onShowChange={(value: SidebarShown) => setShowSidebar(value)}
      className={classNames("quest-sidebar", {
        "one-banner": bannerRefreshShown || sessionBannerShown,
        "two-banner": bannerRefreshShown && sessionBannerShown,
      })}
    >
      <button className="quest-sidebar-toggler" onClick={() => toggleSidebar()}>
        {isSidebarMinimized && <ReactSVG src={iconMenuOpen} />}
        {!isSidebarMinimized && <ReactSVG src={iconMenuClose} />}
      </button>
      {userData && (
        <div className="quest-sidebar-header">
          <span className="quest-sidebar-info quest-sidebar-user-details">
            Welcome {userData.firstName}
          </span>
          {userData.bdm && (
            <span className="quest-sidebar-info small">
              Your relationship manager is: <br />
              {userData.bdm.firstName}
              {userData.bdm.lastName ? ` ${userData.bdm.lastName}` : ""}
              <br />
              {userData.bdm.mobile}
            </span>
          )}
        </div>
      )}
      <ul className="quest-sidebar-nav ps">
        <li className="quest-sidebar-nav-item">
          <CLink
            exact
            className="quest-sidebar-nav-link"
            to="/application/applications"
          >
            <i className="cil-home"></i>
            &nbsp; Dashboard
          </CLink>
        </li>
        <li className="quest-sidebar-nav-item">
          <CLink
            className="quest-sidebar-nav-link"
            to="/application/quotes/quick-quote"
          >
            <img
              className="quest-sidebar-link-icon"
              src={iconQuickQuote}
              alt="quick-quote"
            />
            &nbsp; Quick Quote
          </CLink>
        </li>
        <li className="quest-sidebar-nav-item">
          <CLink
            className="quest-sidebar-nav-link"
            to="/application/applications/new"
            exact
          >
            <img
              className="quest-sidebar-link-icon"
              src={iconNewApplication}
              alt="new-application"
            />
            &nbsp; New Application
          </CLink>
        </li>
        <li className="quest-sidebar-nav-item">
          <CLink className="quest-sidebar-nav-link" to="/kitchen-sink" exact>
            <i className="cil-code"></i>
            &nbsp; Kitchen Sink
          </CLink>
        </li>
      </ul>
      <div className="quest-sidebar-footer">
        <span className="quest-sidebar-info mb-2">Need Help?</span>
        <a
          className="d-block quest-sidebar-info small mb-2"
          href="mailto:help@quest.finance"
        >
          help@quest.finance
        </a>
        <span className="quest-sidebar-info small mb-2">1300 465 363</span>
      </div>
    </CSidebar>
  );
};

export default React.memo(SideBar);

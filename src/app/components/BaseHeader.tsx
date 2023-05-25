import React from "react";
import { CHeader, CHeaderNav, CHeaderNavItem, CLink } from "@coreui/react";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import {
  getIsAuthenticatedSelector,
  getIsTokenExpiringSelector,
} from "../../auth";
import iconMenuClose from "../../common/assets/images/icon-menu-close.svg";
import iconMenuOpen from "../../common/assets/images/icon-menu-open.svg";
import QuestConnectLogo from "../../common/assets/images/QuestConnect-Logo-blue.svg";
import { useLayoutContext } from "../contexts/LayoutContext";
import HeaderDropDownUser from "./HeaderDropDownUser";
import HeaderSearch from "./HeaderSearch";

import "./BaseHeader.scss";

type BaseHeaderProps = {
  bannerRefreshShown?: boolean;
};

const BaseHeader: React.FunctionComponent<BaseHeaderProps> = ({
  bannerRefreshShown,
}: BaseHeaderProps) => {
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const isTokenExpiring = useSelector(getIsTokenExpiringSelector);
  const sessionBannerShown = isAuthenticated && isTokenExpiring;
  const {
    isSidebarMinimized,
    setIsSidebarMinimized,
    showSidebar,
    setShowSidebar,
  } = useLayoutContext();

  const toggleSidebarMobile = () => {
    const val = [false, "responsive", undefined].includes(showSidebar)
      ? true
      : "responsive";
    setShowSidebar(val);
    setIsSidebarMinimized(false);
  };

  return (
    <CHeader
      className={classNames("quest-header", {
        "one-banner": bannerRefreshShown || sessionBannerShown,
        "two-banner": bannerRefreshShown && sessionBannerShown,
      })}
    >
      <CHeaderNav className="quest-header-logo-container">
        <CHeaderNavItem className="d-lg-none mr-3">
          <button
            type="button"
            className="quest-sidebar-toggler"
            onClick={() => toggleSidebarMobile()}
          >
            {showSidebar === "responsive" && isSidebarMinimized && (
              <ReactSVG src={iconMenuOpen} />
            )}
            {!isSidebarMinimized && (
              <ReactSVG src={iconMenuClose} alt="icon-menu-close" />
            )}
          </button>
        </CHeaderNavItem>
        <CHeaderNavItem>
          <CLink to="/application/applications">
            <img
              className="header-logo"
              src={QuestConnectLogo}
              alt="quest-connect-logo-blue"
            />
          </CLink>
        </CHeaderNavItem>
      </CHeaderNav>
      <CHeaderNav className="ml-auto header-search-container">
        <HeaderSearch />
      </CHeaderNav>
      <CHeaderNav className="ml-auto pl-3 pr-0 return-to-dashboard">
        <CHeaderNavItem>
          <CLink
            className="quest-button purple header-nav-link"
            to="/application/applications"
          >
            Return To Dashboard
          </CLink>
        </CHeaderNavItem>
      </CHeaderNav>
      <CHeaderNav className="links dropdown-user">
        <HeaderDropDownUser />
      </CHeaderNav>
    </CHeader>
  );
};

export default BaseHeader;

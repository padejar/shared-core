import "./BaseLayout.scss";
import React, { Suspense, useRef, useState } from "react";
import { CContainer } from "@coreui/react";
import { useSelector } from "react-redux";
import {
  getIsAuthenticatedSelector,
  RefreshBanner,
  ModalExpired,
} from "../../auth";
import Loading from "../../common/components/Loading";
import { NewVersionBanner, selector } from "../../version-manager";
import { SidebarShown, LayoutContext } from "../contexts/LayoutContext";
import BaseHeader from "./BaseHeader";
import SideBar from "./SideBar";

type BaseLayoutProps = {
  bannerRefreshShown?: boolean;
  children?: React.ReactNode;
};

const BaseLayout: React.FunctionComponent<BaseLayoutProps> = ({
  bannerRefreshShown,
  children,
}: BaseLayoutProps) => {
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const hasNewVersion = useSelector(selector.hasNewVersionSelector);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<SidebarShown>(undefined);
  const year = useRef<number>(new Date().getFullYear());

  return (
    <LayoutContext.Provider
      value={{
        isSidebarMinimized,
        setIsSidebarMinimized,
        showSidebar,
        setShowSidebar,
      }}
    >
      <div className="container quest-app">
        <div className="banner-container">
          {isAuthenticated && <RefreshBanner />}
          {hasNewVersion && <NewVersionBanner appName="QuestConnect" />}
        </div>
        <BaseHeader bannerRefreshShown={hasNewVersion} />
        <div className="c-app authorized">
          <SideBar bannerRefreshShown={hasNewVersion} />
          <div className="c-wrapper col-xl-10 px-0">
            <div className="c-body">
              <main
                className="c-main pb-5"
                style={{
                  paddingTop: hasNewVersion ? "4rem" : "2rem",
                }}
              >
                <CContainer fluid>
                  <Suspense fallback={<Loading />}>{children}</Suspense>
                </CContainer>
              </main>
            </div>
            <div className="c-footer">
              <p>
                &copy; Copyright {year.current} Oneteam Capital Pty Ltd T/as
                Quest Finance Technologies
              </p>
            </div>
          </div>
        </div>
      </div>
      {!isAuthenticated && <ModalExpired />}
    </LayoutContext.Provider>
  );
};

export default BaseLayout;

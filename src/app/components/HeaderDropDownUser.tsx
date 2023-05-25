import React from "react";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import { useHistory } from "react-router";
import { ReactSVG } from "react-svg";
import { logout, useAuthenticationDispatch } from "../../auth";
import userIcon from "../../common/assets/images/icon-user-outline.svg";

const HeaderDropDownUser: React.FunctionComponent = () => {
  const dispatch = useAuthenticationDispatch();
  const history = useHistory();
  const handleLogout = async () => {
    dispatch(logout());
    history.replace("/auth/login");
  };

  return (
    <CDropdown
      inNav
      className="c-header-nav-items ml-1 mr-lg-2 mr-sm-0 quest-dropdown"
      dir="down"
    >
      <CDropdownToggle caret={false} className="c-header-nav-link">
        <div className="c-avatar">
          <ReactSVG src={userIcon} />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="quest-dropdown-menu" placement="bottom-end">
        <CDropdownItem
          className="quest-dropdown-item"
          to="/user/change-password"
        >
          Edit Profile
        </CDropdownItem>
        <CDropdownItem
          className="quest-dropdown-item"
          onClick={() => handleLogout()}
        >
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default HeaderDropDownUser;

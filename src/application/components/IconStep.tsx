import React from "react";
import { CButton } from "@coreui/react";
import { ReactSVG } from "react-svg";
import IconDone from "../assets/images/icon-circle-done.svg";

type IconStepProps = {
  isActive: boolean;
  isDone?: boolean;
  isClickable?: boolean;
  onClick: () => void;
  iconPath: string;
  stepName: string;
};

const IconStep: React.FunctionComponent<IconStepProps> = ({
  isActive,
  isDone,
  isClickable = false,
  onClick,
  iconPath,
  stepName,
}: IconStepProps) => {
  let icon = iconPath;

  if (isDone) {
    icon = IconDone;
  }

  const children = (
    <>
      <ReactSVG src={icon} alt={`Icon ${stepName}-${isDone ? "done" : ""}`} />
      <span>{stepName}</span>
    </>
  );

  const renderChildrenContainer = () => {
    if (isClickable || isDone) {
      return (
        <CButton
          onClick={() => onClick()}
          data-testid={`step-${stepName}-button`}
        >
          {children}
        </CButton>
      );
    }
    return <span className="icon-container">{children}</span>;
  };

  return (
    <li
      className={`${!isClickable ? "disabled" : ""} ${isDone ? "done" : ""} ${
        isActive ? "active" : ""
      }`}
      data-testid={`step-${stepName}-container`}
    >
      {renderChildrenContainer()}
    </li>
  );
};

export default IconStep;

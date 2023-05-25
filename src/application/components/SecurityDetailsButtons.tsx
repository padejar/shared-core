import React, { useCallback } from "react";
import { CButton } from "@coreui/react";
import "./SecurityDetailsButtons.scss";
import {
  SECURITY_DETAILS_INPUT_TYPES,
  SECURITY_DETAILS_INPUT_TYPE_OPTIONS,
} from "../constants/securityDetailsInputTypes";

type SecurityDetailsButtonsProps = {
  selectedValue: SECURITY_DETAILS_INPUT_TYPES;
  disabled: boolean;
  onSelect: (selected: SECURITY_DETAILS_INPUT_TYPES) => void;
};
const SecurityDetailsButtons: React.FunctionComponent<SecurityDetailsButtonsProps> = ({
  selectedValue,
  disabled,
  onSelect,
}: SecurityDetailsButtonsProps) => {
  const onSelectCallback = useCallback(
    (value: SECURITY_DETAILS_INPUT_TYPES) => {
      onSelect(value);
    },
    [onSelect]
  );
  return (
    <div className="security-details-buttons">
      {Object.keys(SECURITY_DETAILS_INPUT_TYPE_OPTIONS).map((option) => (
        <CButton
          type="button"
          className={`mr-2 ${selectedValue === option ? "selected" : ""}`}
          color="primary"
          disabled={disabled}
          key={option}
          onClick={() =>
            onSelectCallback(option as SECURITY_DETAILS_INPUT_TYPES)
          }
          data-testid={`${option}-button`}
        >
          {SECURITY_DETAILS_INPUT_TYPE_OPTIONS[option]}
        </CButton>
      ))}
    </div>
  );
};

export default SecurityDetailsButtons;

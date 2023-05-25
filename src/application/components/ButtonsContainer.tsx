import React, { useCallback, useRef } from "react";
import { CCol, CRow } from "@coreui/react";
import { ReactSVG } from "react-svg";
import ArrowLeft from "../../common/assets/images/arrow-left-white.svg";
import ArrowRight from "../../common/assets/images/arrow-right-white.svg";
import {
  BUTTON_COLORS,
  QuestButton,
} from "../../common/components/QuestButton";
import { SubmitButtonContainer } from "./SubmitButton";

type ButtonsContainerProps = {
  popOverContent?: () => JSX.Element;
  disabled?: boolean;
  disableSave?: boolean;
  btnSaveText?: string;
  btnPreviousText?: string;
  btnSubmitText?: string;
  submitButtonColor?: BUTTON_COLORS;
  useSubmitButton?: boolean;
  isSubmitted?: boolean;
  disableSubmit?: boolean;
  onSaveClick: () => void;
  onPreviousClick?: () => void;
  onSubmitClick: () => void;
};

const ButtonsContainer: React.FunctionComponent<ButtonsContainerProps> = ({
  popOverContent,
  disabled = false,
  disableSave,
  btnSaveText = "Save and exit",
  btnSubmitText = "Next",
  btnPreviousText = "Back",
  submitButtonColor = BUTTON_COLORS.PRIMARY,
  useSubmitButton = false,
  isSubmitted = false,
  disableSubmit = false,
  onSaveClick,
  onPreviousClick,
  onSubmitClick,
}: ButtonsContainerProps) => {
  const popoverParent = useRef<HTMLDivElement | null>(null);
  const onSaveCallback = useCallback(() => {
    if (!disableSave || !disabled) onSaveClick();
  }, [onSaveClick, disableSave, disabled]);
  const onPreviousCallback = useCallback(() => {
    if (!disabled && onPreviousClick) onPreviousClick();
  }, [onPreviousClick, disabled]);
  const onSubmitCallback = useCallback(() => {
    if (!disableSubmit || !disabled) onSubmitClick();
  }, [onSubmitClick, disableSubmit, disabled]);
  return (
    <CRow className="buttons-container mt-4">
      <CCol xs={12} className="buttons-container-inner">
        <div className="save">
          <QuestButton
            color={BUTTON_COLORS.SECONDARY}
            type="button"
            onClick={() => onSaveCallback()}
            disabled={disabled || disableSave}
            data-testid="save-and-exit-button"
          >
            {btnSaveText}
          </QuestButton>
        </div>
        <div className="navigation" ref={popoverParent}>
          {onPreviousClick && (
            <QuestButton
              color={BUTTON_COLORS.SECONDARY}
              className="mr-2"
              type="button"
              onClick={() => onPreviousCallback()}
              disabled={disabled}
              data-testid="previous-button"
            >
              <ReactSVG src={ArrowLeft} /> {btnPreviousText}
            </QuestButton>
          )}
          {useSubmitButton ? (
            <SubmitButtonContainer
              popOverParentContainer={popoverParent.current}
              popOverContent={popOverContent}
              disableSubmit={disableSubmit}
              isSubmitted={isSubmitted}
              onClick={() => onSubmitCallback()}
              btnSubmitText={btnSubmitText}
            />
          ) : (
            <QuestButton
              color={submitButtonColor}
              type="button"
              onClick={() => onSubmitCallback()}
              disabled={disabled || disableSubmit}
              data-testid="submit-button"
            >
              {btnSubmitText} <ReactSVG src={ArrowRight} />
            </QuestButton>
          )}
        </div>
      </CCol>
    </CRow>
  );
};

export default ButtonsContainer;

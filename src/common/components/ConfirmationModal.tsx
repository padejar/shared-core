import "./ConfirmationModal.scss";
import React from "react";
import { CModal, CModalBody } from "@coreui/react";
import { BUTTON_COLORS, QuestButton } from "./QuestButton";

export enum MODAL_TYPE {
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
}

type ConfirmationModalProps = {
  modalType: MODAL_TYPE;
  headerText?: string | JSX.Element;
  bodyText?: string | JSX.Element;
  renderBody?: () => JSX.Element;
  isShown: boolean;
  toggler: () => void;
  onConfirm: () => void;
  confirmButtonText?: string;
  confirmButtonColor?: BUTTON_COLORS;
  onCancel?: () => void;
  cancelButtonText?: string;
  cancelButtonColor?: BUTTON_COLORS;
  showCloseButton?: boolean;
  testId?: string;
};

const ConfirmationModal: React.FunctionComponent<ConfirmationModalProps> = ({
  modalType,
  headerText,
  bodyText,
  renderBody,
  isShown,
  toggler,
  onConfirm,
  confirmButtonText = "Confirm",
  confirmButtonColor = BUTTON_COLORS.PRIMARY,
  onCancel,
  cancelButtonText = "Cancel",
  cancelButtonColor = BUTTON_COLORS.SECONDARY,
  showCloseButton,
  testId,
}: ConfirmationModalProps) => {
  testId += "-confirmation-modal";

  return (
    <CModal
      data-testid={testId}
      className={`modal-confirmation ${modalType.toLowerCase()}`}
      show={isShown}
      onClose={toggler}
      closeOnBackdrop={false}
    >
      <CModalBody>
        {showCloseButton && (
          <button type="button" className="btn-close" onClick={toggler}>
            x
          </button>
        )}
        {headerText && <h4 className="f-quest-navy f-bold">{headerText}</h4>}
        {bodyText && <div className="f-quest-navy mb-4">{bodyText}</div>}
        {renderBody && renderBody()}
        {onCancel && (
          <QuestButton
            type="button"
            color={cancelButtonColor}
            onClick={() => onCancel()}
            data-testid={testId + "-cancel"}
          >
            {cancelButtonText}
          </QuestButton>
        )}

        <QuestButton
          className="ml-3"
          type="button"
          color={confirmButtonColor}
          onClick={() => onConfirm()}
          data-testid={testId + "-confirm"}
        >
          {confirmButtonText}
        </QuestButton>
      </CModalBody>
    </CModal>
  );
};

export default ConfirmationModal;

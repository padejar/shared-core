import React from "react";
import { CModal, CModalBody } from "@coreui/react";
import "./ModalSecurityAlert.scss";
import {
  BUTTON_COLORS,
  QuestButton,
} from "../../common/components/QuestButton";

type ModalSecurityAlertProps = {
  isShown: boolean;
  toggler: () => void;
  fieldName: string;
  quoteFieldName: string;
  onEditClicked: () => void;
  onCancel: () => void;
};
const ModalSecurityAlert: React.FunctionComponent<ModalSecurityAlertProps> = ({
  isShown,
  toggler,
  fieldName,
  quoteFieldName,
  onEditClicked,
  onCancel,
}: ModalSecurityAlertProps) => {
  return (
    <CModal
      className="modal-security-alert"
      show={isShown}
      onClose={toggler}
      closeOnBackdrop={false}
      data-testid="modal-security-alert"
    >
      <CModalBody>
        <button type="button" className="btn-close" onClick={toggler}>
          x
        </button>
        <h4 className="f-quest-navy f-bold">Attention</h4>
        <p className="f-quest-navy">
          The <b>{fieldName}</b> doesn&apos;t match what was entered in the
          Quote. Please edit the <b>{quoteFieldName}</b> in the Quote tab so
          they match.
        </p>
        <QuestButton
          className="mr-3"
          color={BUTTON_COLORS.SECONDARY}
          type="button"
          onClick={() => onCancel()}
          data-testid="modal-security-cancel"
        >
          Cancel
        </QuestButton>
        <QuestButton
          color={BUTTON_COLORS.PRIMARY}
          type="button"
          className="quest-button purple f-normal f-14"
          onClick={() => onEditClicked()}
          data-testid="modal-security-edit"
        >
          Edit {quoteFieldName}
        </QuestButton>
      </CModalBody>
    </CModal>
  );
};

export default ModalSecurityAlert;

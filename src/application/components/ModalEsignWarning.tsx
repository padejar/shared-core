import "./ModalEsignWarning.scss";
import React, { useCallback } from "react";
import { CButton, CModal, CModalBody } from "@coreui/react";

type ModalEsignWarningProps = {
  isShown: boolean;
  toggler: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
};

const ModalEsignWarning: React.FunctionComponent<ModalEsignWarningProps> = ({
  isShown,
  toggler,
  onConfirm,
  onCancel,
}: ModalEsignWarningProps) => {
  const onConfirmCallback = useCallback(() => {
    onConfirm();
    toggler();
  }, [onConfirm, toggler]);

  const onClose = useCallback(() => {
    toggler();
  }, [toggler]);

  const onCancelCallback = useCallback(() => {
    if (onCancel) onCancel();
  }, [onCancel]);

  return (
    <CModal
      className="modal-e-sign-warning"
      show={isShown}
      onClose={onClose}
      data-testid="modal-e-sign-warning"
    >
      <CModalBody>
        <button type="button" className="btn-close" onClick={onClose}>
          x
        </button>
        <h4 className="f-quest-navy f-bold">Attention</h4>
        <p className="f-quest-navy">
          You are about to email a copy of the contracts documents to the client
          (and yourself) to be e-signed.
        </p>
        <CButton
          type="button"
          className="quest-button secondary f-normal f-14 mr-3"
          onClick={() => onCancelCallback()}
          data-testid="modal-e-sign-cancel"
        >
          Cancel
        </CButton>
        <CButton
          type="button"
          className="quest-button purple f-normal f-14"
          onClick={() => onConfirmCallback()}
          data-testid="modal-e-sign-proceed"
        >
          Proceed
        </CButton>
      </CModalBody>
    </CModal>
  );
};

export default ModalEsignWarning;

import "./ModalGuarantorDeleteConfirmation.scss";
import React, { useCallback } from "react";
import { CButton, CModal, CModalBody } from "@coreui/react";

type ModalGuarantorDeleteConfirmationProps = {
  guarantorIndex: number;
  isShown: boolean;
  toggler: () => void;
  onConfirm: (guarantorIndex: number) => void;
};

const ModalGuarantorDeleteConfirmation: React.FunctionComponent<ModalGuarantorDeleteConfirmationProps> = ({
  guarantorIndex,
  isShown,
  toggler,
  onConfirm,
}: ModalGuarantorDeleteConfirmationProps) => {
  const onConfirmCallback = useCallback(
    (guarantorIndex: number) => {
      onConfirm(guarantorIndex);
      toggler();
    },
    [onConfirm, toggler]
  );

  const onClose = useCallback(() => {
    toggler();
  }, [toggler]);

  return (
    <CModal
      className="modal-guarantor-delete-confirmation"
      show={isShown}
      onClose={onClose}
      data-testid="guarantor-delete-confirmation"
    >
      <CModalBody>
        <button type="button" className="btn-close" onClick={onClose}>
          x
        </button>
        <h4 className="f-quest-navy f-bold">Attention</h4>
        <p className="f-quest-navy">
          You are about to delete Director #{guarantorIndex + 1}
        </p>
        <CButton
          type="button"
          className="quest-button purple f-normal f-14"
          onClick={() => onConfirmCallback(guarantorIndex)}
          data-testid={`confirm-delete-guarantor-${guarantorIndex}`}
        >
          Confirm
        </CButton>
      </CModalBody>
    </CModal>
  );
};

export default ModalGuarantorDeleteConfirmation;

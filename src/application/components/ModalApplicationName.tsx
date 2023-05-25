import React, { useCallback } from "react";
import {
  CButton,
  CForm,
  CInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import { ReactSVG } from "react-svg";
import ArrowRight from "../../common/assets/images/arrow-right-white.svg";

type ModalApplicationNameProps = {
  name: string;
  isShown: boolean;
  errorText: string;
  isLoading: boolean;
  submitButtonText: string;
  onNameChange: (name: string) => void;
  toggler: () => void;
  onModalSubmit: () => void;
};

const ModalApplicationName: React.FunctionComponent<ModalApplicationNameProps> = ({
  name,
  errorText,
  isShown,
  isLoading,
  submitButtonText,
  onNameChange,
  toggler,
  onModalSubmit,
}: ModalApplicationNameProps) => {
  const handleNameChange = useCallback(
    (name) => {
      onNameChange(name);
    },
    [onNameChange]
  );
  const handleSubmmit = useCallback(() => {
    onModalSubmit();
  }, [onModalSubmit]);
  return (
    <CModal
      show={isShown}
      onClose={toggler}
      data-testid="modal-application-name"
    >
      <CModalHeader>Application Name</CModalHeader>
      <CForm>
        <CModalBody>
          <CInput
            disabled={isLoading}
            type="text"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleNameChange(event.target.value)
            }
            value={name}
            placeholder="Enter applicant name"
            data-testid="application-name"
          />
          {errorText && <span className="text-danger">{errorText}</span>}
        </CModalBody>
        <CModalFooter>
          <CButton
            type="button"
            onClick={() => toggler()}
            className="quest-button secondary"
            disabled={isLoading}
            data-testid="modal-application-name-cancel"
          >
            Cancel
          </CButton>
          <CButton
            type="button"
            className="quest-button"
            disabled={isLoading}
            onClick={() => handleSubmmit()}
            data-testid="modal-application-name-submit"
          >
            {submitButtonText} <ReactSVG src={ArrowRight} />
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  );
};

export default ModalApplicationName;

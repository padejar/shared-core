import "./ModalExpired.scss";
import React, { useState } from "react";
import { CModal, CModalBody } from "@coreui/react";
import { Link } from "react-router-dom";

const ModalExpired: React.FunctionComponent = () => {
  const [shown, setShown] = useState(true);
  return (
    <CModal
      className="modal-expired"
      data-testid="session-expired-modal"
      show={shown}
      onClosed={() => setShown(true)}
      closeOnBackdrop={false}
    >
      <CModalBody>
        <h4 className="f-quest-navy f-bold">Attention</h4>
        <p className="f-quest-navy">
          Your session has been expired. Click the button below to renew your
          session.
        </p>
        <Link
          className="quest-button purple f-normal f-14"
          data-testid="login-button"
          to="/auth/login"
        >
          Login
        </Link>
      </CModalBody>
    </CModal>
  );
};

export default ModalExpired;

import "./ReturnToDashboard.scss";
import React from "react";
import { CLink, CModal, CModalBody } from "@coreui/react";

type ReturnToDashboardProps = {
  isShown: boolean;
  toggler: () => void;
  dashboardLink: string;
};
const ReturnToDashboard: React.FunctionComponent<ReturnToDashboardProps> = ({
  isShown,
  toggler,
  dashboardLink,
}: ReturnToDashboardProps) => {
  return (
    <CModal
      className="modal-return-to-dashboard success"
      show={isShown}
      onClose={toggler}
      closeOnBackdrop={false}
      data-testid="return-to-dashboard-modal"
    >
      <CModalBody>
        <h4 className="f-quest-navy f-bold">Congratulations!</h4>
        <p className="f-quest-navy">
          Application has been submitted for assessment.
        </p>
        <CLink
          className="btn-link"
          href={dashboardLink}
          data-testid="return-to-dashboard-link"
        >
          Return to dashboard
        </CLink>
      </CModalBody>
    </CModal>
  );
};

export default ReturnToDashboard;

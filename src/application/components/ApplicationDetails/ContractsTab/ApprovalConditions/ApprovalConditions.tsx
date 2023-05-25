import React, { useEffect } from "react";
import { CCol, CRow } from "@coreui/react";
import { useSelector } from "react-redux";
import { getApprovalConditions } from "../../../../actions/creators/contracts";
import { APPLICATION_PUBLIC_STATUSES } from "../../../../constants/applicationStatuses";
import { useContractsDispatch } from "../../../../dispatchers";
import { getApplicationSelector } from "../../../../selectors/applicationForm";
import {
  getApprovalConditionsSelector,
  getApproverSelector,
} from "../../../../selectors/contracts";

const validStatus: string[] = [
  APPLICATION_PUBLIC_STATUSES.APPROVED,
  APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT,
  APPLICATION_PUBLIC_STATUSES.SETTLED,
];
const ApprovalConditions: React.FunctionComponent = () => {
  const approvalConditions = useSelector(getApprovalConditionsSelector);
  const application = useSelector(getApplicationSelector);
  const approver = useSelector(getApproverSelector);
  const dispatch = useContractsDispatch();
  const showApprovalCondition = validStatus.includes(application.publicStatus);

  useEffect(() => {
    if (showApprovalCondition) {
      dispatch(getApprovalConditions(application.id as string));
    }
  }, [dispatch, application, showApprovalCondition]);

  if (!showApprovalCondition) return null;

  return (
    <>
      <hr className="divider" />
      <CRow>
        <CCol xs={12} className="approval-conditions">
          <CRow>
            <CCol xl={9}>
              <CRow>
                {approvalConditions.length > 0 && (
                  <CCol sm={8}>
                    <h3 className="f-bold f-quest-navy mb-4">
                      Approval conditions
                    </h3>
                    <ul data-testid="approval-conditions">
                      {approvalConditions.map((approvalCondition, index) => (
                        <li
                          key={index}
                          data-testid={`approval-condition-${index}`}
                        >
                          {approvalCondition}
                        </li>
                      ))}
                    </ul>
                  </CCol>
                )}
                {approver !== null && (
                  <CCol sm={4}>
                    <h3 className="f-bold f-quest-navy mb-4">Approved by</h3>
                    <span
                      className="f-quest-navy"
                      data-testid="approver-name"
                    >{`${approver.firstName} ${approver.lastName}`}</span>{" "}
                    <br />
                    <br />
                    <span
                      className="f-quest-navy"
                      data-testid="approver-mobile"
                    >
                      {approver.mobile}
                    </span>{" "}
                    <br />
                    <br />
                    <span className="f-quest-navy" data-testid="approver-email">
                      {approver.email}
                    </span>
                  </CCol>
                )}
              </CRow>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </>
  );
};

export default ApprovalConditions;

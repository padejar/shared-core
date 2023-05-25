import "./index.scss";
import React, { useEffect } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch, useHistory, Link } from "react-router-dom";
import ConfirmationModal, {
  MODAL_TYPE,
} from "../../../common/components/ConfirmationModal";
import Loading from "../../../common/components/Loading";
import {
  actionCreator as notifAction,
  dispatch,
  selector,
} from "../../../notification";
import {
  clearApplicationState,
  clearClonedApplicationId,
  clearRedirectPath,
  getApplicationDetails,
  resetApplicationDetails,
  revertChanges,
  saveForm,
  setActiveStep,
  setIsApplicationAmended,
} from "../../actions/creators/applicationForm";
import IconStep from "../../components/IconStep";
import { APPLICATION_PUBLIC_STATUS_LABELS } from "../../constants/applicationStatuses";
import {
  APPLICATION_STEPS,
  APPLICATION_STEPS_LABELS,
} from "../../constants/applicationSteps";
import { NOTIFICATION_IDS } from "../../constants/notificationIds";
import { REDIRECT_TYPES } from "../../constants/redirectTypes";
import { useApplicationFormDispatch } from "../../dispatchers";
import { default as tabRoutes } from "../../routes/application-details";
import {
  getApplicationSelector,
  getCurrentStepSelector,
  getDetailsLoadingSelector,
  getIsApplicationAmendedSelector,
  getIsFormLoadingSelector,
  getNextPathSelector,
  getRedirectSelector,
  getStepsSelector,
} from "../../selectors/applicationForm";
import { ApplicationSteps } from "../../types/ApplicationStep";

const { useNotificationDispatch } = dispatch;

type ApplicationDetailsProps = {
  applicationId?: string;
  tabName?: APPLICATION_STEPS;
  pageAfterSave?: string;
  assessmentUrl?: string;
};

/**
 * @param {string} applicationId - the id of an application to be retrieved
 * @param {string} tabName - current active tab, can be retrieved from the match.params object
 * @param {string} pageAfterSave - path to which the page will be redirected after hitting the "Save and exit" button
 * @param {string} assessmentUrl - needs to include {{ASSESSMENT_ID}} template string to be replaced by the actual `assessmentId`
 */
const ApplicationDetails: React.FunctionComponent<ApplicationDetailsProps> = ({
  applicationId,
  tabName,
  pageAfterSave = "/application/applications",
  assessmentUrl,
}: ApplicationDetailsProps) => {
  const history = useHistory();

  const application = useSelector(getApplicationSelector);
  const isApplicationAmended = useSelector(getIsApplicationAmendedSelector);
  const currentStep = useSelector(getCurrentStepSelector);
  const getDetailsLoading = useSelector(getDetailsLoadingSelector);
  const steps = useSelector(getStepsSelector);
  const redirect = useSelector(getRedirectSelector);
  const isFormLoading = useSelector(getIsFormLoadingSelector);
  const nextPath = useSelector(getNextPathSelector);
  const errorMessage = useSelector(
    selector.notificationItemSelector(
      NOTIFICATION_IDS.NOT_FOUND_ERRORS + applicationId
    )
  );

  const dispatch = useApplicationFormDispatch();
  const notifDispatch = useNotificationDispatch();

  useEffect(() => {
    if (errorMessage) {
      history.replace(pageAfterSave);
    }
  }, [errorMessage, history, pageAfterSave, notifDispatch]);

  useEffect(() => {
    notifDispatch(notifAction.clearNotification());
    return () => {
      dispatch(clearApplicationState());
    };
  }, [dispatch, notifDispatch]);

  useEffect(() => {
    dispatch(clearClonedApplicationId());
    if (applicationId === "new") {
      dispatch(resetApplicationDetails());
    } else {
      dispatch(getApplicationDetails(applicationId));
    }
  }, [dispatch, applicationId]);

  useEffect(() => {
    if (typeof tabName !== "undefined") {
      if (typeof APPLICATION_STEPS_LABELS[tabName] === "undefined") {
        notifDispatch(
          notifAction.setNotification({
            body: "The resource you're trying to access is not available",
          })
        );
        history.replace(pageAfterSave);
      }

      dispatch(setActiveStep(tabName));
    }
  }, [tabName, pageAfterSave, history, dispatch, notifDispatch]);

  useEffect(() => {
    if (redirect.redirectPath) {
      dispatch(clearRedirectPath());
      if (redirect.redirectType === REDIRECT_TYPES.PUSH) {
        history.push(redirect.redirectPath);
      } else {
        history.replace(redirect.redirectPath);
      }
    }
  }, [redirect, history, dispatch]);

  return (
    <>
      <CRow className="quest-page-header-section">
        <CCol xs={12} className="align-items-center d-flex">
          {application.applicant && application.applicant.entityName ? (
            <h2 className="quest-header-text">
              <span>
                {APPLICATION_PUBLIC_STATUS_LABELS[application.publicStatus]}
                {" - "}
                {application.applicant.entityName}
              </span>
            </h2>
          ) : (
            <h2 className="quest-header-text">
              <span>New Application</span>
            </h2>
          )}
        </CCol>
      </CRow>
      <CRow className="quest-details-content-section application-details-content">
        <CCol xl={12}>
          <CCard className="quest-card">
            <CCardHeader>
              <ul className="application-steps">
                {currentStep &&
                  Object.keys(steps).map((key) => {
                    const step = steps[key as keyof ApplicationSteps];
                    return (
                      <IconStep
                        key={key}
                        isActive={currentStep.stepSlug === step.stepSlug}
                        isDone={step.isStepDone}
                        isClickable={
                          applicationId !== "new" && step.isClickable
                        }
                        onClick={() =>
                          dispatch(setActiveStep(step.stepSlug, tabName))
                        }
                        iconPath={step.stepIcon}
                        stepName={step.stepName}
                      />
                    );
                  })}
              </ul>
              {applicationId !== "new" && (
                <div className="application-info">
                  {application.assessmentId && assessmentUrl && (
                    <Link
                      className="quest-button admin-link"
                      to={assessmentUrl.replace(
                        "{{ASSESSMENT_ID}}",
                        application.assessmentId
                      )}
                      data-testid="assessment-admin-link"
                    >
                      View Assessment
                    </Link>
                  )}
                  <span className="contract-no-text">
                    Loan # {application.applicationNumber}
                  </span>
                  {application.user && (
                    <span className="application-number">
                      {application.user.client} ({application.user.firstName}{" "}
                      {application.user.lastName})
                    </span>
                  )}
                </div>
              )}
            </CCardHeader>
            {currentStep && (
              <CCol xs={12} className="step-header">
                <img src={currentStep.headerIcon} alt="step-icon" />
                <h2 className="step-name" data-testid="step-name">
                  {currentStep.stepName}
                </h2>
              </CCol>
            )}
            <CCardBody>
              <Switch>
                {tabRoutes.map((route, index) => (
                  <Route key={index} path={route.path} exact={route.exact}>
                    <route.component
                      applicationId={applicationId}
                      pageAfterSave={pageAfterSave}
                    />
                  </Route>
                ))}
                <Redirect
                  from="/application/applications/new"
                  to="/application/applications/new/quotes"
                />
              </Switch>
            </CCardBody>
          </CCard>
        </CCol>
        {getDetailsLoading && <Loading text="Loading application..." />}
        {isFormLoading && <Loading text="Saving application..." />}
      </CRow>
      {isApplicationAmended && (
        <ConfirmationModal
          modalType={MODAL_TYPE.WARNING}
          isShown={isApplicationAmended}
          toggler={() =>
            dispatch(setIsApplicationAmended(!isApplicationAmended))
          }
          bodyText="You have amended this application"
          onCancel={() =>
            dispatch(revertChanges(tabName as APPLICATION_STEPS, nextPath))
          }
          onConfirm={() =>
            dispatch(
              saveForm(
                tabName as APPLICATION_STEPS,
                applicationId as string,
                true,
                nextPath
              )
            )
          }
          cancelButtonText="Cancel amendment"
          confirmButtonText="Save and continue"
          testId="amendment"
        />
      )}
    </>
  );
};

export default ApplicationDetails;

import "../../assets/scss/auth.scss";
import React, { useEffect, useState } from "react";
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormGroup,
  CImg,
  CInput,
  CRow,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import QuestLogo from "../../../common/assets/images/quest-logo.svg";
import BareLayout from "../../../common/components/BareLayout";
import {
  BUTTON_COLORS,
  QuestButton,
} from "../../../common/components/QuestButton";
import { PERMISSION_ACCESS_TYPES } from "../../../common/constants/permissionAccessTypes";
import { EMAIL_VALIDATION_PATTERN } from "../../../common/constants/validation";
import * as notification from "../../../notification";
import {
  sendResetLink,
  setIsFormSubmitted,
} from "../../actions/creators/resetPassword";
import { NOTIFICATION_IDS } from "../../constants/notificationIds";
import { useResetFormDispatch } from "../../dispatchers";
import {
  getIsFormLoadingSelector,
  getIsFormSubmittedSelector,
} from "../../selectors/resetPassword";

type ForgotPasswordProps = {
  source: PERMISSION_ACCESS_TYPES;
};

const {
  selector: { notificationItemSelector },
  actionCreator: { unsetNotification },
  dispatch: { useNotificationDispatch },
} = notification;

const ForgotPassword: React.FunctionComponent<ForgotPasswordProps> = ({
  source,
}: ForgotPasswordProps) => {
  const isFormSubmitted = useSelector(getIsFormSubmittedSelector);
  const isFormLoading = useSelector(getIsFormLoadingSelector);
  const notification = useSelector(
    notificationItemSelector(NOTIFICATION_IDS.RESET_PASSWORD)
  );
  const dispatchResetForm = useResetFormDispatch();
  const dispatchNotif = useNotificationDispatch();
  const [email, setEmail] = useState<string>("");
  const {
    register,
    trigger: validate,
    errors: validationErrors,
    clearErrors: clearFormErrors,
  } = useForm();

  useEffect(() => {
    dispatchResetForm(setIsFormSubmitted(false));
    dispatchNotif(unsetNotification(NOTIFICATION_IDS.RESET_PASSWORD));
    setEmail("");
  }, [dispatchResetForm, dispatchNotif]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    clearFormErrors();
  };

  const handleSendResetLink = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!(await validate())) return;
    dispatchResetForm(sendResetLink(email, source));
  };

  return (
    <BareLayout className="c-app c-default-layout flex-grow align-items-center custom auth-page">
      <CContainer fluid>
        <CRow className="justify-content-md-center">
          <CCol xl="3" lg="4" md="6" sm="10" className="quest-form auth-form">
            <CCard>
              <CCardHeader className="text-center  d-flex justify-content-center align-items-center">
                <CImg src={QuestLogo} className="logo" />
              </CCardHeader>
              <CCardBody className="text-center">
                {!isFormSubmitted ? (
                  <CForm onSubmit={handleSendResetLink}>
                    <h4 className="f-bold mb-4">Forgot Password</h4>
                    <p>
                      Enter your email and we&apos;ll send you a reset link.
                    </p>
                    {notification && (
                      <CAlert color="danger">{notification.body}</CAlert>
                    )}
                    <CFormGroup className="mb-4">
                      <div className="big-field has-icon">
                        <i className="cil-envelope-closed"></i>
                        <CInput
                          className="mb-2"
                          type="email"
                          name="email"
                          value={email}
                          onChange={handleChange}
                          innerRef={register({
                            required: "Email is required",
                            pattern: {
                              value: EMAIL_VALIDATION_PATTERN,
                              message: "Invalid email address",
                            },
                          })}
                          disabled={isFormLoading}
                          data-testid="email"
                        />
                      </div>
                      {validationErrors.email && (
                        <span
                          className="error-alert"
                          data-testid="errorEmailMessage"
                        >
                          {validationErrors.email.message}
                        </span>
                      )}
                    </CFormGroup>
                    <QuestButton
                      big
                      type="submit"
                      className="mb-2"
                      disabled={isFormLoading}
                      color={BUTTON_COLORS.CTA}
                      block
                      data-testid="submit-button"
                    >
                      {isFormLoading ? "Sending..." : "Send reset link"}
                    </QuestButton>
                  </CForm>
                ) : (
                  <>
                    <h4 className="f-bold mb-4" data-testid="successMessage">
                      Email Sent!
                    </h4>
                    <p>
                      If your email is registered with us, we have sent a link
                      to reset your password.
                    </p>
                  </>
                )}
                <Link to="/auth/login">Back to login page</Link>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </BareLayout>
  );
};

export default ForgotPassword;

import "../../assets/scss/auth.scss";
import React, { useEffect } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CCard,
  CCardBody,
  CFormGroup,
  CAlert,
  CCardHeader,
  CLabel,
  CInput,
  CImg,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import QuestLogo from "../../../common/assets/images/quest-logo.svg";
import BareLayout from "../../../common/components/BareLayout";
import {
  QuestButton,
  BUTTON_COLORS,
} from "../../../common/components/QuestButton";
import { PERMISSION_ACCESS_TYPES } from "../../../common/constants/permissionAccessTypes";
import { EMAIL_VALIDATION_PATTERN } from "../../../common/constants/validation";
import { getErrorClass } from "../../../common/utils/validation";
import { ERROR_CODES } from "../../../error-handler";
import * as notification from "../../../notification";
import {
  authenticate,
  updateAuthForm,
} from "../../actions/creators/authentication";
import IconLoginPassword from "../../assets/images/icon-login-password.svg";
import { RESTRICTED_APP_ACCESS } from "../../constants/errorMessages";
import { NOTIFICATION_IDS } from "../../constants/notificationIds";
import { useAuthenticationDispatch } from "../../dispatchers";
import {
  getAuthFormSelector,
  getIsAuthenticatedSelector,
  getIsFormLoadingSelector,
} from "../../selectors/authentication";
import { AuthenticationForm } from "../../types/AuthenticationForm";

type LoginProps = {
  redirectPath: string;
  source: PERMISSION_ACCESS_TYPES;
};
const {
  selector: { notificationItemSelector },
  actionCreator: { unsetNotification },
  dispatch: { useNotificationDispatch },
} = notification;

const Login: React.FunctionComponent<LoginProps> = ({
  redirectPath,
  source,
}: LoginProps) => {
  const authForm = useSelector(getAuthFormSelector);
  const isFormLoading = useSelector(getIsFormLoadingSelector);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const authNotif = useSelector(
    notificationItemSelector(NOTIFICATION_IDS.AUTHENTICATION)
  );
  const dispatchAuth = useAuthenticationDispatch();
  const dispatchNotif = useNotificationDispatch();
  const history = useHistory();
  const {
    register,
    trigger: validate,
    errors,
    clearErrors: clearFormErrors,
  } = useForm<AuthenticationForm>();

  useEffect(() => {
    dispatchNotif(unsetNotification(NOTIFICATION_IDS.AUTHENTICATION));
  }, [dispatchNotif]);

  useEffect(() => {
    if (isAuthenticated) history.replace(redirectPath);
  }, [isAuthenticated, history, redirectPath]);

  const handleAuthenticate = async () => {
    if (!(await validate())) return;
    dispatchAuth(authenticate(authForm, source));
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAuthenticate();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    clearFormErrors(name as keyof AuthenticationForm);
    dispatchAuth(
      updateAuthForm({
        [name]: value,
      })
    );
  };

  const renderErrorMessage = () => {
    if (!authNotif || !authNotif.body) return null;

    let message = <span>{authNotif.body}</span>;
    if (authNotif.body === ERROR_CODES.ACCOUNT_SUSPENDED) {
      message = (
        <span>
          Your account has been suspended. Please contact{" "}
          <a href="mailto:help@quest.finance">help@quest.finance</a> for further
          information.
        </span>
      );
    } else if (authNotif.body === ERROR_CODES.FORBIDDEN) {
      message = <span>{RESTRICTED_APP_ACCESS}</span>;
    }

    return (
      <CAlert color="danger" data-testid="loginErrorMessage">
        {message}
      </CAlert>
    );
  };

  return (
    <BareLayout className="c-app c-default-layout flex-grow align-items-center custom auth-page">
      <CContainer fluid>
        <CRow className="justify-content-md-center justify-content-sm-center">
          <CCol xl="3" lg="4" md="6" sm="10" className="auth-form">
            <CCard>
              <CCardHeader className="text-center  d-flex justify-content-center align-items-center">
                <CImg src={QuestLogo} className="logo" />
              </CCardHeader>
              <CCardBody>
                <CForm
                  onSubmit={handleOnSubmit}
                  className="text-center quest-form"
                  data-testid="loginForm"
                >
                  {renderErrorMessage()}
                  <CFormGroup className={`mb-3 ${getErrorClass(errors.email)}`}>
                    <CLabel>Email</CLabel>
                    <div className="big-field has-icon">
                      <i className="cil-envelope-closed"></i>
                      <CInput
                        type="email"
                        autoComplete="email"
                        name="email"
                        value={authForm.email}
                        onChange={handleChange}
                        disabled={isFormLoading}
                        innerRef={register({
                          required: "Email is required",
                          pattern: {
                            value: EMAIL_VALIDATION_PATTERN,
                            message: "Invalid email address",
                          },
                        })}
                        data-testid="emailField"
                      />
                    </div>
                    {errors.email && (
                      <span
                        className="validation-error"
                        data-testid="errorEmailMessage"
                      >
                        {errors.email.message}
                      </span>
                    )}
                  </CFormGroup>

                  <CFormGroup
                    className={`mb-4 ${getErrorClass(errors.password)}`}
                  >
                    <CLabel>Password</CLabel>
                    <div className="big-field has-icon">
                      <img src={IconLoginPassword} alt="icon-password" />
                      <CInput
                        type="password"
                        name="password"
                        autoComplete="password"
                        onChange={handleChange}
                        value={authForm.password}
                        disabled={isFormLoading}
                        innerRef={register({
                          required: "Password is required",
                        })}
                        data-testid="passwordField"
                      />
                    </div>
                    {errors.password && (
                      <span
                        className="validation-error"
                        data-testid="errorPasswordMessage"
                      >
                        {errors.password.message}
                      </span>
                    )}
                  </CFormGroup>
                  <QuestButton
                    big
                    type="submit"
                    className="mb-2"
                    disabled={isFormLoading}
                    data-testid="loginButton"
                    color={BUTTON_COLORS.CTA}
                    block
                  >
                    {isFormLoading ? "Logging in..." : "Login"}
                  </QuestButton>
                  <Link
                    to="/auth/forgot-password"
                    className="forgot-password-link"
                  >
                    Forgot Password?
                  </Link>

                  <span className="need-help">Need Help?</span>
                  <span className="need-help-details">
                    <a href="mailto:help@quest.finance">help@quest.finance</a>{" "}
                    or 1300 465 363
                  </span>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </BareLayout>
  );
};

export default Login;

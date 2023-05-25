import "../../assets/scss/auth.scss";
import React, { useEffect, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormGroup,
  CImg,
  CInput,
  CLabel,
  CLink,
  CRow,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import QuestLogo from "../../../common/assets/images/quest-logo.svg";
import {
  BUTTON_COLORS,
  QuestButton,
} from "../../../common/components/QuestButton";
import { getErrorClass } from "../../../common/utils/validation";
import { Notification } from "../../../notification";
import * as notification from "../../../notification";
import { PasswordRequirements, validatePassord } from "../../../user";
import { updatePassword } from "../../actions/creators/resetPassword";
import { useResetFormDispatch } from "../../dispatchers";
import {
  getIsFormLoadingSelector,
  getIsFormSubmittedSelector,
} from "../../selectors/resetPassword";
import { UpdatePasswordForm } from "../../types/UpdatePasswordForm";

const {
  dispatch: { useNotificationDispatch },
  actionCreator: { clearNotification },
} = notification;

const ResetPassword: React.FunctionComponent<RouteComponentProps> = ({
  location,
}: RouteComponentProps) => {
  const queryParams = new URLSearchParams(location.search);
  const {
    register,
    trigger,
    errors: validationErrors,
    watch,
    getValues,
    handleSubmit,
  } = useForm({});
  const code = useRef<string>(queryParams.get("code") || "");
  const isFormSubmitted = useSelector(getIsFormSubmittedSelector);
  const isLoading = useSelector(getIsFormLoadingSelector);
  const dispatch = useResetFormDispatch();
  const notificationDispatch = useNotificationDispatch();
  const password = useRef<string>("");
  password.current = watch("newPassword", "");

  useEffect(() => {
    return () => {
      notificationDispatch(clearNotification());
    };
  }, [notificationDispatch]);

  if (!code.current) {
    return <Redirect to="/" />;
  }

  const validate = async () => {
    let isValid = true;

    isValid = await trigger(["newPassword", "confirmPassword"]);

    return isValid;
  };

  const handleUpdatePassword = async (
    data: UpdatePasswordForm
  ): Promise<boolean> => {
    const isFormValid = await validate();

    if (!isFormValid) return false;

    dispatch(updatePassword(data.newPassword, code.current));

    return false;
  };

  return (
    <div className="c-app c-default-layout flex-grow align-items-center custom auth-page">
      <Notification />
      <CContainer fluid>
        <CRow className="justify-content-md-center ">
          <CCol xl="3" lg="4" md="6" sm="10" className="auth-form">
            <CCard>
              <CCardHeader className="text-center  d-flex justify-content-center align-items-center">
                <CImg src={QuestLogo} className="logo" />
              </CCardHeader>
              <CCardBody className="text-center">
                <h4 className="mb-3 f-bold">Reset your password</h4>
                {isFormSubmitted ? (
                  <p data-testid="successMessage">
                    Your password has been successfully reset. Please log in
                    using your new credentials
                  </p>
                ) : (
                  <CForm
                    onSubmit={(event) => event.preventDefault()}
                    className="quest-form"
                  >
                    <CFormGroup
                      className={`mb-4 ${getErrorClass(
                        validationErrors.newPassword
                      )}`}
                    >
                      <CLabel>New password</CLabel>
                      <div className="big-field">
                        <CInput
                          type="password"
                          autoComplete="newPassword"
                          name="newPassword"
                          disabled={isLoading}
                          innerRef={register({
                            required: "New password is required",
                            validate: (value) =>
                              validatePassord(value).result ||
                              "Please specify a valid password",
                          })}
                          data-testid="newPassword"
                        />
                        {validationErrors.newPassword && (
                          <span
                            className="validation-error"
                            data-testid="newPassword-error"
                          >
                            {validationErrors.newPassword.message}
                          </span>
                        )}
                        <div className="text-left mt-3">
                          <PasswordRequirements password={password.current} />
                        </div>
                      </div>
                    </CFormGroup>
                    <CFormGroup
                      className={`mb-4 ${getErrorClass(
                        validationErrors.newPassword
                      )}`}
                    >
                      <CLabel>Confirm new password</CLabel>
                      <div className="big-field">
                        <CInput
                          type="password"
                          autoComplete="confirmPassword"
                          name="confirmPassword"
                          disabled={isLoading}
                          innerRef={register({
                            required: "Password confirmation is required",
                            validate: (value) =>
                              value === getValues("newPassword") ||
                              "Password confirmation doesn't match",
                          })}
                          data-testid="confirmPassword"
                        />
                      </div>
                      {validationErrors.confirmPassword && (
                        <span
                          className="validation-error"
                          data-testid="confirmPassword-error"
                        >
                          {validationErrors.confirmPassword.message}
                        </span>
                      )}
                    </CFormGroup>

                    <QuestButton
                      big
                      type="submit"
                      className="mb-2"
                      disabled={isLoading}
                      color={BUTTON_COLORS.CTA}
                      block
                      onClick={handleSubmit<UpdatePasswordForm>(
                        handleUpdatePassword
                      )}
                      data-testid="submit-button"
                    >
                      {isLoading ? "Submitting..." : "Reset Password"}
                    </QuestButton>
                  </CForm>
                )}
                <CLink to="/auth/login">Back to login page</CLink>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetPassword;

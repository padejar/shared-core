import React, { useEffect, useRef } from "react";
import {
  CCard,
  CCardBody,
  CForm,
  CRow,
  CCol,
  CInput,
  CLabel,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import {
  BUTTON_COLORS,
  QuestButton,
} from "../../../common/components/QuestButton";
import { getErrorClass } from "../../../common/utils/validation";
import { changePasswordRequest } from "../../actions/creators/changePassword";
import PasswordRequirements from "../../components/PasswordRequirements/PasswordRequirements";
import { useChangePasswordDispatch } from "../../dispatchers";

import {
  getIsLoadingSelector,
  getIsSuccessSelector,
} from "../../selectors/changePassword";
import {
  ChangePassword as ChangePasswordType,
  changePasswordDefaultValue,
} from "../../types/ChangePassword";
import { validatePassord } from "../../util/";

const ChangePassword: React.ElementType<RouteComponentProps> = () => {
  const {
    errors: validationErrors,
    trigger: validate,
    handleSubmit,
    register,
    watch,
    setValue,
    getValues,
  } = useForm<ChangePasswordType>({
    defaultValues: changePasswordDefaultValue,
  });

  const isLoading = useSelector(getIsLoadingSelector);
  const isSuccess = useSelector(getIsSuccessSelector);
  const newPassword = useRef<string>("");
  newPassword.current = watch("newPassword", "");

  const dispatch = useChangePasswordDispatch();

  useEffect(() => {
    if (isSuccess) {
      setValue("oldPassword", "");
      setValue("newPassword", "");
      setValue("newPasswordConfirm", "");
    }
  }, [isSuccess, setValue]);

  const handleChangePassword = async (data: ChangePasswordType) => {
    if (!(await validate())) return;

    dispatch(changePasswordRequest(data));
  };

  return (
    <CRow>
      <CCol lg={6}>
        <CCard>
          <CForm
            className="quest-form"
            onSubmit={handleSubmit(handleChangePassword)}
          >
            <CCardBody>
              <h3 className="f-quest-navy f-bold mb-4">Change Password</h3>
              <CRow>
                <CCol
                  md={12}
                  className={`form-group ${getErrorClass(
                    validationErrors.oldPassword
                  )}`}
                >
                  <CLabel>Current password*</CLabel>
                  <CInput
                    type="password"
                    name="oldPassword"
                    disabled={isLoading}
                    autoComplete=""
                    innerRef={register({
                      required: "Current password is required",
                    })}
                    data-testid="current-password"
                  />
                  {validationErrors.oldPassword && (
                    <span
                      className="validation-error"
                      data-testid="current-password-error"
                    >
                      {validationErrors.oldPassword.message}
                    </span>
                  )}
                </CCol>
              </CRow>
              <CRow>
                <CCol
                  md={12}
                  className={`form-group ${getErrorClass(
                    validationErrors.newPassword
                  )}`}
                >
                  <CLabel>New password*</CLabel>
                  <CInput
                    type="password"
                    name="newPassword"
                    disabled={isLoading}
                    autoComplete=""
                    innerRef={register({
                      required: "New password is required",
                      validate: (value) =>
                        validatePassord(value).result ||
                        "Please specify a valid password",
                    })}
                    data-testid="new-password"
                  />
                  {validationErrors.newPassword && (
                    <span
                      className="validation-error"
                      data-testid="new-password-error"
                    >
                      {validationErrors.newPassword.message}
                    </span>
                  )}
                </CCol>
                <PasswordRequirements password={newPassword.current} />
              </CRow>
              <CRow>
                <CCol
                  md={12}
                  className={`form-group ${getErrorClass(
                    validationErrors.newPasswordConfirm
                  )}`}
                >
                  <CLabel>New password confirmation*</CLabel>
                  <CInput
                    type="password"
                    name="newPasswordConfirm"
                    disabled={isLoading}
                    autoComplete=""
                    innerRef={register({
                      required: "Password confirmation is required",
                      validate: (value) =>
                        value === getValues("newPassword") ||
                        "Password confirmation doesn't match",
                    })}
                    data-testid="confirm-password"
                  />
                  {validationErrors.newPasswordConfirm && (
                    <span
                      className="validation-error"
                      data-testid="confirm-password-error"
                    >
                      {validationErrors.newPasswordConfirm.message}
                    </span>
                  )}
                </CCol>
              </CRow>
              <div className="d-flex mt-4">
                <QuestButton
                  color={BUTTON_COLORS.CTA}
                  disabled={isLoading}
                  type="submit"
                  className="justify-self-end"
                  data-testid="submit-button"
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </QuestButton>
              </div>
            </CCardBody>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ChangePassword;

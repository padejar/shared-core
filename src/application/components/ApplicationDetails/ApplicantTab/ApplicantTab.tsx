import React, { useEffect, useState } from "react";
import { CAlert, CCol, CInput, CLabel, CRow, CSelect } from "@coreui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  ABNLookup,
  ACNLookup,
  ABNResponse,
  ACNResponse,
} from "../../../../abn";
import { AddressAutoComplete } from "../../../../address-autocomplete";
import { NumberField } from "../../../../common/components/NumberField";
import {
  ENTITY_TYPES,
  ENTITY_TYPE_LABELS,
} from "../../../../common/constants/entityTypes";
import { Dictionary } from "../../../../common/types/Dictionary";
import { dateFormat } from "../../../../common/utils/date";
import { getErrorClass } from "../../../../common/utils/validation";
import {
  setFormErrors,
  getErrorMessageSelector,
  FieldErrors,
} from "../../../../error-handler";
import {
  saveAndExit,
  saveApplicant,
  setActiveStep,
  updateApplicant,
} from "../../../actions/creators/applicationForm";
import { APPLICATION_STATUS_GROUP } from "../../../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../../../constants/applicationSteps";
import {
  INDUSTRY_LABELS,
  INDUSTRY_OPTIONS,
} from "../../../constants/industryTypes";
import {
  TRUSTEE_TYPES,
  TRUSTEE_TYPE_LABELS,
} from "../../../constants/trusteeTypes";
import { useApplicationFormDispatch } from "../../../dispatchers";
import {
  getApplicantFormSelector,
  getApplicationApplicantSelector,
  getApplicationStatusSelector,
  getIsApplicationStatusLockedSelector,
  getIsFormLoadingSelector,
} from "../../../selectors/applicationForm";
import { ApplicantForm } from "../../../types/ApplicantForm";
import { ApplicationTabProps } from "../../../types/ApplicationForm";
import { getAddressFromEntity } from "../../../utils/address";
import { applicantSchema } from "../../../validations/applicant";
import ButtonsContainer from "../../ButtonsContainer";

const ApplicantTab: React.FunctionComponent<ApplicationTabProps> = ({
  applicationId,
  pageAfterSave,
}: ApplicationTabProps) => {
  const applicationStatus = useSelector(getApplicationStatusSelector);
  const applicant = useSelector(getApplicationApplicantSelector);
  const applicantForm = useSelector(getApplicantFormSelector);
  const isFormLoading = useSelector(getIsFormLoadingSelector);
  const errors = useSelector(getErrorMessageSelector);
  const isApplicationLocked = useSelector(getIsApplicationStatusLockedSelector);
  const dispatch = useApplicationFormDispatch();
  const hookFormMethods = useForm<ApplicantForm>({
    resolver: joiResolver(applicantSchema),
  });
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);

  const [industryTypes, setIndustryTypes] = useState<Dictionary>({});

  useEffect(() => {
    if (errors) {
      if (typeof errors !== "string") {
        setFormErrors<ApplicantForm>(
          errors as FieldErrors,
          hookFormMethods.setError
        );
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }, [errors, hookFormMethods.setError]);

  useEffect(() => {
    if (applicant && applicant.id) setIsFormExpanded(true);
  }, [applicant]);

  useEffect(() => {
    hookFormMethods.setValue("abn", applicantForm.abn);
    hookFormMethods.setValue("trusteeAcn", applicantForm.trusteeAcn);
    hookFormMethods.setValue("phone", applicantForm.phone);
    hookFormMethods.setValue(
      "addressInputType",
      applicantForm.addressInputType
    );

    if (applicantForm.industry) {
      const industryTypeOptions = (INDUSTRY_OPTIONS[
        applicantForm.industry
      ] as unknown) as Dictionary;
      setIndustryTypes(industryTypeOptions);
    }
  }, [applicantForm, hookFormMethods]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    dispatch(
      updateApplicant({
        [name]: value,
      })
    );
    hookFormMethods.clearErrors(name as keyof ApplicantForm);
  };

  const handleFormattedFieldsChange = (fieldName: string, value: string) => {
    dispatch(
      updateApplicant({
        [fieldName]: value,
      })
    );
    hookFormMethods.clearErrors(fieldName as keyof ApplicantForm);
  };

  const handleSaveApplicant = (
    isDraft: boolean,
    nextStep?: APPLICATION_STEPS
  ) => {
    let nextPath;
    if (nextStep) {
      nextPath = `/application/applications/${applicationId}/${nextStep}`;
    }
    dispatch(
      saveApplicant(applicationId as string, applicantForm, isDraft, nextPath)
    );
  };

  const handleSaveAndExit = () => {
    dispatch(saveAndExit(APPLICATION_STEPS.applicant, pageAfterSave));
  };

  const handlePreviousClick = () => {
    if (
      (APPLICATION_STATUS_GROUP.TO_BE_SUBMITTED as string[]).includes(
        applicationStatus
      )
    ) {
      handleSaveApplicant(true, APPLICATION_STEPS.quotes);
    } else {
      dispatch(
        setActiveStep(APPLICATION_STEPS.quotes, APPLICATION_STEPS.applicant)
      );
    }
  };

  const handleNextClick = async () => {
    const isFormValid = await hookFormMethods.trigger();
    if (!isFormValid) return;

    if (
      (APPLICATION_STATUS_GROUP.TO_BE_SUBMITTED as string[]).includes(
        applicationStatus
      )
    ) {
      handleSaveApplicant(false, APPLICATION_STEPS.guarantors);
    } else {
      dispatch(
        setActiveStep(APPLICATION_STEPS.guarantors, APPLICATION_STEPS.applicant)
      );
    }
  };

  const onABNFound = (data: ABNResponse | null) => {
    if (data) {
      dispatch(
        updateApplicant({
          entityName: data.entityName,
          entityType: data.entityType ?? "",
          tradingName:
            data.tradingNames && data.tradingNames.length > 0
              ? data.tradingNames[0]
              : "",
          trusteeType: "",
          trusteeAcn: "",
          trusteeName: "",
          abnRegisteredDate: data.abnActiveFrom
            ? dateFormat(new Date(data.abnActiveFrom), "dd/MM/yyyy")
            : "",
          gstRegisteredDate: data.gstActiveFrom
            ? dateFormat(new Date(data.gstActiveFrom), "dd/MM/yyyy")
            : "",
        })
      );
      hookFormMethods.clearErrors("abn");
    } else {
      hookFormMethods.setError("abn", {
        type: "validate",
        message: "ABN Not found",
      });
    }
    setIsFormExpanded(true);
  };

  const onACNFound = (data: ACNResponse | null) => {
    if (data) {
      dispatch(
        updateApplicant({
          trusteeName: data.entityName,
        })
      );
      hookFormMethods.clearErrors("trusteeAcn");
    } else {
      hookFormMethods.setError("trusteeAcn", {
        type: "validate",
        message: "ACN not found - please input the trustee name manually",
      });
    }
  };

  return (
    <>
      {errors && typeof errors === "string" && (
        <CAlert color="danger">{errors}</CAlert>
      )}
      <form autoComplete="off" className="quest-form applicant-form">
        <CRow>
          <CCol
            xl={3}
            xs={12}
            className={`form-group ${getErrorClass(
              hookFormMethods.errors.abn
            )}`}
          >
            <CLabel className="required">ABN</CLabel>
            <Controller
              name="abn"
              control={hookFormMethods.control}
              defaultValue={applicantForm.abn}
              render={({ onChange, value }) => (
                <ABNLookup
                  readOnly={isApplicationLocked}
                  value={value}
                  onAbnFound={onABNFound}
                  onValueChange={(values) => {
                    onChange(values.value);
                    handleFormattedFieldsChange("abn", values.value);
                  }}
                />
              )}
            />

            {hookFormMethods.errors.abn && (
              <span className="validation-error" data-testid="abn-error">
                {hookFormMethods.errors.abn.message}
              </span>
            )}
          </CCol>
        </CRow>
        <CRow
          data-testid="applicant-form-row-1"
          className={`${isFormExpanded ? "" : "d-none"}`}
        >
          <CCol
            xl={3}
            xs={12}
            className={`form-group ${getErrorClass(
              hookFormMethods.errors.entityName
            )}`}
          >
            <CLabel className="required">Entity name</CLabel>
            <CInput
              readOnly={isApplicationLocked}
              innerRef={hookFormMethods.register()}
              name="entityName"
              type="text"
              onChange={handleChange}
              value={applicantForm.entityName}
              disabled={isFormLoading}
              data-testid="entityName"
            />
            {hookFormMethods.errors.entityName && (
              <span className="validation-error" data-testid="entityName-error">
                {hookFormMethods.errors.entityName.message}
              </span>
            )}
          </CCol>
          <CCol
            xl={3}
            xs={12}
            className={`form-group ${getErrorClass(
              hookFormMethods.errors.tradingName
            )}`}
          >
            <CLabel>Trading name</CLabel>
            <CInput
              readOnly={isApplicationLocked}
              innerRef={hookFormMethods.register()}
              name="tradingName"
              type="text"
              onChange={handleChange}
              value={applicantForm.tradingName}
              disabled={isFormLoading}
              data-testid="tradingName"
            />
            {hookFormMethods.errors.tradingName && (
              <span
                className="validation-error"
                data-testid="tradingName-error"
              >
                {hookFormMethods.errors.tradingName.message}
              </span>
            )}
          </CCol>
          <CCol
            xl={3}
            xs={12}
            className={`form-group ${getErrorClass(
              hookFormMethods.errors.entityType
            )}`}
          >
            <CLabel className="required">Type of entity</CLabel>
            <CSelect
              innerRef={hookFormMethods.register()}
              name="entityType"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                dispatch(
                  updateApplicant({
                    entityType: event.target.value,
                    trusteeType: "",
                    trusteeAcn: "",
                    trusteeName: "",
                  })
                );
                hookFormMethods.clearErrors("entityType");
              }}
              value={applicantForm.entityType}
              disabled={isFormLoading || isApplicationLocked}
              data-testid="entityType"
            >
              <option value="">Select</option>
              {Object.keys(ENTITY_TYPE_LABELS).map((value, key) => (
                <option key={key} value={value}>
                  {ENTITY_TYPE_LABELS[value]}
                </option>
              ))}
            </CSelect>
            {hookFormMethods.errors.entityType && (
              <span className="validation-error" data-testid="entityType-error">
                {hookFormMethods.errors.entityType.message}
              </span>
            )}
          </CCol>
        </CRow>
        {applicantForm.entityType === ENTITY_TYPES.TRUST && (
          <>
            <CRow>
              <CCol
                xl={3}
                xs={12}
                className={`form-group ${getErrorClass(
                  hookFormMethods.errors.trusteeType
                )}`}
              >
                <CLabel className="required">Trustee type</CLabel>
                <CSelect
                  innerRef={hookFormMethods.register()}
                  name="trusteeType"
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    dispatch(
                      updateApplicant({
                        trusteeType: event.target.value,
                        trusteeAcn: "",
                      })
                    );
                    hookFormMethods.clearErrors("trusteeType");
                  }}
                  value={applicantForm.trusteeType}
                  disabled={isFormLoading || isApplicationLocked}
                  data-testid="trusteeType"
                >
                  <option value="">Select</option>
                  {Object.keys(TRUSTEE_TYPE_LABELS).map((value, key) => (
                    <option key={key} value={value}>
                      {TRUSTEE_TYPE_LABELS[value]}
                    </option>
                  ))}
                </CSelect>
                {hookFormMethods.errors.trusteeType && (
                  <span
                    className="validation-error"
                    data-testid="trusteeType-error"
                  >
                    {hookFormMethods.errors.trusteeType.message}
                  </span>
                )}
              </CCol>
            </CRow>
            <CRow>
              {applicantForm.trusteeType === TRUSTEE_TYPES.COMPANY && (
                <CCol
                  xl={3}
                  xs={12}
                  className={`form-group ${getErrorClass(
                    hookFormMethods.errors.trusteeAcn
                  )}`}
                >
                  <CLabel>Trustee ACN</CLabel>
                  <Controller
                    name="trusteeAcn"
                    control={hookFormMethods.control}
                    defaultValue={applicantForm.trusteeAcn}
                    render={({ onChange, value }) => (
                      <ACNLookup
                        readOnly={isApplicationLocked}
                        value={value}
                        onAcnFound={onACNFound}
                        onValueChange={(values) => {
                          onChange(values.value);
                          handleFormattedFieldsChange(
                            "trusteeAcn",
                            values.value
                          );
                        }}
                      />
                    )}
                  />
                  {hookFormMethods.errors.trusteeAcn && (
                    <span
                      className="validation-error"
                      data-testid="trustAcn-error"
                    >
                      {hookFormMethods.errors.trusteeAcn.message}
                    </span>
                  )}
                </CCol>
              )}
              <CCol
                xl={3}
                xs={12}
                className={`form-group ${getErrorClass(
                  hookFormMethods.errors.trusteeName
                )}`}
              >
                <CLabel>Trustee name</CLabel>
                <CInput
                  readOnly={isApplicationLocked}
                  innerRef={hookFormMethods.register()}
                  name="trusteeName"
                  type="text"
                  onChange={handleChange}
                  value={
                    applicantForm.trusteeName ? applicantForm.trusteeName : ""
                  }
                  disabled={isFormLoading}
                  data-testid="trusteeName"
                />
                {hookFormMethods.errors.trusteeName && (
                  <span
                    className="validation-error"
                    data-testid="trusteeName-error"
                  >
                    {hookFormMethods.errors.trusteeName.message}
                  </span>
                )}
              </CCol>
            </CRow>
          </>
        )}
        <div
          data-testid="applicant-form-row-2"
          className={`${isFormExpanded ? "" : "d-none"}`}
        >
          <CRow>
            <CCol
              xl={3}
              xs={12}
              className={`form-group ${getErrorClass(
                hookFormMethods.errors.abnRegisteredDate
              )}`}
            >
              <CLabel className="required">ABN registered date</CLabel>
              <NumberField
                readOnly={isApplicationLocked}
                getInputRef={hookFormMethods.register()}
                name="abnRegisteredDate"
                type="tel"
                displayType="input"
                onValueChange={(values) => {
                  handleFormattedFieldsChange(
                    "abnRegisteredDate",
                    values.formattedValue
                  );
                }}
                value={applicantForm.abnRegisteredDate}
                disabled={isFormLoading}
                placeholder="DD / MM / YYYY"
                format="##/##/####"
                data-testid="abnRegisteredDate"
              />
              {hookFormMethods.errors.abnRegisteredDate && (
                <span
                  className="validation-error"
                  data-testid="abnRegisteredDate-error"
                >
                  {hookFormMethods.errors.abnRegisteredDate.message}
                </span>
              )}
            </CCol>
            <CCol
              xl={3}
              xs={12}
              className={`form-group ${getErrorClass(
                hookFormMethods.errors.gstRegisteredDate
              )}`}
            >
              <CLabel>GST registered date</CLabel>
              <NumberField
                readOnly={isApplicationLocked}
                getInputRef={hookFormMethods.register()}
                name="gstRegisteredDate"
                type="tel"
                displayType="input"
                onValueChange={(values) => {
                  handleFormattedFieldsChange(
                    "gstRegisteredDate",
                    values.formattedValue
                  );
                }}
                value={applicantForm.gstRegisteredDate}
                disabled={isFormLoading}
                placeholder="DD / MM / YYYY"
                format="##/##/####"
                data-testid="gstRegisteredDate"
              />
              {hookFormMethods.errors.gstRegisteredDate && (
                <span
                  className="validation-error"
                  data-testid="gstRegisteredDate-error"
                >
                  {hookFormMethods.errors.gstRegisteredDate.message}
                </span>
              )}
            </CCol>
            <CCol
              xl={3}
              xs={12}
              className={`form-group ${getErrorClass(
                hookFormMethods.errors.phone
              )}`}
            >
              <CLabel className="required">Business phone number</CLabel>
              <Controller
                name="phone"
                defaultValue={applicantForm.phone}
                control={hookFormMethods.control}
                render={({ onChange, value }) => (
                  <NumberField
                    readOnly={isApplicationLocked}
                    name="phone"
                    type="tel"
                    onValueChange={(values) => {
                      onChange(values.value);
                      handleFormattedFieldsChange("phone", values.value);
                    }}
                    value={value}
                    disabled={isFormLoading}
                    format="## #### ####"
                    data-testid="phone"
                  />
                )}
              />

              {hookFormMethods.errors.phone && (
                <span className="validation-error" data-testid="phone-error">
                  {hookFormMethods.errors.phone.message}
                </span>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol
              xl={3}
              xs={12}
              className={`form-group ${getErrorClass(
                hookFormMethods.errors.industry
              )}`}
            >
              <CLabel className="required">Industry</CLabel>
              <CSelect
                innerRef={hookFormMethods.register()}
                name="industry"
                onChange={handleChange}
                value={applicantForm.industry}
                disabled={isFormLoading || isApplicationLocked}
                data-testid="industry"
              >
                <option value="">Select</option>
                {Object.keys(INDUSTRY_LABELS).map((option, index) => (
                  <option key={index} value={option}>
                    {INDUSTRY_LABELS[option]}
                  </option>
                ))}
              </CSelect>
              {hookFormMethods.errors.industry && (
                <span className="validation-error" data-testid="industry-error">
                  {hookFormMethods.errors.industry.message}
                </span>
              )}
            </CCol>
            <CCol
              xl={3}
              xs={12}
              className={`form-group ${getErrorClass(
                hookFormMethods.errors.industryType
              )}`}
            >
              <CLabel className="required">Industry type</CLabel>
              <CSelect
                innerRef={hookFormMethods.register()}
                name="industryType"
                onChange={handleChange}
                value={applicantForm.industryType}
                disabled={isFormLoading || isApplicationLocked}
                data-testid="industryType"
              >
                <option value="">Select</option>
                {typeof industryTypes !== "undefined" &&
                  Object.keys(industryTypes).map((option, index) => (
                    <option key={index} value={option}>
                      {industryTypes[option]}
                    </option>
                  ))}
              </CSelect>
              {hookFormMethods.errors.industryType && (
                <span
                  className="validation-error"
                  data-testid="industryType-error"
                >
                  {hookFormMethods.errors.industryType.message}
                </span>
              )}
            </CCol>
          </CRow>
          <FormProvider {...hookFormMethods}>
            <AddressAutoComplete
              readOnly={isApplicationLocked}
              className="required"
              uniqueCheckboxId="applicant"
              labelName="Principle business address"
              onAddressUpdate={(address) =>
                dispatch(
                  updateApplicant({
                    ...address,
                  })
                )
              }
              address={getAddressFromEntity(applicantForm)}
              testIdPrefix="applicant"
            />
          </FormProvider>
          {Object.keys(hookFormMethods.errors).length > 0 && (
            <CAlert color="danger" data-testid="validation-error-message">
              There are missing or invalid information
            </CAlert>
          )}
        </div>

        <ButtonsContainer
          disabled={isFormLoading}
          disableSave={isApplicationLocked}
          onSaveClick={() => handleSaveAndExit()}
          onPreviousClick={() => handlePreviousClick()}
          onSubmitClick={() => handleNextClick()}
        />
      </form>
    </>
  );
};

export default ApplicantTab;

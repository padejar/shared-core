import React, { useCallback, useEffect, useState, useMemo } from "react";
import { CAlert, CCol, CInput, CLabel, CRow, CSelect } from "@coreui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ConfirmationModal, {
  MODAL_TYPE,
} from "../../../../common/components/ConfirmationModal";
import LabelRadioGroups from "../../../../common/components/LabelRadioGroups";
import { NumberField } from "../../../../common/components/NumberField";
import { validateYear } from "../../../../common/utils/date";
import { parseNumber } from "../../../../common/utils/number";
import { numberToString } from "../../../../common/utils/string";
import { getErrorClass } from "../../../../common/utils/validation";
import {
  setFormErrors,
  getErrorMessageSelector,
} from "../../../../error-handler";
import {
  GlassGuideModal,
  GLASS_GUIDE_MODEL_TYPE_CODES,
  GlassGuideValues,
  glassGuideCalculationResultDefaultValue,
} from "../../../../glass-guide";
import {
  checkGlassGuideAvailability,
  initSecurityForm,
  quoteChangedPopupToggle,
  saveAndExit,
  saveSecurity,
  setActiveStep,
  setGlassGuideShown,
  setRedirectPath,
  setSecurityComparison,
  updateSecurity,
} from "../../../actions/creators/applicationForm";
import ButtonsContainer from "../../../components/ButtonsContainer";
import ModalSecurityAlert from "../../../components/ModalSecurityAlert";
import SecurityDetailsButtons from "../../../components/SecurityDetailsButtons";
import { APPLICATION_STATUS_GROUP } from "../../../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../../../constants/applicationSteps";
import {
  ASSET_TYPE_CATEGORIES,
  ASSET_TYPE_LIST,
  PRIMARY_ASSETS,
} from "../../../constants/assetTypes";
import { REDIRECT_TYPES } from "../../../constants/redirectTypes";
import { SECURITY_DETAILS_INPUT_TYPES } from "../../../constants/securityDetailsInputTypes";
import { SUPPLIER_TYPE_LABELS } from "../../../constants/supplierTypes";
import { USAGE_TYPES, USAGE_TYPE_LABELS } from "../../../constants/usageTypes";
import { useApplicationFormDispatch } from "../../../dispatchers";
import {
  getApplicationSecuritySelector,
  getApplicationQuoteSelector,
  getApplicationStatusSelector,
  getIsFormLoadingSelector,
  getSecurityFormSelector,
  getIsGlassGuideAvailableSelector,
  getIsApplicationStatusLockedSelector,
  getSecurityComparisonSelector,
  getQuoteChangedPopupSelector,
  getContractGenerationErrorsSelector,
} from "../../../selectors/applicationForm";
import { ApplicationTabProps } from "../../../types/ApplicationForm";
import { SecurityForm } from "../../../types/SecurityForm";
import { securitySchema } from "../../../validations/security";

const SecurityTab: React.FunctionComponent<ApplicationTabProps> = ({
  applicationId,
  pageAfterSave,
}: ApplicationTabProps) => {
  const applicationSecurity = useSelector(getApplicationSecuritySelector);
  const applicationQuote = useSelector(getApplicationQuoteSelector);
  const applicationStatus = useSelector(getApplicationStatusSelector);
  const securityForm = useSelector(getSecurityFormSelector);
  const securityComparison = useSelector(getSecurityComparisonSelector);
  const isFormLoading = useSelector(getIsFormLoadingSelector);
  const errors = useSelector(getErrorMessageSelector);
  const isGlassGuideAvailable = useSelector(getIsGlassGuideAvailableSelector);
  const isApplicationLocked = useSelector(getIsApplicationStatusLockedSelector);
  const quoteChangedPopupShown = useSelector(getQuoteChangedPopupSelector);
  const [tempResultValues, setTempResultValues] = useState(
    glassGuideCalculationResultDefaultValue
  );
  const contractsGenerationErrors = useSelector(
    getContractGenerationErrorsSelector
  );
  const dispatch = useApplicationFormDispatch();
  const {
    register,
    trigger: validate,
    errors: validationErrors,
    setError,
    clearErrors,
    setValue,
    control,
  } = useForm<SecurityForm>({
    resolver: joiResolver(securitySchema),
  });

  const isKmDisplayed = useMemo(() => {
    return (
      securityForm.assetTypeCategory ===
        ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS ||
      (securityForm.assetTypeCategory ===
        ASSET_TYPE_CATEGORIES.PRIMARY_ASSETS &&
        securityForm.assetType === PRIMARY_ASSETS.HEAVY_TRUCKS)
    );
  }, [securityForm]);

  const isSecurityInputTypeDisplayed = useMemo(() => {
    return (
      isGlassGuideAvailable &&
      (securityForm.assetTypeCategory ===
        ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS ||
        (securityForm.assetTypeCategory ===
          ASSET_TYPE_CATEGORIES.PRIMARY_ASSETS &&
          securityForm.assetType === PRIMARY_ASSETS.HEAVY_TRUCKS))
    );
  }, [isGlassGuideAvailable, securityForm]);

  useEffect(() => {
    dispatch(checkGlassGuideAvailability());
  }, [dispatch]);

  useEffect(() => {
    setValue("supplierType", securityForm.supplierType);
    setValue("usageType", securityForm.usageType);
    setValue("manufactureYear", securityForm.manufactureYear);
    setValue("make", securityForm.make);
    setValue("model", securityForm.model);
    setValue("retailValue", securityForm.retailValue);
    setValue("actualKm", securityForm.actualKm);
  }, [securityForm, setValue]);

  useEffect(() => {
    if (applicationSecurity) {
      setTempResultValues({
        rrp: applicationSecurity.rrp ?? 0,
        trade: applicationSecurity.trade ?? 0,
        retail: applicationSecurity.retail ?? 0,
        kmAdjustmentTradeValue: applicationSecurity.kmAdjustmentTradeValue ?? 0,
        kmAdjustmentRetailValue:
          applicationSecurity.kmAdjustmentRetailValue ?? 0,
        optionsRrpValue: applicationSecurity.optionsRrpValue ?? 0,
        optionsTradeValue: applicationSecurity.optionsTradeValue ?? 0,
        optionsRetailValue: applicationSecurity.optionsRetailValue ?? 0,
        adjustedRrpValue: applicationSecurity.adjustedRrpValue ?? 0,
        adjustedTradeValue: applicationSecurity.adjustedTradeValue ?? 0,
        adjustedRetailValue: applicationSecurity.adjustedRetailValue ?? 0,
      });
    }
  }, [applicationSecurity]);

  useEffect(() => {
    if (errors) {
      if (typeof errors !== "string") {
        setFormErrors<SecurityForm>(errors, setError);
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }, [errors, setError]);

  useEffect(() => {
    if (typeof contractsGenerationErrors !== undefined) {
      for (const key in contractsGenerationErrors) {
        const message =
          contractsGenerationErrors[key as "serialNumber" | "supplierName"];
        if (message) {
          setError(key, {
            message,
            type: "required",
          });
        }
      }
    }
  }, [contractsGenerationErrors, setError]);

  useEffect(() => {
    dispatch(initSecurityForm());
  }, [dispatch, applicationQuote]);

  const onGlassGuideSelected = useCallback(
    (values: GlassGuideValues) => {
      let retailValue = values.adjustedRetailValue;
      if (securityForm.usageType === USAGE_TYPES.NEW) {
        retailValue = values.adjustedRrpValue;
      }
      dispatch(
        updateSecurity({
          make: values.manufacturerName,
          model: values.modelFullName,
          modelTypeCode: values.modelTypeCode,
          manufacturerCode: values.manufacturerCode,
          familyCode: values.familyCode,
          variantName: values.variantName,
          seriesCode: values.seriesCode ?? "",
          nvic: values.nvic,
          adjustedRetailValue: numberToString(values.adjustedRetailValue),
          adjustedRrpValue: numberToString(values.adjustedRrpValue),
          retailValue: numberToString(retailValue),
          actualKm: numberToString(values.actualKm),
          options: values.options,
          securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP,
          manufactureYear: numberToString(values.manufactureYear),
        })
      );
      setTempResultValues({
        rrp: values.rrp,
        trade: values.trade,
        retail: values.retail,
        kmAdjustmentTradeValue: values.kmAdjustmentTradeValue,
        kmAdjustmentRetailValue: values.kmAdjustmentRetailValue,
        optionsRrpValue: values.optionsRrpValue,
        optionsTradeValue: values.optionsTradeValue,
        optionsRetailValue: values.optionsRetailValue,
        adjustedRrpValue: values.adjustedRrpValue,
        adjustedTradeValue: values.adjustedTradeValue,
        adjustedRetailValue: values.adjustedRetailValue,
      });
    },
    [dispatch, securityForm]
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    dispatch(
      updateSecurity({
        [name]: value,
      })
    );
    clearErrors(name as keyof SecurityForm);
  };

  const createOrUpdateSecurity = async (
    securityForm: SecurityForm,
    isDraft: boolean,
    nextStep?: APPLICATION_STEPS
  ) => {
    let nextPath;
    if (nextStep) {
      nextPath = `/application/applications/${applicationId}/${nextStep}`;
    }
    dispatch(
      saveSecurity(applicationId as string, securityForm, isDraft, nextPath)
    );
  };

  const handleSaveAndExit = () => {
    dispatch(saveAndExit(APPLICATION_STEPS.security, pageAfterSave));
  };

  const handlePreviousClick = () => {
    if (
      (APPLICATION_STATUS_GROUP.TO_BE_SUBMITTED as string[]).includes(
        applicationStatus
      )
    ) {
      createOrUpdateSecurity(securityForm, true, APPLICATION_STEPS.guarantors);
    } else {
      dispatch(
        setActiveStep(APPLICATION_STEPS.guarantors, APPLICATION_STEPS.security)
      );
    }
  };

  const handleNextClick = async () => {
    const isFormValid = await validate();
    if (!isFormValid) return;

    if (
      (APPLICATION_STATUS_GROUP.TO_BE_SUBMITTED as string[]).includes(
        applicationStatus
      )
    ) {
      createOrUpdateSecurity(securityForm, false, APPLICATION_STEPS.notes);
    } else {
      dispatch(
        setActiveStep(APPLICATION_STEPS.notes, APPLICATION_STEPS.security)
      );
    }
  };

  const handleModalToggler = (showAlert: boolean) => {
    dispatch(
      setSecurityComparison({
        ...securityComparison,
        showAlert,
      })
    );
    if (!showAlert) {
      dispatch(
        updateSecurity({
          [securityComparison.field as string]: securityComparison.initialValue,
        })
      );
    }
  };

  const handleModalEditClick = () => {
    dispatch(
      setActiveStep(APPLICATION_STEPS.quotes, APPLICATION_STEPS.security)
    );
    dispatch(setGlassGuideShown(false));
    handleModalToggler(false);
  };

  const handleQuoteChangedPopUpConfirmation = () => {
    dispatch(quoteChangedPopupToggle(false));
    dispatch(
      setRedirectPath(
        `/application/applications/${applicationId}/${APPLICATION_STEPS.quotes}`,
        REDIRECT_TYPES.PUSH
      )
    );
  };

  return (
    <>
      {errors && typeof errors === "string" && (
        <CAlert color="danger">{errors}</CAlert>
      )}
      <form autoComplete="off" className="quest-form security-form">
        <CRow className="mb-3">
          <CCol xs={12}>
            <h3 className="f-bold section-header">Supplier</h3>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol xl={9} xs={12}>
            <CRow>
              <CCol
                xl={5}
                sm={6}
                xs={12}
                className={`form-group ${getErrorClass(
                  validationErrors.supplierType
                )}`}
              >
                <CLabel className="required">Supplier type</CLabel>
                <Controller
                  control={control}
                  name="supplierType"
                  defaultValue={securityForm.supplierType}
                  render={({ onChange, value }) => (
                    <LabelRadioGroups
                      fieldName="supplierType"
                      options={SUPPLIER_TYPE_LABELS}
                      checkedValue={value}
                      handleChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        onChange(event.target.value);
                        dispatch(
                          updateSecurity({
                            supplierType: event.target.value,
                          })
                        );
                      }}
                      disabled={isFormLoading || isApplicationLocked}
                      testId="supplierType"
                    />
                  )}
                />
                {validationErrors.supplierType && (
                  <span
                    className="validation-error"
                    data-testid="supplierType-error"
                  >
                    {validationErrors.supplierType.message}
                  </span>
                )}
              </CCol>
              <CCol
                xl={7}
                sm={6}
                xs={12}
                className={`form-group ${getErrorClass(
                  validationErrors.supplierName
                )}`}
              >
                <CLabel className="required">Supplier name</CLabel>
                <CInput
                  readOnly={isApplicationLocked}
                  innerRef={register()}
                  type="text"
                  name="supplierName"
                  onChange={handleChange}
                  defaultValue={securityForm.supplierName}
                  disabled={isFormLoading}
                  data-testid="supplierName"
                />
                {validationErrors.supplierName && (
                  <span
                    className="validation-error"
                    data-testid="supplierName-error"
                  >
                    {validationErrors.supplierName.message}
                  </span>
                )}
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        <hr className="mb-5 mt-4" />
        <CRow className="mb-3">
          <CCol xs={12}>
            <h3 className="f-bold section-header">Security</h3>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol
            xs={12}
            className={`form-group ${getErrorClass(
              validationErrors.usageType
            )}`}
          >
            <CLabel className="required">Usage type</CLabel>
            <Controller
              control={control}
              name="usageType"
              defaultValue={securityForm.usageType}
              render={({ onChange, value }) => (
                <LabelRadioGroups
                  fieldName="usageType"
                  options={USAGE_TYPE_LABELS}
                  checkedValue={value}
                  handleChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ) => {
                    onChange(event.target.value);
                    dispatch(
                      updateSecurity({
                        usageType: event.target.value,
                      })
                    );
                  }}
                  disabled={isFormLoading || isApplicationLocked}
                  testId="usageType"
                />
              )}
            />
            {validationErrors.usageType && (
              <span className="validation-error" data-testid="usageType-error">
                {validationErrors.usageType.message}
              </span>
            )}
          </CCol>
        </CRow>
        {isSecurityInputTypeDisplayed && (
          <CRow className="mb-3">
            <CCol xs={12} className="form-group">
              <SecurityDetailsButtons
                onSelect={(value) => {
                  if (value === SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP) {
                    dispatch(setGlassGuideShown(true));
                  } else {
                    dispatch(
                      updateSecurity({
                        securityDetailsInputType:
                          SECURITY_DETAILS_INPUT_TYPES.MANUAL,
                      })
                    );
                  }
                }}
                selectedValue={securityForm.securityDetailsInputType}
                disabled={isFormLoading || isApplicationLocked}
              />
            </CCol>
          </CRow>
        )}
        <CRow className="mb-3">
          <CCol xl={9} xs={12}>
            <CRow className="mb-md-2">
              <CCol
                md={5}
                className={`form-group ${getErrorClass(
                  validationErrors.assetTypeCategory
                )}`}
              >
                <CLabel className="required">Asset type category</CLabel>
                <CSelect
                  innerRef={register()}
                  name="assetTypeCategory"
                  onChange={handleChange}
                  value={securityForm.assetTypeCategory}
                  disabled={isFormLoading || isApplicationLocked}
                  data-testid="assetTypeCategory"
                >
                  <option value="">Select</option>
                  {ASSET_TYPE_LIST.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </CSelect>
                {validationErrors.assetTypeCategory && (
                  <span
                    className="validation-error"
                    data-testid="assetTypeCategory-error"
                  >
                    {validationErrors.assetTypeCategory.message}
                  </span>
                )}
              </CCol>
              <CCol
                md={7}
                className={`form-group ${getErrorClass(
                  validationErrors.assetType
                )}`}
              >
                <CLabel className="required">Asset type</CLabel>
                <CSelect
                  innerRef={register()}
                  name="assetType"
                  onChange={handleChange}
                  value={securityForm.assetType}
                  disabled={isFormLoading || isApplicationLocked}
                  data-testid="assetType"
                >
                  <option value="">Select</option>
                  {securityForm.assetSubtypes?.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </CSelect>
                {validationErrors.assetType && (
                  <span
                    className="validation-error"
                    data-testid="assetType-error"
                  >
                    {validationErrors.assetType.message}
                  </span>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-md-2">
              <CCol
                md={5}
                className={`form-group ${getErrorClass(
                  validationErrors.manufactureYear
                )}`}
              >
                <CLabel className="required">Year</CLabel>
                <Controller
                  control={control}
                  name="manufactureYear"
                  defaultValue={securityForm.manufactureYear}
                  render={({ onChange, value }) => (
                    <NumberField
                      readOnly={isApplicationLocked}
                      format="####"
                      name="manufactureYear"
                      isAllowed={(values) => validateYear(values.value)}
                      onBlur={() =>
                        dispatch(
                          updateSecurity({
                            manufactureYear: value,
                          })
                        )
                      }
                      onValueChange={(values) => {
                        onChange(values.value);
                        clearErrors("manufactureYear");
                      }}
                      value={value}
                      disabled={
                        isFormLoading ||
                        securityForm.securityDetailsInputType ===
                          SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP
                      }
                      data-testid="manufactureYear"
                    />
                  )}
                />
                {validationErrors.manufactureYear && (
                  <span
                    className="validation-error"
                    data-testid="manufactureYear-error"
                  >
                    {validationErrors.manufactureYear.message}
                  </span>
                )}
              </CCol>
              <CCol
                md={7}
                className={`form-group ${getErrorClass(validationErrors.make)}`}
              >
                <CLabel className="required">Make</CLabel>
                <CInput
                  readOnly={isApplicationLocked}
                  innerRef={register()}
                  type="text"
                  name="make"
                  onChange={handleChange}
                  defaultValue={securityForm.make}
                  disabled={
                    isFormLoading ||
                    securityForm.securityDetailsInputType ===
                      SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP
                  }
                  data-testid="make"
                />
                {validationErrors.make && (
                  <span className="validation-error" data-testid="make-error">
                    {validationErrors.make.message}
                  </span>
                )}
              </CCol>
            </CRow>
            <CRow className="mb-md-2">
              <CCol
                md={isKmDisplayed ? 8 : 12}
                className={`form-group ${getErrorClass(
                  validationErrors.model
                )}`}
              >
                <CLabel className="required">Model</CLabel>
                <CInput
                  readOnly={isApplicationLocked}
                  innerRef={register()}
                  type="text"
                  name="model"
                  onChange={handleChange}
                  defaultValue={securityForm.model}
                  disabled={
                    isFormLoading ||
                    securityForm.securityDetailsInputType ===
                      SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP
                  }
                  data-testid="model"
                />
                {validationErrors.model && (
                  <span className="validation-error" data-testid="model-error">
                    {validationErrors.model.message}
                  </span>
                )}
              </CCol>
              <CCol
                md={4}
                className={`${
                  isKmDisplayed ? "form-group" : "d-none"
                } ${getErrorClass(validationErrors.actualKm)}`}
              >
                <CLabel>KM</CLabel>
                <Controller
                  control={control}
                  name="actualKm"
                  defaultValue={securityForm.actualKm}
                  render={({ onChange, value }) => (
                    <NumberField
                      name="actualKm"
                      readOnly={isApplicationLocked}
                      disabled={
                        isFormLoading ||
                        securityForm.securityDetailsInputType ===
                          SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP
                      }
                      value={value}
                      onValueChange={(values) => {
                        onChange(values.value);
                        dispatch(
                          updateSecurity({
                            actualKm: values.value,
                          })
                        );
                      }}
                      data-testid="actualKm-security"
                    />
                  )}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol xs={12}>
                <CLabel>Description</CLabel>
                <CInput
                  readOnly={isApplicationLocked}
                  innerRef={register()}
                  type="text"
                  name="description"
                  onChange={handleChange}
                  defaultValue={securityForm.description}
                  disabled={isFormLoading}
                  data-testid="description"
                />
              </CCol>
            </CRow>
            <CRow
              className="mb-md-2"
              style={{
                display:
                  securityForm.securityDetailsInputType ===
                  SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP
                    ? "flex"
                    : "none",
              }}
            >
              <CCol md={12} className="form-group">
                <CLabel>Retail value</CLabel>
                <Controller
                  control={control}
                  name="retailValue"
                  defaultValue={securityForm.retailValue}
                  render={({ onChange, value }) => (
                    <NumberField
                      readOnly={isApplicationLocked}
                      prefix={"$"}
                      name="retailValue"
                      onValueChange={(values) => {
                        onChange(values.value);
                        dispatch(updateSecurity({ retailValue: values.value }));
                      }}
                      value={value}
                      disabled={
                        isFormLoading ||
                        securityForm.securityDetailsInputType ===
                          SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP
                      }
                      data-testid="retailValue"
                    />
                  )}
                />
              </CCol>
            </CRow>
            <CRow className="mb-md-2">
              <CCol
                md={8}
                className={`form-group ${getErrorClass(
                  validationErrors.serialNumber
                )}`}
              >
                <CLabel>Vin or Serial # (if known)</CLabel>
                <CInput
                  readOnly={isApplicationLocked}
                  innerRef={register()}
                  type="text"
                  name="serialNumber"
                  onChange={handleChange}
                  defaultValue={securityForm.serialNumber}
                  disabled={isFormLoading}
                  data-testid="serialNumber"
                />
                {validationErrors.serialNumber && (
                  <span
                    className="validation-error"
                    data-testid="serialNumber-error"
                  >
                    {validationErrors.serialNumber.message}
                  </span>
                )}
              </CCol>
              <CCol md={4} className="form-group">
                <CLabel>Rego #</CLabel>
                <CInput
                  readOnly={isApplicationLocked}
                  innerRef={register()}
                  type="text"
                  name="registrationNumber"
                  onChange={handleChange}
                  defaultValue={securityForm.registrationNumber}
                  disabled={isFormLoading}
                  data-testid="registrationNumber"
                />
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        {Object.keys(validationErrors).length > 0 && (
          <CAlert color="danger" data-testid="validation-error-message">
            There are missing information or invalid information
          </CAlert>
        )}
        <ButtonsContainer
          disabled={isFormLoading}
          disableSave={isApplicationLocked}
          onSaveClick={() => handleSaveAndExit()}
          onPreviousClick={() => handlePreviousClick()}
          onSubmitClick={() => handleNextClick()}
        />
        {isGlassGuideAvailable && securityForm.isGlassGuideShown && (
          <GlassGuideModal
            useCache={false}
            initialValues={{
              modelTypeCode: securityForm.modelTypeCode
                ? securityForm.modelTypeCode
                : GLASS_GUIDE_MODEL_TYPE_CODES.ALL,
              yearCreate: securityForm.manufactureYear
                ? parseNumber(securityForm.manufactureYear)
                : 0,
              familyCode: securityForm.familyCode
                ? securityForm.familyCode
                : "",
              variantName: securityForm.variantName
                ? securityForm.variantName
                : "",
              seriesCode: securityForm.seriesCode
                ? securityForm.seriesCode
                : "",
              actualKm: securityForm.actualKm
                ? parseNumber(securityForm.actualKm)
                : 0,
              manufacturerCode: securityForm.manufacturerCode
                ? securityForm.manufacturerCode
                : "",
              options: securityForm.options,
              nvic: securityForm.nvic ? securityForm.nvic : "",
            }}
            initResultValues={tempResultValues}
            isShown={securityForm.isGlassGuideShown as boolean}
            toggler={() => {
              dispatch(setGlassGuideShown(!securityForm.isGlassGuideShown));
            }}
            onSelected={onGlassGuideSelected}
          />
        )}

        {securityComparison.showAlert && (
          <ModalSecurityAlert
            quoteFieldName={securityComparison.quoteFieldLabel as string}
            fieldName={securityComparison.fieldLabel as string}
            isShown={securityComparison.showAlert as boolean}
            onEditClicked={() => handleModalEditClick()}
            onCancel={() => handleModalToggler(false)}
            toggler={() => handleModalToggler(!securityComparison.showAlert)}
          />
        )}
      </form>
      <ConfirmationModal
        toggler={() =>
          dispatch(quoteChangedPopupToggle(!quoteChangedPopupShown))
        }
        modalType={MODAL_TYPE.WARNING}
        isShown={quoteChangedPopupShown}
        renderBody={() => (
          <p className="f-quest-navy">
            <strong>Asset model year</strong> has changed in quote screen, the
            quote figures may have changed
          </p>
        )}
        onCancel={() => dispatch(quoteChangedPopupToggle(false))}
        cancelButtonText="OK"
        onConfirm={() => handleQuoteChangedPopUpConfirmation()}
        confirmButtonText="Go to quote"
        testId="go-to-quote-modal"
      />
    </>
  );
};

export default SecurityTab;

import "./QuoteForm.scss";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CCol, CLabel, CRow, CSelect } from "@coreui/react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { ArrowContainer, Popover } from "react-tiny-popover";
import LabelRadioGroups from "../../common/components/LabelRadioGroups";
import {
  FIELD_TYPE,
  NumberField,
  TEXT_ALIGN,
} from "../../common/components/NumberField";
import Switch from "../../common/components/Switch";
import { BOOLEAN_OPTIONS } from "../../common/constants/booleanOptions";
import { LabelValue } from "../../common/types/LabelValue";
import { validateYear } from "../../common/utils/date";
import { convertToCurrency } from "../../common/utils/number";
import { isSameObject } from "../../common/utils/object";
import { stringToBoolean } from "../../common/utils/string";
import { getErrorClass } from "../../common/utils/validation";
import { actionCreator as notifAction, dispatch } from "../../notification";
import {
  calculateQuote,
  updateQuote,
} from "../actions/creators/applicationForm";
import { AMOUNT_TYPES } from "../constants/amountTypes";
import {
  ASSET_TYPE_LIST,
  DISABLED_ASSET_TYPE_LIST,
} from "../constants/assetTypes";
import { NOTIFICATION_IDS } from "../constants/notificationIds";
import { PAYMENT_TERMS_OPTIONS } from "../constants/paymentTerms";
import { QUOTE_MAX_BROKERAGE_ORIGINATION_FEE_AMOUNT } from "../constants/quote";
import {
  SUPPLIER_TYPES,
  SUPPLIER_TYPE_LABELS,
} from "../constants/supplierTypes";
import { useApplicationFormDispatch } from "../dispatchers";
import { getQuoteCalculationLoading } from "../selectors/applicationForm";
import { QuoteFormCalculate } from "../types/QuoteFormCalculate";
import { QuoteFormSave } from "../types/QuoteFormSave";
import { QuoteResponse } from "../types/QuoteResponse";
import QuoteOutput from "./QuoteOutput";

const { useNotificationDispatch } = dispatch;

type QuoteFormProps = {
  quoteForm: QuoteFormSave;
  quoteDetails: QuoteResponse;
  isLoading: boolean;
  readOnly?: boolean;
};

const QuoteForm: React.FunctionComponent<QuoteFormProps> = ({
  quoteForm,
  quoteDetails,
  isLoading,
  readOnly,
}: QuoteFormProps) => {
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const calculationLoading = useSelector(getQuoteCalculationLoading);
  const dispatch = useApplicationFormDispatch();
  const notifDispatch = useNotificationDispatch();
  const [assetSubTypes, setAssetSubTypes] = useState<LabelValue[] | undefined>(
    []
  );
  const oldQuote = useRef<QuoteFormSave>(quoteForm);
  const financierRatePopover = useRef<HTMLElement>();
  const {
    trigger: validate,
    errors,
    clearErrors,
    register,
    control,
    getValues,
    setValue,
  } = useFormContext();

  useEffect(() => {
    return () => {
      notifDispatch(
        notifAction.unsetNotification(NOTIFICATION_IDS.QUOTE_CALCULATE_ERROR)
      );
    };
  }, [notifDispatch]);

  const validateCalculation = useCallback(
    async (quoteFormCalculate: QuoteFormCalculate): Promise<boolean> => {
      const quoteFormFields = Object.keys(
        quoteFormCalculate
      ) as (keyof QuoteFormCalculate)[];
      const validationResult = await validate([
        ...quoteFormFields,
        "assetType",
      ]);
      return validationResult;
    },
    [validate]
  );

  const calculate = useCallback(
    async (quoteForm: QuoteFormSave) => {
      clearErrors();
      const isQuoteValid = await validateCalculation(quoteForm);
      if (!isQuoteValid) return;
      dispatch(calculateQuote({ ...quoteForm, ...getValues() }));
    },
    [validateCalculation, dispatch, clearErrors, getValues]
  );

  useEffect(() => {
    if (quoteForm.assetTypeCategory !== "") {
      const matchingAssetType = ASSET_TYPE_LIST.find(
        (type) => type.value === quoteForm.assetTypeCategory
      );
      let assetTypes = matchingAssetType?.subTypes;

      assetTypes = matchingAssetType?.subTypes.filter(
        (item) =>
          !DISABLED_ASSET_TYPE_LIST.includes(item.value) ||
          quoteDetails.assetType === item.value
      );

      setAssetSubTypes(assetTypes);
    }

    const sameObject = isSameObject(
      (oldQuote.current as unknown) as Record<string, unknown>,
      (quoteForm as unknown) as Record<string, unknown>
    );

    if (quoteForm.shouldCompareQuote && !sameObject) {
      oldQuote.current = quoteForm;
      calculate(quoteForm);
    }
  }, [quoteForm, quoteDetails, calculate]);

  const handleManualFinancierRateToggle = (isFinancierRateManual: boolean) => {
    const shouldCompareQuote = !isFinancierRateManual;
    oldQuote.current = quoteForm;
    dispatch(
      updateQuote({
        isFinancierRateManual,
        financierRate: "",
        shouldCompareQuote,
      })
    );
  };

  return (
    <React.Fragment>
      <CRow className="quest-form quote-form">
        <CCol xl={6} xs={12} className="form-section">
          <CRow>
            <CCol
              md={6}
              className={`form-group ${getErrorClass(
                errors.assetTypeCategory
              )}`}
            >
              <CLabel className="required">Asset type category</CLabel>
              <CSelect
                innerRef={register()}
                name="assetTypeCategory"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  dispatch(
                    updateQuote({
                      assetTypeCategory: event.target.value,
                      assetType: "",
                      shouldCompareQuote: true,
                    })
                  );
                }}
                value={quoteForm.assetTypeCategory}
                disabled={readOnly}
                data-testid="assetTypeCategory"
              >
                <option value="" data-testid="atc-select">
                  Select
                </option>
                {ASSET_TYPE_LIST.map((item, index) => (
                  <option
                    key={index}
                    value={item.value}
                    data-testid={`atc-${item.value}`}
                  >
                    {item.label}
                  </option>
                ))}
              </CSelect>
              {errors.assetTypeCategory && (
                <span
                  className="validation-error"
                  data-testid="assetTypeCategory-error"
                >
                  {errors.assetTypeCategory.message}
                </span>
              )}
            </CCol>
            <CCol
              md={6}
              className={`form-group ${getErrorClass(errors.assetType)}`}
            >
              <CLabel className="required">Asset type</CLabel>
              <CSelect
                disabled={readOnly}
                innerRef={register()}
                name="assetType"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  dispatch(
                    updateQuote({
                      assetType: event.target.value,
                      shouldCompareQuote: true,
                    })
                  );
                  clearErrors("assetType");
                }}
                value={quoteForm.assetType}
                data-testid="assetType"
              >
                <option value="">Select</option>
                {assetSubTypes?.map((item, index) => (
                  <option
                    key={index}
                    value={item.value}
                    data-testid={`assetType-${item.value}`}
                  >
                    {item.label}
                  </option>
                ))}
              </CSelect>
              {errors.assetType && (
                <span
                  className="validation-error"
                  data-testid="assetType-error"
                >
                  {errors.assetType?.message}
                </span>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol
              md={6}
              className={`form-group ${getErrorClass(
                errors.assetManufactureYear
              )}`}
            >
              <CRow>
                <CCol tag="label" xs={12} className="required">
                  Asset model year
                </CCol>
                <CCol md={5}>
                  <NumberField
                    readOnly={readOnly}
                    getInputRef={register()}
                    allowNegative={false}
                    format="####"
                    type="tel"
                    name="assetManufactureYear"
                    value={quoteForm.assetManufactureYear}
                    isAllowed={(values) => validateYear(values.value)}
                    onBlur={() =>
                      dispatch(
                        updateQuote({
                          shouldCompareQuote: true,
                        })
                      )
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(
                        updateQuote({
                          assetManufactureYear: event.target.value,
                        })
                      )
                    }
                    disabled={isLoading}
                    data-testid="assetManufactureYear"
                  />
                </CCol>
              </CRow>
              {errors.assetManufactureYear && (
                <span
                  className="validation-error"
                  data-testid="assetManufactureYear-error"
                >
                  {errors.assetManufactureYear.message}
                </span>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol
              md={12}
              className={`form-group ${getErrorClass(errors.supplierType)}`}
            >
              <CLabel className="required">Supplier type</CLabel>
              <Controller
                control={control}
                name="supplierType"
                render={({ onChange, value }) => (
                  <LabelRadioGroups
                    disabled={readOnly}
                    fieldName="supplierType"
                    options={SUPPLIER_TYPE_LABELS}
                    checkedValue={value}
                    handleChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      onChange(event.target.value);
                      dispatch(
                        updateQuote({
                          supplierType: event.target.value as SUPPLIER_TYPES,
                          shouldCompareQuote: true,
                        })
                      );
                    }}
                    testId="supplierType"
                  />
                )}
              />
              {errors.supplierType && (
                <span
                  className="validation-error"
                  data-testid="supplierType-error"
                >
                  {errors.supplierType.message}
                </span>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol
              md={6}
              className={`form-group ${getErrorClass(errors.isPropertyOwner)}`}
            >
              <CLabel className="required">Property owner</CLabel>
              <Controller
                control={control}
                name="isPropertyOwner"
                render={({ onChange, value }) => (
                  <LabelRadioGroups
                    disabled={readOnly}
                    options={BOOLEAN_OPTIONS}
                    fieldName="isPropertyOwner"
                    checkedValue={value}
                    handleChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      onChange(stringToBoolean(event.target.value));
                      dispatch(
                        updateQuote({
                          isPropertyOwner: stringToBoolean(event.target.value),
                          shouldCompareQuote: true,
                        })
                      );
                    }}
                    testId="isPropertyOwner"
                  />
                )}
              />
              {errors.isPropertyOwner && (
                <span
                  className="validation-error"
                  data-testid="isPropertyOwner-error"
                >
                  {errors.isPropertyOwner.message}
                </span>
              )}
            </CCol>
          </CRow>
          <hr className="divider" />
          <h3 className="section-header f-bold">Quote</h3>
          <CRow>
            <CCol
              md={6}
              className={`form-group ${getErrorClass(errors.purchaseAmount)}`}
            >
              <CLabel className="required">Purchase price</CLabel>
              <NumberField
                readOnly={readOnly}
                getInputRef={register()}
                onBlur={() =>
                  dispatch(
                    updateQuote({
                      shouldCompareQuote: true,
                    })
                  )
                }
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(
                    updateQuote({
                      purchaseAmount: event.target.value,
                    })
                  )
                }
                name="purchaseAmount"
                value={quoteForm.purchaseAmount}
                disabled={isLoading}
                fieldType={FIELD_TYPE.CURRENCY}
                data-testid="purchaseAmount"
              />
              {errors.purchaseAmount && (
                <span
                  className="validation-error"
                  data-testid="purchaseAmount-error"
                >
                  {errors.purchaseAmount.message}
                </span>
              )}
            </CCol>
            <CCol
              md={6}
              className={`form-group ${getErrorClass(errors.depositAmount)}`}
            >
              <CLabel>Cash deposit</CLabel>
              <NumberField
                readOnly={readOnly}
                getInputRef={register()}
                allowNegative={false}
                type="tel"
                onBlur={() =>
                  dispatch(
                    updateQuote({
                      shouldCompareQuote: true,
                    })
                  )
                }
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(
                    updateQuote({
                      depositAmount: event.target.value,
                    })
                  )
                }
                name="depositAmount"
                value={quoteForm.depositAmount}
                disabled={isLoading}
                fieldType={FIELD_TYPE.CURRENCY}
                data-testid="depositAmount"
              />
              {errors.depositAmount && (
                <span
                  className="validation-error"
                  data-testid="depositAmount-error"
                >
                  {errors.depositAmount.message}
                </span>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol
              md={6}
              className={`form-group ${getErrorClass(errors.tradeInAmount)}`}
            >
              <CLabel>Trade in</CLabel>
              <NumberField
                readOnly={readOnly}
                getInputRef={register()}
                allowNegative={false}
                type="tel"
                onBlur={() =>
                  dispatch(
                    updateQuote({
                      shouldCompareQuote: true,
                    })
                  )
                }
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(
                    updateQuote({
                      tradeInAmount: event.target.value,
                    })
                  )
                }
                name="tradeInAmount"
                value={quoteForm.tradeInAmount}
                disabled={isLoading}
                fieldType={FIELD_TYPE.CURRENCY}
                data-testid="tradeInAmount"
              />
              {errors.tradeInAmount && (
                <span
                  className="validation-error"
                  data-testid="tradeInAmount-error"
                >
                  {errors.tradeInAmount.message}
                </span>
              )}
            </CCol>
            <CCol
              md={6}
              className={`form-group ${getErrorClass(
                errors.tradePayoutAmount
              )}`}
            >
              <CLabel>Payout amount</CLabel>
              <NumberField
                readOnly={readOnly}
                getInputRef={register()}
                allowNegative={false}
                type="tel"
                onBlur={() =>
                  dispatch(
                    updateQuote({
                      shouldCompareQuote: true,
                    })
                  )
                }
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(
                    updateQuote({
                      tradePayoutAmount: event.target.value,
                    })
                  )
                }
                name="tradePayoutAmount"
                value={quoteForm.tradePayoutAmount}
                disabled={isLoading}
                fieldType={FIELD_TYPE.CURRENCY}
                data-testid="tradePayoutAmount"
              />
              {errors.tradePayoutAmount && (
                <span
                  className="validation-error"
                  data-testid="tradePayoutAmount-error"
                >
                  {errors.tradePayoutAmount.message}
                </span>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol md={6} className="form-group">
              <CLabel>Balloon</CLabel>
              <CRow>
                <CCol
                  xl={6}
                  className={`mb-sm-0 mb-3 ${getErrorClass(
                    errors.balloonPercentage
                  )}`}
                >
                  <NumberField
                    readOnly={readOnly}
                    getInputRef={register()}
                    allowNegative={false}
                    type="tel"
                    onBlur={() =>
                      dispatch(
                        updateQuote({
                          shouldCompareQuote: true,
                        })
                      )
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setValue("balloonType", AMOUNT_TYPES.PERCENTAGE);
                      dispatch(
                        updateQuote({
                          balloonPercentage: event.target.value,
                          balloonType: AMOUNT_TYPES.PERCENTAGE,
                        })
                      );
                    }}
                    name="balloonPercentage"
                    value={quoteForm.balloonPercentage}
                    disabled={isLoading}
                    textAlign={TEXT_ALIGN.RIGHT}
                    fieldType={FIELD_TYPE.PERCENTAGE}
                    data-testid="balloonPercentage"
                  />
                </CCol>
                <CCol
                  xl={6}
                  className={`${getErrorClass(errors.balloonNominal)}`}
                >
                  <NumberField
                    readOnly={readOnly}
                    getInputRef={register()}
                    allowNegative={false}
                    type="tel"
                    onBlur={() =>
                      dispatch(
                        updateQuote({
                          shouldCompareQuote: true,
                        })
                      )
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setValue("balloonType", AMOUNT_TYPES.FIXED);
                      dispatch(
                        updateQuote({
                          balloonNominal: event.target.value,
                          balloonType: AMOUNT_TYPES.FIXED,
                        })
                      );
                    }}
                    name="balloonNominal"
                    value={quoteForm.balloonNominal}
                    disabled={isLoading}
                    fieldType={FIELD_TYPE.CURRENCY}
                    data-testid="balloonNominal"
                  />
                </CCol>
                <input
                  type="hidden"
                  name="balloonType"
                  ref={register()}
                  defaultValue={quoteForm.balloonType}
                  data-testid="balloonType"
                />
              </CRow>
              {errors.balloonPercentage && (
                <span
                  className="validation-error"
                  data-testid="balloonPercentage-error"
                >
                  {errors.balloonPercentage.message}
                </span>
              )}
              {errors.balloonNominal && (
                <span
                  className="validation-error"
                  data-testid="balloonNominal-error"
                >
                  {errors.balloonNominal.message}
                </span>
              )}
            </CCol>
            <CCol md={6} className="form-group ">
              <CLabel>Brokerage (ex GST)</CLabel>
              <CRow>
                <CCol
                  xl={6}
                  className={`mb-sm-0 mb-3 ${getErrorClass(
                    errors.brokeragePercentage
                  )}`}
                >
                  <NumberField
                    readOnly={readOnly}
                    getInputRef={register()}
                    allowNegative={false}
                    type="tel"
                    onBlur={() =>
                      dispatch(
                        updateQuote({
                          shouldCompareQuote: true,
                        })
                      )
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setValue("brokerageType", AMOUNT_TYPES.PERCENTAGE);
                      dispatch(
                        updateQuote({
                          brokeragePercentage: event.target.value,
                          brokerageType: AMOUNT_TYPES.PERCENTAGE,
                        })
                      );
                    }}
                    name="brokeragePercentage"
                    value={quoteForm.brokeragePercentage}
                    disabled={isLoading}
                    textAlign={TEXT_ALIGN.RIGHT}
                    fieldType={FIELD_TYPE.PERCENTAGE}
                    data-testid="brokeragePercentage"
                  />
                </CCol>
                <CCol
                  xl={6}
                  className={`form-group ${getErrorClass(
                    errors.brokerageNominal
                  )}`}
                >
                  <NumberField
                    readOnly={readOnly}
                    getInputRef={register()}
                    allowNegative={false}
                    type="tel"
                    onBlur={() =>
                      dispatch(
                        updateQuote({
                          shouldCompareQuote: true,
                        })
                      )
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setValue("brokerageType", AMOUNT_TYPES.FIXED);
                      dispatch(
                        updateQuote({
                          brokerageNominal: event.target.value,
                          brokerageType: AMOUNT_TYPES.FIXED,
                        })
                      );
                    }}
                    name="brokerageNominal"
                    value={quoteForm.brokerageNominal}
                    disabled={isLoading}
                    fieldType={FIELD_TYPE.CURRENCY}
                    data-testid="brokerageNominal"
                  />
                </CCol>
                <input
                  type="hidden"
                  name="brokerageType"
                  ref={register()}
                  defaultValue={quoteForm.brokerageType}
                  data-testid="brokerageType"
                />
              </CRow>
              {errors.brokeragePercentage && (
                <span
                  className="validation-error"
                  data-testid="brokeragePercentage-error"
                >
                  {errors.brokeragePercentage.message}
                </span>
              )}
              {errors.brokerageNominal && (
                <span
                  className="validation-error"
                  data-testid="brokerageNominal-error"
                >
                  {errors.brokerageNominal.message}
                </span>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol
              xl={6}
              className={`form-group ${getErrorClass(
                errors.repaymentTermMonth
              )}`}
            >
              <CLabel>Term (years)</CLabel>
              <Controller
                control={control}
                name="repaymentTermMonth"
                render={({ onChange, value }) => (
                  <LabelRadioGroups
                    disabled={readOnly}
                    fieldName="repaymentTermMonth"
                    options={PAYMENT_TERMS_OPTIONS}
                    checkedValue={value}
                    handleChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      onChange(event.target.value);
                      dispatch(
                        updateQuote({
                          repaymentTermMonth: event.target.value,
                          shouldCompareQuote: true,
                        })
                      );
                    }}
                    testId="repaymentTermMonth"
                  />
                )}
              />

              {errors.repaymentTermMonth && (
                <span
                  className="validation-error"
                  data-testid="repaymentTermMonth-error"
                >
                  {errors.repaymentTermMonth.message}
                </span>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol
              xl={6}
              xs={12}
              className={`form-group ${getErrorClass(errors.financierRate)}`}
            >
              <CLabel innerRef={financierRatePopover}>
                Financier rate
                <Popover
                  containerParent={financierRatePopover.current}
                  isOpen={isPopOverOpen}
                  positions={["right", "top"]}
                  padding={0}
                  content={({ position, childRect, popoverRect }) => (
                    <ArrowContainer
                      position={position}
                      childRect={childRect}
                      popoverRect={popoverRect}
                      arrowColor="#d1faf5"
                      arrowSize={10}
                    >
                      <div className="popover-content">
                        Financier Rate is based on Asset Category, Total Amount
                        Financed and Add-ons - Refer to Matrix
                      </div>
                    </ArrowContainer>
                  )}
                >
                  <span
                    className="popover-info"
                    onMouseEnter={() => setIsPopOverOpen(true)}
                    onMouseLeave={() => setIsPopOverOpen(false)}
                    onClick={() =>
                      setIsPopOverOpen((previousState) => !previousState)
                    }
                  >
                    i
                  </span>
                </Popover>
              </CLabel>
              <div className="financier-group">
                <NumberField
                  readOnly={readOnly}
                  getInputRef={register()}
                  allowNegative={false}
                  type="tel"
                  onBlur={() =>
                    dispatch(
                      updateQuote({
                        shouldCompareQuote: true,
                      })
                    )
                  }
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(
                      updateQuote({
                        financierRate: event.target.value,
                      })
                    )
                  }
                  name="financierRate"
                  value={quoteForm.financierRate}
                  disabled={!getValues("isFinancierRateManual")}
                  className="mr-2 percentage-field"
                  textAlign={TEXT_ALIGN.RIGHT}
                  fieldType={FIELD_TYPE.PERCENTAGE}
                  data-testid="financierRate"
                />
                <Controller
                  control={control}
                  name="isFinancierRateManual"
                  defaultValue={quoteForm.isFinancierRateManual}
                  render={({ onChange, value }) => (
                    <Switch
                      disabled={readOnly}
                      name="isFinancierRateManual"
                      label="Manual rate"
                      onChange={(event) => {
                        onChange(event.target.checked);
                        handleManualFinancierRateToggle(event.target.checked);
                      }}
                      checked={value}
                      testId="isFinancierRateManual"
                    />
                  )}
                />
              </div>
              {errors.financierRate && (
                <span
                  className="validation-error"
                  data-testid="financierRate-error"
                >
                  {errors.financierRate.message}
                </span>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol
              xl={6}
              className={`form-group ${getErrorClass(
                errors.brokerOriginationFeeAmount
              )}`}
            >
              <CLabel>Origination fee (ex GST)</CLabel>
              <NumberField
                readOnly={readOnly}
                getInputRef={register()}
                allowNegative={false}
                type="tel"
                onBlur={() =>
                  dispatch(
                    updateQuote({
                      shouldCompareQuote: true,
                    })
                  )
                }
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(
                    updateQuote({
                      brokerOriginationFeeAmount: event.target.value,
                    })
                  )
                }
                name="brokerOriginationFeeAmount"
                value={quoteForm.brokerOriginationFeeAmount}
                disabled={isLoading}
                className="mr-2"
                fieldType={FIELD_TYPE.CURRENCY}
                data-testid="brokerOriginationFeeAmount"
              />
              <span className="hint">{`Max $${convertToCurrency(
                QUOTE_MAX_BROKERAGE_ORIGINATION_FEE_AMOUNT
              )} ex GST`}</span>
              <br />
              {errors.brokerOriginationFeeAmount && (
                <span
                  className="validation-error"
                  data-testid="brokerOriginationFeeAmount-error"
                >
                  {errors.brokerOriginationFeeAmount.message}
                </span>
              )}
            </CCol>
            <CCol md={6} className={`form-group`}>
              <CLabel>Finance fees</CLabel>
              <Controller
                control={control}
                name="includeFees"
                render={({ onChange, value }) => (
                  <LabelRadioGroups
                    disabled={readOnly}
                    options={BOOLEAN_OPTIONS}
                    fieldName="includeFees"
                    checkedValue={value}
                    handleChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      onChange(stringToBoolean(event.target.value));
                      dispatch(
                        updateQuote({
                          includeFees: stringToBoolean(event.target.value),
                          shouldCompareQuote: true,
                        })
                      );
                    }}
                    testId="includeFees"
                  />
                )}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol xl={6} xs={12} className="output-section">
          <QuoteOutput
            quoteDetails={quoteDetails}
            quoteForm={quoteForm}
            isLoading={isLoading || calculationLoading}
          />
        </CCol>
      </CRow>
    </React.Fragment>
  );
};

export default QuoteForm;

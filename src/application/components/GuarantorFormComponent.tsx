import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CButton, CCol, CInput, CLabel, CRow, CSelect } from "@coreui/react";
import { Controller, useFormContext } from "react-hook-form";
import NumberFormat from "react-number-format";
import {
  Address,
  AddressAutoComplete,
  ADDRESS_INPUT_TYPES,
} from "../../address-autocomplete";
import IconAdd from "../../common/assets/images/icon-sml-add.svg";
import IconClose from "../../common/assets/images/icon-sml-close.svg";
import LabelRadioGroups from "../../common/components/LabelRadioGroups";
import { FIELD_TYPE, NumberField } from "../../common/components/NumberField";
import PopoverInfo from "../../common/components/PopoverInfo";
import { AUSTRALIAN_STATE_OPTIONS } from "../../common/constants/australianStateOptions";
import { BOOLEAN_OPTIONS } from "../../common/constants/booleanOptions";
import { TITLE_OPTIONS } from "../../common/constants/titles";
import { Dictionary } from "../../common/types/Dictionary";
import { validateDateOfBirthInput } from "../../common/utils/date";
import { parseNumber } from "../../common/utils/number";
import { stringToBoolean } from "../../common/utils/string";
import { getErrorClass } from "../../common/utils/validation";
import { updateGuarantor } from "../actions/creators/applicationForm";
import { GUARANTOR_ASSET_TYPE_LABELS } from "../constants/guarantorAssetTypes";
import { GUARANTOR_LIABILITY_TYPES_LABELS } from "../constants/guarantorLiabilityTypes";
import { GUARANTOR_RESIDENTIAL_STATUSES_OPTIONS } from "../constants/guarantorResidentialStatuses";
import { MARITAL_STATUS_LABELS } from "../constants/maritalStatuses";
import { useApplicationFormDispatch } from "../dispatchers";
import {
  GuarantorAssetLiabilityForm,
  GuarantorForm,
} from "../types/GuarantorForm";
import { getAddressFromEntity } from "../utils/address";
import { checkHasInvestmentProperty } from "../utils/guarantors";

type AssetLiabilityFormProps = {
  name: string;
  parentIndex: number;
  index: number;
  data: GuarantorAssetLiabilityForm;
  isLoading: boolean;
  options: Dictionary;
  setDataFunction: (value: GuarantorAssetLiabilityForm) => void;
  deleteFunction: () => void;
  readOnly?: boolean;
};

const AssetLiabilityForm: React.FunctionComponent<AssetLiabilityFormProps> = ({
  name,
  parentIndex,
  index,
  data,
  isLoading,
  options,
  setDataFunction,
  deleteFunction,
  readOnly,
}: AssetLiabilityFormProps) => {
  const { register, errors, clearErrors } = useFormContext();
  const deleteFunctionCallback = useCallback(() => deleteFunction(), [
    deleteFunction,
  ]);

  const updateData = (newData: Partial<GuarantorAssetLiabilityForm>) => {
    const newValue = {
      ...data,
      ...newData,
    };
    setDataFunction(newValue);
  };

  const handleTypeChange = (type: string) => {
    updateData({ type });
    clearErrors(`guarantors[${parentIndex}].${name}[${index}].type`);
  };

  const handleAmountChange = (amount: string) => {
    updateData({ amount });
    clearErrors(`guarantors[${parentIndex}].${name}[${index}].amount`);
  };

  const getFieldError = (fieldName: string) => {
    if (
      errors.guarantors &&
      errors.guarantors[parentIndex] &&
      errors.guarantors[parentIndex][name] &&
      errors.guarantors[parentIndex][name][index] &&
      errors.guarantors[parentIndex][name][index][fieldName]
    ) {
      return errors.guarantors[parentIndex][name][index][fieldName].message;
    }

    return "";
  };

  const renderErrorMessage = (fieldName: string) => {
    const error = getFieldError(fieldName);

    if (error)
      return (
        <span
          className="validation-error"
          data-testid={`guarantor-${parentIndex}-${name}-${fieldName}-${index}-error`}
        >
          {error}
        </span>
      );

    return <></>;
  };

  return (
    <div
      className={`select-and-input mb-2 ${getErrorClass(
        getFieldError("amount") | getFieldError("type")
      )}`}
    >
      <div className="input-container">
        <CSelect
          innerRef={register()}
          name={`guarantors[${parentIndex}].${name}[${index}].type`}
          className="select"
          disabled={isLoading || readOnly}
          value={data.type}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            handleTypeChange(event.target.value)
          }
          data-testid={`guarantor-${parentIndex}-${name}-type-${index}`}
        >
          <option value="">Select</option>
          {Object.keys(options).map((option, index) => (
            <option key={index} value={option}>
              {options[option]}
            </option>
          ))}
        </CSelect>
        <NumberField
          readOnly={readOnly}
          getInputRef={register()}
          name={`guarantors[${parentIndex}].${name}[${index}].amount`}
          className="input"
          onValueChange={(values) => handleAmountChange(values.value)}
          fieldType={FIELD_TYPE.CURRENCY}
          value={data.amount}
          data-testid={`guarantor-${parentIndex}-${name}-amount-${index}`}
        />
        {renderErrorMessage("amount")}
        {renderErrorMessage("type")}
      </div>
      {index > 0 && (
        <div className="btn-container">
          <CButton
            className="btn-remove"
            disabled={isLoading || readOnly}
            onClick={() => deleteFunctionCallback()}
            data-testid={`delete-guarantor-${parentIndex}-${name}-${index}`}
          >
            <img src={IconClose} alt="icon remove asset liability" />
          </CButton>
        </div>
      )}
    </div>
  );
};

type GuarantorFormComponentProps = {
  applicantAddress: Address;
  guarantor: GuarantorForm;
  indexNumber: number;
  deleteFunction: () => void;
  isLoading: boolean;
  readOnly?: boolean;
};

const GuarantorFormComponent: React.FunctionComponent<GuarantorFormComponentProps> = ({
  applicantAddress,
  guarantor,
  indexNumber,
  deleteFunction,
  isLoading,
  readOnly,
}: GuarantorFormComponentProps) => {
  const { register, control, errors, clearErrors } = useFormContext();
  const dispatch = useApplicationFormDispatch();
  const deleteFunctionCallback = useCallback(() => deleteFunction(), [
    deleteFunction,
  ]);

  const [summary, setSummary] = useState<{
    totalAssets: number;
    totalLiabilities: number;
    netPosition: number;
  }>({
    totalAssets: 0,
    totalLiabilities: 0,
    netPosition: 0,
  });

  const shouldDisplayInvestmentPropertyAddress = useMemo(() => {
    return checkHasInvestmentProperty(
      guarantor.assets.map((asset) => asset.type)
    );
  }, [guarantor]);

  useEffect(() => {
    let totalAssets = 0;
    if (guarantor.assets.length > 0) {
      totalAssets = guarantor.assets
        .map((asset) => parseNumber(asset.amount))
        .reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        });
    }

    let totalLiabilities = 0;
    if (guarantor.liabilities.length > 0) {
      totalLiabilities = guarantor.liabilities
        .map((liability) => parseNumber(liability.amount))
        .reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        });
    }

    const netPosition = totalAssets - totalLiabilities;

    setSummary({
      totalAssets,
      totalLiabilities,
      netPosition,
    });
  }, [guarantor]);

  const handleChange = (fieldName: string, value: string) => {
    const singleFieldName = fieldName.replace(
      `guarantors[${indexNumber}].`,
      ""
    );
    dispatch(updateGuarantor({ [singleFieldName]: value }, indexNumber));
    clearErrors(fieldName);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    handleChange(name, value);
  };

  const toggleSameAddressAsApplicant = (isAddressSameAsApplicant: boolean) => {
    let newState: Partial<GuarantorForm> = {
      isAddressSameAsApplicant,
      ...applicantAddress,
    };

    if (!isAddressSameAsApplicant) {
      newState = {
        isAddressSameAsApplicant,
        addressInputType: ADDRESS_INPUT_TYPES.AUTOCOMPLETE,
        addressStreetName: "",
        addressStreetNumber: "",
        addressState: "",
        addressUnitNumber: "",
        addressPostcode: "",
        addressSuburb: "",
      };
    }
    let fields = Object.keys(newState);
    fields = fields.map((field) => `guarantors[${indexNumber}].${field}`);
    clearErrors(fields);
    dispatch(updateGuarantor(newState, indexNumber));
  };

  const handleArrayChange = (
    index: number,
    fieldName: "assets" | "liabilities",
    value: GuarantorAssetLiabilityForm
  ) => {
    const newArray = [...guarantor[fieldName]];
    newArray[index] = value;
    dispatch(updateGuarantor({ [fieldName]: newArray }, indexNumber));
  };

  const deleteAsset = (index: number) => {
    const tempAssets = [...guarantor.assets];
    tempAssets.splice(index, 1);
    dispatch(updateGuarantor({ assets: tempAssets }, indexNumber));
  };

  const addAsset = () => {
    const tempAssets = [...guarantor.assets];
    tempAssets.push({ type: "", amount: "" });
    dispatch(updateGuarantor({ assets: tempAssets }, indexNumber));
  };

  const deleteLiabilities = (index: number) => {
    const tempLiabilities = [...guarantor.liabilities];
    tempLiabilities.splice(index, 1);
    dispatch(updateGuarantor({ liabilities: tempLiabilities }, indexNumber));
  };

  const addLiabilities = () => {
    const tempLiabilities = [...guarantor.liabilities];
    tempLiabilities.push({ type: "", amount: "" });
    dispatch(updateGuarantor({ liabilities: tempLiabilities }, indexNumber));
  };

  const getFieldError = (field: string) => {
    if (
      errors.guarantors &&
      errors.guarantors[indexNumber] &&
      errors.guarantors[indexNumber][field]
    ) {
      return errors.guarantors[indexNumber][field].message;
    }

    return "";
  };

  const renderErrorMessage = (field: string) => {
    const error = getFieldError(field);

    if (error)
      return (
        <span
          className="validation-error"
          data-testid={`${indexNumber}-${field}-error`}
        >
          {error}
        </span>
      );

    return <></>;
  };

  return (
    <div className="guarantor" data-testid={`guarantor-${indexNumber}`}>
      <CRow className="mb-3">
        <CCol xs={12} className="guarantor-section-header">
          <h3 className="f-bold section-header">Director #{indexNumber + 1}</h3>{" "}
          {indexNumber > 0 && (
            <CButton
              className="btn-remove-guarantor ml-3"
              onClick={() => deleteFunctionCallback()}
              disabled={isLoading || readOnly}
              data-testid={`delete-guarantor-${indexNumber}`}
            >
              <img
                src={IconClose}
                alt="icon remove director"
                className="mr-2"
              />
              Remove
            </CButton>
          )}
        </CCol>
      </CRow>
      <CRow className="mb-lg-4">
        <CCol
          xl={2}
          xs={12}
          className={`form-group ${getErrorClass(getFieldError("title"))}`}
        >
          <CLabel className="required">Title</CLabel>
          <CSelect
            innerRef={register()}
            name={`guarantors[${indexNumber}].title`}
            onChange={handleInputChange}
            value={guarantor.title}
            disabled={isLoading || readOnly}
            data-testid={`${indexNumber}-title`}
          >
            <option value="">Select</option>
            {Object.keys(TITLE_OPTIONS).map((title, key) => (
              <option key={key} value={title}>
                {TITLE_OPTIONS[title]}
              </option>
            ))}
          </CSelect>
          {renderErrorMessage("title")}
        </CCol>
        <CCol
          xl={2}
          xs={12}
          className={`form-group ${getErrorClass(getFieldError("firstName"))}`}
        >
          <CLabel className="required">First name</CLabel>
          <CInput
            readOnly={readOnly}
            innerRef={register()}
            type="text"
            name={`guarantors[${indexNumber}].firstName`}
            onChange={handleInputChange}
            value={guarantor.firstName}
            disabled={isLoading}
            data-testid={`${indexNumber}-firstName`}
          />
          {renderErrorMessage("firstName")}
        </CCol>
        <CCol xl={2} xs={12} className={`form-group`}>
          <CLabel>Middle name</CLabel>
          <CInput
            readOnly={readOnly}
            innerRef={register()}
            type="text"
            name={`guarantors[${indexNumber}].middleName`}
            onChange={handleInputChange}
            value={guarantor.middleName ? guarantor.middleName : ""}
            disabled={isLoading}
            data-testid={`${indexNumber}-middleName`}
          />
        </CCol>
        <CCol
          xl={3}
          xs={12}
          className={`form-group ${getErrorClass(getFieldError("lastName"))}`}
        >
          <CLabel className="required">Last name</CLabel>
          <CInput
            readOnly={readOnly}
            innerRef={register()}
            type="text"
            name={`guarantors[${indexNumber}].lastName`}
            onChange={handleInputChange}
            value={guarantor.lastName}
            disabled={isLoading}
            data-testid={`${indexNumber}-lastName`}
          />
          {renderErrorMessage("lastName")}
        </CCol>
        <CCol
          xl={2}
          xs={12}
          className={`form-group ${getErrorClass(
            getFieldError("dateOfBirth")
          )}`}
        >
          <CLabel className="required">Date of birth</CLabel>
          <NumberField
            readOnly={readOnly}
            getInputRef={register()}
            placeholder="DD / MM / YYYY"
            format="##/##/####"
            type="text"
            name={`guarantors[${indexNumber}].dateOfBirth`}
            onValueChange={(values) =>
              handleChange(
                `guarantors[${indexNumber}].dateOfBirth`,
                values.formattedValue
              )
            }
            isAllowed={(values) =>
              validateDateOfBirthInput(values.formattedValue)
            }
            value={guarantor.dateOfBirth}
            data-testid={`${indexNumber}-dateOfBirth`}
          />
          {renderErrorMessage("dateOfBirth")}
        </CCol>
      </CRow>
      <CRow className="mb-lg-4">
        <CCol
          xl={3}
          xs={12}
          className={`form-group ${getErrorClass(
            getFieldError("driverLicenseNumber")
          )}`}
        >
          <CLabel>Driver licence number</CLabel>
          <CInput
            readOnly={readOnly}
            innerRef={register()}
            type="text"
            name={`guarantors[${indexNumber}].driverLicenseNumber`}
            onChange={handleInputChange}
            maxLength={11}
            value={
              guarantor.driverLicenseNumber ? guarantor.driverLicenseNumber : ""
            }
            disabled={isLoading}
            data-testid={`${indexNumber}-driverLicenseNumber`}
          />
          {renderErrorMessage("driverLicenseNumber")}
        </CCol>
        <CCol
          xl={3}
          xs={12}
          className={`form-group license-card-num-${indexNumber} ${getErrorClass(
            getFieldError("driverLicenseNumber")
          )}`}
        >
          <CLabel>
            Licence card number
            <PopoverInfo
              positions={["top"]}
              content={
                <div>
                  Licence card number is a unique identifier which is updated
                  each time a driver&apos;s licence is re-issued. By including
                  card number in the matching criteria, we know that the
                  document being presented is the most recently issued document.
                  This change will help reduce identity crime in Australia and
                  is now a requirement for government electronic identity
                  verification.
                </div>
              }
              containerParent={
                document.querySelector(
                  `.license-card-num-${indexNumber}`
                ) as HTMLElement
              }
            />
          </CLabel>
          <CInput
            readOnly={readOnly}
            innerRef={register()}
            type="text"
            name={`guarantors[${indexNumber}].licenseCardNumber`}
            onChange={handleInputChange}
            maxLength={11}
            value={guarantor.licenseCardNumber ?? ""}
            disabled={isLoading}
            data-testid={`${indexNumber}-licenseCardNumber`}
          />
          {renderErrorMessage("licenseCardNumber")}
        </CCol>
        <CCol xl={3} xs={12} className={`form-group`}>
          <CLabel>Licence state</CLabel>
          <CSelect
            innerRef={register()}
            name={`guarantors[${indexNumber}].driverLicenseState`}
            onChange={handleInputChange}
            value={guarantor.driverLicenseState}
            disabled={isLoading || readOnly}
            data-testid={`${indexNumber}-driverLicenseState`}
          >
            <option value="">Select</option>
            {AUSTRALIAN_STATE_OPTIONS.map((state, key) => (
              <option key={key} value={state}>
                {state}
              </option>
            ))}
          </CSelect>
        </CCol>
      </CRow>
      <CRow>
        <CCol
          xl={3}
          xs={12}
          className={`form-group ${getErrorClass(
            getFieldError("maritalStatus")
          )}`}
        >
          <CLabel className="required">Marital status</CLabel>
          <CSelect
            innerRef={register()}
            name={`guarantors[${indexNumber}].maritalStatus`}
            onChange={handleInputChange}
            value={guarantor.maritalStatus}
            disabled={isLoading || readOnly}
            data-testid={`${indexNumber}-maritalStatus`}
          >
            <option value="">Select</option>
            {Object.keys(MARITAL_STATUS_LABELS).map((status, index) => (
              <option key={index} value={status}>
                {MARITAL_STATUS_LABELS[status]}
              </option>
            ))}
          </CSelect>
          {renderErrorMessage("maritalStatus")}
        </CCol>
        <CCol
          xl={3}
          xs={12}
          className={`form-group ${getErrorClass(
            getFieldError("dependentNumber")
          )}`}
        >
          <CLabel className="required">Number of dependents</CLabel>
          <CRow>
            <CCol xl={4} xs={12}>
              <NumberField
                readOnly={readOnly}
                getInputRef={register()}
                name={`guarantors[${indexNumber}].dependentNumber`}
                format="##"
                isNumericString
                onValueChange={(value) =>
                  handleChange(
                    `guarantors[${indexNumber}].dependentNumber`,
                    value.value
                  )
                }
                value={guarantor.dependentNumber}
                disabled={isLoading}
                data-testid={`${indexNumber}-dependentNumber`}
              />
            </CCol>
          </CRow>
          {renderErrorMessage("dependentNumber")}
        </CCol>
      </CRow>
      <CRow className="mb-lg-5">
        <CCol
          xl={3}
          xs={12}
          className={`form-group ${getErrorClass(getFieldError("mobile"))}`}
        >
          <CLabel className="required">Mobile</CLabel>
          <NumberField
            readOnly={readOnly}
            getInputRef={register()}
            name={`guarantors[${indexNumber}].mobile`}
            format="#### ### ###"
            isNumericString
            onValueChange={(value) =>
              handleChange(`guarantors[${indexNumber}].mobile`, value.value)
            }
            value={guarantor.mobile}
            disabled={isLoading}
            data-testid={`${indexNumber}-mobile`}
          />
          {renderErrorMessage("mobile")}
        </CCol>
        <CCol
          xl={6}
          xs={12}
          className={`form-group ${getErrorClass(getFieldError("email"))}`}
        >
          <CLabel className="required">Email</CLabel>
          <CInput
            readOnly={readOnly}
            innerRef={register()}
            type="email"
            name={`guarantors[${indexNumber}].email`}
            onChange={handleInputChange}
            value={guarantor.email}
            disabled={isLoading}
            data-testid={`${indexNumber}-email`}
          />
          {renderErrorMessage("email")}
        </CCol>
      </CRow>
      <hr className="mb-5" />
      <CRow className="mb-lg-3">
        <CCol xs={12}>
          <h3 className="f-bold section-header">Residential address</h3>
        </CCol>
      </CRow>
      <CRow className="mb-lg-4">
        <CCol xl={3} xs={12} className={`form-group`}>
          <CLabel>Same as business address?</CLabel>
          <Controller
            control={control}
            name={`guarantors[${indexNumber}].isAddressSameAsApplicant`}
            defaultValue={guarantor.isAddressSameAsApplicant}
            render={() => (
              <LabelRadioGroups
                fieldName={`guarantors[${indexNumber}].isAddressSameAsApplicant`}
                options={BOOLEAN_OPTIONS}
                checkedValue={guarantor.isAddressSameAsApplicant}
                handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  toggleSameAddressAsApplicant(
                    stringToBoolean(event.target.value)
                  );
                }}
                disabled={isLoading || readOnly}
                testId={`${indexNumber}-isAddressSameAsApplicant`}
              />
            )}
          />
        </CCol>
        <CCol
          xl={6}
          xs={12}
          className={`form-group ${getErrorClass(
            getFieldError("residentialStatus")
          )}`}
        >
          <CLabel className="required">Residential status</CLabel>
          <Controller
            control={control}
            name={`guarantors[${indexNumber}].residentialStatus`}
            defaultValue={guarantor.residentialStatus}
            render={({ onChange, value }) => (
              <LabelRadioGroups
                fieldName={`guarantors[${indexNumber}].residentialStatus`}
                options={GUARANTOR_RESIDENTIAL_STATUSES_OPTIONS}
                checkedValue={value}
                handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(
                    `guarantors[${indexNumber}].residentialStatus`,
                    event.target.value
                  );
                  onChange(event.target.value);
                }}
                disabled={isLoading || readOnly}
                testId={`${indexNumber}-residentialStatus`}
              />
            )}
          />

          {renderErrorMessage("residentialStatus")}
        </CCol>
      </CRow>
      <AddressAutoComplete
        readOnly={readOnly}
        uniqueCheckboxId={`${indexNumber}`}
        className="mb-3"
        labelName="Residential address"
        address={getAddressFromEntity(guarantor)}
        arrayIndex={indexNumber}
        arrayPrefix="guarantors"
        onAddressUpdate={(address) =>
          dispatch(
            updateGuarantor(
              {
                ...address,
              },
              indexNumber
            )
          )
        }
        disabled={guarantor.isAddressSameAsApplicant}
        testIdPrefix={`guarantor-${indexNumber}`}
      />
      <hr className="mb-5" />
      <CRow className="mb-3">
        <CCol xs={12}>
          <h3 className="f-bold section-header">Assets and Liabilities</h3>
        </CCol>
      </CRow>
      <CRow className="mb-5 assets-liabilities">
        <CCol xl={6} xs={12} className="assets-section">
          <CRow className="mb-2">
            <CCol xs={12}>
              <div className="heading">
                <CLabel>Assets</CLabel>
                <CLabel>Value</CLabel>
              </div>
              {guarantor.assets.map((asset, index) => (
                <AssetLiabilityForm
                  readOnly={readOnly}
                  name="assets"
                  parentIndex={indexNumber}
                  index={index}
                  key={index}
                  data={asset}
                  options={GUARANTOR_ASSET_TYPE_LABELS}
                  isLoading={isLoading}
                  deleteFunction={() => deleteAsset(index)}
                  setDataFunction={(value) =>
                    handleArrayChange(index, "assets", value)
                  }
                />
              ))}
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12} className="d-flex justify-content-end">
              <CButton
                className="btn-add"
                onClick={() => addAsset()}
                disabled={readOnly}
                data-testid={`guarantor-${indexNumber}-add-asset`}
              >
                Add asset <img src={IconAdd} alt="icon-add" />
              </CButton>
            </CCol>
          </CRow>
        </CCol>
        <CCol xl={6} xs={12} className="liabilities-section">
          <CRow className="mb-2">
            <CCol xs={12}>
              <div className="heading">
                <CLabel>Liabilities</CLabel>
                <CLabel>Balance</CLabel>
              </div>
              {guarantor.liabilities.map((liability, index) => (
                <AssetLiabilityForm
                  readOnly={readOnly}
                  name="liabilities"
                  parentIndex={indexNumber}
                  index={index}
                  key={index}
                  data={liability}
                  options={GUARANTOR_LIABILITY_TYPES_LABELS}
                  isLoading={isLoading}
                  deleteFunction={() => deleteLiabilities(index)}
                  setDataFunction={(value) =>
                    handleArrayChange(index, "liabilities", value)
                  }
                />
              ))}
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12} className="d-flex justify-content-end">
              <CButton
                className="btn-add"
                onClick={() => addLiabilities()}
                disabled={readOnly}
                data-testid={`guarantor-${indexNumber}-add-liability`}
              >
                Add liability <img src={IconAdd} alt="icon-add" />
              </CButton>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      {shouldDisplayInvestmentPropertyAddress && (
        <AddressAutoComplete
          readOnly={readOnly}
          uniqueCheckboxId={`${indexNumber}-investmentAddress`}
          className="mb-3"
          labelName="Investment property address (optional)"
          addressFieldNames={{
            addressInputType: `guarantors[${indexNumber}].investmentPropertyAddressInputType`,
            addressState: `guarantors[${indexNumber}].investmentPropertyAddressState`,
            addressStreetName: `guarantors[${indexNumber}].investmentPropertyAddressStreetName`,
            addressStreetNumber: `guarantors[${indexNumber}].investmentPropertyAddressStreetNumber`,
            addressUnitNumber: `guarantors[${indexNumber}].investmentPropertyAddressUnitNumber`,
            addressSuburb: `guarantors[${indexNumber}].investmentPropertyAddressSuburb`,
            addressPostcode: `guarantors[${indexNumber}].investmentPropertyAddressPostcode`,
            fullAddress: `guarantors[${indexNumber}].investmentPropertyFullAddress`,
          }}
          address={{
            addressInputType: guarantor.investmentPropertyAddressInputType,
            addressState: guarantor.investmentPropertyAddressState,
            addressStreetName: guarantor.investmentPropertyAddressStreetName,
            addressStreetNumber:
              guarantor.investmentPropertyAddressStreetNumber,
            addressUnitNumber: guarantor.investmentPropertyAddressUnitNumber,
            addressSuburb: guarantor.investmentPropertyAddressSuburb,
            addressPostcode: guarantor.investmentPropertyAddressPostcode,
          }}
          onAddressUpdate={(address) =>
            dispatch(
              updateGuarantor(
                {
                  investmentPropertyAddressInputType: address.addressInputType,
                  investmentPropertyAddressUnitNumber:
                    address.addressUnitNumber,
                  investmentPropertyAddressStreetNumber:
                    address.addressStreetNumber,
                  investmentPropertyAddressStreetName:
                    address.addressStreetName,
                  investmentPropertyAddressSuburb: address.addressSuburb,
                  investmentPropertyAddressState: address.addressState,
                  investmentPropertyAddressPostcode: address.addressPostcode,
                },
                indexNumber
              )
            )
          }
          testIdPrefix={`investment-${indexNumber}`}
          isRequired={false}
        />
      )}

      <hr className="mb-5" />
      <CRow className="mb-3">
        <CCol xs={12}>
          <h3 className="f-bold section-header">Financial Summary</h3>
        </CCol>
      </CRow>
      <CRow className="mb-5">
        <CCol xs={12}>
          <div className="financial-summary">
            <div className="summary-row mb-3">
              <div className="label">Total Assets:</div>
              <div className="value">
                <NumberFormat
                  value={summary.totalAssets}
                  prefix="$"
                  displayType="text"
                  fixedDecimalScale
                  decimalScale={2}
                  thousandSeparator=","
                  data-testid={`guarantor-${indexNumber}-summary-total-assets`}
                />
              </div>
            </div>
            <div className="summary-row mb-3">
              <div className="label">Total Liabilities:</div>
              <div className="value">
                <NumberFormat
                  value={summary.totalLiabilities}
                  prefix="$"
                  displayType="text"
                  fixedDecimalScale
                  decimalScale={2}
                  thousandSeparator=","
                  data-testid={`guarantor-${indexNumber}-summary-total-liabilities`}
                />
              </div>
            </div>
            <div className="summary-row">
              <div className="label f-bold">Net Position:</div>
              <div className="value f-bold">
                <NumberFormat
                  value={summary.netPosition}
                  prefix="$"
                  displayType="text"
                  fixedDecimalScale
                  decimalScale={2}
                  thousandSeparator=","
                  data-testid={`guarantor-${indexNumber}-summary-net-position`}
                />
              </div>
            </div>
          </div>
        </CCol>
      </CRow>
    </div>
  );
};

export default GuarantorFormComponent;

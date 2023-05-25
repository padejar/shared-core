import React, { useCallback, useEffect, useRef } from "react";
import {
  CCol,
  CFormGroup,
  CInput,
  CInputCheckbox,
  CLabel,
  CRow,
  CSelect,
} from "@coreui/react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import classNames from "classnames";
import { Controller, useFormContext } from "react-hook-form";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import { AUSTRALIAN_STATE_OPTIONS } from "../../common/constants/australianStateOptions";
import { getObjectKeyByValue } from "../../common/utils/object";
import { getErrorClass } from "../../common/utils/validation";
import {
  ADDRESS_INPUT_TYPES,
  AUTOCOMPLETE_DELAY_MILLISECOND,
} from "../constants";
import {
  Address,
  AddressFieldNames,
  addressFieldNamesDefaultValue,
} from "../types";
import "../assets/scss/index.scss";

const getAddressComponentByType = (
  addressComponents: google.maps.GeocoderAddressComponent[],
  type: string
): string => {
  for (const component of addressComponents) {
    const foundComponent =
      typeof component.types.find((value) => value === type) !== "undefined";

    if (foundComponent) {
      return component.short_name;
    }
  }

  return "";
};

type AddressAutoCompleteProps = {
  uniqueCheckboxId: string;
  labelName: string;
  className?: string;
  disabled?: boolean;
  address: Address;
  addressFieldNames?: AddressFieldNames;
  arrayPrefix?: string;
  arrayIndex?: number;
  onAddressUpdate?: (address: Address) => void;
  readOnly?: boolean;
  testIdPrefix?: string;
  isRequired?: boolean;
};

const AddressAutoComplete: React.FunctionComponent<AddressAutoCompleteProps> = ({
  uniqueCheckboxId,
  labelName,
  className,
  disabled,
  address,
  addressFieldNames = addressFieldNamesDefaultValue,
  arrayPrefix,
  arrayIndex,
  onAddressUpdate,
  readOnly,
  testIdPrefix = "address-autocomplete",
  isRequired = true,
}: AddressAutoCompleteProps) => {
  const {
    register,
    control,
    clearErrors,
    errors: validationErrors,
  } = useFormContext();

  const {
    init: initGoogleMaps,
    ready: googleMapsReady,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: "AU",
      },
    },
    debounce: AUTOCOMPLETE_DELAY_MILLISECOND,
    initOnMount: false,
  });

  const autoCompleteRef = useRef<HTMLInputElement>(null);

  const onAddressUpdateCallback = useCallback(
    (address: Address) => {
      if (onAddressUpdate) onAddressUpdate(address);
    },
    [onAddressUpdate]
  );

  const updateAddress = useCallback(
    (newState: Partial<Address>) => {
      onAddressUpdateCallback({
        ...address,
        ...newState,
      });
    },
    [onAddressUpdateCallback, address]
  );

  useEffect(() => {
    return () => {
      clearSuggestions();
    };
  }, [clearSuggestions]);

  useEffect(() => {
    setValue(
      [
        address.addressUnitNumber,
        address.addressStreetNumber,
        address.addressStreetName,
        address.addressSuburb,
        address.addressState,
        address.addressPostcode,
      ]
        .filter((component) => !!component)
        .join(" "),
      false
    );
  }, [address, setValue]);

  const getFieldName = (fieldName: string) => {
    if (!arrayPrefix && !arrayIndex) return addressFieldNames[fieldName];

    return `${arrayPrefix}[${arrayIndex}].${addressFieldNames[fieldName]}`;
  };

  const getFieldErrors = (fieldName?: string) => {
    let addressErrors = validationErrors;
    if (
      typeof arrayPrefix !== "undefined" &&
      typeof arrayIndex !== "undefined"
    ) {
      if (
        validationErrors[arrayPrefix] &&
        validationErrors[arrayPrefix][arrayIndex]
      )
        addressErrors = validationErrors[arrayPrefix][arrayIndex];
    }

    if (fieldName) {
      return addressErrors[addressFieldNames[fieldName]];
    }

    return addressErrors;
  };

  const renderErrorMessage = (field: string) => {
    const error = getFieldErrors(field);

    if (error)
      return (
        <span
          className="validation-error"
          data-testid={`${testIdPrefix}-${field}-error`}
        >
          {error.message}
        </span>
      );

    return <></>;
  };

  const isAddressErrorsNotEmpty = () => {
    const errorKeys = Object.keys(getFieldErrors());
    const fieldNames = Object.values(addressFieldNames);
    if (errorKeys.length > 0) {
      const addressFieldErrors = errorKeys.filter((errorKey) => {
        return fieldNames.some((fieldName) => {
          return fieldName === errorKey;
        });
      });

      return addressFieldErrors.length > 0;
    }

    return false;
  };

  const clearAddressErrors = () => {
    let addressErrorKeys = Object.values(addressFieldNames);
    if (
      typeof arrayPrefix !== "undefined" &&
      typeof arrayIndex !== "undefined"
    ) {
      addressErrorKeys = addressErrorKeys.map((errorKey) => {
        return `${arrayPrefix}[${arrayIndex}].${errorKey}`;
      });
    }
    clearErrors(addressErrorKeys);
  };

  const handleSelect = ({
    place_id,
  }: google.maps.places.AutocompletePrediction) => async () => {
    const details = (await getDetails({
      placeId: place_id,
    })) as google.maps.places.PlaceResult;
    if (details.address_components) {
      updateAddress({
        addressUnitNumber: getAddressComponentByType(
          details.address_components,
          "subpremise"
        ),
        addressStreetName: getAddressComponentByType(
          details.address_components,
          "route"
        ),
        addressStreetNumber: getAddressComponentByType(
          details.address_components,
          "street_number"
        ),
        addressSuburb: getAddressComponentByType(
          details.address_components,
          "locality"
        ),
        addressState: getAddressComponentByType(
          details.address_components,
          "administrative_area_level_1"
        ),
        addressPostcode: getAddressComponentByType(
          details.address_components,
          "postal_code"
        ),
      });
      if (details.formatted_address) {
        setValue(details.formatted_address, false);
      }
    }

    clearSuggestions();
    clearAddressErrors();
  };

  const renderSugestions = () => {
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          data-testid={`places-suggestion-${place_id}`}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const singleFieldName = name.replace(`${arrayPrefix}[${arrayIndex}].`, "");
    const fieldName = getObjectKeyByValue(addressFieldNames, singleFieldName);
    updateAddress({ [fieldName as string]: value });
    clearErrors(name);
  };

  return (
    <CRow className={`quest-address mb-3 ${className}`}>
      <CCol xs={12} className="autocomplete-input">
        <CRow>
          <CCol xs={12}>
            <CLabel className={classNames({ required: isRequired })}>
              {labelName}
            </CLabel>
          </CCol>
        </CRow>
        <CRow>
          <CCol
            xl={9}
            className={`${
              address.addressInputType === ADDRESS_INPUT_TYPES.MANUAL
                ? "d-none"
                : ""
            } ${
              typeof validationErrors !== "undefined"
                ? getErrorClass(isAddressErrorsNotEmpty())
                : ""
            }`}
          >
            {process.env.REACT_APP_GOOGLE_MAP_API_KEY && (
              <Wrapper
                apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                libraries={["places"]}
                callback={(status) => {
                  if (status === Status.SUCCESS) initGoogleMaps();
                }}
              >
                <CInput
                  readOnly={readOnly}
                  name={getFieldName("fullAddress")}
                  className={`${className}`}
                  innerRef={autoCompleteRef}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setValue(event.target.value);
                    if (event.target.value === "") {
                      updateAddress({
                        addressUnitNumber: "",
                        addressStreetName: "",
                        addressStreetNumber: "",
                        addressSuburb: "",
                        addressState: "",
                        addressPostcode: "",
                      });
                    }
                  }}
                  value={value}
                  disabled={!googleMapsReady || disabled}
                  data-testid={`${testIdPrefix}-fullAddress`}
                />
              </Wrapper>
            )}
            {status === "OK" && (
              <ul className="suggestions" data-testid="places-suggestions">
                {renderSugestions()}
              </ul>
            )}
            {typeof validationErrors !== "undefined" &&
              isAddressErrorsNotEmpty() && (
                <span
                  className="validation-error"
                  data-testid={`${testIdPrefix}-fullAddress-error`}
                >
                  {`${labelName} is required`}
                </span>
              )}
          </CCol>
          <CCol
            xl={9}
            className={
              address.addressInputType === ADDRESS_INPUT_TYPES.AUTOCOMPLETE
                ? "d-none"
                : ""
            }
            data-testid={`${testIdPrefix}-manual-address-input`}
          >
            <CRow className="mb-3">
              <CCol md={3} xs={12} className="form-group">
                <CLabel>Unit number</CLabel>
                <CInput
                  readOnly={readOnly}
                  innerRef={register()}
                  name={getFieldName("addressUnitNumber")}
                  onChange={handleChange}
                  value={
                    address.addressUnitNumber ? address.addressUnitNumber : ""
                  }
                  disabled={disabled}
                  data-testid={`${testIdPrefix}-addressUnitNumber`}
                />
              </CCol>
              <CCol
                md={3}
                xs={12}
                className={`form-group ${getErrorClass(
                  getFieldErrors("addressStreetNumber")
                )}`}
              >
                <CLabel className={classNames({ required: isRequired })}>
                  Street number
                </CLabel>
                <CInput
                  readOnly={readOnly}
                  innerRef={register()}
                  name={getFieldName("addressStreetNumber")}
                  onChange={handleChange}
                  value={address.addressStreetNumber}
                  disabled={disabled}
                  data-testid={`${testIdPrefix}-addressStreetNumber`}
                />
                {renderErrorMessage("addressStreetNumber")}
              </CCol>
              <CCol
                md={6}
                className={`form-group ${getErrorClass(
                  getFieldErrors("addressStreetName")
                )}`}
              >
                <CLabel className={classNames({ required: isRequired })}>
                  Street name
                </CLabel>
                <CInput
                  readOnly={readOnly}
                  innerRef={register()}
                  name={getFieldName("addressStreetName")}
                  onChange={handleChange}
                  value={address.addressStreetName}
                  disabled={disabled}
                  data-testid={`${testIdPrefix}-addressStreetName`}
                />
                {renderErrorMessage("addressStreetName")}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol
                md={6}
                className={`form-group ${getErrorClass(
                  getFieldErrors("addressSuburb")
                )}`}
              >
                <CLabel className={classNames({ required: isRequired })}>
                  Suburb
                </CLabel>
                <CInput
                  readOnly={readOnly}
                  innerRef={register()}
                  name={getFieldName("addressSuburb")}
                  onChange={handleChange}
                  value={address.addressSuburb}
                  disabled={disabled}
                  data-testid={`${testIdPrefix}-addressSuburb`}
                />
                {renderErrorMessage("addressSuburb")}
              </CCol>
              <CCol
                md={3}
                xs={12}
                className={`form-group ${getErrorClass(
                  getFieldErrors("addressState")
                )}`}
              >
                <CLabel className={classNames({ required: isRequired })}>
                  State
                </CLabel>
                <CSelect
                  innerRef={register()}
                  name={getFieldName("addressState")}
                  onChange={handleChange}
                  value={address.addressState}
                  disabled={disabled || readOnly}
                  data-testid={`${testIdPrefix}-addressState`}
                >
                  <option value="">Select</option>
                  {AUSTRALIAN_STATE_OPTIONS.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </CSelect>
                {renderErrorMessage("addressState")}
              </CCol>
              <CCol
                md={3}
                xs={12}
                className={`form-group ${getErrorClass(
                  getFieldErrors("addressPostcode")
                )}`}
              >
                <CLabel className={classNames({ required: isRequired })}>
                  Postal code
                </CLabel>
                <CInput
                  readOnly={readOnly}
                  innerRef={register()}
                  name={getFieldName("addressPostcode")}
                  onChange={handleChange}
                  value={address.addressPostcode}
                  disabled={disabled}
                  data-testid={`${testIdPrefix}-addressPostcode`}
                />
                {renderErrorMessage("addressPostcode")}
              </CCol>
            </CRow>
          </CCol>
          <CCol xs={12} xl={3}>
            <Controller
              name={getFieldName("addressInputType")}
              control={control}
              defaultValue={address.addressInputType}
              render={({ value, onChange }) => (
                <CFormGroup variant="custom-checkbox" inline>
                  <CInputCheckbox
                    custom
                    className="quest-checkbox"
                    id={`addressInputType-${uniqueCheckboxId}`}
                    name={getFieldName("addressInputType")}
                    value={1}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onChange(
                        !event.target.checked
                          ? ADDRESS_INPUT_TYPES.AUTOCOMPLETE
                          : ADDRESS_INPUT_TYPES.MANUAL
                      );
                      updateAddress({
                        addressInputType: !event.target.checked
                          ? ADDRESS_INPUT_TYPES.AUTOCOMPLETE
                          : ADDRESS_INPUT_TYPES.MANUAL,
                        addressUnitNumber: "",
                        addressStreetName: "",
                        addressStreetNumber: "",
                        addressSuburb: "",
                        addressState: "",
                        addressPostcode: "",
                      });
                      clearAddressErrors();
                    }}
                    checked={value === ADDRESS_INPUT_TYPES.MANUAL}
                    disabled={disabled || readOnly}
                    data-testid={`${testIdPrefix}-addressInputType`}
                  />
                  <CLabel
                    variant="custom-checkbox"
                    htmlFor={`addressInputType-${uniqueCheckboxId}`}
                    data-testid={`${testIdPrefix}-addressInputType-label`}
                  >
                    Enter manually?
                  </CLabel>
                </CFormGroup>
              )}
            />
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  );
};

AddressAutoComplete.defaultProps = {
  addressFieldNames: addressFieldNamesDefaultValue,
};

export default AddressAutoComplete;

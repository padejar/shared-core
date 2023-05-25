import { parseNumber } from "../../common/utils/number";
import { extractProperties, propertyCheck } from "../../common/utils/object";
import { numberToString } from "../../common/utils/string";
import { SECURITY_DETAILS_INPUT_TYPES } from "../constants/securityDetailsInputTypes";
import { SecurityForm, securityFormDefaultValue } from "../types/SecurityForm";
import {
  SecurityRequest,
  securityRequestDefaultValue,
} from "../types/SecurityRequest";
import { SecurityResponse } from "../types/SecurityResponse";

export const transformToSecurityForm = (
  securityResponse: SecurityResponse
): SecurityForm => {
  let newSecurityForm = extractProperties<SecurityResponse>(
    securityResponse,
    Object.keys(securityFormDefaultValue)
  ) as SecurityForm;

  for (const field in securityResponse) {
    if (propertyCheck(newSecurityForm, field as keyof SecurityForm)) {
      let value = securityResponse[field as keyof SecurityResponse];
      if (value === null) value = "";
      if (typeof value === "number") {
        value = typeof value !== "undefined" ? numberToString(value) : "";
      }
      newSecurityForm = {
        ...newSecurityForm,
        [field]: value,
      };
    }
  }

  return newSecurityForm;
};

export const transformToSecurityRequest = (
  securityForm: SecurityForm,
  isDraft = false
): SecurityRequest => {
  let securityRequest = extractProperties<SecurityForm>(
    securityForm,
    Object.keys(securityRequestDefaultValue)
  ) as SecurityRequest;

  if (
    securityRequest.securityDetailsInputType ===
    SECURITY_DETAILS_INPUT_TYPES.MANUAL
  ) {
    securityRequest = {
      ...securityRequest,
      familyCode: null,
      manufacturerCode: null,
      variantName: null,
      seriesCode: null,
      nvic: null,
      options: [],
    };
  }

  return {
    ...securityRequest,
    modelTypeCode: securityRequest.modelTypeCode as string,
    actualKm: securityForm.actualKm ? parseNumber(securityForm.actualKm) : 0,
    manufactureYear: securityForm.manufactureYear
      ? parseNumber(securityForm.manufactureYear)
      : null,
    retailValue: securityForm.retailValue
      ? parseNumber(securityForm.retailValue)
      : null,
    usageType: securityForm.usageType === "" ? null : securityForm.usageType,
    supplierType:
      securityForm.supplierType === "" ? null : securityForm.supplierType,
    isDraft,
  };
};

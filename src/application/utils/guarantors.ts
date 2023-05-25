import { ADDRESS_INPUT_TYPES } from "../../address-autocomplete";
import { DEFAULT_DATE_INPUT_FORMAT } from "../../common/constants/date";
import { dateFormat, parseDateForServer } from "../../common/utils/date";
import { parseNumber } from "../../common/utils/number";
import { extractProperties } from "../../common/utils/object";
import { numberToString } from "../../common/utils/string";
import { GUARANTOR_ASSET_TYPES } from "../constants/guarantorAssetTypes";
import { Guarantor, GuarantorAssetLiability } from "../types/Guarantor";
import {
  GuarantorForm,
  guarantorAssetLiabilityFormDefaultValue,
  guarantorFormDefaultValue,
} from "../types/GuarantorForm";
import { GuarantorsRequest } from "../types/GuarantorsRequest";

export const transformToGuarantorForm = (
  guarantor: Guarantor
): GuarantorForm => {
  const clonedGuarantor = extractProperties<Guarantor>(
    guarantor,
    Object.keys(guarantorFormDefaultValue)
  ) as Guarantor;
  const assets = clonedGuarantor.assets.map((asset) => ({
    ...asset,
    amount: numberToString(asset.amount),
  }));
  if (assets.length === 0) assets.push(guarantorAssetLiabilityFormDefaultValue);

  const liabilities = clonedGuarantor.liabilities.map((liability) => ({
    ...liability,
    amount: numberToString(liability.amount),
  }));
  if (liabilities.length === 0)
    liabilities.push(guarantorAssetLiabilityFormDefaultValue);

  let dateOfBirth = "";
  if (clonedGuarantor.dateOfBirth) {
    dateOfBirth = dateFormat(
      new Date(clonedGuarantor.dateOfBirth),
      DEFAULT_DATE_INPUT_FORMAT
    );
  }

  return {
    ...clonedGuarantor,
    dependentNumber: !clonedGuarantor.dependentNumber
      ? "0"
      : numberToString(clonedGuarantor.dependentNumber),
    assets,
    liabilities,
    dateOfBirth,
    middleName: clonedGuarantor.middleName ?? "",
    driverLicenseNumber: clonedGuarantor.driverLicenseNumber ?? "",
    licenseCardNumber: clonedGuarantor.licenseCardNumber ?? "",
    addressUnitNumber:
      clonedGuarantor.addressUnitNumber ?? clonedGuarantor.addressUnitNumber,
    maritalStatus: clonedGuarantor.maritalStatus ?? "",
    residentialStatus: clonedGuarantor.residentialStatus ?? "",
    title: clonedGuarantor.title ?? "",
    investmentPropertyAddressInputType:
      clonedGuarantor.investmentPropertyAddressInputType ??
      ADDRESS_INPUT_TYPES.AUTOCOMPLETE,
    investmentPropertyAddressUnitNumber:
      clonedGuarantor.investmentPropertyAddressUnitNumber ?? "",
    investmentPropertyAddressStreetName:
      clonedGuarantor.investmentPropertyAddressStreetName ?? "",
    investmentPropertyAddressStreetNumber:
      clonedGuarantor.investmentPropertyAddressStreetNumber ?? "",
    investmentPropertyAddressSuburb:
      clonedGuarantor.investmentPropertyAddressSuburb ?? "",
    investmentPropertyAddressState:
      clonedGuarantor.investmentPropertyAddressState ?? "",
    investmentPropertyAddressPostcode:
      clonedGuarantor.investmentPropertyAddressPostcode ?? "",
  };
};

export const transformToGuarantorForms = (
  guarantors: Guarantor[]
): GuarantorForm[] => {
  const newGuarantors: GuarantorForm[] = guarantors.map((guarantor) =>
    transformToGuarantorForm(guarantor)
  );

  return newGuarantors;
};

const transformToGuarantorRequest = (
  guarantorForm: GuarantorForm
): Guarantor => {
  const guarantorRequest = Object.assign({}, guarantorForm);

  let assets: GuarantorAssetLiability[] = guarantorRequest.assets.map(
    (asset) => ({
      ...asset,
      amount: parseNumber(asset.amount),
    })
  );
  assets = assets.filter((asset) => {
    if (!asset.amount || !asset.type) return false;
    else return true;
  });

  let liabilities: GuarantorAssetLiability[] = guarantorRequest.liabilities.map(
    (liability) => {
      return {
        ...liability,
        amount: parseNumber(liability.amount),
      };
    }
  );

  liabilities = liabilities.filter((asset) => {
    if (!asset.amount || !asset.type) return false;
    else return true;
  });

  const title = guarantorRequest.title ? guarantorRequest.title : null;
  const middleName = guarantorRequest.middleName
    ? guarantorRequest.middleName
    : null;
  const dateOfBirth = guarantorRequest.dateOfBirth
    ? parseDateForServer(guarantorRequest.dateOfBirth)
    : null;
  const dependentNumber = parseNumber(guarantorRequest.dependentNumber);
  const residentialStatus = guarantorRequest.residentialStatus
    ? guarantorRequest.residentialStatus
    : null;
  const maritalStatus = guarantorRequest.maritalStatus
    ? guarantorRequest.maritalStatus
    : null;

  if (guarantorRequest.isAddressSameAsApplicant) {
    guarantorRequest.addressPostcode = "";
    guarantorRequest.addressState = "";
    guarantorRequest.addressStreetName = "";
    guarantorRequest.addressStreetNumber = "";
    guarantorRequest.addressSuburb = "";
    guarantorRequest.addressUnitNumber = "";
  }

  const hasInvestmentProperty = checkHasInvestmentProperty(
    guarantorRequest.assets.map((asset) => asset.type)
  );

  if (!hasInvestmentProperty) {
    guarantorRequest.investmentPropertyAddressPostcode = "";
    guarantorRequest.investmentPropertyAddressState = "";
    guarantorRequest.investmentPropertyAddressStreetName = "";
    guarantorRequest.investmentPropertyAddressStreetNumber = "";
    guarantorRequest.investmentPropertyAddressSuburb = "";
    guarantorRequest.investmentPropertyAddressUnitNumber = "";
  }

  return {
    ...guarantorRequest,
    title,
    middleName,
    assets,
    liabilities,
    dateOfBirth,
    dependentNumber,
    residentialStatus,
    maritalStatus,
  };
};

export const transformToGuarantorsRequest = (
  guarantors: GuarantorForm[],
  isDraft = false
): GuarantorsRequest => {
  const guarantorRequest = guarantors.map((guarantor) =>
    transformToGuarantorRequest(guarantor)
  );

  return {
    guarantors: guarantorRequest,
    isDraft,
  };
};

export const checkHasInvestmentProperty = (assetTypes: string[]): boolean => {
  return (
    typeof assetTypes.find(
      (assetType) => assetType === GUARANTOR_ASSET_TYPES.INVESTMENT_PROPERTY
    ) !== "undefined"
  );
};

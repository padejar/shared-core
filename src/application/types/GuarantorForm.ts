import {
  Address,
  addressDefaultValue,
  ADDRESS_INPUT_TYPES,
} from "../../address-autocomplete";
import { GUARANTOR_RESIDENTIAL_STATUSES } from "../constants/guarantorResidentialStatuses";
import { MARITAL_STATUSES } from "../constants/maritalStatuses";

export interface GuarantorAssetLiabilityForm {
  type: string;
  amount: string;
}

export const guarantorAssetLiabilityFormDefaultValue: GuarantorAssetLiabilityForm = {
  type: "",
  amount: "",
};

export interface GuarantorForm extends Address {
  title: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  driverLicenseNumber: string;
  licenseCardNumber: string;
  driverLicenseState: string;
  maritalStatus: MARITAL_STATUSES | string;
  dependentNumber: string;
  mobile: string;
  email: string;
  isAddressSameAsApplicant: boolean;
  residentialStatus: GUARANTOR_RESIDENTIAL_STATUSES | string;
  assets: GuarantorAssetLiabilityForm[];
  liabilities: GuarantorAssetLiabilityForm[];
  id?: string | null;
  investmentPropertyAddressInputType: ADDRESS_INPUT_TYPES;
  investmentPropertyAddressState: string;
  investmentPropertyAddressStreetName: string;
  investmentPropertyAddressStreetNumber: string;
  investmentPropertyAddressUnitNumber: string;
  investmentPropertyAddressSuburb: string;
  investmentPropertyAddressPostcode: string;
}

export const guarantorFormDefaultValue: GuarantorForm = {
  ...addressDefaultValue,
  title: "",
  firstName: "",
  middleName: null,
  lastName: "",
  dateOfBirth: "",
  driverLicenseNumber: "",
  licenseCardNumber: "",
  driverLicenseState: "",
  maritalStatus: "",
  dependentNumber: "",
  mobile: "",
  email: "",
  isAddressSameAsApplicant: false,
  residentialStatus: "",
  assets: [guarantorAssetLiabilityFormDefaultValue],
  liabilities: [guarantorAssetLiabilityFormDefaultValue],
  id: null,
  investmentPropertyAddressInputType: ADDRESS_INPUT_TYPES.AUTOCOMPLETE,
  investmentPropertyAddressState: "",
  investmentPropertyAddressStreetName: "",
  investmentPropertyAddressStreetNumber: "",
  investmentPropertyAddressUnitNumber: "",
  investmentPropertyAddressSuburb: "",
  investmentPropertyAddressPostcode: "",
};

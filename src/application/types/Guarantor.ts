import {
  Address,
  addressDefaultValue,
  ADDRESS_INPUT_TYPES,
} from "../../address-autocomplete";
import { GUARANTOR_RESIDENTIAL_STATUSES } from "../constants/guarantorResidentialStatuses";
import { MARITAL_STATUSES } from "../constants/maritalStatuses";

export interface GuarantorAssetLiability {
  type: string;
  amount: number;
}

export const guarantorAssetLiabilityDefaultValue: GuarantorAssetLiability = {
  type: "",
  amount: 0,
};

export interface Guarantor extends Address {
  title: string | null;
  state?: boolean;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  driverLicenseNumber: string | null;
  licenseCardNumber: string | null;
  driverLicenseState: string;
  maritalStatus: MARITAL_STATUSES | string | null;
  dependentNumber: number;
  mobile: string;
  email: string;
  isAddressSameAsApplicant: boolean;
  residentialStatus: GUARANTOR_RESIDENTIAL_STATUSES | string | null;
  assets: GuarantorAssetLiability[];
  liabilities: GuarantorAssetLiability[];
  id?: string | null;
  applicationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  investmentPropertyAddressInputType: ADDRESS_INPUT_TYPES | null;
  investmentPropertyAddressState: string | null;
  investmentPropertyAddressStreetName: string | null;
  investmentPropertyAddressStreetNumber: string | null;
  investmentPropertyAddressUnitNumber: string | null;
  investmentPropertyAddressSuburb: string | null;
  investmentPropertyAddressPostcode: string | null;
}

export const guarantorDefaultValue: Guarantor = {
  ...addressDefaultValue,
  title: "",
  state: false,
  firstName: "",
  middleName: null,
  lastName: "",
  dateOfBirth: null,
  driverLicenseNumber: "",
  licenseCardNumber: "",
  driverLicenseState: "",
  maritalStatus: "",
  dependentNumber: 0,
  mobile: "",
  email: "",
  isAddressSameAsApplicant: false,
  residentialStatus: "",
  assets: [],
  liabilities: [],
  investmentPropertyAddressInputType: ADDRESS_INPUT_TYPES.AUTOCOMPLETE,
  investmentPropertyAddressState: "",
  investmentPropertyAddressStreetName: "",
  investmentPropertyAddressStreetNumber: "",
  investmentPropertyAddressUnitNumber: "",
  investmentPropertyAddressSuburb: "",
  investmentPropertyAddressPostcode: "",
};

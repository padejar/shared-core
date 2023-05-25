import { ADDRESS_INPUT_TYPES } from "../constants";

export interface Address {
  addressInputType: ADDRESS_INPUT_TYPES;
  addressState: string;
  addressStreetName: string;
  addressStreetNumber: string;
  addressUnitNumber: string;
  addressSuburb: string;
  addressPostcode: string;
}

export const addressDefaultValue: Address = {
  addressInputType: ADDRESS_INPUT_TYPES.AUTOCOMPLETE,
  addressState: "",
  addressStreetName: "",
  addressStreetNumber: "",
  addressUnitNumber: "",
  addressSuburb: "",
  addressPostcode: "",
};

export interface AddressFieldNames extends Record<string, string> {
  addressInputType: string;
  addressState: string;
  addressStreetName: string;
  addressStreetNumber: string;
  addressUnitNumber: string;
  addressSuburb: string;
  addressPostcode: string;
  fullAddress: string;
}

export const addressFieldNamesDefaultValue: AddressFieldNames = {
  addressInputType: "addressInputType",
  addressState: "addressState",
  addressStreetName: "addressStreetName",
  addressStreetNumber: "addressStreetNumber",
  addressUnitNumber: "addressUnitNumber",
  addressSuburb: "addressSuburb",
  addressPostcode: "addressPostcode",
  fullAddress: "fullAddress",
};

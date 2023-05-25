import joi from "joi";
import { ADDRESS_INPUT_TYPES } from "../constants";
import { AddressFieldNames, addressFieldNamesDefaultValue } from "../types";

export const addressSchema = (
  addressFieldNames: Omit<
    AddressFieldNames,
    "fullAddress"
  > = addressFieldNamesDefaultValue,
  isRequired = true
): {
  [x: string]: joi.StringSchema;
} => ({
  [addressFieldNames.addressInputType]: isRequired
    ? joi
        .string()
        .valid(...Object.values(ADDRESS_INPUT_TYPES))
        .required()
    : joi
        .string()
        .valid(...Object.values(ADDRESS_INPUT_TYPES))
        .allow(null, ""),
  [addressFieldNames.addressState]: isRequired
    ? joi.string().required().messages({
        "string.empty": "State is required",
        "any.required": "State is required",
      })
    : joi.string().allow(null, ""),
  [addressFieldNames.addressStreetName]: isRequired
    ? joi.string().required().messages({
        "string.empty": "Street name is required",
        "any.required": "Street name is required",
      })
    : joi.string().allow(null, ""),
  [addressFieldNames.addressStreetNumber]: isRequired
    ? joi.string().required().messages({
        "string.empty": "Street number is required",
        "any.required": "Street number is required",
      })
    : joi.string().allow(null, ""),
  [addressFieldNames.addressUnitNumber]: joi.string().allow(null, ""),
  [addressFieldNames.addressSuburb]: isRequired
    ? joi.string().required().messages({
        "string.empty": "Suburb is required",
        "any.required": "Suburb is required",
      })
    : joi.string().allow(null, ""),
  [addressFieldNames.addressPostcode]: isRequired
    ? joi.string().required().messages({
        "string.empty": "Postal code is required",
        "any.required": "Postal code is required",
      })
    : joi.string().allow(null, ""),
});

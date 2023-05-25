import joi from "joi";
import { addressSchema } from "../../address-autocomplete";
import { MOBILE_VALIDATION_PATTERN } from "../../common/constants/validation";
import {
  stringToDate,
  validateMaxAge,
  validateMinimumAge,
} from "../../common/utils/date";
import { parseNumber } from "../../common/utils/number";
import { replaceAll } from "../../common/utils/string";
import { GUARANTOR_ASSET_TYPES } from "../constants/guarantorAssetTypes";
import { GUARANTOR_LIABILITY_TYPES } from "../constants/guarantorLiabilityTypes";
import { GUARANTOR_RESIDENTIAL_STATUSES } from "../constants/guarantorResidentialStatuses";
import { GUARANTOR_MAX_AGE, GUARANTOR_MIN_AGE } from "../constants/validation";

export const guarantorsSchema = joi.object({
  guarantors: joi.array().items(
    joi.object().keys({
      id: joi.string().allow(null),
      title: joi.string().required().messages({
        "string.empty": "Title is required",
        "any.required": "Title is required",
      }),
      firstName: joi.string().required().messages({
        "string.empty": "First name is required",
        "any.required": "First name is required",
      }),
      middleName: joi.string().allow(null, ""),
      lastName: joi.string().required().messages({
        "string.empty": "Last name is required",
        "any.required": "Last name is required",
      }),
      dateOfBirth: joi
        .string()
        .custom((value, helpers) => {
          const isValidDate = replaceAll(value, " ", "").length === 10;
          if (!isValidDate) {
            return helpers.error("string.min");
          }

          const dateString = stringToDate(value);

          if (!validateMinimumAge(dateString, GUARANTOR_MIN_AGE)) {
            return helpers.error("number.min");
          }

          if (!validateMaxAge(dateString, GUARANTOR_MAX_AGE)) {
            return helpers.error("number.max");
          }

          return value;
        })
        .required()
        .messages({
          "string.empty": "Date of birth is required",
          "any.required": "Date of birth is required",
          "string.min": "Date of birth is invalid",
          "number.min": `Minimum age of the guarantor is ${GUARANTOR_MIN_AGE}`,
          "number.max": `Maximum age of the guarantor is ${GUARANTOR_MAX_AGE}`,
        }),
      driverLicenseNumber: joi.string().max(11).allow(null, "").messages({
        "string.max": `Maximum length is {#limit} characters`,
      }),
      licenseCardNumber: joi.string().allow(null, ""),
      driverLicenseState: joi.string().allow(null, ""),
      maritalStatus: joi.string().required().messages({
        "string.empty": "Marital status is required",
        "any.required": "Marital status is required",
      }),
      dependentNumber: joi
        .string()
        .custom((value, helpers) => {
          const number = parseNumber(value);
          if (number < 0) return helpers.error("number.min");

          return value;
        })
        .required()
        .messages({
          "number.min": "Minimum dependent number is 0",
          "any.required": "Dependent number is required",
          "string.empty": "Dependent number is required",
        }),
      assets: joi.array().items(
        joi.object().keys({
          type: joi
            .string()
            .valid(...Object.values(GUARANTOR_ASSET_TYPES))
            .allow(null, "")
            .optional(),
          amount: joi.when("type", {
            is: joi.valid(...Object.values(GUARANTOR_ASSET_TYPES)),
            then: joi.string().required().messages({
              "string.empty": "Amount is required",
              "any.required": "Amount is required",
            }),
            otherwise: joi.string().valid("", null).messages({
              "any.only": "Type is required when amount is entered",
            }),
          }),
        })
      ),
      liabilities: joi.array().items(
        joi.object().keys({
          type: joi
            .string()
            .valid(...Object.values(GUARANTOR_LIABILITY_TYPES))
            .allow(null, "")
            .optional(),
          amount: joi.when("type", {
            is: joi.valid(...Object.values(GUARANTOR_LIABILITY_TYPES)),
            then: joi.string().required().messages({
              "string.empty": "Amount is required",
              "any.required": "Amount is required",
            }),
            otherwise: joi.string().valid("", null).messages({
              "any.only": "Type is required when amount is entered",
            }),
          }),
        })
      ),
      mobile: joi
        .string()
        .pattern(MOBILE_VALIDATION_PATTERN)
        .required()
        .messages({
          "string.pattern.base": "Mobile phone number is invalid",
          "string.empty": "Mobile phone is required",
        }),
      email: joi
        .string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.email": "Email is invalid",
          "string.empty": "Email is required",
          "any.required": "Email is required",
        }),
      isAddressSameAsApplicant: joi.boolean().required(),
      residentialStatus: joi
        .string()
        .valid(...Object.values(GUARANTOR_RESIDENTIAL_STATUSES))
        .required()
        .messages({
          "any.only": "Residential status is required",
          "any.required": "Residential status is required",
        }),
      ...addressSchema(),
      ...addressSchema(
        {
          addressInputType: "investmentPropertyAddressInputType",
          addressState: "investmentPropertyAddressState",
          addressStreetName: "investmentPropertyAddressStreetName",
          addressStreetNumber: "investmentPropertyAddressStreetNumber",
          addressUnitNumber: "investmentPropertyAddressUnitNumber",
          addressSuburb: "investmentPropertyAddressSuburb",
          addressPostcode: "investmentPropertyAddressPostcode",
        },
        false
      ),
    })
  ),
});

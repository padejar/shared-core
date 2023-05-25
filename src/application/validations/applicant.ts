import { isMatch } from "date-fns";
import joi from "joi";
import { addressSchema } from "../../address-autocomplete";
import { DEFAULT_DATE_INPUT_FORMAT } from "../../common/constants/date";
import { ENTITY_TYPES } from "../../common/constants/entityTypes";
import { PHONE_VALIDATION_PATTERN } from "../../common/constants/validation";
import { stringToDate } from "../../common/utils/date";
import { replaceAll } from "../../common/utils/string";
import { TRUSTEE_TYPES } from "../constants/trusteeTypes";

export const applicantSchema = joi.object({
  abn: joi.string().required().messages({
    "string.empty": "ABN is required",
    "any.required": "ABN is required",
  }),
  entityName: joi.string().required().messages({
    "string.empty": "Entity name is required",
    "any.required": "Entity name is required",
  }),
  tradingName: joi.string().allow(null, "").required(),
  entityType: joi.string().required().messages({
    "string.empty": "Entity type is required",
    "any.required": "Entity type is required",
  }),
  trusteeType: joi.when("entityType", {
    is: ENTITY_TYPES.TRUST,
    then: joi.string().required().messages({
      "string.empty": "Trustee type is required",
      "any.required": "Trustee type is required",
    }),
    otherwise: joi.string().valid("", null),
  }),
  trusteeName: joi.when("trusteeType", {
    is: joi.valid(TRUSTEE_TYPES.INDIVIDUAL, TRUSTEE_TYPES.COMPANY),
    then: joi.string().required().messages({
      "string.empty": "Trustee name is required",
      "any.required": "Trustee name is required",
    }),
  }),
  trusteeAcn: joi.when("trusteeType", {
    is: TRUSTEE_TYPES.COMPANY,
    then: joi.string().required().messages({
      "string.empty": "Trustee ACN is required",
      "any.required": "Trustee ACN is required",
    }),
    otherwise: joi.string().valid("", null),
  }),
  abnRegisteredDate: joi
    .string()
    .custom((value, helpers) => {
      const sanitizedDate = replaceAll(value, " ", "");
      const matchedFormat = isMatch(sanitizedDate, DEFAULT_DATE_INPUT_FORMAT);

      if (sanitizedDate.length < 10 || !matchedFormat) {
        return helpers.error("date.format");
      }

      const dateString = stringToDate(sanitizedDate);
      const today = new Date();
      dateString.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (dateString > today) {
        return helpers.error("date.max");
      }

      return value;
    })
    .required()
    .messages({
      "string.empty": "ABN registered date is required",
      "date.format": "ABN registered date is invalid",
      "date.max": "ABN registered date is greater than today",
      "any.required": "ABN registered date is required",
    }),
  gstRegisteredDate: joi
    .string()
    .custom((value, helpers) => {
      if (value) {
        const sanitizedDate = replaceAll(value, " ", "");
        const matchedFormat = isMatch(sanitizedDate, DEFAULT_DATE_INPUT_FORMAT);

        if (sanitizedDate.length < 10 || !matchedFormat) {
          return helpers.error("date.format");
        }

        const dateString = stringToDate(sanitizedDate);
        const today = new Date();
        dateString.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (dateString > today) {
          return helpers.error("date.max");
        }
      }

      return value;
    })
    .allow(null, "")
    .required()
    .messages({
      "date.format": "GST registered date is invalid",
      "date.max": "GST registered date is greater than today",
    }),
  phone: joi.string().pattern(PHONE_VALIDATION_PATTERN).required().messages({
    "string.pattern.base": "Phone number is invalid",
    "string.empty": "Phone is required",
  }),
  industry: joi.string().required().messages({
    "string.empty": "Industry is required",
    "any.required": "Industry is required",
  }),
  industryType: joi.string().required().messages({
    "string.empty": "Industry type is required",
    "any.required": "Industry type is required",
  }),
  ...addressSchema(),
});

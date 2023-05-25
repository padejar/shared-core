import joi from "joi";
import { SECURITY_DETAILS_INPUT_TYPES } from "../constants/securityDetailsInputTypes";
import { SUPPLIER_TYPES } from "../constants/supplierTypes";
import { USAGE_TYPES } from "../constants/usageTypes";

export const securitySchema = joi.object({
  supplierType: joi
    .string()
    .valid(...Object.values(SUPPLIER_TYPES))
    .required()
    .messages({
      "any.only": "Supplier type is required",
      "any.required": "Supplier type is required",
    }),
  supplierName: joi.string().required().messages({
    "string.empty": "Supplier name is required",
    "any.required": "Supplier name is required",
  }),
  usageType: joi
    .string()
    .valid(...Object.values(USAGE_TYPES))
    .required()
    .messages({
      "any.only": "Usage type is required",
      "any.required": "Usage type is required",
    }),
  assetTypeCategory: joi.string().required().messages({
    "string.empty": "Asset type category is required",
    "any.required": "Asset type category is required",
  }),
  assetType: joi.string().required().messages({
    "string.empty": "Asset type category is required",
    "any.required": "Asset type category is required",
  }),
  securityDetailsInputType: joi
    .string()
    .valid(...Object.values(SECURITY_DETAILS_INPUT_TYPES))
    .required()
    .messages({
      "any.only": "Security input type is required",
      "any.required": "Security input type is required",
    }),
  manufactureYear: joi.string().required().messages({
    "string.empty": "Year is required",
    "any.required": "Year is required",
  }),
  make: joi.string().required().messages({
    "string.empty": "Make is required",
    "any.required": "Make is required",
  }),
  model: joi.string().required().messages({
    "string.empty": "Model is required",
    "any.required": "Model is required",
  }),
  retailValue: joi.string().allow(null, "").optional(),
  nvic: joi.string().allow(null, "").optional(),
  serialNumber: joi.string().allow(null, "").optional(),
  registrationNumber: joi.string().allow(null, "").optional(),
  description: joi.string().allow(null, "").optional(),
  actualKm: joi.string().allow(null, "").optional(),
});

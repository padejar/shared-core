import joi from "joi";
import { convertToCurrency, parseNumber } from "../../common/utils/number";
import { AMOUNT_TYPES } from "../constants/amountTypes";
import {
  QUOTE_MIN_ASSET_MODEL_YEAR,
  QUOTE_MIN_PURCHASE_AMOUNT,
  QUOTE_NOMINAL_MAX_AMOUNT,
  QUOTE_NOMINAL_MIN_AMOUNT,
  QUOTE_PERCENTAGE_MAX_AMOUNT,
  QUOTE_PERCENTAGE_MIN_AMOUNT,
  QUOTE_MAX_BROKERAGE_ORIGINATION_FEE_AMOUNT,
  QUOTE_MIN_BROKERAGE_ORIGINATION_FEE_AMOUNT,
} from "../constants/quote";
import { REPAYMENT_TERM_OPTIONS } from "../constants/repaymentTermOptions";
import { SUPPLIER_TYPES } from "../constants/supplierTypes";

export const quoteSchema = joi.object({
  supplierType: joi
    .string()
    .valid(...Object.values(SUPPLIER_TYPES))
    .messages({
      "any.only": "Supplier type is required",
    }),
  assetTypeCategory: joi.string().required().messages({
    "string.empty": "Asset type category is required",
    "any.required": "Asset type category is required",
  }),
  assetManufactureYear: joi
    .number()
    .min(QUOTE_MIN_ASSET_MODEL_YEAR)
    .custom((value, helpers) => {
      const currentYear = new Date().getFullYear();
      if (+value <= currentYear) return value;
      return helpers.error("number.max");
    })
    .required()
    .messages({
      "number.min": `Min asset manufacture year is ${QUOTE_MIN_ASSET_MODEL_YEAR}`,
      "number.max": `Max asset manufacture year is ${new Date().getFullYear()}`,
      "number.base": "Asset manufacture year is required",
    }),
  purchaseAmount: joi
    .string()
    .custom((value, helpers) => {
      if (parseNumber(value) >= QUOTE_MIN_PURCHASE_AMOUNT) return value;
      return helpers.error("number.min");
    })
    .custom((value, helpers) => {
      if (parseNumber(value) <= QUOTE_NOMINAL_MAX_AMOUNT) return value;
      return helpers.error("number.max");
    })
    .required()
    .messages({
      "number.min": `Minimum purchase price is $${convertToCurrency(
        QUOTE_MIN_PURCHASE_AMOUNT
      )}`,
      "number.max": `Maximum purchase price is $${convertToCurrency(
        QUOTE_NOMINAL_MAX_AMOUNT
      )}`,
      "string.empty": "Purchase price is required",
    }),
  depositAmount: joi
    .string()
    .custom((value, helpers) => {
      if (parseNumber(value) >= QUOTE_NOMINAL_MIN_AMOUNT) return value;
      return helpers.error("number.min");
    })
    .custom((value, helpers) => {
      if (parseNumber(value) <= QUOTE_NOMINAL_MAX_AMOUNT) return value;
      return helpers.error("number.max");
    })
    .allow("")
    .required()
    .messages({
      "number.min": `Minimum deposit amount is $${convertToCurrency(
        QUOTE_NOMINAL_MIN_AMOUNT
      )}`,
      "number.max": `Maximum deposit amount is $${convertToCurrency(
        QUOTE_NOMINAL_MAX_AMOUNT
      )}`,
      "any.required": "Deposit is required",
    }),
  tradeInAmount: joi
    .string()
    .custom((value, helpers) => {
      if (parseNumber(value) >= QUOTE_NOMINAL_MIN_AMOUNT) return value;
      return helpers.error("number.min");
    })
    .custom((value, helpers) => {
      if (parseNumber(value) <= QUOTE_NOMINAL_MAX_AMOUNT) return value;
      return helpers.error("number.max");
    })
    .allow("")
    .required()
    .messages({
      "number.min": `Minimum trade in amount is $${convertToCurrency(
        QUOTE_NOMINAL_MIN_AMOUNT
      )}`,
      "number.max": `Maximum trade in amountis $${convertToCurrency(
        QUOTE_NOMINAL_MAX_AMOUNT
      )}`,
      "any.required": "Trade in is required",
    }),
  tradePayoutAmount: joi
    .string()
    .custom((value, helpers) => {
      if (parseNumber(value) >= QUOTE_NOMINAL_MIN_AMOUNT) return value;
      return helpers.error("number.min");
    })
    .custom((value, helpers) => {
      if (parseNumber(value) <= QUOTE_NOMINAL_MAX_AMOUNT) return value;
      return helpers.error("number.max");
    })
    .allow("")
    .required()
    .messages({
      "number.min": `Minimum payout amount is $${convertToCurrency(
        QUOTE_NOMINAL_MIN_AMOUNT
      )}`,
      "number.max": `Maximum payout amount is $${convertToCurrency(
        QUOTE_NOMINAL_MAX_AMOUNT
      )}`,
      "any.required": "Payout amount is required",
    }),
  repaymentTermOption: joi
    .string()
    .valid(REPAYMENT_TERM_OPTIONS.MONTHLY)
    .optional(),
  repaymentTermMonth: joi.string().required().messages({
    "any.required": "Term is required",
    "string.base": "Term is required",
    "string.empty": "Term is required",
  }),
  balloonType: joi
    .string()
    .valid(...Object.values(AMOUNT_TYPES))
    .required(),
  balloonPercentage: joi.when("balloonType", {
    is: AMOUNT_TYPES.PERCENTAGE,
    then: joi
      .string()
      .custom((value, helpers) => {
        if (parseNumber(value) >= QUOTE_PERCENTAGE_MIN_AMOUNT) return value;
        return helpers.error("number.min");
      })
      .custom((value, helpers) => {
        if (parseNumber(value) <= QUOTE_PERCENTAGE_MAX_AMOUNT) return value;
        return helpers.error("number.max");
      })
      .allow("")
      .messages({
        "number.min": `Minimum ballon percentage is $${convertToCurrency(
          QUOTE_PERCENTAGE_MIN_AMOUNT
        )}`,
        "number.max": `Maximum ballon percentage is $${convertToCurrency(
          QUOTE_PERCENTAGE_MAX_AMOUNT
        )}`,
      }),
    otherwise: joi.string().allow("", null).optional(),
  }),
  balloonNominal: joi.when("balloonType", {
    is: AMOUNT_TYPES.FIXED,
    then: joi
      .string()
      .custom((value, helpers) => {
        if (parseNumber(value) >= QUOTE_NOMINAL_MIN_AMOUNT) return value;
        return helpers.error("number.min");
      })
      .custom((value, helpers) => {
        if (parseNumber(value) <= QUOTE_NOMINAL_MAX_AMOUNT) return value;
        return helpers.error("number.max");
      })
      .allow("")
      .messages({
        "number.min": `Minimum ballon nominal is $${convertToCurrency(
          QUOTE_NOMINAL_MIN_AMOUNT
        )}`,
        "number.max": `Maximum ballon nominal is $${convertToCurrency(
          QUOTE_NOMINAL_MAX_AMOUNT
        )}`,
      }),
    otherwise: joi.string().allow("", null).optional(),
  }),
  brokerageType: joi
    .string()
    .valid(...Object.values(AMOUNT_TYPES))
    .required(),
  brokeragePercentage: joi.when("brokerageType", {
    is: AMOUNT_TYPES.PERCENTAGE,
    then: joi
      .string()
      .custom((value, helpers) => {
        if (parseNumber(value) >= QUOTE_PERCENTAGE_MIN_AMOUNT) return value;
        return helpers.error("number.min");
      })
      .custom((value, helpers) => {
        if (parseNumber(value) <= QUOTE_PERCENTAGE_MAX_AMOUNT) return value;
        return helpers.error("number.max");
      })
      .allow("")
      .messages({
        "number.min": `Minimum brokerage percentage is $${convertToCurrency(
          QUOTE_PERCENTAGE_MIN_AMOUNT
        )}`,
        "number.max": `Maximum brokerage percentage is $${convertToCurrency(
          QUOTE_PERCENTAGE_MAX_AMOUNT
        )}`,
      }),
    otherwise: joi.string().allow("", null).optional(),
  }),
  brokerageNominal: joi.when("brokerageType", {
    is: AMOUNT_TYPES.FIXED,
    then: joi
      .string()
      .custom((value, helpers) => {
        if (parseNumber(value) >= QUOTE_NOMINAL_MIN_AMOUNT) return value;
        return helpers.error("number.min");
      })
      .custom((value, helpers) => {
        if (parseNumber(value) <= QUOTE_NOMINAL_MAX_AMOUNT) return value;
        return helpers.error("number.max");
      })
      .allow("")
      .messages({
        "number.min": `Minimum brokerage nominal is $${convertToCurrency(
          QUOTE_NOMINAL_MIN_AMOUNT
        )}`,
        "number.max": `Maximum brokerage nominal is $${convertToCurrency(
          QUOTE_NOMINAL_MAX_AMOUNT
        )}`,
      }),
    otherwise: joi.string().allow("", null).optional(),
  }),
  isFinancierRateManual: joi.boolean().required(),
  financierRate: joi.when("isFinancierRateManual", {
    is: true,
    then: joi
      .string()
      .custom((value, helpers) => {
        if (parseNumber(value) <= QUOTE_PERCENTAGE_MIN_AMOUNT)
          return helpers.error("number.min");

        return value;
      })
      .custom((value, helpers) => {
        if (parseNumber(value) > QUOTE_PERCENTAGE_MAX_AMOUNT)
          return helpers.error("number.max");

        return value;
      })
      .required()
      .messages({
        "number.min": `Minimum financier rate ${convertToCurrency(
          QUOTE_PERCENTAGE_MIN_AMOUNT
        )}`,
        "number.max": `Maximum financier rate ${convertToCurrency(
          QUOTE_PERCENTAGE_MAX_AMOUNT
        )}`,
        "string.empty": "Financier rate is required",
        "any.required": "Financier rate is required",
      }),
    otherwise: joi.string().allow("", null).optional(),
  }),

  includeFees: joi.boolean().required(),
  brokerOriginationFeeAmount: joi
    .string()
    .custom((value, helpers) => {
      if (parseNumber(value) >= QUOTE_MIN_BROKERAGE_ORIGINATION_FEE_AMOUNT)
        return value;
      return helpers.error("number.min");
    })
    .custom((value, helpers) => {
      if (parseNumber(value) <= QUOTE_MAX_BROKERAGE_ORIGINATION_FEE_AMOUNT)
        return value;
      return helpers.error("number.max");
    })
    .allow("")
    .required()
    .messages({
      "number.min": `Minimum brokerage origination fee amount is $${convertToCurrency(
        QUOTE_MIN_BROKERAGE_ORIGINATION_FEE_AMOUNT
      )}`,
      "number.max": `Maximum brokerage origination fee amount is $${convertToCurrency(
        QUOTE_MAX_BROKERAGE_ORIGINATION_FEE_AMOUNT
      )}`,
      "any.required": "Broker origination fee is required",
    }),
  advanceOrArrears: joi.string().optional(),
  isPropertyOwner: joi.boolean().required().messages({
    "boolean.base": "Property owner is is required",
    "any.required": "Property owner is required",
  }),
  financeType: joi.string().optional(),
  assetType: joi.string().required().messages({
    "string.empty": "Asset type is required",
    "any.required": "Asset type is required",
  }),
  hasStructuredPayment: joi.boolean().optional(),
  structuredPaymentNthPaymentAmount: joi.string().optional(),
  structuredPaymentAmount: joi.string().optional(),
});

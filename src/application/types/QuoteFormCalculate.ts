import { AMOUNT_TYPES } from "../constants/amountTypes";
import { PAYMENT_TERMS_60 } from "../constants/paymentTerms";
import { QUOTE_ADVANCE_OR_ARREARS } from "../constants/quote";
import { REPAYMENT_TERM_OPTIONS } from "../constants/repaymentTermOptions";
import { SUPPLIER_TYPES } from "../constants/supplierTypes";

export interface QuoteFormCalculate {
  supplierType: SUPPLIER_TYPES | null;
  assetTypeCategory: string;
  assetManufactureYear: string;
  purchaseAmount: string;
  depositAmount: string;
  tradeInAmount: string;
  tradePayoutAmount: string;
  repaymentTermMonth: string;
  repaymentTermOption: REPAYMENT_TERM_OPTIONS;
  balloonType: AMOUNT_TYPES;
  balloonNominal: string;
  balloonPercentage: string;
  brokerageType: AMOUNT_TYPES;
  brokerageNominal: string;
  brokeragePercentage: string;
  isFinancierRateManual: boolean;
  financierRate: string;
  includeFees: boolean;
  brokerOriginationFeeAmount: string;
  advanceOrArrears: string;
  shouldCompareQuote: boolean;
  calculationLoading: boolean;
  isPropertyOwner: boolean | null;
}

export const quoteFormCalculateDefaultValue: QuoteFormCalculate = {
  supplierType: null,
  assetTypeCategory: "",
  assetManufactureYear: "",
  purchaseAmount: "",
  depositAmount: "",
  tradeInAmount: "",
  tradePayoutAmount: "",
  repaymentTermMonth: PAYMENT_TERMS_60,
  repaymentTermOption: REPAYMENT_TERM_OPTIONS.MONTHLY,
  balloonType: AMOUNT_TYPES.FIXED,
  balloonNominal: "",
  balloonPercentage: "",
  brokerageType: AMOUNT_TYPES.FIXED,
  brokerageNominal: "",
  brokeragePercentage: "",
  isFinancierRateManual: false,
  financierRate: "",
  includeFees: false,
  brokerOriginationFeeAmount: "",
  advanceOrArrears: QUOTE_ADVANCE_OR_ARREARS.ADVANCE,
  shouldCompareQuote: false,
  calculationLoading: false,
  isPropertyOwner: false,
};

import { AMOUNT_TYPES } from "../constants/amountTypes";
import { REPAYMENT_TERM_OPTIONS } from "../constants/repaymentTermOptions";
import { SUPPLIER_TYPES } from "../constants/supplierTypes";

export interface QuoteCalculateRequest {
  supplierType: SUPPLIER_TYPES | null;
  assetTypeCategory: string;
  assetManufactureYear: number;
  purchaseAmount: number;
  depositAmount: number;
  tradeInAmount: number;
  tradePayoutAmount: number;
  repaymentTermMonth: number;
  repaymentTermOption: REPAYMENT_TERM_OPTIONS;
  balloonType: AMOUNT_TYPES;
  balloonAmount: number;
  brokerageType: AMOUNT_TYPES;
  brokerageAmount: number;
  isFinancierRateManual: boolean;
  financierRate: number | null;
  includeFees: boolean;
  brokerOriginationFeeAmount: number;
  advanceOrArrears: string;
  isPropertyOwner: boolean;
}

export const quoteCalculateRequestDefaultValue: QuoteCalculateRequest = {
  supplierType: null,
  assetTypeCategory: "",
  assetManufactureYear: 0,
  purchaseAmount: 0,
  depositAmount: 0,
  tradeInAmount: 0,
  tradePayoutAmount: 0,
  repaymentTermMonth: 60,
  repaymentTermOption: REPAYMENT_TERM_OPTIONS.MONTHLY,
  balloonType: AMOUNT_TYPES.FIXED,
  balloonAmount: 0,
  brokerageType: AMOUNT_TYPES.FIXED,
  brokerageAmount: 0,
  isFinancierRateManual: false,
  financierRate: 0,
  includeFees: true,
  brokerOriginationFeeAmount: 0,
  advanceOrArrears: "ADVANCE",
  isPropertyOwner: false,
};

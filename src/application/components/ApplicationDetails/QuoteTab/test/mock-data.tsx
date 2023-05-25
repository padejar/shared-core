import { AMOUNT_TYPES } from "../../../../constants/amountTypes";
import { APPLICATION_STATUSES } from "../../../../constants/applicationStatuses";
import {
  ASSET_TYPE_CATEGORIES,
  CARS_AND_LIGHT_TRUCKS,
  PRIMARY_ASSETS,
} from "../../../../constants/assetTypes";
import { REPAYMENT_TERM_OPTIONS } from "../../../../constants/repaymentTermOptions";
import { SUPPLIER_TYPES } from "../../../../constants/supplierTypes";
import { QuoteCalculateRequest } from "../../../../types/QuoteCalculateRequest";
import { QuoteCalculateResponse } from "../../../../types/QuoteCalculateResponse";

export const applicationId = "700960e5-ff65-4e19-9a08-60f9bf1ce6f0";

export const calculateResp: QuoteCalculateResponse = {
  amountFinanced: 11589.5,
  applicationFee: 545,
  applicationFeeWithGst: 599.5,
  balloonNominal: 800,
  brokerOriginationFeeAmountWithGst: 990,
  brokerageNominal: 231.79,
  brokerageNominalWithGst: 254.97,
  customerRate: 14.08,
  baseRate: 12.9,
  financierRate: 12.9,
  firstInstallmentAmount: 301.12,
  installmentAmount: 301.12,
  totalPaymentToBroker: 1131.79,
  totalPaymentToBrokerWithGst: 1244.97,
};

export interface QuoteFormFields extends Partial<QuoteCalculateRequest> {
  assetType: string;
}
export const quoteDataSet1: QuoteFormFields = {
  supplierType: SUPPLIER_TYPES.PRIVATE,
  assetTypeCategory: ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS as string,
  assetType: CARS_AND_LIGHT_TRUCKS.PASSENGER_VEHICLES as string,
  assetManufactureYear: 2021,
  purchaseAmount: 10001,
  isPropertyOwner: true,
  repaymentTermMonth: 48,
  depositAmount: 5000,
  tradeInAmount: 5001,
  tradePayoutAmount: 5001,
  balloonType: AMOUNT_TYPES.PERCENTAGE,
  brokerageType: AMOUNT_TYPES.PERCENTAGE,
  isFinancierRateManual: true,
  financierRate: 5,
  includeFees: true,
  brokerOriginationFeeAmount: 900,
  advanceOrArrears: "ADVANCE",
  repaymentTermOption: REPAYMENT_TERM_OPTIONS.MONTHLY,
};

export const quoteDataSet2: QuoteFormFields = {
  supplierType: SUPPLIER_TYPES.DEALER,
  assetTypeCategory: ASSET_TYPE_CATEGORIES.PRIMARY_ASSETS as string,
  assetType: PRIMARY_ASSETS.HEAVY_TRUCKS as string,
  assetManufactureYear: 2020,
  purchaseAmount: 10001,
  isPropertyOwner: false,
  repaymentTermMonth: 60,
  depositAmount: 0,
  tradeInAmount: 0,
  tradePayoutAmount: 0,
  balloonType: AMOUNT_TYPES.FIXED,
  brokerageType: AMOUNT_TYPES.FIXED,
  isFinancierRateManual: false,
  includeFees: false,
  brokerOriginationFeeAmount: 0,
  advanceOrArrears: "ADVANCE",
  repaymentTermOption: REPAYMENT_TERM_OPTIONS.MONTHLY,
};

export const savedApplication = {
  data: {
    id: applicationId,
    userId: 6,
    assessmentId: null,
    name: "Test Applicant Name",
    applicationNumber: "QF10362",
    status: APPLICATION_STATUSES.DRAFTED_NEW,
    submittedAt: null,
    quote: {
      id: "700960e5-ff65-4e19-9a08-60f9bf1ce6f0",
      applicationId: applicationId,
      state: true,
      financeType: "CHATTEL_MORTGAGE",
      assetTypeCategory: ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS as string,
      assetType: CARS_AND_LIGHT_TRUCKS.PASSENGER_VEHICLES as string,
      assetManufactureYear: 2021,
      supplierType: SUPPLIER_TYPES.DEALER,
      isPropertyOwner: false,
      purchaseAmount: 50000,
      depositAmount: 40000,
      tradeInAmount: 6000,
      tradePayoutAmount: 3000,
      repaymentTermOption: REPAYMENT_TERM_OPTIONS.MONTHLY,
      repaymentTermMonth: 60,
      balloonType: AMOUNT_TYPES.FIXED,
      balloonAmount: 3,
      balloonNominal: 3,
      brokerageType: AMOUNT_TYPES.FIXED,
      brokerageAmount: 3,
      brokerageNominal: 3,
      brokerOriginationFeeAmount: 3,
      brokerOriginationFeeAmountWithGst: 0,
      isFinancierRateManual: false,
      baseRate: 7.5,
      includeFees: false,
      advanceOrArrears: "ADVANCE",
      hasStructuredPayment: false,
      structuredPaymentNthPaymentAmount: 0,
      structuredPaymentAmount: 0,
      firstInstallmentAmount: 1430.18,
      totalPaymentToBroker: 0,
      totalPaymentToBrokerWithGst: 0,
      installmentAmount: 995.68,
      applicationFee: 395,
      applicationFeeWithGst: 434.5,
      brokerageNominalWithGst: 0,
      financierRate: null,
      customerRate: 7.5,
      amountFinanced: 50000,
    },
  },
};

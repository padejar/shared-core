export interface QuoteCalculateResponse {
  amountFinanced: number;
  applicationFee: number;
  applicationFeeWithGst: number;
  balloonNominal: number;
  brokerOriginationFeeAmountWithGst: number;
  brokerageNominal: number;
  brokerageNominalWithGst: number;
  customerRate: number;
  baseRate: number;
  financierRate: number | null;
  firstInstallmentAmount: number;
  installmentAmount: number;
  totalPaymentToBroker: number;
  totalPaymentToBrokerWithGst: number;
}

export const quoteCalculateResponseDefaultValue: QuoteCalculateResponse = {
  amountFinanced: 0,
  applicationFee: 0,
  applicationFeeWithGst: 0,
  balloonNominal: 0,
  brokerOriginationFeeAmountWithGst: 0,
  brokerageNominal: 0,
  brokerageNominalWithGst: 0,
  customerRate: 0,
  baseRate: 0,
  financierRate: 0,
  firstInstallmentAmount: 0,
  installmentAmount: 0,
  totalPaymentToBroker: 0,
  totalPaymentToBrokerWithGst: 0,
};

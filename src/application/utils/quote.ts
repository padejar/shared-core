import { parseNumber } from "../../common/utils/number";
import { extractProperties, propertyCheck } from "../../common/utils/object";
import { numberToString } from "../../common/utils/string";
import { AMOUNT_TYPES } from "../constants/amountTypes";
import {
  QuoteCalculateRequest,
  quoteCalculateRequestDefaultValue,
} from "../types/QuoteCalculateRequest";
import {
  QuoteFormCalculate,
  quoteFormCalculateDefaultValue,
} from "../types/QuoteFormCalculate";
import {
  QuoteFormSave,
  quoteFormSaveDefaultValue,
} from "../types/QuoteFormSave";
import { QuoteRequest, quoteRequestDefaultValue } from "../types/QuoteRequest";
import { QuoteResponse } from "../types/QuoteResponse";

export const getLoanAmount = (
  purchaseAmount: number,
  depositAmount: number,
  tradeInAmount: number,
  tradePayoutAmount: number
): number => {
  return purchaseAmount - depositAmount - tradeInAmount + tradePayoutAmount;
};

export const getFutureValuePercentage = (
  purchaseAmount: number,
  balloonNominal: number
): number => {
  return (balloonNominal / purchaseAmount) * 100;
};

export const getBrokeragePercentage = (
  amountFinanced: number,
  brokerageAmount: number
): number => {
  return (brokerageAmount / amountFinanced) * 100;
};

export const transformToQuoteForm = (quote: QuoteResponse): QuoteFormSave => {
  let newQuoteForm = quoteFormSaveDefaultValue;

  for (const property in quote) {
    if (propertyCheck(newQuoteForm, property as keyof QuoteFormSave)) {
      let value = quote[property as keyof QuoteRequest];
      if (typeof quote[property as keyof QuoteRequest] === "number") {
        value =
          typeof value !== "undefined"
            ? numberToString(value as number)
            : value;
      }
      if (property === "financierRate") {
        if (!quote.financierRate) {
          value = "";
        }
      }
      newQuoteForm = {
        ...newQuoteForm,
        [property]: value,
      };
    }
  }

  const {
    balloonNominal,
    balloonPercentage,
    brokerageNominal,
    brokeragePercentage,
  } = processBalloonAndBrokerageForm(quote, newQuoteForm);

  newQuoteForm = {
    ...newQuoteForm,
    balloonNominal,
    balloonPercentage,
    brokerageNominal,
    brokeragePercentage,
  };

  return newQuoteForm;
};

export const transformToCalculateRequest = (
  calculatePayload: QuoteFormSave
): QuoteCalculateRequest => {
  const extractedObject = extractProperties<QuoteFormSave>(
    calculatePayload,
    Object.keys(quoteFormCalculateDefaultValue)
  ) as QuoteFormCalculate;

  let quoteRequest = quoteCalculateRequestDefaultValue;
  for (const property in extractedObject) {
    if (propertyCheck(quoteRequest, property as keyof QuoteCalculateRequest)) {
      let value: string | number | null | boolean =
        extractedObject[property as keyof QuoteFormCalculate];
      if (
        typeof quoteRequest[property as keyof QuoteCalculateRequest] ===
        "number"
      ) {
        value = parseNumber(value as string);
      }
      if (property === "financierRate") {
        value = !calculatePayload.financierRate ? null : value;
      }
      quoteRequest = {
        ...quoteRequest,
        [property]: value,
      };
    }
  }

  return quoteRequest;
};

export const transformToSaveRequest = (
  quoteFormSave: QuoteFormSave
): QuoteRequest => {
  let quoteRequest = quoteRequestDefaultValue;
  for (const property in quoteFormSave) {
    if (propertyCheck(quoteRequest, property as keyof QuoteRequest)) {
      let formValue: string | number | boolean | null | undefined =
        quoteFormSave[property as keyof QuoteFormSave];
      const requestValue = quoteRequest[property as keyof QuoteRequest];
      const isRequestValueNumber = typeof requestValue === "number";
      const isString = typeof formValue === "string";
      if (isRequestValueNumber && isString) {
        formValue = parseNumber(formValue as string);
      }
      if (property === "financierRate") {
        formValue = !quoteFormSave.financierRate ? null : formValue;
      }
      quoteRequest = {
        ...quoteRequest,
        [property]: formValue,
      };
    }
  }

  return {
    ...quoteRequest,
    supplierType: quoteRequest.supplierType ? quoteRequest.supplierType : null,
  };
};

export const processBalloonAndBrokeragePayload = (
  quoteFormSave: QuoteFormSave
): {
  balloonAmount: number;
  brokerageAmount: number;
} => {
  let balloonAmount = 0;
  if (quoteFormSave.balloonType === AMOUNT_TYPES.FIXED) {
    balloonAmount = parseNumber(quoteFormSave.balloonNominal);
  } else {
    balloonAmount = parseNumber(quoteFormSave.balloonPercentage);
  }

  let brokerageAmount = 0;
  if (quoteFormSave.brokerageType === AMOUNT_TYPES.FIXED) {
    brokerageAmount = parseNumber(quoteFormSave.brokerageNominal);
  } else {
    brokerageAmount = parseNumber(quoteFormSave.brokeragePercentage);
  }

  return {
    brokerageAmount,
    balloonAmount,
  };
};

export const processBalloonAndBrokerageForm = (
  quote: QuoteResponse,
  quoteForm: QuoteFormSave
): {
  balloonNominal: string;
  balloonPercentage: string;
  brokerageNominal: string;
  brokeragePercentage: string;
} => {
  const purchaseAmount = parseNumber(quoteForm.purchaseAmount);

  const brokerageNominal = numberToString(quote.brokerageNominal);
  let brokeragePercentage = quoteForm.brokeragePercentage;
  if (
    quoteForm.brokeragePercentage === "" &&
    quoteForm.brokerageType === AMOUNT_TYPES.PERCENTAGE
  ) {
    brokeragePercentage = numberToString(quote.brokerageAmount);
  }
  if (quoteForm.brokerageType === AMOUNT_TYPES.FIXED) {
    const depositAmount = parseNumber(quoteForm.depositAmount);
    const tradeInAmount = parseNumber(quoteForm.tradeInAmount);
    const tradePayoutAmount = parseNumber(quoteForm.tradePayoutAmount);
    const loanAmount = getLoanAmount(
      purchaseAmount,
      depositAmount,
      tradeInAmount,
      tradePayoutAmount
    );
    const amountFinanced =
      loanAmount +
      (quoteForm.includeFees
        ? quote.applicationFee +
          parseNumber(quoteForm.brokerOriginationFeeAmount)
        : 0);
    const calculateBrokeragePercentage = getBrokeragePercentage(
      amountFinanced,
      quote.brokerageNominal
    );
    brokeragePercentage = numberToString(calculateBrokeragePercentage);
  }

  const balloonNominal = numberToString(quote.balloonNominal);
  let balloonPercentage = quoteForm.balloonPercentage;
  if (
    quoteForm.balloonPercentage === "" &&
    quoteForm.balloonType === AMOUNT_TYPES.PERCENTAGE
  ) {
    balloonPercentage = numberToString(quote.balloonAmount);
  }
  if (quoteForm.balloonType === AMOUNT_TYPES.FIXED) {
    const calculateFutureValuePercentage = getFutureValuePercentage(
      purchaseAmount,
      quote.balloonNominal
    );
    balloonPercentage = numberToString(calculateFutureValuePercentage);
  }

  return {
    brokerageNominal,
    brokeragePercentage,
    balloonNominal,
    balloonPercentage,
  };
};

export const processCalculatePayload = (
  quoteFormSave: QuoteFormSave
): QuoteCalculateRequest => {
  let newPayload = transformToCalculateRequest(quoteFormSave);
  const { balloonAmount, brokerageAmount } = processBalloonAndBrokeragePayload(
    quoteFormSave
  );

  newPayload = {
    ...newPayload,
    balloonAmount,
    brokerageAmount,
    financierRate: newPayload.isFinancierRateManual
      ? newPayload.financierRate
      : null,
  };

  return newPayload;
};

export const processSavePayload = (
  quoteFormSave: QuoteFormSave,
  isDraft?: boolean
): QuoteRequest => {
  const newPayload = transformToSaveRequest(quoteFormSave);
  const { balloonAmount, brokerageAmount } = processBalloonAndBrokeragePayload(
    quoteFormSave
  );

  return {
    ...newPayload,
    balloonAmount,
    brokerageAmount,
    isDraft,
    financierRate: newPayload.isFinancierRateManual
      ? newPayload.financierRate
      : null,
  };
};

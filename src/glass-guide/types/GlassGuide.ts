import { GLASS_GUIDE_MODEL_TYPE_CODES } from "../constants/glassGuidemodelTypeCodes";

export interface GlassGuideResponse {
  code: string;
  name: string;
}

export interface GlassGuideNvicResponse {
  nvicCur: string;
  nvicModel: string;
  modelName: string;
}

export interface GlassGuideOptionResponse {
  optionCode: string;
  optionName: string;
  optionType: string;
  rrpAmount: number;
  retailAmount: number;
}

export interface GlassGuideKmResponse {
  variationFromAverageKm: number;
  amount: number;
}

export interface GlassGuideCalculationResult {
  rrp: number;
  trade: number;
  retail: number;
  kmAdjustmentTradeValue: number;
  kmAdjustmentRetailValue: number;
  optionsRrpValue: number;
  optionsTradeValue: number;
  optionsRetailValue: number;
  adjustedRrpValue: number;
  adjustedTradeValue: number;
  adjustedRetailValue: number;
}

export const glassGuideCalculationResultDefaultValue: GlassGuideCalculationResult = {
  rrp: 0,
  trade: 0,
  retail: 0,
  kmAdjustmentTradeValue: 0,
  kmAdjustmentRetailValue: 0,
  optionsRrpValue: 0,
  optionsTradeValue: 0,
  optionsRetailValue: 0,
  adjustedRrpValue: 0,
  adjustedTradeValue: 0,
  adjustedRetailValue: 0,
};

export interface GlassGuideDetailsResponse extends GlassGuideCalculationResult {
  nvicCur: string;
  yearCreate: number;
  manufacturerName: string;
  familyName: string;
  variantName: string;
  seriesName: string;
  bodyName: string;
  ccName: string;
  transmissionName: string;
  tradeLow: number;
  trade: number;
  retail: number;
  rrp: number;
  averageKm: number;
  engineName: string;
}

export const glassGuideDetailsResponseDefaultValue: GlassGuideDetailsResponse = {
  ...glassGuideCalculationResultDefaultValue,
  nvicCur: "",
  yearCreate: 0,
  manufacturerName: "",
  familyName: "",
  variantName: "",
  seriesName: "",
  bodyName: "",
  ccName: "",
  transmissionName: "",
  tradeLow: 0,
  averageKm: 0,
  engineName: "",
};

export interface GlassGuideNvicListRequest {
  modelTypeCode: string;
  yearCreate: number;
  manufacturerCode: string;
  familyCode: string;
  variantName: string;
  seriesCode: null | string;
  keyword: null | string;
}

export const glassGuideNvicListRequestDefaultValue: GlassGuideNvicListRequest = {
  modelTypeCode: GLASS_GUIDE_MODEL_TYPE_CODES.ALL,
  yearCreate: 0,
  manufacturerCode: "",
  familyCode: "",
  variantName: "",
  seriesCode: "",
  keyword: null,
};

export interface GlassGuideOptionListRequest {
  modelTypeCode: string;
  nvic: string;
  optionType: null | string;
}

export const glassGuideNvicOptionListRequestDefaultValue: GlassGuideOptionListRequest = {
  modelTypeCode: "",
  nvic: "",
  optionType: null,
};

export interface GlassGuideKmListRequest {
  modelTypeCode: string;
  nvic: string;
}

export interface GlassGuideDetailsListRequest {
  modelTypeCode: string;
  nvic: string;
  useCache: boolean;
  actualKm: number;
  options: string[];
  shouldFetchDetails?: boolean;
}

export const glassGuideDetailsListRequestDefaultValue: GlassGuideDetailsListRequest = {
  modelTypeCode: "",
  nvic: "",
  useCache: false,
  actualKm: 0,
  options: [],
};

export interface GlassGuideValues extends GlassGuideCalculationResult {
  actualKm: number;
  options: string[];
  manufacturerName: string;
  manufacturerCode: string;
  manufactureYear: number;
  familyCode: string;
  variantName: string;
  seriesCode: string | null;
  modelTypeCode: string;
  modelFullName: string;
  nvic: string;
}

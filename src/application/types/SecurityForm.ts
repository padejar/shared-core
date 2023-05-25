import { LabelValue } from "../../common/types/LabelValue";
import { GLASS_GUIDE_MODEL_TYPE_CODES } from "../../glass-guide";
import { SECURITY_DETAILS_INPUT_TYPES } from "../constants/securityDetailsInputTypes";
import { SUPPLIER_TYPES } from "../constants/supplierTypes";
import { USAGE_TYPES } from "../constants/usageTypes";

export interface SecurityForm {
  securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES;
  supplierType: SUPPLIER_TYPES | string;
  supplierName: string;
  usageType: USAGE_TYPES | string;
  assetTypeCategory: string;
  assetType: string;
  manufactureYear: string;
  make: string;
  model: string;
  retailValue: string;
  nvic: string;
  serialNumber: string;
  registrationNumber: string;
  description: string;
  actualKm: string;
  options: string[];
  modelTypeCode: string;
  manufacturerCode: string;
  familyCode: string;
  variantName: string;
  seriesCode: string;
  assetSubtypes?: LabelValue[];
  isGlassGuideAvailable?: boolean;
  isGlassGuideShown?: boolean;
  adjustedRrpValue: string;
  adjustedRetailValue: string;
}

export const securityFormDefaultValue: SecurityForm = {
  securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
  supplierType: "",
  supplierName: "",
  usageType: "",
  assetTypeCategory: "",
  assetType: "",
  manufactureYear: "",
  make: "",
  model: "",
  retailValue: "",
  nvic: "",
  serialNumber: "",
  registrationNumber: "",
  description: "",
  actualKm: "",
  options: [],
  modelTypeCode: GLASS_GUIDE_MODEL_TYPE_CODES.ALL,
  manufacturerCode: "",
  familyCode: "",
  variantName: "",
  seriesCode: "",
  assetSubtypes: [],
  isGlassGuideAvailable: false,
  isGlassGuideShown: false,
  adjustedRrpValue: "",
  adjustedRetailValue: "",
};

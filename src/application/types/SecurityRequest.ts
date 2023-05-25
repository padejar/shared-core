import { GLASS_GUIDE_MODEL_TYPE_CODES } from "../../glass-guide";
import { SECURITY_DETAILS_INPUT_TYPES } from "../constants/securityDetailsInputTypes";
import { SUPPLIER_TYPES } from "../constants/supplierTypes";
import { USAGE_TYPES } from "../constants/usageTypes";

export interface SecurityRequest {
  isDraft?: boolean;
  supplierType: SUPPLIER_TYPES | string | null;
  securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES | null;
  supplierName: string | null;
  usageType: USAGE_TYPES | string | null;
  assetTypeCategory: string;
  assetType: string;
  manufactureYear: number | null;
  make: string | null;
  model: string | null;
  retailValue: number | null;
  nvic: string | null;
  serialNumber: string | null;
  registrationNumber: string | null;
  description: string | null;
  actualKm: number | null;
  options: string[];
  modelTypeCode: string | null;
  manufacturerCode: string | null;
  familyCode: string | null;
  variantName: string | null;
  seriesCode: string | null;
}

export const securityRequestDefaultValue: SecurityRequest = {
  isDraft: false,
  securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
  supplierType: "",
  supplierName: "",
  usageType: "",
  assetTypeCategory: "",
  assetType: "",
  manufactureYear: 0,
  make: "",
  model: "",
  retailValue: 0,
  nvic: "",
  serialNumber: "",
  registrationNumber: "",
  description: "",
  actualKm: 0,
  options: [],
  modelTypeCode: GLASS_GUIDE_MODEL_TYPE_CODES.ALL,
  manufacturerCode: "",
  familyCode: "",
  variantName: "",
  seriesCode: "",
};

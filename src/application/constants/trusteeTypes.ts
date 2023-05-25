import { Dictionary } from "../../common/types/Dictionary";

export enum TRUSTEE_TYPES {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}

export const TRUSTEE_TYPE_LABELS: Dictionary = {
  [TRUSTEE_TYPES.INDIVIDUAL]: "Individual",
  [TRUSTEE_TYPES.COMPANY]: "Company",
};

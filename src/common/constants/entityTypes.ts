import { Dictionary } from "../types/Dictionary";

export enum ENTITY_TYPES {
  SOLE_TRADER = "SOLE_TRADER",
  COMPANY = "COMPANY",
  PARTNERSHIP = "PARTNERSHIP",
  TRUST = "TRUST",
}

export const ENTITY_TYPE_LABELS: Dictionary = {
  [ENTITY_TYPES.SOLE_TRADER]: "Sole Trader",
  [ENTITY_TYPES.COMPANY]: "Company",
  [ENTITY_TYPES.PARTNERSHIP]: "Partnership",
  [ENTITY_TYPES.TRUST]: "Trust",
};

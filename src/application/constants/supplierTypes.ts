import { Dictionary } from "../../common/types/Dictionary";

export enum SUPPLIER_TYPES {
  DEALER = "DEALER",
  PRIVATE = "PRIVATE",
  REFINANCE = "REFINANCE",
}

export const SUPPLIER_TYPE_LABELS: Dictionary = {
  [SUPPLIER_TYPES.DEALER]: "Dealer",
  [SUPPLIER_TYPES.PRIVATE]: "Private",
  [SUPPLIER_TYPES.REFINANCE]: "Refinance",
};

import { Dictionary } from "../../common/types/Dictionary";

export enum MARITAL_STATUSES {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DE_FACTO = "DE_FACTO",
}

export const MARITAL_STATUS_LABELS: Dictionary = {
  [MARITAL_STATUSES.SINGLE]: "Single",
  [MARITAL_STATUSES.MARRIED]: "Married",
  [MARITAL_STATUSES.DE_FACTO]: "De Facto / Partner",
};

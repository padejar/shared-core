import { Dictionary } from "../../common/types/Dictionary";

export enum REPAYMENT_TERM_OPTIONS {
  MONTHLY = "MONTHLY",
  FORTNIGHTLY = "FORTNIGHTLY",
}

export const REPAYMENT_TERM_OPTION_LABELS: Dictionary = {
  [REPAYMENT_TERM_OPTIONS.MONTHLY]: "Monthly",
  [REPAYMENT_TERM_OPTIONS.FORTNIGHTLY]: "Fortnightly",
};

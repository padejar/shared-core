import { Dictionary } from "../../common/types/Dictionary";

export enum SECURITY_DETAILS_INPUT_TYPES {
  GLASS_LOOKUP = "GLASS_GUIDE",
  MANUAL = "MANUAL",
}

export const SECURITY_DETAILS_INPUT_TYPE_OPTIONS: Dictionary = {
  [SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP]: "Glass lookup",
  [SECURITY_DETAILS_INPUT_TYPES.MANUAL]: "Manual",
};

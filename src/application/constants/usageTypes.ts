import { Dictionary } from "../../common/types/Dictionary";

export enum USAGE_TYPES {
  NEW = "NEW",
  DEMO = "DEMO",
  USED = "USED",
}

export const USAGE_TYPE_LABELS: Dictionary = {
  [USAGE_TYPES.NEW]: "New",
  [USAGE_TYPES.DEMO]: "Demo",
  [USAGE_TYPES.USED]: "Used",
};

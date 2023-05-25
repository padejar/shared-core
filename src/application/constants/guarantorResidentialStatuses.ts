import { Dictionary } from "../../common/types/Dictionary";

export enum GUARANTOR_RESIDENTIAL_STATUSES {
  OWNING = "OWNING",
  RENTING = "RENTING",
  BOARDING = "BOARDING",
}

export const GUARANTOR_RESIDENTIAL_STATUSES_OPTIONS: Dictionary = {
  [GUARANTOR_RESIDENTIAL_STATUSES.OWNING]: "Owning",
  [GUARANTOR_RESIDENTIAL_STATUSES.RENTING]: "Renting",
  [GUARANTOR_RESIDENTIAL_STATUSES.BOARDING]: "Boarding",
};
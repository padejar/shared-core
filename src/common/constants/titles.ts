import { Dictionary } from "../types/Dictionary";

export enum TITLES {
  MR = "MR",
  MRS = "MRS",
  MS = "MS",
  MISS = "MISS",
  DR = "DR",
}

export const TITLE_OPTIONS: Dictionary = {
  [TITLES.MR]: "Mr",
  [TITLES.MRS]: "Mrs",
  [TITLES.MS]: "Ms",
  [TITLES.MISS]: "Miss",
  [TITLES.DR]: "Dr",
};

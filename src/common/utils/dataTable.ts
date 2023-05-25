import { Sorting } from "../types/Sorting";

export const parseSortingObject = (sorting: Sorting): string => {
  return (sorting.direction === "desc" ? "-" : "") + sorting.column;
};

export const getOffset = (pageNumber: number, limit: number): number => {
  return limit * pageNumber - limit;
};

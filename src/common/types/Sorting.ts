export type SortingDirection = "asc" | "desc";

export interface Sorting {
  column: string;
  direction: SortingDirection;
}

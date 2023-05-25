export interface ListResponse<T> {
  count?: number;
  data: T[];
}

export const listDefaultValue = {
  data: [],
};

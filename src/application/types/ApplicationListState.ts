import { ApplicationResponse } from "./ApplicationResponse";

export interface ApplicationListState {
  applications: ApplicationResponse[];
  applicationCount: number;
  isLoading: boolean;
  status?: string | null;
  search?: string | null;
  page?: number | null;
  order?: string | null;
  limit?: number | null;
  offset?: number | null;
  resetPage?: boolean | null;
}

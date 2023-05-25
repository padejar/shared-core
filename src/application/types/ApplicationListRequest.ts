import querystring from "querystring";
import { DATATABLE_MAX_ROWS } from "../../common/constants/datatable";
export interface ApplicationListRequest
  extends querystring.ParsedUrlQueryInput {
  search?: string | null;
  status?: string | null;
  limit?: number | null;
  offset: number;
  order?: string | null;
}

export const applicationListRequestDefaultValue = {
  limit: DATATABLE_MAX_ROWS,
  offset: 0,
};

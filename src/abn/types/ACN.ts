import { ENTITY_TYPES } from "../../common/constants/entityTypes";

export interface ACNRequest {
  acn: string;
}

export interface ACNResponse {
  entityName: string;
  entityType: ENTITY_TYPES | null;
  tradingNames: string[];
  acn: string;
  abnActiveFrom: string;
  gstActiveFrom: string | null;
}

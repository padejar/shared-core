import { ENTITY_TYPES } from "../../common/constants/entityTypes";

export interface ABNRequest {
  abn: string;
}

export interface ABNResponse {
  entityName: string;
  entityType: ENTITY_TYPES | null;
  tradingNames: string[];
  acn: string;
  abnActiveFrom: string;
  gstActiveFrom: string | null;
}

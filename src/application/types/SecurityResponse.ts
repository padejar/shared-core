import {
  SecurityRequest,
  securityRequestDefaultValue,
} from "./SecurityRequest";

export interface SecurityResponse extends SecurityRequest {
  id?: string;
  name?: string;
  state?: boolean;
  applicationId?: string;
  rrp?: number;
  trade?: number;
  retail?: number;
  kmAdjustmentTradeValue?: number;
  kmAdjustmentRetailValue?: number;
  optionsRrpValue?: number;
  optionsTradeValue?: number;
  optionsRetailValue?: number;
  adjustedRrpValue?: number;
  adjustedTradeValue?: number;
  adjustedRetailValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const securityResponseDefaultValue: SecurityResponse = {
  ...securityRequestDefaultValue,
  state: false,
};

import { approverDefaultValue, ApproverResponse } from "./ApproverResponse";

export enum Status {
  REFER = "REFER",
  PASS = "PASS",
  HOLD = "HOLD",
}

export interface ApprovalCondition {
  condition: string;
  status: Status | null;
}

export interface ApprovalConditionsResponse {
  conditions: ApprovalCondition[];
  approver: ApproverResponse;
}

export const approvalConditionsResponse: ApprovalConditionsResponse = {
  conditions: [],
  approver: approverDefaultValue,
};

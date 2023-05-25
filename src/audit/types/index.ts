import querystring from "querystring";

export interface AuditLogListRequest extends querystring.ParsedUrlQueryInput {
  modelName: string;
  modelId: string;
  limit?: number | null;
  offset?: number | null;
}

export const auditLogListRequestDefaultValue: AuditLogListRequest = {
  modelName: "",
  modelId: "",
};

export interface AuditLogResponse {
  id: number;
  userId: number | null;
  modelId: string;
  modelName: string;
  shortDescription: string;
  longDescription: string;
  ipAddress: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  actor: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
  } | null;
}

export const auditLogResponseDefaultValue: AuditLogResponse = {
  id: 0,
  userId: 0,
  modelId: "",
  modelName: "",
  shortDescription: "",
  longDescription: "",
  ipAddress: "",
  oldValues: {},
  newValues: {},
  createdAt: "",
  updatedAt: "",
  actor: {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  },
};

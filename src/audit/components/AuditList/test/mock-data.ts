import { ListResponse } from "../../../../common/types/ListResponse";
import { AuditLogResponse } from "../../../types";

export const list = Array.from({ length: 16 }, (_, i) => {
  const ctr = i + 1;

  return {
    id: ctr,
    userId: ctr,
    modelId: "1",
    modelName: "SampleModel",
    shortDescription: "Sample audit",
    longDescription: "Sample audit",
    ipAddress: "",
    oldValues: {
      value: "foo",
    },
    newValues: {
      value: "bar",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    actor: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      mobile: "0412345678",
    },
  };
});

export const mockData: ListResponse<AuditLogResponse> = {
  data: list,
  count: list.length,
};

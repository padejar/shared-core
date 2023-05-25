import React from "react";
import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as _ from "lodash";
import AuditItem from ".";
import { dateFormat } from "../../../common/utils/date";
import { AuditLogResponse } from "../../types";

describe("ApplicantTab tests", () => {
  afterEach(cleanup);

  const mockData: AuditLogResponse = {
    id: 1,
    userId: 1,
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

  const renderComponent = (data: AuditLogResponse) => {
    return render(<AuditItem auditLog={data} />);
  };

  it("renders AuditItem", () => {
    const { getByTestId, queryByTestId } = renderComponent(mockData);

    expect(queryByTestId("auditContent")).not.toBeInTheDocument();
    expect(getByTestId("auditToggleExpandContent")).toHaveTextContent(
      "Show values"
    );
    expect(getByTestId("auditCreatedTime")).toHaveTextContent(
      dateFormat(new Date(mockData.createdAt), "MMM d h:mm a")
    );
    expect(getByTestId("auditActorName")).toHaveTextContent(
      `${mockData.actor?.firstName} ${mockData.actor?.lastName}`
    );
  });

  it("renders AuditItem without actor", () => {
    const mockDataWithoutActor = _.cloneDeep(mockData);
    mockDataWithoutActor.actor = null;

    const { getByTestId } = renderComponent(mockDataWithoutActor);

    expect(getByTestId("auditActorName")).toHaveTextContent("N/A");
  });

  it("toggles AuditItem content", () => {
    const { getByTestId, queryByTestId } = renderComponent(mockData);

    const toggleBtn = getByTestId("auditToggleExpandContent");

    expect(toggleBtn).toHaveTextContent("Show values");
    expect(queryByTestId("auditContent")).not.toBeInTheDocument();

    userEvent.click(toggleBtn);

    expect(toggleBtn).toHaveTextContent("Hide values");
    expect(getByTestId("auditContent")).toBeInTheDocument();

    userEvent.click(toggleBtn);

    expect(queryByTestId("auditContent")).not.toBeInTheDocument();
  });
});

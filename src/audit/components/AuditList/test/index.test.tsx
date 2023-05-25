import React from "react";
import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuditList from "../";
import { mockData } from "./mock-data";

describe("ApplicantTab tests", () => {
  afterEach(cleanup);

  it("renders empty AuditList", () => {
    const onPageChange = (pageNumber) => {
      console.log(pageNumber);
    };

    const { getByTestId, queryByTestId } = render(
      <AuditList
        auditLogs={[]}
        dataPerPage={10}
        auditLogsCount={0}
        isLoading={false}
        onPageChange={onPageChange}
      />
    );

    expect(queryByTestId("auditItem")).not.toBeInTheDocument();
    expect(getByTestId("auditEmptyList")).toBeInTheDocument();
  });

  it("renders AuditList with only 1 page of data", () => {
    const list = [...mockData.data.slice(0, 10)];

    const onPageChange = (pageNumber) => {
      console.log(pageNumber);
    };

    const { getAllByTestId, queryByTestId, getByTestId } = render(
      <AuditList
        auditLogs={list}
        dataPerPage={10}
        auditLogsCount={list.length}
        isLoading={false}
        onPageChange={onPageChange}
      />
    );

    const previousBtn = getByTestId("auditPaginationPreviousButton");
    const nextBtn = getByTestId("auditPaginationNextButton");

    expect(getAllByTestId("auditItem")).toHaveLength(list.length);
    expect(queryByTestId("auditLoading")).not.toBeInTheDocument();
    expect(previousBtn).toBeDisabled();
    expect(nextBtn).toBeDisabled();
  });

  it("paginates the list", () => {
    let list = [...mockData.data.slice(0, 10)];
    const auditLogsCount = mockData.count;
    const dataPerPage = 10;
    const totalPages =
      auditLogsCount < dataPerPage
        ? 1
        : Math.ceil(auditLogsCount / dataPerPage);

    const changePage = jest.fn((pageNumber: number) => {
      list = mockData.data.slice(
        (pageNumber - 1) * dataPerPage,
        pageNumber * dataPerPage
      );
    });

    const { getAllByTestId, getByTestId, queryByTestId, rerender } = render(
      <AuditList
        auditLogs={list}
        dataPerPage={10}
        auditLogsCount={mockData.count}
        isLoading={false}
        onPageChange={changePage}
      />
    );

    const previousBtn = getByTestId("auditPaginationPreviousButton");
    const nextBtn = getByTestId("auditPaginationNextButton");

    expect(getAllByTestId("auditItem")).toHaveLength(list.length);
    expect(queryByTestId("auditLoading")).not.toBeInTheDocument();
    expect(previousBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();
    expect(getByTestId("auditPaginationInfo")).toHaveTextContent(
      `Page 1 of total ${totalPages} pages`
    );

    userEvent.click(nextBtn);

    rerender(
      <AuditList
        auditLogs={list}
        dataPerPage={10}
        auditLogsCount={mockData.count}
        isLoading={false}
        onPageChange={changePage}
      />
    );

    expect(getAllByTestId("auditItem")).toHaveLength(list.length);
    expect(getByTestId("auditPaginationInfo")).toHaveTextContent(
      `Page 2 of total ${totalPages} pages`
    );
    expect(previousBtn).not.toBeDisabled();
    expect(nextBtn).toBeDisabled();
    expect(changePage).toHaveBeenCalledTimes(1);

    userEvent.click(previousBtn);

    rerender(
      <AuditList
        auditLogs={list}
        dataPerPage={10}
        auditLogsCount={mockData.count}
        isLoading={false}
        onPageChange={changePage}
      />
    );

    expect(getAllByTestId("auditItem")).toHaveLength(list.length);
    expect(previousBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();
    expect(getByTestId("auditPaginationInfo")).toHaveTextContent(
      `Page 1 of total ${totalPages} pages`
    );
    expect(changePage).toHaveBeenCalledTimes(2);
  });
});

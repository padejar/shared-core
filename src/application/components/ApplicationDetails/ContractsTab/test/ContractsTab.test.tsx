import React from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { Store } from "@reduxjs/toolkit";
import { screen, within } from "@testing-library/dom";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Route, Redirect } from "react-router-dom";
import { axiosInstance } from "../../../../../common/services/APIService";
import { dateFormat } from "../../../../../common/utils/date";
import { reduxSagaSetup } from "../../../../../common/utils/testing";
import {
  errorHandlerReducers,
  errorHandlerSagas,
  RESOURCE_NOT_FOUND_MESSAGE,
} from "../../../../../error-handler";
import {
  reducer as notificationReducers,
  Notification,
} from "../../../../../notification";
import {
  APPLICATION_STATUSES,
  APPLICATION_PUBLIC_STATUSES,
} from "../../../../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../../../../constants/applicationSteps";
import { DOCUMENT_PURPOSES } from "../../../../constants/documentPurposes";
import { DOCUMENT_TYPES } from "../../../../constants/documentTypes";

import { applicationSagas } from "../../../../index";
import applicationReducers from "../../../../reducers";
import { ApplicationResponse } from "../../../../types/ApplicationResponse";
import Application from "../../index";
import * as mockData from "./mock-data";

const docTypeKeys = Object.keys(DOCUMENT_TYPES);

describe("Application Contracts Tab", () => {
  const applicationsListTestId = "applications-list";
  const applicantTabTestId = "applicant-tab";
  const mockApi = new MockAdapter(axiosInstance);
  let appStore: Store;

  const renderComponent = (applicationId = "new") => {
    const applicationListUrl = "/application/applications";
    return render(
      <Provider store={appStore}>
        <Notification />
        <Router>
          <Route path="/application/applications/:id/notes" exact={true}>
            <div data-testid={applicantTabTestId}></div>
          </Route>
          <Route path="/application/applications/:id/contracts" exact={true}>
            <Application
              applicationId={applicationId}
              pageAfterSave={applicationListUrl}
              tabName={APPLICATION_STEPS.contracts}
            />
          </Route>
          <Route path={applicationListUrl} exact={true}>
            <div data-testid={applicationsListTestId}></div>
          </Route>
          <Redirect
            to={`/application/applications/${applicationId}/contracts`}
          />
        </Router>
      </Provider>
    );
  };

  const initApplication = (
    application: Partial<ApplicationResponse> = {
      status: APPLICATION_STATUSES.APPROVED_WAITING_FOR_MORE_INFO,
      publicStatus: APPLICATION_PUBLIC_STATUSES.APPROVED,
    }
  ) => {
    const { id } = mockData.approvedApplication;

    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: {
        ...mockData.approvedApplication,
        ...application,
      },
    });
    mockApi
      .onGet(
        `/application/applications/${id}/documents?purposes=${DOCUMENT_PURPOSES.GENERATED}&purposes=${DOCUMENT_PURPOSES.GENERATED_ESIGN}`
      )
      .reply(200, { data: mockData.contracts });
    mockApi
      .onGet(
        `/application/applications/${id}/documents?purposes=${DOCUMENT_PURPOSES.SETTLEMENT_DOCUMENT}`
      )
      .reply(200, { data: mockData.settlementDocuments });
    mockApi
      .onGet(`/application/applications/${id}/approval-conditions`)
      .reply(200, {
        data: {
          conditions: mockData.approvalConditions,
          approver: mockData.approver,
        },
      });

    renderComponent(id);
  };

  beforeEach(() => {
    function* rootSaga(): Generator<
      AllEffect<ForkEffect<void>>,
      void,
      unknown
    > {
      yield all([fork(errorHandlerSagas), fork(applicationSagas)]);
    }
    const setup = reduxSagaSetup({
      notification: notificationReducers,
      errorHandler: errorHandlerReducers,
      application: applicationReducers,
    });
    appStore = setup.store;
    setup.sagaMiddleware.run(rootSaga);
  });

  afterEach(() => {
    mockApi.reset();
    cleanup();
  });

  it("Application not found.", async () => {
    const { id } = mockData.application;

    mockApi.onGet(`/application/applications/${id}`).replyOnce(404);

    const { getByTestId, queryAllByRole } = renderComponent(id);
    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
      expect(getByTestId("notification")).toBeInTheDocument();
      expect(queryAllByRole("alert")[0]).toHaveTextContent(
        RESOURCE_NOT_FOUND_MESSAGE
      );
    });
  });

  it("Handle network error.", async () => {
    const { id } = mockData.application;

    mockApi.onGet(`/*`).networkError();

    const { getByTestId, queryAllByRole } = renderComponent(id);
    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
      expect(getByTestId("notification")).toBeInTheDocument();
      expect(queryAllByRole("alert")).toHaveLength(2);
    });
  });

  it("Load draft application.", async () => {
    const { id } = mockData.application;

    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: mockData.application,
    });
    mockApi
      .onGet(new RegExp(`/application/applications/${id}/documents*`))
      .reply(200, { data: [] });
    mockApi
      .onGet(`/application/applications/${id}/approval-conditions`)
      .replyOnce(200, {
        data: {
          conditions: [],
          approver: null,
        },
      });

    const { getByTestId, queryByTestId, getByText } = renderComponent(id);

    expect(getByText("Loading your uploaded documents...")).toBeInTheDocument();
    expect(
      getByText("Loading your generated documents...")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
    });

    const stepName = getByTestId("step-name");
    expect(stepName).toBeInTheDocument();
    expect(stepName).toHaveTextContent("Contracts");
    expect(getByTestId("empty-generated-docs")).toBeInTheDocument();
    expect(getByTestId("settlement-documents-empty")).toBeInTheDocument();

    expect(queryByTestId("approver-name")).not.toBeInTheDocument();
    expect(queryByTestId("approver-mobile")).not.toBeInTheDocument();
    expect(queryByTestId("approver-email")).not.toBeInTheDocument();
    expect(queryByTestId("approval-conditions")).not.toBeInTheDocument();

    userEvent.hover(getByTestId("submit-button"));
    await waitFor(() => {
      expect(getByTestId("popover-content-submit-button")).toBeInTheDocument();
      expect(getByTestId("popover-content-submit-button")).toHaveTextContent(
        "Only approved applications can be submitted for settlement"
      );
    });
  });

  it("Load approved application.", async () => {
    initApplication();

    const { approvalConditions, approver } = mockData;
    const { getByTestId, queryByTestId } = screen;

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(4);
    });

    Object.keys(DOCUMENT_TYPES).forEach((docType) => {
      expect(getByTestId(`document-options-${docType}`)).toBeEnabled();
    });
    expect(getByTestId("generate-e-sign")).toBeEnabled();
    expect(getByTestId("generate-pdf")).toBeEnabled();

    const stepName = getByTestId("step-name");
    expect(stepName).toBeInTheDocument();
    expect(stepName).toHaveTextContent("Contracts");

    const submitButton = getByTestId("submit-button");
    expect(submitButton).toHaveTextContent("Submit");
    userEvent.hover(submitButton);
    await waitFor(() => {
      expect(
        queryByTestId("popover-content-submit-button")
      ).not.toBeInTheDocument();
    });

    approvalConditions.forEach((approvalCondition, i) => {
      const condition = getByTestId(`approval-condition-${i}`);
      expect(condition).toBeInTheDocument();
      expect(condition).toHaveTextContent(approvalCondition.condition);
    });

    const { firstName, lastName, mobile, email } = approver;
    expect(getByTestId("approver-name")).toHaveTextContent(
      `${firstName} ${lastName}`
    );
    expect(getByTestId("approver-mobile")).toHaveTextContent(mobile);
    expect(getByTestId("approver-email")).toHaveTextContent(email);
  });

  it("Load submitted application.", async () => {
    initApplication({
      status: APPLICATION_STATUSES.IN_SETTLEMENT_SETTLEMENT_IN_PROGRESS,
      publicStatus: APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT,
    });

    const { getByTestId, queryByTestId } = screen;

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(4);
    });

    Object.keys(DOCUMENT_TYPES).forEach((docType) => {
      expect(getByTestId(`document-options-${docType}`)).toBeEnabled();
    });
    expect(getByTestId("generate-e-sign")).toBeEnabled();
    expect(getByTestId("generate-pdf")).toBeEnabled();

    const submitButton = getByTestId("submit-button");
    expect(submitButton).toHaveTextContent("Submitted");
    userEvent.hover(submitButton);
    await waitFor(() => {
      const popOver = queryByTestId("popover-content-submit-button");
      expect(popOver).toBeInTheDocument();
      expect(popOver).toHaveTextContent(
        "This application has been submitted for settlement"
      );
    });
  });

  it("Load for settlement application.", async () => {
    const { settlementDocuments } = mockData;

    initApplication({
      status: APPLICATION_STATUSES.SETTLED,
      publicStatus: APPLICATION_PUBLIC_STATUSES.SETTLED,
    });

    const { getByTestId, queryByTestId } = screen;

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(4);
    });

    Object.keys(DOCUMENT_TYPES).forEach((docType) => {
      expect(getByTestId(`document-options-${docType}`)).toBeDisabled();
    });
    expect(getByTestId("generate-e-sign")).toBeDisabled();
    expect(getByTestId("generate-pdf")).toBeDisabled();
    expect(getByTestId("settlement-documents-select-files")).toBeDisabled();

    settlementDocuments.forEach((doc) =>
      expect(
        getByTestId(`settlement-documents-delete-${doc.id}`)
      ).toBeDisabled()
    );

    const submitButton = getByTestId("submit-button");
    expect(submitButton).toHaveTextContent("Submitted");
    userEvent.hover(submitButton);
    await waitFor(() => {
      const popOver = queryByTestId("popover-content-submit-button");
      expect(popOver).toBeInTheDocument();
      expect(popOver).toHaveTextContent("This application has been settled");
    });
  });

  it("Generate contract without Security Vin or Serial #.", async () => {
    const { security } = mockData.approvedApplication;
    const { getByTestId } = screen;

    initApplication({
      status: APPLICATION_STATUSES.IN_SETTLEMENT_SETTLEMENT_IN_PROGRESS,
      publicStatus: APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT,
      security: {
        ...security,
        serialNumber: "",
      },
    });

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(4);
    });

    userEvent.click(getByTestId("generate-pdf"));

    await waitFor(() => {
      const notification = getByTestId("notification");
      const { getByText } = within(notification);
      expect(notification).toBeInTheDocument();
      expect(
        getByText(
          "Please complete Vin / serial# and supplier name on the security screen"
        )
      ).toBeInTheDocument();
    });
  });

  it("Generate contract without Supplier name.", async () => {
    const { security } = mockData.approvedApplication;
    const { getByTestId } = screen;

    initApplication({
      status: APPLICATION_STATUSES.IN_SETTLEMENT_SETTLEMENT_IN_PROGRESS,
      publicStatus: APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT,
      security: {
        ...security,
        supplierName: "",
      },
    });

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(4);
    });

    userEvent.click(getByTestId("generate-pdf"));

    await waitFor(() => {
      const notification = getByTestId("notification");
      const { getByText } = within(notification);
      expect(notification).toBeInTheDocument();
      expect(
        getByText(
          "Please complete Vin / serial# and supplier name on the security screen"
        )
      ).toBeInTheDocument();
    });
  });

  it("Generate and download contract.", async () => {
    const { contract, contracts } = mockData;
    const firstContract = contracts[0];

    const { id } = mockData.approvedApplication;
    const { getByTestId, queryByTestId } = screen;
    const testFailingDocumentGeneration = async (buttonId: string) => {
      userEvent.click(getByTestId(buttonId));

      await waitFor(() => {
        const notification = getByTestId("notification");
        const { getByText } = within(notification);
        expect(notification).toBeInTheDocument();
        expect(
          getByText("You need to select at least 1 type of document.")
        ).toBeInTheDocument();
      });
    };

    mockApi
      .onPost(`/application/applications/${id}/documents/generate`)
      .reply(200, {
        data: [contract],
      });

    initApplication({
      status: APPLICATION_STATUSES.IN_SETTLEMENT_SETTLEMENT_IN_PROGRESS,
      publicStatus: APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT,
    });

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(4);
    });

    docTypeKeys.forEach((docType) => {
      const checkbox = document.querySelector(
        `[data-testid="document-options-${docType}"]`
      ) as HTMLFormElement;

      if (checkbox.checked) {
        userEvent.click(getByTestId(`document-options-${docType}-label`));
      }
      expect(getByTestId(`document-options-${docType}`)).not.toBeChecked();
    });

    await testFailingDocumentGeneration("generate-pdf");
    await testFailingDocumentGeneration("generate-e-sign");

    const firstDocType = docTypeKeys[0];
    userEvent.click(getByTestId(`document-options-${firstDocType}-label`));

    userEvent.click(getByTestId("generate-pdf"));
    expect(getByTestId("generate-documents-loading")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockApi.history.post).toHaveLength(1);
      expect(
        queryByTestId("generate-documents-loading")
      ).not.toBeInTheDocument();
      const firstPostRequestPayload = JSON.parse(mockApi.history.post[0].data);
      expect(firstPostRequestPayload).toMatchObject({
        types: [firstDocType],
        isEsign: false,
      });
    });

    userEvent.click(getByTestId("generate-e-sign"));
    await waitFor(() => {
      expect(getByTestId("modal-e-sign-warning")).toBeInTheDocument();
      userEvent.click(getByTestId("modal-e-sign-proceed"));
    });

    await waitFor(() => {
      expect(mockApi.history.post).toHaveLength(2);
      const secondPostRequestPayload = JSON.parse(mockApi.history.post[1].data);
      expect(secondPostRequestPayload).toMatchObject({
        types: [firstDocType],
        isEsign: true,
      });
    });

    contracts.forEach((doc) => {
      const { id, createdAt, originalFilename } = doc;
      expect(getByTestId(`generated-${id}-originalFileName`)).toHaveTextContent(
        originalFilename
      );
      expect(getByTestId(`generated-${id}-createdAt`)).toHaveTextContent(
        dateFormat(new Date(createdAt), "dd-MM-yy H:mm:ss")
      );
    });

    userEvent.click(getByTestId(`download-${firstContract.id}`));
    await waitFor(() => expect(mockApi.history.get).toHaveLength(7));
  });

  it("Settlement document - List, Download & Delete", async () => {
    const { settlementDocuments, downloadFileResponse, application } = mockData;
    const { id } = application;
    const file = settlementDocuments[0];

    const { getByTestId } = screen;
    initApplication();

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(4);
    });

    mockApi
      .onGet(`/application/applications/${id}/documents/${file.id}/download`)
      .replyOnce(200, downloadFileResponse);
    mockApi
      .onDelete(`/application/applications/${id}/documents/${file.id}`)
      .replyOnce(200, { data: true });

    settlementDocuments.forEach((doc) => {
      const { id, createdAt, originalFilename } = doc;
      expect(getByTestId(`${id}-originalFileName`)).toHaveTextContent(
        originalFilename
      );
      expect(getByTestId(`${id}-createdAt`)).toHaveTextContent(
        dateFormat(new Date(createdAt), "dd-MM-yy H:mm:ss")
      );
    });

    const deleteModalPrefix =
      "settlement-documents-delete-file-modal-confirmation-modal";
    const modalFileName = getByTestId("filename-to-delete");
    const fileDeleteBtn = getByTestId(`settlement-documents-delete-${file.id}`);

    userEvent.click(getByTestId(`settlement-documents-download-${file.id}`));
    await waitFor(() => expect(mockApi.history.get).toHaveLength(5));

    userEvent.click(fileDeleteBtn);
    expect(modalFileName).toHaveTextContent(file.originalFilename);

    userEvent.click(getByTestId(`${deleteModalPrefix}-cancel`));
    expect(modalFileName).not.toHaveTextContent(file.originalFilename);

    userEvent.click(fileDeleteBtn);
    expect(modalFileName).toHaveTextContent(file.originalFilename);

    userEvent.click(getByTestId(`${deleteModalPrefix}-confirm`));
    await waitFor(() => expect(mockApi.history.delete).toHaveLength(1));
  });

  mockData.pairedStatuses.forEach((pairedStatus) => {
    const approvalConditionIsVisible = [
      APPLICATION_PUBLIC_STATUSES.APPROVED,
      APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT,
      APPLICATION_PUBLIC_STATUSES.SETTLED,
    ].includes(pairedStatus.publicStatus);
    const visibility = approvalConditionIsVisible ? "Displays" : "Hides";

    it(`${visibility} approval conditions visibility when application public status is ${pairedStatus.publicStatus}.`, async () => {
      const { queryByTestId } = screen;

      initApplication(pairedStatus);

      await waitFor(() => {
        const approvalConditions = queryByTestId("approval-conditions");
        if (approvalConditionIsVisible) {
          expect(mockApi.history.get).toHaveLength(4);
          expect(approvalConditions).toBeInTheDocument();
        } else {
          expect(mockApi.history.get).toHaveLength(3);
          expect(approvalConditions).not.toBeInTheDocument();
        }
      });
    });
  });
});

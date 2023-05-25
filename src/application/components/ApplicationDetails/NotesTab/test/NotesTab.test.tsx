import React from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { Store } from "@reduxjs/toolkit";
import { screen } from "@testing-library/dom";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import _ from "lodash";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Route, Redirect } from "react-router-dom";
import { axiosInstance } from "../../../../../common/services/APIService";
import { dateFormat } from "../../../../../common/utils/date";
import { reduxSagaSetup } from "../../../../../common/utils/testing";
import {
  errorHandlerReducers,
  errorHandlerSagas,
} from "../../../../../error-handler";
import {
  reducer as notificationReducers,
  Notification,
} from "../../../../../notification";
import {
  APPLICATION_PUBLIC_STATUSES,
  APPLICATION_STATUSES,
} from "../../../../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../../../../constants/applicationSteps";
import { applicationSagas } from "../../../../index";
import applicationReducers from "../../../../reducers";
import Application from "../../index";
import * as mockData from "./mock-data";

const { application, requiredDocuments } = mockData;

describe("Application Notes Tab", () => {
  const applicationsListTestId = "applications-list";
  const securityTabTestId = "applicant-tab";
  const contractsTabTestId = "contracts-tab";
  const mockApi = new MockAdapter(axiosInstance);
  let appStore: Store;

  const renderComponent = (applicationId: string) => {
    const assessmentUrl = "/application/applications";
    return render(
      <Provider store={appStore}>
        <Notification />
        <Router>
          <Route path="/application/applications/:id/notes" exact={true}>
            <Application
              applicationId={applicationId}
              pageAfterSave={assessmentUrl}
              tabName={APPLICATION_STEPS.notes}
            />
          </Route>
          <Route path="/application/applications/:id/security" exact={true}>
            <div data-testid={securityTabTestId}></div>
          </Route>
          <Route path="/application/applications/:id/contracts" exact={true}>
            <div data-testid={contractsTabTestId}></div>
          </Route>
          <Route path={assessmentUrl} exact={true}>
            <div data-testid={applicationsListTestId}></div>
          </Route>
          <Redirect to={`/application/applications/${applicationId}/notes`} />
        </Router>
      </Provider>
    );
  };

  const loadApplication = (application: typeof mockData.application) => {
    const { id } = application;

    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: mockData.application,
    });

    mockApi
      .onGet(`/application/applications/${id}/required-documents`)
      .reply(200, {
        data: mockData.requiredDocuments,
      });

    mockApi
      .onGet(new RegExp(`/application/applications/${id}/documents*`))
      .reply(200, { data: [] });

    return renderComponent(id);
  };

  const saveApplicationInitialSteps = async () => {
    const { id } = application;

    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: application,
    });
    mockApi
      .onGet(`/application/applications/${id}/required-documents`)
      .replyOnce(200, {
        data: requiredDocuments,
      });
    mockApi
      .onGet(new RegExp(`/application/applications/${id}/documents*`))
      .replyOnce(200, { data: mockData.supportingDocuments });

    const { getByTestId } = renderComponent(id);

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);

      userEvent.type(getByTestId("supportingNotes"), "Notes");
      userEvent.click(getByTestId("hasApplicantConsent-label"));

      expect(getByTestId("hasApplicantConsent")).toBeChecked();
    });

    return application;
  };

  const amendApplicationInitialSteps = async () => {
    const { id } = application;
    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: {
        ...mockData.application,
        note: mockData.notes,
        publicStatus: APPLICATION_PUBLIC_STATUSES.SUBMITTED,
        status: APPLICATION_STATUSES.SUBMITTED_NEW,
      },
    });
    mockApi
      .onGet(`/application/applications/${id}/required-documents`)
      .replyOnce(200, {
        data: requiredDocuments,
      });
    mockApi
      .onGet(new RegExp(`/application/applications/${id}/documents*`))
      .replyOnce(200, { data: [] });

    const { getByTestId } = renderComponent(id);

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
    });

    userEvent.type(getByTestId("supportingNotes"), "Updated Notes");
    userEvent.click(getByTestId("save-and-exit-button"));
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
    const { id } = application;

    mockApi.onGet(`/application/applications/${id}`).replyOnce(404);

    const { getByTestId, queryAllByRole } = renderComponent(id);
    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
      expect(getByTestId("notification")).toBeInTheDocument();
      expect(queryAllByRole("alert")[0]).toHaveTextContent(
        "The resource you're trying to access is not available"
      );
    });
  });

  it("Handle network error.", async () => {
    const { id } = application;

    mockApi.onGet(`/*`).networkError();

    const { getByTestId, queryAllByRole } = renderComponent(id);
    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
      expect(getByTestId("notification")).toBeInTheDocument();
      expect(queryAllByRole("alert")).toHaveLength(3);
    });
  });

  it("Load application notes page - data set 1", async () => {
    loadApplication(mockData.application);

    const { getByText, getByTestId } = screen;

    expect(getByText("Loading your uploaded documents...")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
      expect(getByTestId("step-name")).toBeInTheDocument();
      expect(getByTestId("supportingNotes")).toBeInTheDocument();
      expect(getByTestId("supporting-documents-empty")).toBeInTheDocument();
      expect(getByTestId("hasApplicantConsent")).not.toBeChecked();
      expect(getByTestId("submit-button")).toHaveClass("disallowed");

      const bankStatementLink = getByTestId("bank-statement-url");
      expect(bankStatementLink).toBeInTheDocument();
      expect(bankStatementLink).toHaveValue(
        mockData.requiredDocuments.bankStatementLink
      );
    });

    userEvent.hover(getByTestId("submit-button"));
    await waitFor(() => {
      expect(getByTestId("popover-content-submit-button")).toBeInTheDocument();
      expect(getByTestId("popover-content-submit-button")).toHaveTextContent(
        "Notes"
      );
      expect(getByTestId("popover-content-submit-button")).toHaveTextContent(
        new RegExp(/Please complete the required fields in the following tab/i)
      );
    });
  });

  it("Load application notes page - data set 2", async () => {
    const { id } = application;

    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: application,
    });

    mockApi
      .onGet(`/application/applications/${id}/required-documents`)
      .reply(200, {
        data: {
          ...requiredDocuments,
          bankStatementRequired: false,
          bankStatementLink: null,
        },
      });

    mockApi
      .onGet(new RegExp(`/application/applications/${id}/documents*`))
      .reply(200, { data: mockData.supportingDocuments });

    const { getByTestId, queryByTestId } = renderComponent(id);

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
    });

    expect(getByTestId("step-name")).toBeInTheDocument();
    expect(getByTestId("supportingNotes")).toBeInTheDocument();
    expect(getByTestId("hasApplicantConsent")).not.toBeChecked();
    expect(getByTestId("submit-button")).toHaveClass("disallowed");
    expect(queryByTestId("bank-statement-url")).not.toBeInTheDocument();
  });

  it("Field validations.", async () => {
    const { id } = application;

    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: application,
    });
    mockApi
      .onGet(`/application/applications/${id}/required-documents`)
      .reply(200, {
        data: requiredDocuments,
      });
    mockApi
      .onGet(new RegExp(`/application/applications/${id}/documents*`))
      .reply(200, { data: [] });

    const { getByTestId, queryByTestId } = renderComponent(id);

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
    });

    const notes = "Notes";
    const supportingNotes = getByTestId("supportingNotes");
    const submitButton = getByTestId("submit-button");

    userEvent.type(supportingNotes, notes);
    expect(supportingNotes).toHaveValue(notes);
    expect(submitButton).not.toHaveClass("disallowed");
    userEvent.clear(supportingNotes);
    expect(submitButton).toHaveClass("disallowed");

    userEvent.click(getByTestId("hasApplicantConsent-label"));
    await waitFor(() => {
      expect(getByTestId("hasApplicantConsent")).toBeChecked();
      expect(submitButton).not.toHaveClass("disallowed");
    });

    userEvent.click(getByTestId("hasApplicantConsent-label"));
    await waitFor(() => {
      expect(getByTestId("validation-error-message")).toBeInTheDocument();
      expect(getByTestId("hasApplicantConsent-error")).toBeInTheDocument();
      expect(submitButton).toHaveClass("disallowed");
    });

    userEvent.click(getByTestId("hasApplicantConsent-label"));
    await waitFor(() => {
      expect(
        queryByTestId("hasApplicantConsent-error")
      ).not.toBeInTheDocument();
      expect(queryByTestId("validation-error-message")).not.toBeInTheDocument();
      expect(submitButton).not.toHaveClass("disallowed");
    });
  });

  it("Save and Exit", async () => {
    const { getByTestId } = screen;

    await saveApplicationInitialSteps();

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(() => {
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
    });
  });

  it("Save and Submit", async () => {
    const { getByText, getByTestId } = screen;

    await saveApplicationInitialSteps();

    mockApi.onAny(new RegExp("/*")).reply(200, {
      data: {
        ...mockData.application,
        note: mockData.notes,
        publicStatus: APPLICATION_PUBLIC_STATUSES.SUBMITTED,
      },
    });

    const hasApplicantConsentLabel = getByTestId("hasApplicantConsent-label");
    userEvent.click(hasApplicantConsentLabel);
    expect(getByTestId("hasApplicantConsent")).toBeChecked();

    const submitBtn = getByTestId("submit-button");
    expect(submitBtn).toHaveTextContent("Submit");
    expect(submitBtn).not.toHaveClass("disallowed");
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockApi.history.post).toHaveLength(1);
      expect(mockApi.history.put).toHaveLength(1);

      expect(getByTestId("return-to-dashboard-modal")).toBeInTheDocument();
      expect(getByText("Congratulations!")).toBeInTheDocument();
      expect(getByTestId("return-to-dashboard-link")).toBeInTheDocument();
    });
  });

  it("Load submitted application.", async () => {
    const { id } = application;
    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: {
        ...mockData.application,
        note: mockData.notes,
        publicStatus: APPLICATION_PUBLIC_STATUSES.SUBMITTED,
        status: APPLICATION_STATUSES.SUBMITTED_NEW,
      },
    });
    mockApi
      .onGet(`/application/applications/${id}/required-documents`)
      .replyOnce(200, {
        data: requiredDocuments,
      });
    mockApi
      .onGet(new RegExp(`/application/applications/${id}/documents*`))
      .replyOnce(200, { data: [] });

    const { getByTestId } = renderComponent(id);

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
      expect(getByTestId("supportingNotes")).toHaveValue(
        mockData.notes.supportingNotes
      );
      expect(getByTestId("hasApplicantConsent")).toBeChecked();
    });

    const submitBtn = getByTestId("submit-button");
    expect(submitBtn).toHaveClass("submitted disallowed");
    expect(submitBtn).toHaveTextContent("Submitted");

    userEvent.hover(submitBtn);
    await waitFor(() => {
      expect(getByTestId("popover-content-submit-button")).toBeInTheDocument();

      const popOver = getByTestId("popover-content-submit-button");
      expect(popOver).toBeInTheDocument();
      expect(popOver).toHaveTextContent("This application has been submitted");
    });
  });

  it("Load amended application.", async () => {
    const { id } = application;
    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: {
        ...mockData.application,
        note: mockData.notes,
        publicStatus: APPLICATION_PUBLIC_STATUSES.SUBMITTED,
        status: APPLICATION_STATUSES.DRAFTED_AMENDED,
      },
    });
    mockApi
      .onGet(`/application/applications/${id}/required-documents`)
      .replyOnce(200, {
        data: requiredDocuments,
      });
    mockApi
      .onGet(new RegExp(`/application/applications/${id}/documents*`))
      .replyOnce(200, { data: [] });

    const { getByTestId } = renderComponent(id);

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(3);
    });

    const submitBtn = getByTestId("submit-button");
    expect(submitBtn).not.toHaveClass("submitted");
    expect(submitBtn).toHaveTextContent("Re-submit");
  });

  it("Amend Application - Save and Exit", async () => {
    const { getByTestId } = screen;
    await amendApplicationInitialSteps();

    mockApi.onGet(new RegExp(`/application/applications*`)).reply(200, {
      data: [],
      count: 0,
    });

    userEvent.click(getByTestId("save-and-exit-button"));
    await waitFor(() => {
      expect(getByTestId("amendment-confirmation-modal")).toBeInTheDocument();
    });

    const modalCancelBtn = getByTestId("amendment-confirmation-modal-cancel");
    expect(modalCancelBtn).toBeInTheDocument();

    userEvent.click(modalCancelBtn);
    await waitFor(() => {
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
    });
  });

  it("Amend Application - Move back to previous tab/step", async () => {
    const { getByTestId } = screen;
    await amendApplicationInitialSteps();

    mockApi.onGet(new RegExp(`/application/applications*`)).reply(200, {
      data: [],
      count: 0,
    });

    userEvent.click(getByTestId("previous-button"));
    await waitFor(() => {
      expect(getByTestId("amendment-confirmation-modal")).toBeInTheDocument();
    });

    const modalCancelBtn = getByTestId("amendment-confirmation-modal-cancel");
    expect(modalCancelBtn).toBeInTheDocument();

    userEvent.click(modalCancelBtn);
    await waitFor(() => {
      expect(getByTestId(securityTabTestId)).toBeInTheDocument();
    });
  });

  it("Supporting document - List, Download & Delete", async () => {
    const { id } = application;
    const file = mockData.supportingDocuments[0];

    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: application,
    });
    mockApi
      .onGet(`/application/applications/${id}/required-documents`)
      .replyOnce(200, {
        data: requiredDocuments,
      });
    mockApi
      .onGet(new RegExp(`/application/applications/${id}/documents*`))
      .replyOnce(200, { data: mockData.supportingDocuments });
    mockApi
      .onGet(`/application/applications/${id}/documents/${file.id}/download`)
      .replyOnce(200, mockData.downloadFileResponse);
    mockApi
      .onDelete(`/application/applications/${id}/documents/${file.id}`)
      .replyOnce(200, { data: true });

    const { getByText, getByTestId } = renderComponent(id);

    expect(getByText("Loading your uploaded documents...")).toBeInTheDocument();

    await waitFor(async () => {
      expect(mockApi.history.get).toHaveLength(3);
    });

    mockData.supportingDocuments.forEach(async (doc) => {
      const { id, createdAt, originalFilename } = doc;

      expect(getByTestId(`${id}-originalFileName`)).toHaveTextContent(
        originalFilename
      );
      expect(getByTestId(`${id}-createdAt`)).toHaveTextContent(
        dateFormat(new Date(createdAt), "dd-MM-yy H:mm:ss")
      );
    });

    const deleteModalPrefix =
      "supporting-documents-delete-file-modal-confirmation-modal";
    const modalFileName = getByTestId("filename-to-delete");
    const fileDeleteBtn = getByTestId(`supporting-documents-delete-${file.id}`);

    userEvent.click(getByTestId(`supporting-documents-download-${file.id}`));
    await waitFor(() => expect(mockApi.history.get).toHaveLength(4));

    userEvent.click(fileDeleteBtn);
    expect(modalFileName).toHaveTextContent(file.originalFilename);

    userEvent.click(getByTestId(`${deleteModalPrefix}-cancel`));
    expect(modalFileName).not.toHaveTextContent(file.originalFilename);

    userEvent.click(fileDeleteBtn);
    expect(modalFileName).toHaveTextContent(file.originalFilename);

    userEvent.click(getByTestId(`${deleteModalPrefix}-confirm`));
    await waitFor(() => expect(mockApi.history.delete).toHaveLength(1));
  });
});

import React from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { Store } from "@reduxjs/toolkit";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { Router, Route, Redirect } from "react-router-dom";
import { axiosInstance } from "../../../../common/services/APIService";
import { reduxSagaSetup } from "../../../../common/utils/testing";
import {
  errorHandlerReducers,
  errorHandlerSagas,
} from "../../../../error-handler";
import {
  reducer as notificationReducers,
  Notification,
} from "../../../../notification";
import { APPLICATION_STEPS } from "../../../constants/applicationSteps";
import { applicationSagas } from "../../../index";
import applicationReducers from "../../../reducers";
import ApplicationDetails from "../index";
import { savedApplication } from "./mock-data";

describe("Application Detail", () => {
  const mockApi = new MockAdapter(axiosInstance);
  const assessmentPageTestId = "ASSESSMENT_ADMIN_PAGE";
  const history = createMemoryHistory();
  let appStore: Store;

  const renderComponent = (
    applicationId = "new",
    assessmentUrl: undefined | string = undefined
  ) => {
    const applicationListUrl = "/application/applications";
    const applicationProps = assessmentUrl ? { assessmentUrl } : {};
    return render(
      <Provider store={appStore}>
        <Notification />
        <Router history={history}>
          <Route path="/assessment/:id" exact={true}>
            <div data-testid={assessmentPageTestId}></div>
          </Route>
          <Route path="/application/applications/:id/quotes" exact={true}>
            <ApplicationDetails
              applicationId={applicationId}
              pageAfterSave={applicationListUrl}
              tabName={APPLICATION_STEPS.quotes}
              {...applicationProps}
            />
          </Route>
          <Redirect to={`/application/applications/${applicationId}/quotes`} />
        </Router>
      </Provider>
    );
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

  it("Page default state - assemment admin button NOT visible.", async () => {
    const { id } = savedApplication;

    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: savedApplication,
    });

    const { queryByTestId } = renderComponent(id);

    await waitFor(async () => {
      expect(mockApi.history.get).toHaveLength(1);
      expect(queryByTestId("assessment-admin-link")).not.toBeInTheDocument();
    });
  });

  it("Page default state - assemment admin button visible.", async () => {
    const { id, assessmentId } = savedApplication;
    const assessmentUrl = "/assessment/{{ASSESSMENT_ID}}";

    mockApi.onGet(`/application/applications/${id}`).replyOnce(200, {
      data: savedApplication,
    });

    const { getByTestId } = renderComponent(id, assessmentUrl);

    await waitFor(async () => {
      expect(mockApi.history.get).toHaveLength(1);
    });

    const assessmentAdminLink = getByTestId("assessment-admin-link");
    expect(assessmentAdminLink).toBeInTheDocument();
    expect(assessmentAdminLink).toHaveAttribute(
      "href",
      `/assessment/${assessmentId}`
    );
    userEvent.click(assessmentAdminLink);

    await waitFor(async () => {
      expect(getByTestId(assessmentPageTestId)).toBeInTheDocument();
    });
  });
});

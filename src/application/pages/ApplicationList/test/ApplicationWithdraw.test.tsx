import React, { ReactElement } from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { Store } from "@reduxjs/toolkit";
import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Route, Redirect } from "react-router-dom";
import { axiosInstance } from "../../../../common/services/APIService";
import { reduxSagaSetup } from "../../../../common/utils/testing";
import {
  errorHandlerReducers,
  errorHandlerSagas,
} from "../../../../error-handler";
import {
  Notification,
  reducer as notificationReducers,
} from "../../../../notification";
import { applicationSagas, applicationReducers } from "../../../index";
import ApplicationList from "../ApplicationList";
import {
  quotedApplication,
  submittedApplication,
  statusReasons,
} from "./mock-data";

describe("Application list page", () => {
  const mock = new AxiosMockAdapter(axiosInstance);
  const applicationsUrl = new RegExp("/application/applications*");
  let component: ReactElement;
  let appStore: Store;

  beforeEach(() => {
    function* rootSaga(): Generator<
      AllEffect<ForkEffect<void>>,
      void,
      unknown
    > {
      yield all([fork(errorHandlerSagas), fork(applicationSagas)]);
    }
    const setup = reduxSagaSetup({
      application: applicationReducers,
      notification: notificationReducers,
      errorHandler: errorHandlerReducers,
    });
    appStore = setup.store;
    setup.sagaMiddleware.run(rootSaga);

    component = (
      <Provider store={appStore}>
        <Notification />
        <Router>
          <Route
            path="/application/applications"
            exact={true}
            render={(props) => <ApplicationList {...props} />}
          />
          <Redirect to="/application/applications" />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    mock.reset();
    cleanup();
  });

  it("Withdraw modal performs basic functions", async () => {
    mock.onGet(applicationsUrl).reply(200, {
      data: [quotedApplication],
      count: 1,
    });

    const { getByTestId, queryByText } = render(component);

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
    });

    fireEvent.click(
      getByTestId(`application-${quotedApplication.id}-withdraw`)
    );
    expect(
      queryByText(`Withdraw application ${quotedApplication.applicationNumber}`)
    ).toBeInTheDocument();
    fireEvent.click(getByTestId(`withdraw-cancel-btn`));
    expect(
      queryByText(`Withdraw application ${quotedApplication.applicationNumber}`)
    ).not.toBeInTheDocument();

    fireEvent.click(
      getByTestId(`application-${quotedApplication.id}-withdraw`)
    );
    expect(
      queryByText(`Withdraw application ${quotedApplication.applicationNumber}`)
    ).toBeInTheDocument();
    fireEvent.click(getByTestId(`withdraw-close-btn`));
    expect(
      queryByText(`Withdraw application ${quotedApplication.applicationNumber}`)
    ).not.toBeInTheDocument();
  });

  it("Withdraw quoted application", async () => {
    mock.onGet(applicationsUrl).reply(200, {
      data: [quotedApplication],
      count: 1,
    });

    const { getByTestId, queryByText } = render(component);

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
    });

    fireEvent.click(
      getByTestId(`application-${quotedApplication.id}-withdraw`)
    );

    expect(
      queryByText(`Withdraw application ${quotedApplication.applicationNumber}`)
    ).toBeInTheDocument();
    expect(
      queryByText("Are you sure you want to proceed with this action?")
    ).toBeInTheDocument();

    mock.onPut(/\w*withdraw\b/).reply(200);
    fireEvent.click(getByTestId(`withdraw-submit-btn`));
    await waitFor(() => {
      expect(mock.history.put.length).toBe(1);
      expect(mock.history.get.length).toBe(2);
    });

    expect(
      queryByText(`Withdraw application ${quotedApplication.applicationNumber}`)
    ).not.toBeInTheDocument();
  });

  it("Withdraw submitted application", async () => {
    const [, otherReason] = statusReasons;
    mock.onGet(applicationsUrl).reply(200, {
      data: [submittedApplication],
      count: 1,
    });
    mock
      .onGet(
        "/assessment/assessments/status-reason?statusGroups=WITHDRAWN_BY_INTRODUCER,OTHER"
      )
      .reply(200, {
        data: statusReasons,
        count: 1,
      });

    const { getByTestId, queryByText, getByText, debug } = render(component);

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
    });

    fireEvent.click(
      getByTestId(`application-${submittedApplication.id}-withdraw`)
    );

    expect(
      queryByText(
        `Withdraw application ${submittedApplication.applicationNumber}`
      )
    ).toBeInTheDocument();

    const reason = getByTestId("withdraw-reason-selector");
    expect(reason).toBeInTheDocument();

    fireEvent.click(getByTestId(`withdraw-submit-btn`));
    expect(queryByText("Please select a reason.")).toBeInTheDocument();

    await waitFor(() => {
      expect(mock.history.get.length).toBe(2);
    });

    userEvent.selectOptions(reason, [getByText(otherReason.reason)]);

    expect(getByTestId("withdraw-other-reason")).toBeInTheDocument();

    fireEvent.click(getByTestId(`withdraw-submit-btn`));
    expect(queryByText("Please select a reason.")).toBeInTheDocument();

    userEvent.type(
      getByTestId("withdraw-other-reason"),
      "Please specify your own reason."
    );

    mock.onPut(/\w*withdraw\b/).reply(200);
    fireEvent.click(getByTestId(`withdraw-submit-btn`));
    await waitFor(() => {
      expect(mock.history.put.length).toBe(1);
      expect(mock.history.get.length).toBe(3);
    });

    expect(
      queryByText(
        `Withdraw application ${submittedApplication.applicationNumber}`
      )
    ).not.toBeInTheDocument();
  });
});

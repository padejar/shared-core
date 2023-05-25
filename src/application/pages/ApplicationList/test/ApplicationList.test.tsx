import React, { ReactElement } from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { Store } from "@reduxjs/toolkit";
import { render, cleanup, waitFor, fireEvent } from "@testing-library/react";
import AxiosMockAdapter from "axios-mock-adapter";
import * as queryString from "query-string";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Route, Redirect } from "react-router-dom";
import { axiosInstance } from "../../../../common/services/APIService";
import { convertToCurrency } from "../../../../common/utils/number";
import { reduxSagaSetup } from "../../../../common/utils/testing";
import {
  errorHandlerReducers,
  errorHandlerSagas,
} from "../../../../error-handler";
import {
  Notification,
  reducer as notificationReducers,
} from "../../../../notification";
import {
  applicationSagas,
  applicationReducers,
  applicationStatuses,
} from "../../../index";
import ApplicationList from "../ApplicationList";
import { applicationList } from "./mock-data";

const {
  APPLICATION_PUBLIC_STATUS_LABELS,
  APPLICATION_PUBLIC_STATUSES,
  APPLICATION_STATUS_GROUP,
} = applicationStatuses;

const statusKeys = Object.keys(APPLICATION_PUBLIC_STATUS_LABELS);
const statuses = [
  ["Recent Apps", "recent-apps", undefined],
  ...statusKeys
    .slice(1)
    .map((key) => [
      APPLICATION_PUBLIC_STATUS_LABELS[key],
      "status-" + key,
      key,
    ]),
];

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

  it("Render empty list page", async () => {
    mock.onGet(applicationsUrl).reply(200, {
      data: [],
      count: 0,
    });
    const { container, getByText } = render(component);

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      const message = getByText("There are no records to display");
      expect(message).toBeInTheDocument();
      const pagination = container.getElementsByClassName("rdt_Pagination");
      expect(pagination).toHaveLength(0);
    });
  });

  it("Display pagination details", async () => {
    mock.onGet(applicationsUrl).reply(200, {
      ...applicationList,
      count: 100,
    });
    const { container } = render(component);

    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      expect(container.querySelector(".rdt_Pagination")).toHaveTextContent(
        "1-10 of 100"
      );
      expect(container.querySelector("#pagination-first-page")).toBeDisabled();
      expect(
        container.querySelector("#pagination-next-page")
      ).not.toBeDisabled();
      expect(
        container.querySelector("#pagination-previous-page")
      ).toBeDisabled();
      expect(
        container.querySelector("#pagination-last-page")
      ).not.toBeDisabled();
    });

    fireEvent.click(
      container.querySelector("#pagination-next-page") as HTMLElement
    );

    await waitFor(() => {
      expect(mock.history.get.length).toBe(2);
      expect(container.querySelector(".rdt_Pagination")).toHaveTextContent(
        "11-20 of 100"
      );
      expect(
        container.querySelector("#pagination-first-page")
      ).not.toBeDisabled();
      expect(
        container.querySelector("#pagination-previous-page")
      ).not.toBeDisabled();
      expect(
        container.querySelector("#pagination-next-page")
      ).not.toBeDisabled();
      expect(
        container.querySelector("#pagination-last-page")
      ).not.toBeDisabled();
    });

    fireEvent.click(
      container.querySelector("#pagination-last-page") as HTMLElement
    );

    await waitFor(() => {
      expect(mock.history.get.length).toBe(3);
      expect(container.querySelector(".rdt_Pagination")).toHaveTextContent(
        "91-100 of 100"
      );
      expect(
        container.querySelector("#pagination-first-page")
      ).not.toBeDisabled();
      expect(container.querySelector("#pagination-next-page")).toBeDisabled();
      expect(
        container.querySelector("#pagination-previous-page")
      ).not.toBeDisabled();
      expect(container.querySelector("#pagination-last-page")).toBeDisabled();
    });

    fireEvent.click(
      container.querySelector("#pagination-previous-page") as HTMLElement
    );
    await waitFor(() => expect(mock.history.get.length).toBe(4));

    expect(container.querySelector(".rdt_Pagination")).toHaveTextContent(
      "81-90 of 100"
    );
    expect(
      container.querySelector("#pagination-first-page")
    ).not.toBeDisabled();
    expect(
      container.querySelector("#pagination-previous-page")
    ).not.toBeDisabled();
    expect(container.querySelector("#pagination-next-page")).not.toBeDisabled();
    expect(container.querySelector("#pagination-last-page")).not.toBeDisabled();
  });

  it("Render list retrieved from API", async () => {
    const statusClass: { [key: string]: string } = {
      [APPLICATION_PUBLIC_STATUSES.QUOTED]: "warning",
      [APPLICATION_PUBLIC_STATUSES.DRAFTED]: "warning",
      [APPLICATION_PUBLIC_STATUSES.SUBMITTED]: "warning",
      [APPLICATION_PUBLIC_STATUSES.APPROVED]: "warning",
      [APPLICATION_PUBLIC_STATUSES.IN_PROGRESS]: "warning",
      [APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT]: "warning",
      [APPLICATION_PUBLIC_STATUSES.APPROVED]: "success",
      [APPLICATION_PUBLIC_STATUSES.SETTLED]: "success",
    };
    mock.onGet(applicationsUrl).reply(200, applicationList);

    const { getByTestId, queryAllByTestId } = render(component);
    await waitFor(() => {
      expect(mock.history.get.length).toBe(1);
      applicationList.data.forEach((application) => {
        const {
          id,
          name,
          applicationNumber,
          quote,
          publicStatus,
          status,
        } = application;
        expect(
          getByTestId(`application-${applicationNumber}`)
        ).toHaveTextContent(applicationNumber);

        expect(getByTestId(`applicant-${applicationNumber}`)).toHaveTextContent(
          name
        );

        expect(
          getByTestId(`application-${id}-amountFinanced`)
        ).toHaveTextContent("$" + convertToCurrency(quote.amountFinanced));
        expect(getByTestId(`application-${id}-status`)).toBeInTheDocument();
        expect(getByTestId(`application-${id}-status`)).toHaveClass(
          statusClass[publicStatus] || "default"
        );
        expect(getByTestId(`application-${id}-status`)).toHaveTextContent(
          APPLICATION_PUBLIC_STATUS_LABELS[publicStatus]
        );
        expect(queryAllByTestId(`application-${id}-clone`)).toHaveLength(
          publicStatus === APPLICATION_PUBLIC_STATUSES.QUOTED ? 0 : 1
        );
        expect(queryAllByTestId(`application-${id}-withdraw`)).toHaveLength(
          (APPLICATION_STATUS_GROUP.LOCKED as string[]).includes(status) ? 0 : 1
        );
      });
    });
  });

  test.each(statuses)("Filter by status - %s", async (text, testId, status) => {
    mock.onGet(applicationsUrl).reply(200, applicationList);
    const { getByTestId, container } = render(component);

    const filterBtn = getByTestId(testId as string);

    fireEvent.click(filterBtn);

    await waitFor(() => {
      expect(mock.history.get.length).toBe(2);

      const queryVar = queryString.parse(mock.history.get[1].url as string);
      expect(queryVar.status).toEqual(status);

      expect(filterBtn).toHaveClass("active");
      expect(filterBtn).toHaveTextContent(text as string);

      const activeFilter = container.querySelectorAll(".quest-nav-link.active");
      expect(activeFilter).toHaveLength(1);
    });
  });
});

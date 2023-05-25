import React, { ReactElement } from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { waitFor } from "@testing-library/dom";
import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Redirect, Route } from "react-router-dom";
import { Store } from "redux";
import { HTTP_STATUS_CODES } from "../../../../common/constants/httpStatusCodes";
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
import { NOTIFICATION_IDS } from "../../../constants/notificationIds";
import { userSagas, userReducers } from "../../../index";
import ChangePassword from "../ChangePassword";

describe("Change password page", () => {
  let component: ReactElement;
  let store: Store;
  const mockAdapter = new AxiosMockAdapter(axiosInstance);

  beforeEach(() => {
    function* rootSaga(): Generator<
      AllEffect<ForkEffect<void>>,
      void,
      unknown
    > {
      yield all([fork(errorHandlerSagas), fork(userSagas)]);
    }
    const setup = reduxSagaSetup({
      user: userReducers,
      notification: notificationReducers,
      errorHandler: errorHandlerReducers,
    });
    store = setup.store;
    setup.sagaMiddleware.run(rootSaga);

    component = (
      <Provider store={store}>
        <Notification />
        <Router>
          <Route
            path="/user/change-password"
            exact={true}
            render={(props) => <ChangePassword {...props} />}
          />
          <Redirect to="/user/change-password" />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    mockAdapter.reset();
    cleanup();
  });

  it("Shows page default state", async () => {
    const { getByTestId } = render(component);

    expect(getByTestId("current-password")).toHaveValue("");
    expect(getByTestId("new-password")).toHaveValue("");
    expect(getByTestId("confirm-password")).toHaveValue("");
  });

  it("Validate form fields and display error messages.", async () => {
    const { getByTestId, queryByTestId } = render(component);

    const currentPassword = getByTestId("current-password");
    const newPassword = getByTestId("new-password");
    const confirmPassword = getByTestId("confirm-password");
    const submitButton = getByTestId("submit-button");

    userEvent.click(submitButton);

    await waitFor(async () => {
      expect(queryByTestId("current-password-error")).toHaveTextContent(
        "Current password is required"
      );
      expect(queryByTestId("new-password-error")).toHaveTextContent(
        "New password is required"
      );
      expect(queryByTestId("confirm-password-error")).toHaveTextContent(
        "Password confirmation is required"
      );
    });

    userEvent.type(currentPassword, "current password");
    userEvent.type(newPassword, "new password");
    userEvent.type(confirmPassword, "not new password");

    await waitFor(async () => {
      expect(queryByTestId("current-password-error")).not.toBeInTheDocument();
      expect(queryByTestId("new-password-error")).toHaveTextContent(
        "Please specify a valid password"
      );
      expect(queryByTestId("confirm-password-error")).toHaveTextContent(
        "Password confirmation doesn't match"
      );
    });

    userEvent.clear(newPassword);
    userEvent.type(newPassword, "!1Ab1234");

    userEvent.clear(confirmPassword);
    userEvent.type(confirmPassword, "!1Ab1234");

    await waitFor(() => {
      expect(queryByTestId("new-password-error")).not.toBeInTheDocument();
      expect(queryByTestId("confirm-password-error")).not.toBeInTheDocument();
    });
  });

  it("Shows notification message when current password provided is invalid.", async () => {
    const { getByTestId, queryByTestId } = render(component);
    const submitButton = getByTestId("submit-button");

    userEvent.type(getByTestId("current-password"), "current password");
    userEvent.type(getByTestId("new-password"), "!Ab12345");
    userEvent.type(getByTestId("confirm-password"), "!Ab12345");

    const request = {
      url: "/iam/auth/change-password",
      handler: () => {
        return [
          HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY,
          {
            errorCode: "VALIDATION_ERROR",
            errorMessage: "Email/Password combination is invalid",
          },
        ];
      },
    };

    mockAdapter.onPost(request.url).replyOnce(request.handler);
    userEvent.click(submitButton);

    await waitFor(async () => {
      expect(mockAdapter.history.post).toHaveLength(1);
      expect(queryByTestId(NOTIFICATION_IDS.CHANGE_PASSWORD)).toHaveTextContent(
        "Email/Password combination is invalid"
      );
    });
  });

  it("Shows notification message on failed API request.", async () => {
    const { getByTestId, queryByTestId } = render(component);
    const submitButton = getByTestId("submit-button");

    userEvent.type(getByTestId("current-password"), "current password");
    userEvent.type(getByTestId("new-password"), "!Ab12345");
    userEvent.type(getByTestId("confirm-password"), "!Ab12345");

    const request = {
      url: "/iam/auth/change-password",
      handler: () => {
        return [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR];
      },
    };

    mockAdapter.onPost(request.url).replyOnce(request.handler);
    userEvent.click(submitButton);

    await waitFor(async () => {
      expect(mockAdapter.history.post).toHaveLength(1);
      expect(queryByTestId(NOTIFICATION_IDS.CHANGE_PASSWORD)).toHaveTextContent(
        "There's something wrong when we tried your request. Please refresh the page and try again"
      );
    });
  });

  it("Shows notification message and reset fields on successful password update.", async () => {
    const { getByTestId, queryByTestId } = render(component);
    const submitButton = getByTestId("submit-button");

    userEvent.type(getByTestId("current-password"), "current password");
    userEvent.type(getByTestId("new-password"), "!Ab12345");
    userEvent.type(getByTestId("confirm-password"), "!Ab12345");

    const request = {
      url: "/iam/auth/change-password",
      handler: () => {
        return [
          200,
          {
            data: "Password changed",
          },
        ];
      },
    };

    mockAdapter.onPost(request.url).replyOnce(request.handler);
    userEvent.click(submitButton);

    await waitFor(async () => {
      expect(mockAdapter.history.post).toHaveLength(1);
      expect(queryByTestId(NOTIFICATION_IDS.CHANGE_PASSWORD)).toHaveTextContent(
        "Password successfully changed"
      );
      expect(getByTestId("current-password")).toHaveValue("");
      expect(getByTestId("new-password")).toHaveValue("");
      expect(getByTestId("confirm-password")).toHaveValue("");
    });
  });
});

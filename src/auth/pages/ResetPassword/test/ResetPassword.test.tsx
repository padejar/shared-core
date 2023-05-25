import React, { ReactElement } from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { waitFor } from "@testing-library/dom";
import { render, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Redirect, Route } from "react-router-dom";
import { Store } from "redux";
import { authReducers, authSagas } from "../../../";
import { HTTP_STATUS_CODES } from "../../../../common/constants/httpStatusCodes";
import { axiosInstance } from "../../../../common/services/APIService";
import { reduxSagaSetup } from "../../../../common/utils/testing";
import {
  errorHandlerReducers,
  errorHandlerSagas,
  ERROR_CODES,
} from "../../../../error-handler";

import { reducer as notificationReducers } from "../../../../notification";
import { NOTIFICATION_IDS } from "./../../../constants/notificationIds";
import ResetPassword from "./../ResetPassword";

describe("ResetPassword page test", () => {
  const mockAdapter = new AxiosMockAdapter(axiosInstance);
  let component: ReactElement;
  let store: Store;

  beforeEach(() => {
    function* rootSaga(): Generator<
      AllEffect<ForkEffect<void>>,
      void,
      unknown
    > {
      yield all([fork(errorHandlerSagas), fork(authSagas)]);
    }
    const setup = reduxSagaSetup({
      auth: authReducers,
      notification: notificationReducers,
      errorHandler: errorHandlerReducers,
    });
    store = setup.store;
    setup.sagaMiddleware.run(rootSaga);
    component = (
      <Provider store={store}>
        <Router>
          <Route
            path="/auth/reset-password"
            exact={true}
            render={(props) => <ResetPassword {...props} />}
          />
          <Redirect to={`/auth/reset-password?code=${resetToken}`} />
        </Router>
      </Provider>
    );
  });
  afterEach(() => {
    mockAdapter.reset();
    cleanup();
  });

  const resetToken = "123123";

  it("Validate form fields and display error messages.", async () => {
    const inputs = {
      newPassword: "passwordP(",
      confirmNewPassword: "passwordP(",
    };
    const { getByTestId, findByTestId, queryByTestId } = render(component);

    const newPasswordField = getByTestId("newPassword");
    const confirmPasswordField = getByTestId("confirmPassword");
    const submitButton = getByTestId("submit-button");

    fireEvent.click(submitButton);

    expect(await findByTestId("newPassword-error")).toHaveTextContent(
      "New password is required"
    );
    expect(await findByTestId("confirmPassword-error")).toHaveTextContent(
      "Password confirmation is required"
    );

    fireEvent.input(newPasswordField, {
      target: { value: inputs.newPassword },
    });
    fireEvent.input(confirmPasswordField, {
      target: { value: "invalid" },
    });

    fireEvent.click(submitButton);

    expect(await findByTestId("newPassword-error")).toHaveTextContent(
      "Please specify a valid password"
    );
    expect(await findByTestId("confirmPassword-error")).toHaveTextContent(
      "Password confirmation doesn't match"
    );

    userEvent.clear(newPasswordField);
    userEvent.type(newPasswordField, "!1Ab1234");

    userEvent.clear(confirmPasswordField);
    userEvent.type(confirmPasswordField, "!1Ab1234");

    await waitFor(() => {
      expect(queryByTestId("newPassword-error")).not.toBeInTheDocument();
      expect(queryByTestId("confirmPassword-error")).not.toBeInTheDocument();
    });
  });

  it("Shows message received from API when code provided is invalid.", async () => {
    const password = "!1Ab1234";
    const errorMessage = "Code is invalid or has expired";
    const request = {
      url: new RegExp("/iam/auth/reset-password"),
      handler: () => {
        return [
          HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY,
          {
            errorMessage,
            errorCode: ERROR_CODES.VALIDATION_ERROR,
          },
        ];
      },
    };
    mockAdapter.onPut(request.url).replyOnce(request.handler);
    const { getByTestId, queryByTestId } = render(component);

    const newPasswordField = getByTestId("newPassword");
    const confirmPasswordField = getByTestId("confirmPassword");
    const submitButton = getByTestId("submit-button");

    fireEvent.input(newPasswordField, {
      target: { value: password },
    });
    fireEvent.input(confirmPasswordField, {
      target: { value: password },
    });

    fireEvent.click(submitButton);

    await waitFor(async () => {
      expect(mockAdapter.history.put).toHaveLength(1);
      expect(queryByTestId(NOTIFICATION_IDS.RESET_PASSWORD)).toHaveTextContent(
        errorMessage
      );
    });
  });

  it("Successfully resets user password.", async () => {
    const inputs = {
      newPassword: "!1Ab1234",
      confirmNewPassword: "!1Ab1234",
    };
    const request = {
      url: new RegExp("/iam/auth/reset-password"),
      handler: () => {
        return [
          200,
          {
            data: "Password changed",
          },
        ];
      },
    };
    mockAdapter.onPut(request.url).reply(200, request.handler);
    const { getByTestId } = render(component);

    const newPasswordField = getByTestId("newPassword");
    const confirmPasswordField = getByTestId("confirmPassword");
    const submitButton = getByTestId("submit-button");

    fireEvent.input(newPasswordField, {
      target: { value: inputs.newPassword },
    });
    fireEvent.input(confirmPasswordField, {
      target: { value: inputs.confirmNewPassword },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAdapter.history.put.length).toBe(1);
      const successMessage = getByTestId("successMessage");
      expect(successMessage).toBeInTheDocument();
    });
  });
});

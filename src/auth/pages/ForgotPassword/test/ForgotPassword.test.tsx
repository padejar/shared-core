import React, { ReactElement } from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { waitFor } from "@testing-library/dom";
import { render, cleanup, fireEvent } from "@testing-library/react";
import AxiosMockAdapter from "axios-mock-adapter";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Redirect, Route } from "react-router-dom";
import { Store } from "redux";
import { authReducers, authSagas } from "../../../";
import { PERMISSION_ACCESS_TYPES } from "../../../../common/constants/permissionAccessTypes";
import { axiosInstance } from "../../../../common/services/APIService";
import { reduxSagaSetup } from "../../../../common/utils/testing";
import {
  errorHandlerReducers,
  errorHandlerSagas,
} from "../../../../error-handler";
import { reducer as notificationReducers } from "../../../../notification";
import ForgotPassword from "./../ForgotPassword";

describe("ForgotPassword page test", () => {
  let component: ReactElement;
  let store: Store;
  const mockAdapter = new AxiosMockAdapter(axiosInstance);

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
            path="/auth/forgot-password"
            exact={true}
            render={(props) => (
              <ForgotPassword
                {...props}
                source={PERMISSION_ACCESS_TYPES.INTRODUCER_PORTAL}
              />
            )}
          />
          <Redirect to="/auth/forgot-password" />
        </Router>
      </Provider>
    );
  });
  afterEach(() => {
    mockAdapter.reset();
    cleanup();
  });

  it("shows error validation (empty & invalid email field)", async () => {
    const { getByTestId, findByTestId } = render(component);

    const emailField = getByTestId("email");
    const submitButton = getByTestId("submit-button");

    fireEvent.click(submitButton);

    expect(await findByTestId("errorEmailMessage")).toHaveTextContent(
      "Email is required"
    );

    fireEvent.input(emailField, { target: { value: "invalidemail@gmail" } });

    expect(emailField).toHaveValue("invalidemail@gmail");

    fireEvent.click(submitButton);

    expect(await findByTestId("errorEmailMessage")).toHaveTextContent(
      "Invalid email address"
    );
  });

  it("Successfully sent reset password request", async () => {
    const email = "broker@quest.finance";
    const request = {
      url: new RegExp("/iam/auth/reset-password"),
      handler: () => {
        return [
          200,
          {
            data: "Password reset link delivered",
          },
        ];
      },
    };
    mockAdapter.onPost(request.url).reply(request.handler);

    const { getByTestId } = render(component);

    const emailField = getByTestId("email");
    const submitButton = getByTestId("submit-button");

    fireEvent.input(emailField, { target: { value: email } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      const successMessage = getByTestId("successMessage");
      expect(successMessage).toBeInTheDocument();
    });
  });
});

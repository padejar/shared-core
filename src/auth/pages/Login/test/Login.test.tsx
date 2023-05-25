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
import { SingleResponse } from "../../../../common/types/SingleResponse";
import { reduxSagaSetup } from "../../../../common/utils/testing";
import {
  errorHandlerReducers,
  errorHandlerSagas,
  ERROR_CODES,
  DEFAULT_ERROR_MESSAGE,
} from "../../../../error-handler";
import { reducer as notificationReducers } from "../../../../notification";
import { AuthenticateRequest } from "../../../types/AuthenticateRequest";
import { TokenResponse } from "../../../types/TokenResponse";
import Login from "./../Login";

describe("Login Page Test", () => {
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
            path="/auth/login"
            exact={true}
            render={(props) => (
              <Login
                {...props}
                redirectPath="/application/applications"
                source={PERMISSION_ACCESS_TYPES.INTRODUCER_PORTAL}
              />
            )}
          />
          <Redirect to="/auth/login" />
        </Router>
      </Provider>
    );
  });

  const mockTokenResponse: SingleResponse<TokenResponse> = {
    data: {
      accessToken:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiQUNDRVNTIiwiZGF0YSI6eyJpZCI6MiwiY2xpZW50SWQiOjEsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJRdWVzdCIsImVtYWlsIjoiYWRtaW5AcXVlc3QuZmluYW5jZSIsIm1vYmlsZSI6Iis2MTQxMTIzNDU2NzgiLCJwZXJtaXNzaW9ucyI6WyJBQ0NFU1NfSU5UUk9EVUNFUl9QT1JUQUwiLCJBQ0NFU1NfVU5ERVJXUklUSU5HX1BMQVRGT1JNIiwiSUFNX1JPTEVfUkVBRCIsIklBTV9ST0xFX0NSRUFURSIsIklBTV9ST0xFX1VQREFURSIsIklBTV9ST0xFX0RFTEVURSIsIklBTV9VU0VSX1JFQUQiLCJJQU1fVVNFUl9DUkVBVEUiLCJJQU1fVVNFUl9VUERBVEUiLCJJQU1fVVNFUl9ERUxFVEUiLCJBQ0NSRURJVEFUSU9OX0FDQ1JFRElUQVRJT05fUFJPQ0VTUyIsIkFDQ1JFRElUQVRJT05fQUNDUkVESVRBVElPTl9BUFBST1ZFIiwiQVBQTElDQVRJT05fQVBQTElDQVRJT05fUkVBRCIsIkFQUExJQ0FUSU9OX0FQUExJQ0FUSU9OX0NSRUFURSIsIkFQUExJQ0FUSU9OX0FQUExJQ0FUSU9OX1VQREFURSIsIkFQUExJQ0FUSU9OX0FQUExJQ0FUSU9OX1NUQVRVU19VUERBVEUiLCJBUFBMSUNBVElPTl9BUFBMSUNBVElPTl9TVEFUVVNfV0lUSERSQVciLCJBUFBMSUNBVElPTl9ET0NVTUVOVF9HRU5FUkFURV9ET0NVTUVOVFMiLCJDUkVESVRfREVDSVNJT05JTkdfUFJPQ0VTUyIsIkNSRURJVF9ERUNJU0lPTklOR19BUFBST1ZFIiwiU0VUVExFTUVOVF9QUk9DRVNTIiwiRElTQlVSU0VNRU5UX1BST0NFU1MiXSwiY2hpbGRyZW5JZHMiOls0LDNdfSwiaWF0IjoxNjEzNjg3ODE5LCJleHAiOjE2MTM2ODkwMTl9.U_RqR8E-82uuJlq0gpI5-eVQNP0u8mcnQOMePajlwsa7mR9htg2r6KGbHGro9d1tMAjkpQ5fZoL_yVMrZZS0xQ",
      refreshToken:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiUkVGUkVTSCIsImRhdGEiOnsiaWQiOjIsImNsaWVudElkIjoxLCJmaXJzdE5hbWUiOiJBZG1pbiIsImxhc3ROYW1lIjoiUXVlc3QiLCJlbWFpbCI6ImFkbWluQHF1ZXN0LmZpbmFuY2UiLCJtb2JpbGUiOiIrNjE0MTEyMzQ1Njc4IiwicGVybWlzc2lvbnMiOlsiQUNDRVNTX0lOVFJPRFVDRVJfUE9SVEFMIiwiQUNDRVNTX1VOREVSV1JJVElOR19QTEFURk9STSIsIklBTV9ST0xFX1JFQUQiLCJJQU1fUk9MRV9DUkVBVEUiLCJJQU1fUk9MRV9VUERBVEUiLCJJQU1fUk9MRV9ERUxFVEUiLCJJQU1fVVNFUl9SRUFEIiwiSUFNX1VTRVJfQ1JFQVRFIiwiSUFNX1VTRVJfVVBEQVRFIiwiSUFNX1VTRVJfREVMRVRFIiwiQUNDUkVESVRBVElPTl9BQ0NSRURJVEFUSU9OX1BST0NFU1MiLCJBQ0NSRURJVEFUSU9OX0FDQ1JFRElUQVRJT05fQVBQUk9WRSIsIkFQUExJQ0FUSU9OX0FQUExJQ0FUSU9OX1JFQUQiLCJBUFBMSUNBVElPTl9BUFBMSUNBVElPTl9DUkVBVEUiLCJBUFBMSUNBVElPTl9BUFBMSUNBVElPTl9VUERBVEUiLCJBUFBMSUNBVElPTl9BUFBMSUNBVElPTl9TVEFUVVNfVVBEQVRFIiwiQVBQTElDQVRJT05fQVBQTElDQVRJT05fU1RBVFVTX1dJVEhEUkFXIiwiQVBQTElDQVRJT05fRE9DVU1FTlRfR0VORVJBVEVfRE9DVU1FTlRTIiwiQ1JFRElUX0RFQ0lTSU9OSU5HX1BST0NFU1MiLCJDUkVESVRfREVDSVNJT05JTkdfQVBQUk9WRSIsIlNFVFRMRU1FTlRfUFJPQ0VTUyIsIkRJU0JVUlNFTUVOVF9QUk9DRVNTIl0sImNoaWxkcmVuSWRzIjpbNCwzXX0sImlhdCI6MTYxMzY4NzgxOSwiZXhwIjoxNjEzNjk1MDE5fQ.GuC__0I4v0vdIZV6cuuA_6SBq7XzpDsu8FUJk8i-BxXy3Ynzrkaa3SIyy-A0U_mWHe69dl4mBhjkIDx7eAa-xQ",
    },
  };

  const mockRequestData: AuthenticateRequest = {
    email: "customer@quest.finance",
    password: "password",
    source: PERMISSION_ACCESS_TYPES.INTRODUCER_PORTAL,
  };

  afterEach(() => {
    mockAdapter.reset();
    cleanup();
  });

  it("shows error validations (empty email & password)", async () => {
    const { getByTestId, findByTestId } = render(component);

    const loginForm = getByTestId("loginForm");
    const emailField = getByTestId("emailField");
    const passwordField = getByTestId("passwordField");

    expect(emailField).toHaveValue("");
    expect(passwordField).toHaveValue("");

    fireEvent.submit(loginForm);

    expect(await findByTestId("errorEmailMessage")).toHaveTextContent(
      "Email is required"
    );
    expect(await findByTestId("errorPasswordMessage")).toHaveTextContent(
      "Password is required"
    );
  });

  it("unknown error (possibly internet connection problem)", async () => {
    mockAdapter.onPost(new RegExp("/iam/auth/login")).networkError();

    const { getByTestId } = render(component);

    const loginForm = getByTestId("loginForm");
    const emailField = getByTestId("emailField");
    const passwordField = getByTestId("passwordField");

    fireEvent.change(emailField, {
      target: { value: mockRequestData.email },
    });
    fireEvent.change(passwordField, {
      target: { value: mockRequestData.password },
    });

    expect(emailField).toHaveValue(mockRequestData.email);
    expect(passwordField).toHaveValue(mockRequestData.password);

    fireEvent.submit(loginForm);

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      expect(getByTestId("loginErrorMessage")).toHaveTextContent(
        DEFAULT_ERROR_MESSAGE
      );
    });
  });

  it("Email/Password combination is invalid", async () => {
    mockAdapter.onPost(new RegExp("/iam/auth/login")).reply(422, {
      errorCode: ERROR_CODES.VALIDATION_ERROR,
      errorMessage: "Email/Password combination is invalid",
    });

    const { getByTestId } = render(component);

    const loginForm = getByTestId("loginForm");
    const emailField = getByTestId("emailField");
    const passwordField = getByTestId("passwordField");

    fireEvent.change(emailField, {
      target: { value: mockRequestData.email },
    });
    fireEvent.change(passwordField, {
      target: { value: "dfjdlf" },
    });

    expect(emailField).toHaveValue(mockRequestData.email);
    expect(passwordField).toHaveValue("dfjdlf");

    fireEvent.submit(loginForm);

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      expect(getByTestId("loginErrorMessage")).toHaveTextContent(
        "Email/Password combination is invalid"
      );
    });
  });

  it("successfully logs in and redirects to provided path", async () => {
    component = (
      <Provider store={store}>
        <Router>
          <Route
            path="/auth/login"
            exact={true}
            render={(props) => (
              <Login
                {...props}
                redirectPath="/application/applications"
                source={PERMISSION_ACCESS_TYPES.INTRODUCER_PORTAL}
              />
            )}
          />
          <Route path="/application/applications" exact={true}>
            <div data-testid="dashboard-page">Dashboard Page</div>
          </Route>
          <Redirect to="/auth/login" />
        </Router>
      </Provider>
    );

    const request = {
      url: new RegExp("/iam/auth/login"),
      handler: () => {
        return [200, mockTokenResponse];
      },
    };
    mockAdapter.onPost(request.url).reply(request.handler);

    const { getByTestId } = render(component);

    const loginForm = getByTestId("loginForm");
    const emailField = getByTestId("emailField");
    const passwordField = getByTestId("passwordField");

    fireEvent.change(emailField, {
      target: { value: mockRequestData.email },
    });
    fireEvent.change(passwordField, {
      target: { value: mockRequestData.password },
    });

    expect(emailField).toHaveValue(mockRequestData.email);
    expect(passwordField).toHaveValue(mockRequestData.password);

    fireEvent.submit(loginForm);

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      const dashboardPage = getByTestId("dashboard-page");
      expect(dashboardPage).toBeInTheDocument();
    });
  });
});

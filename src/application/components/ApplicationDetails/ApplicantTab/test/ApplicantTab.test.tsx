import React from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { screen, waitFor, within } from "@testing-library/dom";
import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Redirect, Route } from "react-router-dom";
import { Store } from "redux";
import { ADDRESS_INPUT_TYPES } from "../../../../../address-autocomplete";
import { DEFAULT_DATE_INPUT_FORMAT } from "../../../../../common/constants/date";
import { ENTITY_TYPES } from "../../../../../common/constants/entityTypes";
import { axiosInstance } from "../../../../../common/services/APIService";
import {
  dateFormat,
  parseDateForServer,
} from "../../../../../common/utils/date";
import { reduxSagaSetup } from "../../../../../common/utils/testing";
import {
  DEFAULT_ERROR_MESSAGE,
  errorHandlerReducers,
  errorHandlerSagas,
} from "../../../../../error-handler";
import {
  Notification,
  reducer as notificationReducers,
} from "../../../../../notification";
import { APPLICATION_STATUSES } from "../../../../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../../../../constants/applicationSteps";
import { TRUSTEE_TYPES } from "../../../../constants/trusteeTypes";
import applicationReducers from "../../../../reducers";
import applicationSagas from "../../../../sagas";
import ApplicationDetails from "../../index";
import {
  applicantDataSet1,
  applicantDataSet2,
  invalidDateInputs,
  mockAbnResponse,
  mockAcnResponse,
  mockApplicantResponse,
  mockApplicationResponseData,
} from "./mock-data";

describe("ApplicantTab tests", () => {
  let store: Store;
  const mockAdapter = new AxiosMockAdapter(axiosInstance);
  const applicationsListTestId = "application-list";

  const renderComponent = () => {
    const applicationListPath = "/application/applications";
    const { id } = mockApplicationResponseData.data;
    return render(
      <Provider store={store}>
        <Notification />
        <Router>
          <Route
            path="/application/applications/:applicationId/quotes"
            exact={true}
          >
            <div data-testid="quotes-screen"></div>
          </Route>
          <Route
            path="/application/applications/:applicationId/applicant"
            exact={true}
          >
            <ApplicationDetails
              applicationId={id}
              pageAfterSave={applicationListPath}
              tabName={APPLICATION_STEPS.applicant}
            />
          </Route>
          <Route
            path="/application/applications/:applicationId/guarantors"
            exact={true}
          >
            <div data-testid="guarantors-screen"></div>
          </Route>
          <Route path={applicationListPath} exact={true}>
            <div data-testid={applicationsListTestId}></div>
          </Route>
          <Redirect to={`/application/applications/${id}/applicant`} />
        </Router>
      </Provider>
    );
  };

  const amendmentScenario = async () => {
    const application = {
      data: {
        ...mockApplicationResponseData.data,
        status: APPLICATION_STATUSES.SUBMITTED_NEW,
        applicant: {
          ...mockApplicantResponse,
        },
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${application.data.id}`))
      .replyOnce(200, application);

    mockAdapter
      .onPost(
        new RegExp(
          `/application/applications/${application.data.id}/applicants`
        )
      )
      .replyOnce(200, application);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get).toHaveLength(1);
    });

    userEvent.clear(getByTestId("phone"));
    userEvent.paste(getByTestId("phone"), "1312341234");

    userEvent.click(getByTestId("previous-button"));

    expect(getByTestId("amendment-confirmation-modal")).toBeInTheDocument();
    const cancelBtn = getByTestId("amendment-confirmation-modal-cancel");
    const confirmBtn = getByTestId("amendment-confirmation-modal-confirm");
    expect(confirmBtn).toBeVisible();
    expect(cancelBtn).toBeVisible();

    return { cancelBtn, confirmBtn };
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
    store = setup.store;
    setup.sagaMiddleware.run(rootSaga);
  });
  afterEach(() => {
    cleanup();
    mockAdapter.reset();
  });

  it("handles error fetching application", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .networkErrorOnce();

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      const notification = getByTestId("notification");
      const { getByText } = within(notification);
      expect(notification).toBeInTheDocument();
      expect(getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("handles application not found", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(404);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
    });
  });

  it("renders default tab state", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    expect(getByTestId("applicant-form-row-1")).toHaveClass("d-none");
    expect(getByTestId("applicant-form-row-2")).toHaveClass("d-none");
  });

  it("validates inputs' formatting", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    mockAdapter.onPost(new RegExp("/abn/abn-search")).replyOnce(200, {
      data: null,
    });

    mockAdapter.onPost(new RegExp("/abn/acn-search")).replyOnce(200, {
      data: null,
    });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);

      expect(getByTestId("applicant-form-row-1")).toHaveClass("d-none");
      expect(getByTestId("applicant-form-row-2")).toHaveClass("d-none");
    });

    const abn = "42423423423";
    userEvent.type(getByTestId("abn"), "42423423423");
    expect(getByTestId("abn")).toHaveValue("42 423 423 423");

    userEvent.tab();

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      expect(JSON.parse(mockAdapter.history.post[0].data)).toEqual({
        abn,
      });

      expect(getByTestId("applicant-form-row-1")).not.toHaveClass("d-none");
      expect(getByTestId("applicant-form-row-2")).not.toHaveClass("d-none");

      const abnError = getByTestId("abn-error");
      expect(abnError).toBeInTheDocument();
      expect(abnError).toHaveTextContent("ABN Not found");
    });

    userEvent.selectOptions(getByTestId("entityType"), ENTITY_TYPES.TRUST);
    userEvent.selectOptions(getByTestId("trusteeType"), TRUSTEE_TYPES.COMPANY);

    const acn = "423423423";
    userEvent.type(getByTestId("trusteeAcn"), "423423423");
    expect(getByTestId("trusteeAcn")).toHaveValue("423 423 423");

    userEvent.tab();

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(2);
      expect(JSON.parse(mockAdapter.history.post[1].data)).toEqual({
        acn,
      });

      const trustAcn = getByTestId("trustAcn-error");
      expect(trustAcn).toBeInTheDocument();
      expect(trustAcn).toHaveTextContent("ACN not found");
    });

    userEvent.type(getByTestId("phone"), "1312341234");
    expect(getByTestId("phone")).toHaveValue("13 1234 1234");
  });

  it("handles abn lookup errors", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    mockAdapter.onPost(new RegExp("/abn/abn-search")).networkErrorOnce();

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    userEvent.type(getByTestId("abn"), applicantDataSet1.abn);

    userEvent.tab();

    await waitFor(() => {
      const notification = getByTestId("notification");
      const { getByText } = within(notification);
      expect(notification).toBeInTheDocument();
      expect(getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("handles acn lookup errors", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    mockAdapter.onPost(new RegExp("/abn/abn-search")).replyOnce(200, {
      data: mockAbnResponse,
    });

    mockAdapter.onPost(new RegExp("/abn/acn-search")).networkErrorOnce();

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    userEvent.type(getByTestId("abn"), applicantDataSet1.abn);

    userEvent.tab();

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      expect(JSON.parse(mockAdapter.history.post[0].data)).toEqual({
        abn: applicantDataSet1.abn,
      });

      expect(getByTestId("applicant-form-row-1")).not.toHaveClass("d-none");
      expect(getByTestId("applicant-form-row-2")).not.toHaveClass("d-none");

      expect(getByTestId("entityName")).toHaveValue(mockAbnResponse.entityName);
      expect(getByTestId("tradingName")).toHaveValue(
        mockAbnResponse.tradingNames[0]
      );
      expect(getByTestId("entityType")).toHaveValue(mockAbnResponse.entityType);
      expect(getByTestId("gstRegisteredDate")).toHaveValue(
        `${dateFormat(
          new Date(mockAbnResponse.gstActiveFrom),
          DEFAULT_DATE_INPUT_FORMAT
        )}`
      );
    });

    userEvent.selectOptions(
      getByTestId("trusteeType"),
      applicantDataSet1.trusteeType
    );
    expect(getByTestId("trusteeAcn")).toBeInTheDocument();
    userEvent.type(getByTestId("trusteeAcn"), "123123123");
    expect(getByTestId("trusteeAcn")).toHaveValue("123 123 123");

    userEvent.click(getByTestId("trusteeName"));

    await waitFor(() => {
      const notification = getByTestId("notification");
      const { getByText } = within(notification);
      expect(notification).toBeInTheDocument();
      expect(getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("validates inputs with real abn and acn", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    mockAdapter.onPost(new RegExp("/abn/abn-search")).replyOnce(200, {
      data: mockAbnResponse,
    });

    mockAdapter.onPost(new RegExp("/abn/acn-search")).replyOnce(200, {
      data: null,
    });

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/applicants`))
      .replyOnce(200, mockApplicationResponseData);

    const { getByTestId, findByTestId, queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    userEvent.click(getByTestId("submit-button"));

    expect(await findByTestId("abn-error")).toBeInTheDocument();
    userEvent.type(getByTestId("abn"), applicantDataSet1.abn);

    userEvent.tab();

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      expect(JSON.parse(mockAdapter.history.post[0].data)).toEqual({
        abn: applicantDataSet1.abn,
      });

      expect(getByTestId("applicant-form-row-1")).not.toHaveClass("d-none");
      expect(getByTestId("applicant-form-row-2")).not.toHaveClass("d-none");

      expect(getByTestId("entityName")).toHaveValue(mockAbnResponse.entityName);
      expect(getByTestId("tradingName")).toHaveValue(
        mockAbnResponse.tradingNames[0]
      );
      expect(getByTestId("entityType")).toHaveValue(mockAbnResponse.entityType);
      expect(getByTestId("abnRegisteredDate")).toHaveValue(
        `${dateFormat(
          new Date(mockAbnResponse.abnActiveFrom),
          DEFAULT_DATE_INPUT_FORMAT
        )}`
      );
      expect(getByTestId("gstRegisteredDate")).toHaveValue(
        `${dateFormat(
          new Date(mockAbnResponse.gstActiveFrom),
          DEFAULT_DATE_INPUT_FORMAT
        )}`
      );
    });

    userEvent.selectOptions(
      getByTestId("trusteeType"),
      applicantDataSet1.trusteeType
    );
    expect(getByTestId("trusteeAcn")).toBeInTheDocument();
    userEvent.type(getByTestId("trusteeAcn"), "123123123");
    expect(getByTestId("trusteeAcn")).toHaveValue("123 123 123");

    userEvent.click(getByTestId("trusteeName"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(2);
      expect(JSON.parse(mockAdapter.history.post[1].data)).toEqual({
        acn: "123123123",
      });

      const trustAcnError = getByTestId("trustAcn-error");
      expect(trustAcnError).toBeInTheDocument();
      expect(trustAcnError).toHaveTextContent("ACN not found");
    });

    mockAdapter.onPost(new RegExp("/abn/acn-search")).replyOnce(200, {
      data: mockAcnResponse,
    });

    userEvent.clear(getByTestId("trusteeAcn"));
    userEvent.type(getByTestId("trusteeAcn"), applicantDataSet1.trusteeAcn);

    userEvent.tab();

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(3);
      expect(JSON.parse(mockAdapter.history.post[2].data)).toEqual({
        acn: applicantDataSet1.trusteeAcn,
      });

      expect(queryByTestId("trustAcn-error")).not.toBeInTheDocument();
      expect(getByTestId("trusteeName")).toHaveValue(
        mockAcnResponse.entityName
      );
    });

    expect(getByTestId("phone-error")).toBeInTheDocument();
    expect(getByTestId("industry-error")).toBeInTheDocument();
    expect(getByTestId("industryType-error")).toBeInTheDocument();
    expect(getByTestId("applicant-fullAddress-error")).toBeInTheDocument();

    userEvent.type(getByTestId("phone"), applicantDataSet1.phone);

    userEvent.selectOptions(
      getByTestId("industry"),
      applicantDataSet1.industry
    );
    userEvent.selectOptions(
      getByTestId("industryType"),
      applicantDataSet1.industryType
    );

    expect(getByTestId("applicant-manual-address-input")).toHaveClass("d-none");
    userEvent.click(getByTestId("applicant-addressInputType-label"));
    expect(getByTestId("applicant-addressInputType")).toBeChecked();
    expect(getByTestId("applicant-manual-address-input")).not.toHaveClass(
      "d-none"
    );

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(
        getByTestId("applicant-addressStreetNumber-error")
      ).toBeInTheDocument();
      expect(
        getByTestId("applicant-addressStreetName-error")
      ).toBeInTheDocument();
      expect(getByTestId("applicant-addressSuburb-error")).toBeInTheDocument();
      expect(getByTestId("applicant-addressState-error")).toBeInTheDocument();
      expect(
        getByTestId("applicant-addressPostcode-error")
      ).toBeInTheDocument();
    });

    userEvent.type(
      getByTestId("applicant-addressUnitNumber"),
      applicantDataSet1.addressUnitNumber
    );
    userEvent.type(
      getByTestId("applicant-addressStreetNumber"),
      applicantDataSet1.addressStreetNumber
    );
    userEvent.type(
      getByTestId("applicant-addressStreetName"),
      applicantDataSet1.addressStreetName
    );
    userEvent.type(
      getByTestId("applicant-addressSuburb"),
      applicantDataSet1.addressSuburb
    );
    userEvent.selectOptions(
      getByTestId("applicant-addressState"),
      applicantDataSet1.addressState
    );
    userEvent.type(
      getByTestId("applicant-addressPostcode"),
      applicantDataSet1.addressPostcode
    );

    const updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        applicant: mockApplicantResponse,
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(4);
      expect(JSON.parse(mockAdapter.history.post[3].data)).toEqual({
        addressInputType: ADDRESS_INPUT_TYPES.MANUAL,
        addressState: applicantDataSet1.addressState,
        addressStreetName: applicantDataSet1.addressStreetName,
        addressStreetNumber: applicantDataSet1.addressStreetNumber,
        addressUnitNumber: applicantDataSet1.addressUnitNumber,
        addressSuburb: applicantDataSet1.addressSuburb,
        addressPostcode: applicantDataSet1.addressPostcode,
        abn: applicantDataSet1.abn,
        entityName: mockAbnResponse.entityName,
        tradingName: mockAbnResponse.tradingNames[0],
        entityType: mockAbnResponse.entityType,
        trusteeType: mockAcnResponse.entityType,
        trusteeName: mockAcnResponse.entityName,
        trusteeAcn: applicantDataSet1.trusteeAcn,
        abnRegisteredDate: mockAbnResponse.abnActiveFrom,
        gstRegisteredDate: mockAbnResponse.gstActiveFrom,
        phone: applicantDataSet1.phone,
        industry: applicantDataSet1.industry,
        industryType: applicantDataSet1.industryType,
        isDraft: false,
      });
      expect(mockAdapter.history.get.length).toBe(2);
      expect(
        queryByTestId("applicant-addressStreetNumber-error")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("applicant-addressStreetName-error")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("applicant-addressSuburb-error")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("applicant-addressState-error")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("applicant-addressPostcode-error")
      ).not.toBeInTheDocument();

      expect(getByTestId("guarantors-screen")).toBeInTheDocument();
    });
  });

  it("validates input with custom abn and acn", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    mockAdapter.onPost(new RegExp("/abn/abn-search")).replyOnce(200, {
      data: null,
    });

    mockAdapter.onPost(new RegExp("/abn/acn-search")).replyOnce(200, {
      data: null,
    });

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/applicants`))
      .replyOnce(200, mockApplicationResponseData);

    const { getByTestId, findByTestId, queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    userEvent.click(getByTestId("submit-button"));

    expect(await findByTestId("abn-error")).toBeInTheDocument();
    userEvent.type(getByTestId("abn"), applicantDataSet2.abn);

    userEvent.tab();

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      expect(JSON.parse(mockAdapter.history.post[0].data)).toEqual({
        abn: applicantDataSet2.abn,
      });

      expect(getByTestId("applicant-form-row-1")).not.toHaveClass("d-none");
      expect(getByTestId("applicant-form-row-2")).not.toHaveClass("d-none");

      const abnError = getByTestId("abn-error");
      expect(abnError).toBeInTheDocument();
      expect(abnError).toHaveTextContent("ABN Not found");
    });

    expect(getByTestId("entityName-error")).toBeInTheDocument();
    expect(getByTestId("entityType-error")).toBeInTheDocument();
    expect(getByTestId("abnRegisteredDate-error")).toBeInTheDocument();
    expect(getByTestId("phone-error")).toBeInTheDocument();
    expect(getByTestId("industry-error")).toBeInTheDocument();
    expect(getByTestId("industryType-error")).toBeInTheDocument();
    expect(getByTestId("applicant-fullAddress-error")).toBeInTheDocument();
    expect(getByTestId("validation-error-message")).toBeInTheDocument();

    userEvent.type(getByTestId("entityName"), applicantDataSet2.entityName);
    userEvent.type(getByTestId("tradingName"), applicantDataSet2.tradingName);
    userEvent.selectOptions(
      getByTestId("entityType"),
      applicantDataSet2.entityType
    );
    userEvent.selectOptions(
      getByTestId("trusteeType"),
      applicantDataSet2.trusteeType
    );

    expect(getByTestId("trusteeAcn")).toBeInTheDocument();
    userEvent.type(getByTestId("trusteeAcn"), "123123123");
    expect(getByTestId("trusteeAcn")).toHaveValue("123 123 123");

    userEvent.click(getByTestId("trusteeName"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(2);
      expect(JSON.parse(mockAdapter.history.post[1].data)).toEqual({
        acn: "123123123",
      });

      const trustAcnError = getByTestId("trustAcn-error");
      expect(trustAcnError).toBeInTheDocument();
      expect(trustAcnError).toHaveTextContent("ACN not found");
    });

    userEvent.click(getByTestId("submit-button"));

    expect(await findByTestId("trusteeName-error")).toBeInTheDocument();

    userEvent.type(getByTestId("trusteeName"), applicantDataSet2.trusteeName);
    userEvent.type(
      getByTestId("abnRegisteredDate"),
      applicantDataSet2.abnRegisteredDate
    );
    userEvent.type(getByTestId("phone"), applicantDataSet2.phone);
    userEvent.selectOptions(
      getByTestId("industry"),
      applicantDataSet2.industry
    );
    userEvent.selectOptions(
      getByTestId("industryType"),
      applicantDataSet2.industryType
    );

    expect(getByTestId("applicant-manual-address-input")).toHaveClass("d-none");
    userEvent.click(getByTestId("applicant-addressInputType-label"));
    expect(getByTestId("applicant-addressInputType")).toBeChecked();
    expect(getByTestId("applicant-manual-address-input")).not.toHaveClass(
      "d-none"
    );

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(
        getByTestId("applicant-addressStreetNumber-error")
      ).toBeInTheDocument();
      expect(
        getByTestId("applicant-addressStreetName-error")
      ).toBeInTheDocument();
      expect(getByTestId("applicant-addressSuburb-error")).toBeInTheDocument();
      expect(getByTestId("applicant-addressState-error")).toBeInTheDocument();
      expect(
        getByTestId("applicant-addressPostcode-error")
      ).toBeInTheDocument();
    });

    userEvent.type(
      getByTestId("applicant-addressUnitNumber"),
      applicantDataSet2.addressUnitNumber
    );
    userEvent.type(
      getByTestId("applicant-addressStreetNumber"),
      applicantDataSet2.addressStreetNumber
    );
    userEvent.type(
      getByTestId("applicant-addressStreetName"),
      applicantDataSet2.addressStreetName
    );
    userEvent.type(
      getByTestId("applicant-addressSuburb"),
      applicantDataSet2.addressSuburb
    );
    userEvent.selectOptions(
      getByTestId("applicant-addressState"),
      applicantDataSet2.addressState
    );
    userEvent.type(
      getByTestId("applicant-addressPostcode"),
      applicantDataSet2.addressPostcode
    );

    const updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        applicant: mockApplicantResponse,
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(3);
      expect(JSON.parse(mockAdapter.history.post[2].data)).toEqual({
        addressInputType: ADDRESS_INPUT_TYPES.MANUAL,
        addressState: applicantDataSet2.addressState,
        addressStreetName: applicantDataSet2.addressStreetName,
        addressStreetNumber: applicantDataSet2.addressStreetNumber,
        addressUnitNumber: applicantDataSet2.addressUnitNumber,
        addressSuburb: applicantDataSet2.addressSuburb,
        addressPostcode: applicantDataSet2.addressPostcode,
        abn: applicantDataSet2.abn,
        entityName: applicantDataSet2.entityName,
        tradingName: applicantDataSet2.tradingName,
        entityType: applicantDataSet2.entityType,
        trusteeType: applicantDataSet2.trusteeType,
        trusteeName: applicantDataSet2.trusteeName,
        trusteeAcn: applicantDataSet2.trusteeAcn,
        abnRegisteredDate: parseDateForServer(
          applicantDataSet2.abnRegisteredDate
        ),
        gstRegisteredDate: null,
        phone: applicantDataSet2.phone,
        industry: applicantDataSet2.industry,
        industryType: applicantDataSet2.industryType,
        isDraft: false,
      });
      expect(mockAdapter.history.get.length).toBe(2);
      expect(queryByTestId("entityName-error")).not.toBeInTheDocument();
      expect(queryByTestId("entityType-error")).not.toBeInTheDocument();
      expect(queryByTestId("trusteeName-error")).not.toBeInTheDocument();
      expect(queryByTestId("abnRegisteredDate-error")).not.toBeInTheDocument();
      expect(queryByTestId("phone-error")).not.toBeInTheDocument();
      expect(queryByTestId("industry-error")).not.toBeInTheDocument();
      expect(queryByTestId("industryType-error")).not.toBeInTheDocument();
      expect(
        queryByTestId("applicant-fullAddress-error")
      ).not.toBeInTheDocument();
      expect(queryByTestId("validation-error-message")).not.toBeInTheDocument();
      expect(
        queryByTestId("applicant-addressStreetNumber-error")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("applicant-addressStreetName-error")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("applicant-addressSuburb-error")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("applicant-addressState-error")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("applicant-addressPostcode-error")
      ).not.toBeInTheDocument();
    });
  });

  it("Save and exits existing application with applicant - WITH CHANGES - success", async () => {
    let updatedApplication = {
      ...mockApplicationResponseData.data,
      applicant: mockApplicantResponse,
    };

    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, { data: updatedApplication });

    const entityName = "New Entity name";

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/applicants`))
      .replyOnce(200, {
        data: {
          ...mockApplicantResponse,
          entityName,
        },
      });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    userEvent.clear(getByTestId("entityName"));
    userEvent.type(getByTestId("entityName"), entityName);

    updatedApplication = {
      ...updatedApplication,
      applicant: {
        ...updatedApplication.applicant,
        entityName,
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: updatedApplication,
      });

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      expect(JSON.parse(mockAdapter.history.post[0].data)).toEqual({
        ...applicantDataSet1,
        entityName,
        tradingName: updatedApplication.applicant.tradingName,
        trusteeName: updatedApplication.applicant.trusteeName,
        abnRegisteredDate: updatedApplication.applicant.abnRegisteredDate,
        gstRegisteredDate: updatedApplication.applicant.gstRegisteredDate,
        isDraft: true,
      });
      expect(mockAdapter.history.get.length).toBe(2);
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
    });
  });

  it("Save and exits existing application with applicant - WITH CHANGES - network error", async () => {
    const updatedApplication = {
      ...mockApplicationResponseData.data,
      applicant: mockApplicantResponse,
    };

    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, { data: updatedApplication });

    const entityName = "New Entity name";

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/applicants`))
      .networkErrorOnce();

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    userEvent.clear(getByTestId("entityName"));
    userEvent.type(getByTestId("entityName"), entityName);

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(() => {
      const notification = getByTestId("notification");
      const { getByText } = within(notification);
      expect(notification).toBeInTheDocument();
      expect(getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("Save and exits existing application with applicant - WITHOUT CHANGES", async () => {
    const updatedApplication = {
      ...mockApplicationResponseData.data,
      applicant: mockApplicantResponse,
    };

    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, { data: updatedApplication });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(0);
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
    });
  });

  it("Amend application - cancel", async () => {
    const { cancelBtn } = await amendmentScenario();
    userEvent.click(cancelBtn);

    const { queryByTestId, getByTestId } = screen;

    expect(getByTestId("quotes-screen")).toBeInTheDocument();
    expect(
      queryByTestId("amendment-confirmation-modal")
    ).not.toBeInTheDocument();
  });

  it("Amend application - proceed with change", async () => {
    const { confirmBtn } = await amendmentScenario();
    userEvent.click(confirmBtn);

    const { queryByTestId, getByTestId } = screen;

    await waitFor(() => {
      expect(getByTestId("quotes-screen")).toBeInTheDocument();
      expect(mockAdapter.history.post).toHaveLength(1);
      expect(
        queryByTestId("amendment-confirmation-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("Validates date inputs", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    mockAdapter.onPost(new RegExp("/abn/abn-search")).replyOnce(200, {
      data: mockAbnResponse,
    });

    mockAdapter.onPost(new RegExp("/abn/acn-search")).replyOnce(200, {
      data: null,
    });

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/applicants`))
      .replyOnce(200, mockApplicationResponseData);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    userEvent.type(getByTestId("abn"), applicantDataSet1.abn);

    userEvent.tab();

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      expect(JSON.parse(mockAdapter.history.post[0].data)).toEqual({
        abn: applicantDataSet1.abn,
      });

      expect(getByTestId("applicant-form-row-1")).not.toHaveClass("d-none");
      expect(getByTestId("applicant-form-row-2")).not.toHaveClass("d-none");

      expect(getByTestId("entityName")).toHaveValue(mockAbnResponse.entityName);
      expect(getByTestId("tradingName")).toHaveValue(
        mockAbnResponse.tradingNames[0]
      );
      expect(getByTestId("entityType")).toHaveValue(mockAbnResponse.entityType);
      expect(getByTestId("abnRegisteredDate")).toHaveValue(
        `${dateFormat(
          new Date(mockAbnResponse.abnActiveFrom),
          DEFAULT_DATE_INPUT_FORMAT
        )}`
      );
      expect(getByTestId("gstRegisteredDate")).toHaveValue(
        `${dateFormat(
          new Date(mockAbnResponse.gstActiveFrom),
          DEFAULT_DATE_INPUT_FORMAT
        )}`
      );
    });

    userEvent.clear(getByTestId("abnRegisteredDate"));
    userEvent.clear(getByTestId("gstRegisteredDate"));

    userEvent.type(
      getByTestId("abnRegisteredDate"),
      invalidDateInputs.incomplete
    );
    userEvent.type(
      getByTestId("gstRegisteredDate"),
      invalidDateInputs.incomplete
    );

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(getByTestId("abnRegisteredDate-error")).toHaveTextContent(
        "ABN registered date is invalid"
      );
      expect(getByTestId("gstRegisteredDate-error")).toHaveTextContent(
        "GST registered date is invalid"
      );
    });

    userEvent.clear(getByTestId("abnRegisteredDate"));
    userEvent.clear(getByTestId("gstRegisteredDate"));

    userEvent.type(
      getByTestId("abnRegisteredDate"),
      invalidDateInputs.invalidMonth
    );
    userEvent.type(
      getByTestId("gstRegisteredDate"),
      invalidDateInputs.invalidMonth
    );

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(getByTestId("abnRegisteredDate-error")).toHaveTextContent(
        "ABN registered date is invalid"
      );
      expect(getByTestId("gstRegisteredDate-error")).toHaveTextContent(
        "GST registered date is invalid"
      );
    });

    userEvent.clear(getByTestId("abnRegisteredDate"));
    userEvent.clear(getByTestId("gstRegisteredDate"));

    userEvent.type(
      getByTestId("abnRegisteredDate"),
      invalidDateInputs.futureDate
    );
    userEvent.type(
      getByTestId("gstRegisteredDate"),
      invalidDateInputs.futureDate
    );

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(getByTestId("abnRegisteredDate-error")).toHaveTextContent(
        "ABN registered date is greater than today"
      );
      expect(getByTestId("gstRegisteredDate-error")).toHaveTextContent(
        "GST registered date is greater than today"
      );
    });
  });
});

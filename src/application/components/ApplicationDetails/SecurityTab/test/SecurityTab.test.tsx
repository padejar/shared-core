import React from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { screen, waitFor, within } from "@testing-library/dom";
import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AxiosMockAdapter from "axios-mock-adapter";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Redirect, Route } from "react-router-dom";
import { Store } from "redux";
import { axiosInstance } from "../../../../../common/services/APIService";
import {
  convertToCurrency,
  parseNumber,
} from "../../../../../common/utils/number";
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
import { SECURITY_DETAILS_INPUT_TYPES } from "../../../../constants/securityDetailsInputTypes";
import { USAGE_TYPES } from "../../../../constants/usageTypes";
import applicationReducers from "../../../../reducers";
import applicationSagas from "../../../../sagas";
import ApplicationDetails from "../../index";
import {
  detailsSpec,
  detailsSpec2,
  glassGuideInput,
  glassGuideInput2,
  input,
  makeList,
  mockApplicationResponseData,
  mockSecurityResponseData,
  modelList,
  nvicList,
  nvicOptionList,
  seriesList,
  variantList,
  yearList,
} from "./mock-data";

describe("SecurityTab tests", () => {
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
            path="/application/applications/:applicationId/guarantors"
            exact={true}
          >
            <div data-testid="guarantors-step"></div>
          </Route>
          <Route
            path="/application/applications/:applicationId/security"
            exact={true}
          >
            <ApplicationDetails
              applicationId={id}
              pageAfterSave={applicationListPath}
              tabName={APPLICATION_STEPS.security}
            />
          </Route>
          <Route path={applicationListPath} exact={true}>
            <div data-testid={applicationsListTestId}></div>
          </Route>
          <Redirect to={`/application/applications/${id}/security`} />
        </Router>
      </Provider>
    );
  };

  const amendmentScenario = async () => {
    const application = {
      data: {
        ...mockApplicationResponseData.data,
        status: APPLICATION_STATUSES.SUBMITTED_NEW,
        security: mockSecurityResponseData.data,
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${application.data.id}`))
      .replyOnce(200, application);

    mockAdapter.onPost(new RegExp("/vehicle/glass-guides/check")).reply(200, {
      data: true,
    });

    mockAdapter
      .onPost(
        new RegExp(
          `/application/applications/${application.data.id}/securities`
        )
      )
      .replyOnce(200, application);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get).toHaveLength(1);
    });

    userEvent.click(getByTestId(`usageType-${USAGE_TYPES.USED}-label`));

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
    mockAdapter.reset();
    cleanup();
  });

  it("Handles error fetching application", async () => {
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

  it("Handles application not found", async () => {
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

  it("Renders default tab state", async () => {
    const { id, quote } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    expect(getByTestId(`supplierType-${quote.supplierType}`)).toBeChecked();
    expect(getByTestId(`assetTypeCategory`)).toHaveValue(
      quote.assetTypeCategory
    );
    expect(getByTestId(`manufactureYear`)).toHaveValue(
      `${quote.assetManufactureYear}`
    );
  });

  it("Successfully validates and submits security with glass guide", async () => {
    const { id, quote } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    mockAdapter.onPost(new RegExp("/vehicle/glass-guides/check")).reply(200, {
      data: true,
    });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/year-list"))
      .reply(200, {
        data: yearList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/make-list"))
      .networkErrorOnce();

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/model-list"))
      .reply(200, {
        data: modelList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/variant-list"))
      .reply(200, {
        data: variantList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/series-list"))
      .reply(200, {
        data: seriesList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/nvic-list"))
      .reply(200, {
        data: nvicList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/nvic-option-list"))
      .reply(200, {
        data: nvicOptionList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/details-specification-list"))
      .reply(200, {
        data: [detailsSpec],
      });

    const { getByTestId, queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(mockAdapter.history.post.length).toBe(1);

      expect(getByTestId(`supplierType-${quote.supplierType}`)).toBeChecked();
      expect(getByTestId("assetTypeCategory")).toHaveValue(
        quote.assetTypeCategory
      );
      expect(getByTestId("assetType")).toHaveValue(quote.assetType);

      expect(getByTestId("GLASS_GUIDE-button")).toBeInTheDocument();
    });

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(getByTestId("supplierName-error")).toBeInTheDocument();
      expect(getByTestId("usageType-error")).toBeInTheDocument();
      expect(getByTestId("make-error")).toBeInTheDocument();
      expect(getByTestId("model-error")).toBeInTheDocument();
      expect(getByTestId("validation-error-message")).toBeInTheDocument();
    });

    userEvent.type(getByTestId("supplierName"), input.supplierName);
    userEvent.click(getByTestId(`usageType-${input.usageType}-label`));

    userEvent.click(getByTestId("GLASS_GUIDE-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(3);
      expect(getByTestId("glass-guide-modal")).toBeInTheDocument();
      expect(getByTestId("notification")).toBeInTheDocument();
    });

    userEvent.click(getByTestId("cancel-glass-guide-modal"));

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/make-list"))
      .replyOnce(200, {
        data: makeList,
      });

    userEvent.click(getByTestId("GLASS_GUIDE-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(5);
      expect(getByTestId("glass-guide-modal")).toBeInTheDocument();
    });

    userEvent.selectOptions(
      getByTestId("manufacturerCode"),
      glassGuideInput.manufacturerCode
    );

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(6);
      expect(getByTestId("familyCode")).toBeEnabled();
    });

    userEvent.selectOptions(
      getByTestId("familyCode"),
      glassGuideInput.familyCode
    );

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(7);
      expect(getByTestId("variantName")).toBeEnabled();
    });

    userEvent.selectOptions(
      getByTestId("variantName"),
      glassGuideInput.variantName
    );

    await waitFor(() => {
      // By the time users selects the variant, we will fetch both series-list and nvic-list endpoints
      expect(mockAdapter.history.post.length).toBe(9);
      expect(getByTestId("seriesCode")).toBeEnabled();
    });

    userEvent.selectOptions(
      getByTestId("seriesCode"),
      glassGuideInput.seriesCode
    );

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(11);
      expect(getByTestId("nvic")).toBeEnabled();
    });

    userEvent.selectOptions(getByTestId("nvic"), glassGuideInput.nvic);

    await waitFor(() => {
      // By the time users selects the nvic, we will fetch both nvic-option-list and details-specification-list
      expect(mockAdapter.history.post.length).toBe(13);
      expect(getByTestId("glass-guide-table")).toBeInTheDocument();
      expect(getByTestId("rrp")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec.rrp)}`
      );
      expect(getByTestId("trade")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec.trade)}`
      );
      expect(getByTestId("retail")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec.retail)}`
      );
      expect(getByTestId("optionsRrpValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec.optionsRrpValue)}`
      );
      expect(getByTestId("optionsTradeValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec.optionsTradeValue)}`
      );
      expect(getByTestId("optionsRetailValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec.optionsRetailValue)}`
      );
      expect(getByTestId("adjustedRrpValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec.adjustedRrpValue)}`
      );
      expect(getByTestId("adjustedTradeValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec.adjustedTradeValue)}`
      );
      expect(getByTestId("adjustedRetailValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec.adjustedRetailValue)}`
      );
    });

    userEvent.click(getByTestId("select-glass-guide-modal"));

    expect(getByTestId("manufactureYear")).toBeDisabled();
    expect(getByTestId("make")).toBeDisabled();
    expect(getByTestId("make")).toHaveValue(makeList[0].name);
    expect(getByTestId("model")).toBeDisabled();
    expect(getByTestId("model")).toHaveValue(nvicList[0].modelName);
    expect(getByTestId("actualKm-security")).toHaveValue(
      Number(detailsSpec.averageKm).toLocaleString("en-AU")
    );
    expect(getByTestId("retailValue")).toHaveValue(
      `$${convertToCurrency(detailsSpec.adjustedRrpValue)}`
    );

    userEvent.type(getByTestId("description"), input.description);

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/securities`))
      .replyOnce(200, mockSecurityResponseData);

    let mockApplicationResponse = {
      ...mockApplicationResponseData.data,
    };

    mockApplicationResponse = {
      ...mockApplicationResponseData.data,
      security: {
        ...mockApplicationResponseData.data.security,
        ...mockSecurityResponseData.data,
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: {
          ...mockApplicationResponse,
        },
      });

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(14);
      expect(mockAdapter.history.get.length).toBe(2);
      expect(queryByTestId("supplierName-error")).not.toBeInTheDocument();
      expect(queryByTestId("usageType-error")).not.toBeInTheDocument();
      expect(queryByTestId("make-error")).not.toBeInTheDocument();
      expect(queryByTestId("model-error")).not.toBeInTheDocument();
      expect(queryByTestId("validation-error-message")).not.toBeInTheDocument();
    });
  });

  it("Successfully switch from `NEW` to `USED` usageType", async () => {
    let mockApplicationResponse = {
      ...mockApplicationResponseData.data,
    };

    mockApplicationResponse = {
      ...mockApplicationResponseData.data,
      security: {
        ...mockApplicationResponseData.data.security,
        ...mockSecurityResponseData.data,
      },
    };

    const { id, quote } = mockApplicationResponse;

    const inputSecurity = {
      ...input,
      usageType: USAGE_TYPES.USED,
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: mockApplicationResponse,
      });

    mockAdapter.onPost(new RegExp("/vehicle/glass-guides/check")).reply(200, {
      data: true,
    });

    const { getByTestId, findByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(mockAdapter.history.post.length).toBe(1);
    });

    expect(getByTestId(`supplierType-${quote.supplierType}`)).toBeChecked();
    expect(getByTestId("assetTypeCategory")).toHaveValue(
      quote.assetTypeCategory
    );
    expect(getByTestId("assetType")).toHaveValue(quote.assetType);

    expect(await findByTestId("GLASS_GUIDE-button")).toBeInTheDocument();

    userEvent.click(getByTestId(`usageType-${inputSecurity.usageType}-label`));
    expect(getByTestId(`usageType-${inputSecurity.usageType}`)).toBeChecked();

    expect(getByTestId("manufactureYear")).toBeDisabled();
    expect(getByTestId("make")).toBeDisabled();
    expect(getByTestId("make")).toHaveValue(makeList[0].name);
    expect(getByTestId("model")).toBeDisabled();
    expect(getByTestId("model")).toHaveValue(nvicList[0].modelName);
    expect(getByTestId("actualKm-security")).toHaveValue(
      Number(detailsSpec.averageKm).toLocaleString("en-AU")
    );
    expect(getByTestId("retailValue")).toHaveValue(
      `$${convertToCurrency(detailsSpec.adjustedRetailValue)}`
    );

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/securities`))
      .replyOnce(200, {
        data: {
          ...mockSecurityResponseData.data,
          usageType: inputSecurity.usageType,
        },
      });

    mockApplicationResponse = {
      ...mockApplicationResponseData.data,
      security: {
        ...mockApplicationResponse.security,
        usageType: inputSecurity.usageType,
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: {
          ...mockApplicationResponse,
        },
      });

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(2);
      expect(mockAdapter.history.get.length).toBe(2);
    });
  });

  it("Successfully switch from glass' guide to manual input type", async () => {
    let mockApplicationResponse = {
      ...mockApplicationResponseData.data,
    };

    mockApplicationResponse = {
      ...mockApplicationResponseData.data,
      security: {
        ...mockApplicationResponseData.data.security,
        ...mockSecurityResponseData.data,
        usageType: USAGE_TYPES.USED,
        retailValue: mockSecurityResponseData.data.adjustedRetailValue,
      },
    };

    const { id, quote } = mockApplicationResponse;

    const inputSecurity = {
      ...input,
      usageType: USAGE_TYPES.USED,
      securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
      actualKm: "10000",
      make: "Test make",
      model: "Test model",
      description: "",
      retailValue: mockApplicationResponse.security.retailValue,
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: mockApplicationResponse,
      });

    mockAdapter.onPost(new RegExp("/vehicle/glass-guides/check")).reply(200, {
      data: true,
    });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(mockAdapter.history.post.length).toBe(1);
      expect(
        getByTestId(`${inputSecurity.securityDetailsInputType}-button`)
      ).toBeInTheDocument();
      expect(getByTestId(`supplierType-${quote.supplierType}`)).toBeChecked();
      expect(getByTestId("assetTypeCategory")).toHaveValue(
        quote.assetTypeCategory
      );
      expect(getByTestId("assetType")).toHaveValue(quote.assetType);
    });

    userEvent.click(
      getByTestId(`${inputSecurity.securityDetailsInputType}-button`)
    );

    expect(getByTestId("manufactureYear")).toBeEnabled();

    expect(getByTestId("make")).toBeEnabled();
    userEvent.clear(getByTestId("make"));
    userEvent.type(getByTestId("make"), inputSecurity.make);

    expect(getByTestId("model")).toBeEnabled();
    userEvent.clear(getByTestId("model"));
    userEvent.type(getByTestId("model"), inputSecurity.model);

    expect(getByTestId("actualKm-security")).toBeEnabled();
    userEvent.clear(getByTestId("actualKm-security"));
    userEvent.type(getByTestId("actualKm-security"), inputSecurity.actualKm);

    expect(getByTestId("retailValue")).not.toBeVisible();

    const mockSecurityResponse = {
      ...mockSecurityResponseData.data,
      securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
      make: inputSecurity.make,
      model: inputSecurity.model,
      actualKm: parseNumber(inputSecurity.actualKm),
    };

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/securities`))
      .replyOnce(200, {
        data: mockSecurityResponse,
      });

    mockApplicationResponse = {
      ...mockApplicationResponseData.data,
      security: {
        ...mockApplicationResponse.security,
        securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
        make: inputSecurity.make,
        model: inputSecurity.model,
        actualKm: parseNumber(inputSecurity.actualKm),
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: {
          ...mockApplicationResponse,
        },
      });

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(2);
      expect(JSON.parse(mockAdapter.history.post[1].data)).toMatchObject({
        ...inputSecurity,
        actualKm: parseNumber(inputSecurity.actualKm),
        manufactureYear: parseNumber(inputSecurity.manufactureYear),
        retailValue: inputSecurity.retailValue,
      });
      expect(mockAdapter.history.get.length).toBe(2);
    });
  });

  it("Successfully change values from glass' guide", async () => {
    let mockApplicationResponse = {
      ...mockApplicationResponseData.data,
    };

    mockApplicationResponse = {
      ...mockApplicationResponseData.data,
      security: {
        ...mockApplicationResponseData.data.security,
        ...mockSecurityResponseData.data,
        usageType: USAGE_TYPES.USED,
        retailValue: mockSecurityResponseData.data.adjustedRetailValue,
      },
    };

    const { id, quote } = mockApplicationResponse;

    const inputSecurity = {
      ...input,
      usageType: USAGE_TYPES.USED,
      securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP,
      actualKm: "10000",
      make: "Test make",
      model: "Test model",
      description: "",
      retailValue: mockApplicationResponse.security.retailValue,
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: mockApplicationResponse,
      });

    mockAdapter.onPost(new RegExp("/vehicle/glass-guides/check")).reply(200, {
      data: true,
    });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/year-list"))
      .reply(200, {
        data: yearList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/make-list"))
      .reply(200, {
        data: makeList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/model-list"))
      .reply(200, {
        data: modelList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/variant-list"))
      .reply(200, {
        data: variantList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/series-list"))
      .reply(200, {
        data: seriesList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/nvic-list"))
      .reply(200, {
        data: nvicList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/nvic-option-list"))
      .reply(200, {
        data: nvicOptionList,
      });

    mockAdapter
      .onPost(new RegExp("/vehicle/glass-guides/details-specification-list"))
      .reply(200, {
        data: [detailsSpec2],
      });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(mockAdapter.history.post.length).toBe(1);
      expect(
        getByTestId(`${inputSecurity.securityDetailsInputType}-button`)
      ).toBeInTheDocument();
      expect(getByTestId(`supplierType-${quote.supplierType}`)).toBeChecked();
      expect(getByTestId("assetTypeCategory")).toHaveValue(
        quote.assetTypeCategory
      );
      expect(getByTestId("assetType")).toHaveValue(quote.assetType);
    });

    expect(getByTestId("make")).toHaveValue(
      mockApplicationResponse.security.make
    );

    expect(getByTestId("model")).toHaveValue(
      mockApplicationResponse.security.model
    );

    userEvent.click(
      getByTestId(`${inputSecurity.securityDetailsInputType}-button`)
    );

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(8);
      expect(getByTestId("glass-guide-modal")).toBeInTheDocument();
    });

    userEvent.selectOptions(
      getByTestId("manufacturerCode"),
      glassGuideInput2.manufacturerCode
    );

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(9);
      expect(getByTestId("familyCode")).toBeEnabled();
    });

    userEvent.selectOptions(
      getByTestId("familyCode"),
      glassGuideInput2.familyCode
    );

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(10);
      expect(getByTestId("variantName")).toBeEnabled();
    });

    userEvent.selectOptions(
      getByTestId("variantName"),
      glassGuideInput2.variantName
    );

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(12);
      expect(getByTestId("seriesCode")).toBeEnabled();
    });

    userEvent.selectOptions(
      getByTestId("seriesCode"),
      glassGuideInput2.seriesCode
    );

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(14);
      expect(getByTestId("nvic")).toBeEnabled();
    });

    userEvent.selectOptions(getByTestId("nvic"), glassGuideInput2.nvic);

    await waitFor(() => {
      // By the time users selects the nvic, we will fetch both nvic-option-list and details-specification-list
      expect(mockAdapter.history.post.length).toBe(16);
      expect(getByTestId("glass-guide-table")).toBeInTheDocument();
      expect(getByTestId("rrp")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec2.rrp)}`
      );
      expect(getByTestId("trade")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec2.trade)}`
      );
      expect(getByTestId("retail")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec2.retail)}`
      );
      expect(getByTestId("optionsRrpValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec2.optionsRrpValue)}`
      );
      expect(getByTestId("optionsTradeValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec2.optionsTradeValue)}`
      );
      expect(getByTestId("optionsRetailValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec2.optionsRetailValue)}`
      );
      expect(getByTestId("adjustedRrpValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec2.adjustedRrpValue)}`
      );
      expect(getByTestId("adjustedTradeValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec2.adjustedTradeValue)}`
      );
      expect(getByTestId("adjustedRetailValue")).toHaveTextContent(
        `$${convertToCurrency(detailsSpec2.adjustedRetailValue)}`
      );
    });

    userEvent.click(getByTestId("select-glass-guide-modal"));

    expect(getByTestId("manufactureYear")).toBeDisabled();
    expect(getByTestId("make")).toBeDisabled();
    expect(getByTestId("make")).toHaveValue(makeList[1].name);
    expect(getByTestId("model")).toBeDisabled();
    expect(getByTestId("model")).toHaveValue(nvicList[1].modelName);
    expect(getByTestId("actualKm-security")).toHaveValue(
      Number(detailsSpec2.averageKm).toLocaleString("en-AU")
    );

    expect(getByTestId("retailValue")).toHaveValue(
      `$${convertToCurrency(detailsSpec2.retail)}`
    );
  });

  it("Save and exits existing application with security - WITH CHANGES - success", async () => {
    let mockApplicationResponse = {
      ...mockApplicationResponseData.data,
    };

    mockApplicationResponse = {
      ...mockApplicationResponseData.data,
      security: {
        ...mockApplicationResponseData.data.security,
        ...mockSecurityResponseData.data,
        usageType: USAGE_TYPES.USED,
        securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
        actualKm: 15000,
        retailValue: mockSecurityResponseData.data.adjustedRetailValue,
      },
    };

    const { id } = mockApplicationResponse;

    const inputSecurity = {
      ...input,
      make: mockApplicationResponse.security.make,
      model: mockApplicationResponse.security.model,
      usageType: USAGE_TYPES.USED,
      manufactureYear: mockApplicationResponse.security.manufactureYear,
      actualKm: mockApplicationResponse.security.actualKm,
      securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
      description: "This is a new type of trailer",
      retailValue: mockApplicationResponse.security.retailValue,
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: mockApplicationResponse,
      });

    mockAdapter.onPost(new RegExp("/vehicle/glass-guides/check")).reply(200, {
      data: true,
    });

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/securities`))
      .replyOnce(200, {
        data: {
          ...mockSecurityResponseData,
          description: inputSecurity.description,
        },
      });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(mockAdapter.history.post.length).toBe(1);
      expect(
        getByTestId(`${inputSecurity.securityDetailsInputType}-button`)
      ).toBeInTheDocument();
    });

    userEvent.clear(getByTestId("description"));
    userEvent.type(getByTestId("description"), "This is a new type of trailer");

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: {
          ...mockApplicationResponse,
          security: {
            ...mockApplicationResponse.security,
            description: inputSecurity.description,
          },
        },
      });

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(2);
      expect(JSON.parse(mockAdapter.history.post[1].data)).toMatchObject({
        ...inputSecurity,
      });
      expect(mockAdapter.history.get.length).toBe(2);
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
    });
  });

  it("Save and exits existing application with security - WITH CHANGES - network error", async () => {
    let mockApplicationResponse = {
      ...mockApplicationResponseData.data,
    };

    mockApplicationResponse = {
      ...mockApplicationResponseData.data,
      security: {
        ...mockApplicationResponseData.data.security,
        ...mockSecurityResponseData.data,
        usageType: USAGE_TYPES.USED,
        securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
        actualKm: 15000,
        retailValue: mockSecurityResponseData.data.adjustedRetailValue,
      },
    };

    const { id } = mockApplicationResponse;

    const inputSecurity = {
      ...input,
      make: mockApplicationResponse.security.make,
      model: mockApplicationResponse.security.model,
      usageType: USAGE_TYPES.USED,
      manufactureYear: mockApplicationResponse.security.manufactureYear,
      actualKm: mockApplicationResponse.security.actualKm,
      securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
      description: "This is a new type of trailer",
      retailValue: mockApplicationResponse.security.retailValue,
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: mockApplicationResponse,
      });

    mockAdapter.onPost(new RegExp("/vehicle/glass-guides/check")).reply(200, {
      data: true,
    });

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/securities`))
      .networkErrorOnce();

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(mockAdapter.history.post.length).toBe(1);
      expect(
        getByTestId(`${inputSecurity.securityDetailsInputType}-button`)
      ).toBeInTheDocument();
    });

    userEvent.clear(getByTestId("description"));
    userEvent.type(getByTestId("description"), "This is a new type of trailer");

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: {
          ...mockApplicationResponse,
          security: {
            ...mockApplicationResponse.security,
            description: inputSecurity.description,
          },
        },
      });

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(() => {
      const notification = getByTestId("notification");
      const { getByText } = within(notification);
      expect(notification).toBeInTheDocument();
      expect(getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("Save and exits existing application with security - WITHOUT CHANGES", async () => {
    const { id } = mockApplicationResponseData.data;

    const updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        security: mockSecurityResponseData,
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .reply(200, updatedApplication);

    mockAdapter.onPost(new RegExp("/vehicle/glass-guides/check")).reply(200, {
      data: true,
    });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(mockAdapter.history.post.length).toBe(1);
    });

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
    });
  });

  it("Amend application - cancel", async () => {
    const { cancelBtn } = await amendmentScenario();
    userEvent.click(cancelBtn);

    const { queryByTestId, getByTestId } = screen;

    expect(getByTestId("guarantors-step")).toBeInTheDocument();
    expect(
      queryByTestId("amendment-confirmation-modal")
    ).not.toBeInTheDocument();
  });

  it("Amend application - proceed with change", async () => {
    const { confirmBtn } = await amendmentScenario();
    userEvent.click(confirmBtn);

    const { queryByTestId, getByTestId } = screen;

    await waitFor(() => {
      expect(getByTestId("guarantors-step")).toBeInTheDocument();
      expect(mockAdapter.history.post).toHaveLength(2);
      expect(
        queryByTestId("amendment-confirmation-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("Triggers modal security when updating certain fields", async () => {
    let mockApplicationResponse = {
      ...mockApplicationResponseData.data,
    };

    mockApplicationResponse = {
      ...mockApplicationResponseData.data,
      security: {
        ...mockApplicationResponseData.data.security,
        ...mockSecurityResponseData.data,
        usageType: USAGE_TYPES.USED,
        securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
        actualKm: 15000,
        retailValue: mockSecurityResponseData.data.adjustedRetailValue,
      },
    };

    const { id } = mockApplicationResponse;

    const inputSecurity = {
      ...input,
      make: mockApplicationResponse.security.make,
      model: mockApplicationResponse.security.model,
      usageType: USAGE_TYPES.USED,
      manufactureYear: mockApplicationResponse.security.manufactureYear,
      actualKm: mockApplicationResponse.security.actualKm,
      securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.MANUAL,
      description: "This is a new type of trailer",
      retailValue: mockApplicationResponse.security.retailValue,
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: mockApplicationResponse,
      });

    mockAdapter.onPost(new RegExp("/vehicle/glass-guides/check")).reply(200, {
      data: true,
    });

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/securities`))
      .replyOnce(200, {
        data: {
          ...mockSecurityResponseData,
          description: inputSecurity.description,
        },
      });

    const { getByTestId, queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(mockAdapter.history.post.length).toBe(1);
      expect(
        getByTestId(`${inputSecurity.securityDetailsInputType}-button`)
      ).toBeInTheDocument();
      expect(queryByTestId("modal-security-edit")).not.toBeInTheDocument();
    });

    const supplierName = getByTestId("supplierName");
    userEvent.clear(supplierName);
    userEvent.type(supplierName, "Test supplier");
    userEvent.click(getByTestId("supplierType-PRIVATE-label"));

    expect(getByTestId("modal-security-edit")).toBeInTheDocument();

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: {
          ...mockApplicationResponse,
          security: {
            ...mockApplicationResponse.security,
            supplierName: "Test supplier",
          },
        },
      });

    userEvent.click(getByTestId("modal-security-edit"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(2);
      expect(getByTestId(`quotes-screen`)).toBeInTheDocument();
    });
  });
});

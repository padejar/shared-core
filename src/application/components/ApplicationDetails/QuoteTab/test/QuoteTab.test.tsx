import React from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { Store } from "@reduxjs/toolkit";
import { screen, within } from "@testing-library/dom";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";
import _ from "lodash";
import { Provider } from "react-redux";
import { Router, Route, Redirect } from "react-router-dom";
import { axiosInstance } from "../../../../../common/services/APIService";
import { convertToCurrency } from "../../../../../common/utils/number";
import { extractProperties } from "../../../../../common/utils/object";
import { reduxSagaSetup } from "../../../../../common/utils/testing";
import {
  errorHandlerReducers,
  errorHandlerSagas,
  DEFAULT_ERROR_MESSAGE,
} from "../../../../../error-handler";
import {
  reducer as notificationReducers,
  Notification,
} from "../../../../../notification";
import { AMOUNT_TYPES } from "../../../../constants/amountTypes";
import { APPLICATION_STATUSES } from "../../../../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../../../../constants/applicationSteps";
import {
  ASSET_TYPE_CATEGORIES,
  ASSET_TYPE_LIST,
  CARS_AND_LIGHT_TRUCKS,
  DISABLED_ASSET_TYPE_LIST,
} from "../../../../constants/assetTypes";
import {
  QUOTE_MIN_PURCHASE_AMOUNT,
  QUOTE_MIN_ASSET_MODEL_YEAR,
} from "../../../../constants/quote";
import {
  SUPPLIER_TYPES,
  SUPPLIER_TYPE_LABELS,
} from "../../../../constants/supplierTypes";
import { applicationSagas } from "../../../../index";
import applicationReducers from "../../../../reducers";
import {
  QuoteCalculateRequest,
  quoteCalculateRequestDefaultValue,
} from "../../../../types/QuoteCalculateRequest";
import { QuoteCalculateResponse } from "../../../../types/QuoteCalculateResponse";
import Application from "../../index";
import {
  savedApplication,
  quoteDataSet1,
  quoteDataSet2,
  calculateResp,
  QuoteFormFields,
} from "./mock-data";

const quoteCalculateReqKeys = Object.keys(quoteCalculateRequestDefaultValue);

describe("Application Quote Tab", () => {
  const calculateEndpoint = "/application/quotes/calculate";
  const applicationsListTestId = "applications-list";
  const applicantTabTestId = "applicant-tab";
  const mockApi = new MockAdapter(axiosInstance);
  const history = createMemoryHistory();
  let appStore: Store;

  const validateQuoteSummaryDefaultState = async (
    quoteSummary: QuoteCalculateResponse
  ) => {
    const balloonNominal = await screen.findAllByTestId("balloonNominal");

    expect(screen.getByTestId("installmentAmount")).toHaveTextContent(
      `$${convertToCurrency(quoteSummary.installmentAmount)}`
    );
    expect(screen.getByTestId("firstInstallmentAmount")).toHaveTextContent(
      `$${convertToCurrency(quoteSummary.firstInstallmentAmount)}`
    );
    expect(balloonNominal[1]).toHaveTextContent(
      `$${convertToCurrency(quoteSummary.balloonNominal)}`
    );
    expect(screen.getByTestId("amountFinanced")).toHaveTextContent(
      `$${convertToCurrency(quoteSummary.amountFinanced)}`
    );
    expect(screen.getByTestId("applicationFee")).toHaveTextContent(
      `$${convertToCurrency(quoteSummary.applicationFee)}`
    );
    expect(screen.getByTestId("totalPaymentToBrokerWithGst")).toHaveTextContent(
      `$${convertToCurrency(quoteSummary.totalPaymentToBrokerWithGst)}`
    );
  };

  const fillQuoteFields = async (quote: QuoteFormFields) => {
    const { getByTestId, findAllByTestId } = screen;
    const balloonNominal = await findAllByTestId("balloonNominal");

    userEvent.selectOptions(
      getByTestId("assetTypeCategory"),
      quote.assetTypeCategory as string
    );
    userEvent.selectOptions(getByTestId("assetType"), quote.assetType);
    userEvent.type(
      getByTestId("assetManufactureYear"),
      `${quote.assetManufactureYear}`
    );
    userEvent.click(getByTestId(`supplierType-${quote.supplierType}`));
    userEvent.click(
      getByTestId(`isPropertyOwner-${quote.isPropertyOwner}-label`)
    );
    userEvent.type(getByTestId("purchaseAmount"), `${quote.purchaseAmount}`);
    userEvent.type(getByTestId("depositAmount"), `${quote.depositAmount}`);
    userEvent.type(getByTestId("tradeInAmount"), `${quote.tradeInAmount}`);
    userEvent.type(
      getByTestId("tradePayoutAmount"),
      `${quote.tradePayoutAmount}`
    );
    userEvent.type(
      getByTestId("brokerOriginationFeeAmount"),
      `${quote.brokerOriginationFeeAmount}`
    );
    userEvent.click(
      getByTestId(`repaymentTermMonth-${quote.repaymentTermMonth}-label`)
    );
    userEvent.click(getByTestId(`includeFees-${quote.includeFees}-label`));

    if (quote.financierRate) {
      userEvent.type(getByTestId("financierRate"), `${quote.financierRate}`);
    }

    if (quote.balloonType === AMOUNT_TYPES.FIXED) {
      userEvent.type(balloonNominal[0], `${quote.balloonAmount}`);
    } else {
      userEvent.type(
        getByTestId("balloonPercentage"),
        `${quote.balloonAmount}`
      );
    }

    if (quote.brokerageType === AMOUNT_TYPES.FIXED) {
      userEvent.type(
        getByTestId("brokerageNominal"),
        `${quote.brokerageAmount}`
      );
    } else {
      userEvent.type(
        getByTestId("brokeragePercentage"),
        `${quote.brokerageAmount}`
      );
    }
  };

  const renderComponent = (applicationId = "new") => {
    const applicationListUrl = "/application/applications";
    return render(
      <Provider store={appStore}>
        <Notification />
        <Router history={history}>
          <Route path="/application/applications/:id/applicant" exact={true}>
            <div data-testid={applicantTabTestId}></div>
          </Route>
          <Route path="/application/applications/:id/quotes" exact={true}>
            <Application
              applicationId={applicationId}
              pageAfterSave={applicationListUrl}
              tabName={APPLICATION_STEPS.quotes}
            />
          </Route>
          <Route path={applicationListUrl} exact={true}>
            <div data-testid={applicationsListTestId}></div>
          </Route>
          <Redirect to={`/application/applications/${applicationId}/quotes`} />
        </Router>
      </Provider>
    );
  };

  const amendmentCommon = async () => {
    const application = _.cloneDeep(savedApplication);
    application.data.status = APPLICATION_STATUSES.SUBMITTED_NEW;
    const { id, quote } = application.data;

    mockApi
      .onGet(`/application/applications/${id}`)
      .replyOnce(200, application);

    mockApi
      .onPost(`/application/applications/${id}/quotes`)
      .replyOnce(200, savedApplication);

    const { getByTestId } = renderComponent(id);
    const purchaseAmount = getByTestId("purchaseAmount");

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(1);
    });

    const updatedPurchaseAmount = quote.purchaseAmount + 123;
    userEvent.clear(purchaseAmount);
    userEvent.paste(purchaseAmount, `${updatedPurchaseAmount}`);

    userEvent.click(getByTestId("save-and-exit-button"));

    expect(getByTestId("amendment-confirmation-modal")).toBeVisible();

    const cancelBtn = getByTestId("amendment-confirmation-modal-cancel");
    const confirmBtn = getByTestId("amendment-confirmation-modal-confirm");
    expect(confirmBtn).toBeVisible();
    expect(cancelBtn).toBeVisible();

    return {
      cancelBtn,
      confirmBtn,
    };
  };

  const randomSelectDisabledAssetType = () => {
    // Randomly select a DISABLED assetType
    const randomOptionIndex = Math.floor(
      Math.random() * (DISABLED_ASSET_TYPE_LIST.length - 0) + 0
    );
    const randomSelectedOption = DISABLED_ASSET_TYPE_LIST[randomOptionIndex];

    // Define which assetTypeCategory the DISABLED assetType belongs to
    const assetTypeCategory = ASSET_TYPE_LIST.find((assetTypeCategory) => {
      const assetType = assetTypeCategory.subTypes.find(
        (assetType) => assetType.value === randomSelectedOption
      );
      return assetType ? assetTypeCategory : undefined;
    });

    return { randomSelectedOption, assetTypeCategory };
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

  it("Page with default state.", async () => {
    const { queryByTestId, findAllByTestId } = renderComponent();

    await waitFor(async () => {
      const balloonNominal = await findAllByTestId("balloonNominal");

      expect(queryByTestId("atc-select")).toHaveProperty("selected", true);
      expect(queryByTestId("assetType")).toHaveValue("");
      expect(queryByTestId("assetManufactureYear")).toHaveValue("");

      Object.keys(SUPPLIER_TYPE_LABELS).forEach((element: string) => {
        expect(queryByTestId(`supplierType-${element}`)).not.toBeChecked();
      });
      expect(queryByTestId("isPropertyOwner-false")).toBeChecked();
      expect(queryByTestId("purchaseAmount")).toHaveValue("");
      expect(queryByTestId("depositAmount")).toHaveValue("");
      expect(queryByTestId("tradeInAmount")).toHaveValue("");
      expect(queryByTestId("tradePayoutAmount")).toHaveValue("");

      expect(balloonNominal[0]).toHaveValue("");
      expect(queryByTestId("brokeragePercentage")).toHaveValue("");
      expect(queryByTestId("brokerageNominal")).toHaveValue("");
      expect(queryByTestId("repaymentTermMonth-60")).toBeChecked();

      expect(queryByTestId("financierRate")).toHaveValue("");
      expect(queryByTestId("financierRate")).toBeDisabled();

      expect(queryByTestId("includeFees-true")).toBeChecked();
      expect(queryByTestId("brokerOriginationFeeAmount")).toHaveValue("");
      expect(queryByTestId("isFinancierRateManual")).not.toBeChecked();

      await validateQuoteSummaryDefaultState({
        installmentAmount: 0,
        firstInstallmentAmount: 0,
        balloonNominal: 0,
        amountFinanced: 0,
        applicationFee: 0,
        totalPaymentToBrokerWithGst: 0,
      } as QuoteCalculateResponse);
    });
  });

  it("Field validations.", async () => {
    const { getByTestId, queryByTestId } = renderComponent();
    const submitBtn = getByTestId("submit-button");
    const manualRateSwitch = getByTestId("isFinancierRateManual-label");

    userEvent.click(manualRateSwitch);
    userEvent.click(submitBtn);

    await waitFor(async () => {
      expect(queryByTestId("validation-error-message")).toBeInTheDocument();
      expect(queryByTestId("financierRate-error")).toBeInTheDocument();
      expect(queryByTestId("assetTypeCategory-error")).toBeInTheDocument();
      expect(queryByTestId("assetType-error")).toBeInTheDocument();
      expect(queryByTestId("assetManufactureYear-error")).toBeInTheDocument();
      expect(queryByTestId("supplierType-error")).toBeInTheDocument();
      expect(queryByTestId("purchaseAmount-error")).toBeInTheDocument();

      await validateQuoteSummaryDefaultState({
        installmentAmount: 0,
        firstInstallmentAmount: 0,
        balloonNominal: 0,
        amountFinanced: 0,
        applicationFee: 0,
        totalPaymentToBrokerWithGst: 0,
      } as QuoteCalculateResponse);
    });

    userEvent.type(getByTestId("purchaseAmount"), "1000");
    userEvent.type(getByTestId("brokerOriginationFeeAmount"), "901");
    userEvent.tab();

    userEvent.type(getByTestId("assetManufactureYear"), "1899");
    userEvent.tab();

    await waitFor(() => {
      const assetManufactureYearError = queryByTestId(
        "assetManufactureYear-error"
      );
      expect(assetManufactureYearError).toBeInTheDocument();
      expect(assetManufactureYearError).toHaveTextContent(
        `Min asset manufacture year is ${QUOTE_MIN_ASSET_MODEL_YEAR}`
      );
    });

    await waitFor(() => {
      expect(queryByTestId("validation-error-message")).toBeInTheDocument();
      expect(queryByTestId("purchaseAmount-error")).toBeInTheDocument();
      expect(queryByTestId("purchaseAmount-error")).toHaveTextContent(
        `Minimum purchase price is $${convertToCurrency(
          QUOTE_MIN_PURCHASE_AMOUNT
        )}`
      );
      expect(
        queryByTestId("brokerOriginationFeeAmount-error")
      ).toBeInTheDocument();
      expect(
        queryByTestId("brokerOriginationFeeAmount-error")
      ).toHaveTextContent("Maximum brokerage origination fee amount is $900");
    });

    userEvent.selectOptions(
      getByTestId("assetTypeCategory"),
      ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS
    );
    userEvent.selectOptions(
      getByTestId("assetType"),
      CARS_AND_LIGHT_TRUCKS.PASSENGER_VEHICLES
    );
    userEvent.type(getByTestId("assetManufactureYear"), "2021");
    userEvent.click(getByTestId(`supplierType-${SUPPLIER_TYPES.DEALER}`));
    userEvent.type(getByTestId("purchaseAmount"), "10000");
    userEvent.type(getByTestId("brokerOriginationFeeAmount"), "900");
    userEvent.click(manualRateSwitch);

    await waitFor(() => {
      expect(queryByTestId("validation-error-message")).not.toBeInTheDocument();
      expect(queryByTestId("assetTypeCategory-error")).not.toBeInTheDocument();
      expect(queryByTestId("assetType-error")).not.toBeInTheDocument();
      expect(
        queryByTestId("assetManufactureYear-error")
      ).not.toBeInTheDocument();
      expect(queryByTestId("supplierType-error")).not.toBeInTheDocument();
      expect(queryByTestId("purchaseAmount-error")).not.toBeInTheDocument();
      expect(queryByTestId("financierRate-error")).not.toBeInTheDocument();
      expect(
        queryByTestId("brokerOriginationFeeAmount-error")
      ).not.toBeInTheDocument();
    });
  });

  it("Quote field formatting.", async () => {
    const { getByTestId } = renderComponent();

    const purchaseAmount = getByTestId("purchaseAmount");
    const purchaseAmountValue = 10001;
    userEvent.type(purchaseAmount, purchaseAmountValue.toString());

    const depositAmount = getByTestId("depositAmount");
    const depositAmountValue = 20002;
    userEvent.type(depositAmount, depositAmountValue.toString());

    const tradeInAmount = getByTestId("tradeInAmount");
    const tradeInAmountValue = 30003;
    userEvent.type(tradeInAmount, tradeInAmountValue.toString());

    const tradePayoutAmount = getByTestId("tradePayoutAmount");
    const tradePayoutAmountValue = 30003;
    userEvent.type(tradePayoutAmount, tradePayoutAmountValue.toString());

    const balloonNominal = await screen.findAllByTestId("balloonNominal");
    const balloonNominalValue = 40004;
    userEvent.type(balloonNominal[0], balloonNominalValue.toString());

    const brokerageNominal = getByTestId("brokerageNominal");
    const brokerageNominalValue = 50005;
    userEvent.type(brokerageNominal, brokerageNominalValue.toString());

    const brokerOrigFeeAmount = getByTestId("brokerOriginationFeeAmount");
    const brokerOrigFeeAmountValue = 50005;
    userEvent.type(brokerOrigFeeAmount, brokerOrigFeeAmountValue.toString());

    userEvent.tab();

    await waitFor(() => {
      expect(purchaseAmount).toHaveValue(
        convertToCurrency(purchaseAmountValue)
      );
      expect(depositAmount).toHaveValue(convertToCurrency(depositAmountValue));
      expect(tradeInAmount).toHaveValue(convertToCurrency(tradeInAmountValue));
      expect(tradePayoutAmount).toHaveValue(
        convertToCurrency(tradePayoutAmountValue)
      );
      expect(balloonNominal[0]).toHaveValue(
        convertToCurrency(balloonNominalValue)
      );
      expect(brokerageNominal).toHaveValue(
        convertToCurrency(brokerageNominalValue)
      );
      expect(brokerOrigFeeAmount).toHaveValue(
        convertToCurrency(brokerOrigFeeAmountValue)
      );
    });
  });

  it("Quote calculate - data set 1.", async () => {
    const { getByTestId } = renderComponent();
    const quote = quoteDataSet1;

    userEvent.click(getByTestId("isFinancierRateManual-label"));
    await fillQuoteFields(quote);

    mockApi.onPost(calculateEndpoint).reply(200);

    await waitFor(() => {
      const recentHistory = [...mockApi.history.post].pop() || {};
      const reqPayload = JSON.parse(recentHistory.data);

      expect(reqPayload).toMatchObject(_.pick(quote, quoteCalculateReqKeys));
    });
  });

  it("Quote calculate - data set 2.", async () => {
    renderComponent();

    await fillQuoteFields(quoteDataSet2);

    mockApi.onPost(calculateEndpoint).reply(200);
    await waitFor(() => {
      const recentHistory = [...mockApi.history.post].pop() || {};
      const reqPayload = JSON.parse(recentHistory.data);

      expect(reqPayload).toMatchObject(
        _.pick(quoteDataSet2, quoteCalculateReqKeys)
      );
    });
  });

  it("Displays quote details in summary section.", async () => {
    mockApi.onPost(calculateEndpoint).reply(200, {
      data: calculateResp,
    });
    renderComponent();

    await fillQuoteFields(quoteDataSet1);

    userEvent.tab();

    await waitFor(async () => validateQuoteSummaryDefaultState(calculateResp));
  });

  it("New application - Save and exit.", async () => {
    const { getByTestId } = renderComponent();
    const { quote } = savedApplication.data;
    await fillQuoteFields(quote);

    mockApi.onPost().reply(200, savedApplication);

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(async () => {
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();

      const { url, data } = mockApi.history.post[0];

      expect(url).toEqual("/application/applications");
      expect(JSON.parse(data)).toMatchObject({
        name: "",
        isDraft: true,
        quote: {
          ..._.pick(quote, quoteCalculateReqKeys),
          isDraft: true,
        },
      });
    });
  });

  it("New application - Save quote details and move to next tab.", async () => {
    const { quote } = savedApplication.data;
    const { getByTestId } = renderComponent();
    await fillQuoteFields(quote);

    mockApi.onPost().reply(200, savedApplication);

    userEvent.click(getByTestId("submit-button"));

    await waitFor(async () => {
      const recentHistory = [...mockApi.history.post].pop() || {};

      expect(recentHistory.url).toEqual("/application/applications");
      expect(getByTestId(applicantTabTestId)).toBeInTheDocument();

      expect(JSON.parse(recentHistory.data)).toMatchObject({
        name: "",
        isDraft: false,
        quote: {
          ..._.pick(quote, quoteCalculateReqKeys),
          isDraft: false,
        },
      });
    });
  });

  it("Handle network error when fetching application details.", async () => {
    const { id } = savedApplication.data;
    mockApi.onGet(`/application/applications/${id}`).networkError();

    const { getByTestId } = renderComponent(id);

    await waitFor(async () => {
      const notif = getByTestId("notification");
      const { getByText } = within(notif);
      expect(notif).toBeInTheDocument();
      expect(getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("Handle network error when saving quote details.", async () => {
    const { id } = savedApplication.data;

    mockApi
      .onGet(`/application/applications/${id}`)
      .replyOnce(200, savedApplication);
    mockApi.onPost(`/application/applications/${id}/quotes`).networkError();

    const { getByTestId } = renderComponent(id);

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(1);
    });

    userEvent.click(getByTestId("submit-button"));

    await waitFor(async () => {
      const notif = getByTestId("notification");
      const { getByText } = within(notif);
      expect(notif).toBeInTheDocument();
      expect(getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("Toggles isFinancierRateManual to always calculate when set to false", async () => {
    const { id, quote } = savedApplication.data;

    const payload = extractProperties(
      quote,
      Object.keys(quoteCalculateRequestDefaultValue)
    ) as QuoteCalculateRequest;

    mockApi.onGet().reply(200, savedApplication);
    mockApi.onPost().reply(200, savedApplication);

    const { getByTestId } = renderComponent(id);

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(1);
    });

    userEvent.click(getByTestId("isFinancierRateManual"));

    await waitFor(async () => {
      expect(getByTestId("financierRate")).toHaveValue("");
    });

    userEvent.click(getByTestId("isFinancierRateManual"));

    // Click the toggle the second time.
    userEvent.click(getByTestId("isFinancierRateManual"));

    await waitFor(async () => {
      expect(getByTestId("financierRate")).toHaveValue("");
    });

    userEvent.click(getByTestId("isFinancierRateManual"));

    await waitFor(async () => {
      expect(mockApi.history.post).toHaveLength(2);
      expect(JSON.parse(mockApi.history.post[1].data)).toEqual({
        ...payload,
        isFinancierRateManual: false,
      });
    });
  });

  it("Existing application - Load application details.", async () => {
    const { id, quote } = savedApplication.data;

    mockApi
      .onGet(`/application/applications/${id}`)
      .replyOnce(200, savedApplication);

    const { getByTestId, findAllByTestId } = renderComponent(id);

    await waitFor(async () => {
      const balloonNominal = await findAllByTestId("balloonNominal");

      expect(getByTestId("assetTypeCategory")).toHaveValue(
        quote.assetTypeCategory
      );
      expect(getByTestId("assetType")).toHaveValue(quote.assetType);
      expect(getByTestId("assetManufactureYear")).toHaveValue(
        `${quote.assetManufactureYear}`
      );

      expect(getByTestId(`supplierType-${quote.supplierType}`)).toBeChecked();
      expect(
        getByTestId(`isPropertyOwner-${quote.isPropertyOwner}`)
      ).toBeChecked();
      expect(getByTestId("purchaseAmount")).toHaveValue(
        `${convertToCurrency(quote.purchaseAmount)}`
      );
      expect(getByTestId("depositAmount")).toHaveValue(
        `${convertToCurrency(quote.depositAmount)}`
      );
      expect(getByTestId("tradeInAmount")).toHaveValue(
        `${convertToCurrency(quote.tradeInAmount)}`
      );
      expect(getByTestId("tradePayoutAmount")).toHaveValue(
        `${convertToCurrency(quote.tradePayoutAmount)}`
      );
      expect(getByTestId("brokerageNominal")).toHaveValue(
        `${quote.brokerageNominal}`
      );
      expect(
        getByTestId(`repaymentTermMonth-${quote.repaymentTermMonth}`)
      ).toBeChecked();
      expect(getByTestId("financierRate")).toHaveValue("");
      expect(getByTestId("financierRate")).toBeDisabled();
      expect(getByTestId("isFinancierRateManual")).not.toBeChecked();

      expect(getByTestId("includeFees-false")).toBeChecked();
      expect(getByTestId("brokerOriginationFeeAmount")).toHaveValue(
        `${quote.brokerOriginationFeeAmount}`
      );
      expect(balloonNominal[0]).toHaveValue(`${quote.balloonAmount}`);
    });
  });

  it("Existing application - Save and exit WITHOUT changes.", async () => {
    const { id } = savedApplication.data;
    const { getByTestId } = renderComponent(id);

    mockApi.onGet().reply(200, savedApplication);

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(async () => {
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
      expect(mockApi.history.post).toHaveLength(0);
    });
  });

  it("Existing application - Save and exit WITH changes.", async () => {
    const { id, quote } = savedApplication.data;

    mockApi
      .onGet(`/application/applications/${id}`)
      .replyOnce(200, savedApplication);

    mockApi
      .onPost(`/application/applications/${id}/quotes`)
      .replyOnce(200, savedApplication);

    const { getByTestId } = renderComponent(id);
    const purchaseAmount = getByTestId("purchaseAmount");

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(1);
    });

    const updatedPurchaseAmount = quote.purchaseAmount + 123;
    userEvent.clear(purchaseAmount);
    userEvent.paste(purchaseAmount, `${updatedPurchaseAmount}`);

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(async () => {
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
      expect(mockApi.history.post).toHaveLength(2);

      const { url, data } = mockApi.history.post[0];
      expect(url).toEqual(`/application/applications/${id}/quotes`);
      expect(JSON.parse(data)).toMatchObject({
        ..._.pick(quote, quoteCalculateReqKeys),
        purchaseAmount: updatedPurchaseAmount,
      });
    });
  });

  it("Existing application - Save and move to next tab.", async () => {
    const { id, quote } = savedApplication.data;

    mockApi
      .onGet(`/application/applications/${id}`)
      .replyOnce(200, savedApplication);

    mockApi
      .onPost(`/application/applications/${id}/quotes`)
      .replyOnce(200, savedApplication);

    const { getByTestId } = renderComponent(id);

    await waitFor(() => {
      expect(mockApi.history.get).toHaveLength(1);
    });

    userEvent.click(getByTestId("submit-button"));

    await waitFor(async () => {
      expect(mockApi.history.post).toHaveLength(1);
      expect(getByTestId(applicantTabTestId)).toBeInTheDocument();

      const { url, data } = mockApi.history.post[0];
      expect(url).toEqual(`/application/applications/${id}/quotes`);
      expect(JSON.parse(data)).toMatchObject(
        _.pick(quote, quoteCalculateReqKeys)
      );
    });
  });

  it("Existing application - Cancel amendment", async () => {
    const { cancelBtn } = await amendmentCommon();

    const { getByTestId, queryByTestId } = screen;
    userEvent.click(cancelBtn);

    expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
    expect(
      queryByTestId("amendment-confirmation-modal")
    ).not.toBeInTheDocument();
  });

  it("Existing application - Proceed with amendment", async () => {
    const { confirmBtn } = await amendmentCommon();

    const { getByTestId, queryByTestId } = screen;
    userEvent.click(confirmBtn);

    waitFor(() => {
      expect(getByTestId(applicantTabTestId)).toBeInTheDocument();
      expect(mockApi.history.post).toHaveLength(1);
      expect(
        queryByTestId("amendment-confirmation-modal")
      ).not.toBeInTheDocument();
    });
  });

  if (DISABLED_ASSET_TYPE_LIST.length > 0) {
    it("Loads empty application and verify disabled assetType is not visible", async () => {
      const {
        assetTypeCategory,
        randomSelectedOption,
      } = randomSelectDisabledAssetType();

      const { getByTestId, queryByTestId } = renderComponent("new");

      userEvent.selectOptions(
        getByTestId("assetTypeCategory"),
        assetTypeCategory.value
      );

      await waitFor(() => {
        const options = getByTestId("assetType").querySelectorAll("option");
        expect(options.length).toBeGreaterThan(1);
        const assetTypeOption = queryByTestId(
          `assetType-${randomSelectedOption}`
        );
        expect(assetTypeOption).not.toBeInTheDocument();
      });
    });

    it("Loads existing application and verify pre-selected disabled assetType is visible", async () => {
      const {
        assetTypeCategory,
        randomSelectedOption,
      } = randomSelectDisabledAssetType();

      const application = _.cloneDeep(savedApplication);
      application.data.quote.assetTypeCategory = assetTypeCategory.value;
      application.data.quote.assetType = randomSelectedOption;
      const { id } = application.data;

      mockApi.onGet(`/application/applications/${id}`).reply(200, application);

      const { queryByTestId } = renderComponent(id);

      await waitFor(() => {
        expect(mockApi.history.get).toHaveLength(1);
        const assetTypeOption = queryByTestId(
          `assetType-${randomSelectedOption}`
        );
        expect(assetTypeOption).toBeInTheDocument();
      });
    });
  }
});

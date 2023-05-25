import React from "react";
import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import { Store } from "@reduxjs/toolkit";
import { screen, within } from "@testing-library/dom";
import { render, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import subtract from "date-fns/sub";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Route, Redirect } from "react-router-dom";
import { ADDRESS_INPUT_TYPES } from "../../../../../address-autocomplete";
import { DEFAULT_DATE_INPUT_FORMAT } from "../../../../../common/constants/date";
import { axiosInstance } from "../../../../../common/services/APIService";
import { dateFormat } from "../../../../../common/utils/date";
import { convertToCurrency } from "../../../../../common/utils/number";
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
import { APPLICATION_STATUSES } from "../../../../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../../../../constants/applicationSteps";
import { GUARANTOR_ASSET_TYPES } from "../../../../constants/guarantorAssetTypes";
import { GUARANTOR_LIABILITY_TYPES } from "../../../../constants/guarantorLiabilityTypes";
import {
  GUARANTOR_MAX_AGE,
  GUARANTOR_MIN_AGE,
} from "../../../../constants/validation";
import { applicationSagas } from "../../../../index";
import applicationReducers from "../../../../reducers";
import { GuarantorAssetLiability } from "../../../../types/Guarantor";
import Application from "../../index";
import {
  applicantAddressInput,
  guarantor1,
  guarantor2,
  GuarantorData,
  mockApplicationResponseData,
  mockGuarantorSaveResponse1,
  mockGuarantorSaveResponse2,
} from "./mock-data";
const currencyOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

jest.setTimeout(10000);

describe("Application Guarantors Tab", () => {
  const mockAdapter = new MockAdapter(axiosInstance);
  const applicationsListTestId = "application-list";
  let appStore: Store;

  const renderComponent = () => {
    const applicationListUrl = "/application/applications";
    const { id } = mockApplicationResponseData.data;
    return render(
      <Provider store={appStore}>
        <Notification />
        <Router>
          <Route path="/application/applications/:id/applicant" exact={true}>
            <div data-testid="applicant-step" />
          </Route>
          <Route path="/application/applications/:id/guarantors" exact={true}>
            <Application
              applicationId={id}
              pageAfterSave={applicationListUrl}
              tabName={APPLICATION_STEPS.guarantors}
            />
          </Route>
          <Route path={applicationListUrl} exact={true}>
            <div data-testid={applicationsListTestId}></div>
          </Route>
          <Redirect to={`/application/applications/${id}/guarantors`} />
        </Router>
      </Provider>
    );
  };

  const amendmentScenario = async () => {
    const application = {
      data: {
        ...mockApplicationResponseData.data,
        status: APPLICATION_STATUSES.SUBMITTED_NEW,
        guarantors: [mockGuarantorSaveResponse1],
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${application.data.id}`))
      .replyOnce(200, application);

    mockAdapter
      .onPost(
        new RegExp(
          `/application/applications/${application.data.id}/guarantors`
        )
      )
      .replyOnce(200, application);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get).toHaveLength(1);
    });

    userEvent.clear(getByTestId("0-mobile"));
    userEvent.paste(getByTestId("0-mobile"), "1312341234");

    userEvent.click(getByTestId("previous-button"));

    expect(getByTestId("amendment-confirmation-modal")).toBeInTheDocument();
    const cancelBtn = getByTestId("amendment-confirmation-modal-cancel");
    const confirmBtn = getByTestId("amendment-confirmation-modal-confirm");
    expect(confirmBtn).toBeVisible();
    expect(cancelBtn).toBeVisible();

    return { cancelBtn, confirmBtn };
  };

  const fillGuarantorsAssetsAndLiabilities = (
    type: "assets" | "liabilities",
    assetsOrLiabilities: {
      type: string;
      amount: number;
    }[],
    guarantorIndex: number
  ) => {
    const { getByTestId } = screen;
    assetsOrLiabilities.forEach((assetOrLiability, index) => {
      if (index > 0) {
        userEvent.click(
          getByTestId(
            `guarantor-${guarantorIndex}-add-${
              type === "assets" ? "asset" : "liability"
            }`
          )
        );
      }
      userEvent.selectOptions(
        getByTestId(`guarantor-${guarantorIndex}-${type}-type-${index}`),
        assetOrLiability.type
      );
      userEvent.type(
        getByTestId(`guarantor-${guarantorIndex}-${type}-amount-${index}`),
        `${assetOrLiability.amount}`
      );
    });
  };

  const assertFinancialSummary = (
    assets: GuarantorAssetLiability[],
    liabilities: GuarantorAssetLiability[],
    index: number
  ) => {
    const { getByTestId } = screen;
    let totalAssets = 0;
    let totalLiabilities = 0;
    let netPosition = 0;

    if (assets.length > 0) {
      totalAssets = assets
        .map((asset) => asset.amount)
        .reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        });
    }

    if (assets.length > 0) {
      totalLiabilities = liabilities
        .map((liability) => liability.amount)
        .reduce((previousValue, currentValue) => {
          return previousValue + currentValue;
        });
    }

    netPosition = totalAssets - totalLiabilities;

    expect(
      getByTestId(`guarantor-${index}-summary-total-assets`)
    ).toHaveTextContent(`$${convertToCurrency(totalAssets, currencyOptions)}`);
    expect(
      getByTestId(`guarantor-${index}-summary-total-liabilities`)
    ).toHaveTextContent(
      `$${convertToCurrency(totalLiabilities, currencyOptions)}`
    );
    expect(
      getByTestId(`guarantor-${index}-summary-net-position`)
    ).toHaveTextContent(`$${convertToCurrency(netPosition, currencyOptions)}`);
  };

  const addGuarantor = (guarantor: GuarantorData, index = 0) => {
    const { getByTestId } = screen;

    userEvent.selectOptions(getByTestId(`${index}-title`), guarantor.title);
    userEvent.type(getByTestId(`${index}-firstName`), guarantor.firstName);
    userEvent.type(
      getByTestId(`${index}-middleName`),
      guarantor.middleName ?? ""
    );
    userEvent.type(getByTestId(`${index}-lastName`), guarantor.lastName);
    userEvent.type(
      getByTestId(`${index}-dateOfBirth`),
      dateFormat(new Date(guarantor.dateOfBirth), DEFAULT_DATE_INPUT_FORMAT)
    );
    userEvent.type(
      getByTestId(`${index}-driverLicenseNumber`),
      guarantor.driverLicenseNumber ?? ""
    );
    userEvent.type(
      getByTestId(`${index}-licenseCardNumber`),
      guarantor.licenseCardNumber
    );
    userEvent.selectOptions(
      getByTestId(`${index}-driverLicenseState`),
      guarantor.driverLicenseState ?? ""
    );
    userEvent.selectOptions(
      getByTestId(`${index}-maritalStatus`),
      guarantor.maritalStatus
    );
    userEvent.type(
      getByTestId(`${index}-dependentNumber`),
      `${guarantor.dependentNumber}`
    );
    userEvent.type(getByTestId(`${index}-mobile`), guarantor.mobile);
    userEvent.type(getByTestId(`${index}-email`), guarantor.email);

    userEvent.click(
      getByTestId(
        `${index}-residentialStatus-${guarantor.residentialStatus}-label`
      )
    );
    expect(
      getByTestId(`${index}-residentialStatus-${guarantor.residentialStatus}`)
    ).toBeChecked();

    if (guarantor.isAddressSameAsApplicant) {
      userEvent.click(
        getByTestId(`${index}-isAddressSameAsApplicant-true-label`)
      );
    } else {
      if (guarantor.addressInputType === ADDRESS_INPUT_TYPES.MANUAL) {
        userEvent.click(
          getByTestId(`guarantor-${index}-addressInputType-label`)
        );

        expect(
          getByTestId(`guarantor-${index}-addressInputType`)
        ).toBeChecked();
        expect(
          getByTestId(`guarantor-${index}-manual-address-input`)
        ).not.toHaveClass("d-none");

        userEvent.type(
          getByTestId(`guarantor-${index}-addressUnitNumber`),
          guarantor.addressUnitNumber
        );
        userEvent.type(
          getByTestId(`guarantor-${index}-addressStreetNumber`),
          guarantor.addressStreetNumber
        );
        userEvent.type(
          getByTestId(`guarantor-${index}-addressStreetName`),
          guarantor.addressStreetName
        );
        userEvent.type(
          getByTestId(`guarantor-${index}-addressSuburb`),
          guarantor.addressSuburb
        );
        userEvent.selectOptions(
          getByTestId(`guarantor-${index}-addressState`),
          guarantor.addressState
        );
        userEvent.type(
          getByTestId(`guarantor-${index}-addressPostcode`),
          guarantor.addressPostcode
        );
      }
    }

    if (guarantor.assets.length > 0) {
      fillGuarantorsAssetsAndLiabilities("assets", guarantor.assets, index);
    }

    if (guarantor.liabilities.length > 0) {
      fillGuarantorsAssetsAndLiabilities(
        "liabilities",
        guarantor.liabilities,
        index
      );
    }

    const hasInvestmentPropertyAsset =
      typeof guarantor.assets.find(
        (asset) => asset.type === GUARANTOR_ASSET_TYPES.INVESTMENT_PROPERTY
      ) !== "undefined";

    if (
      hasInvestmentPropertyAsset &&
      guarantor.investmentPropertyAddressInputType ===
        ADDRESS_INPUT_TYPES.MANUAL
    ) {
      userEvent.click(
        getByTestId(`investment-${index}-addressInputType-label`)
      );

      expect(getByTestId(`investment-0-addressInputType`)).toBeChecked();
      expect(
        getByTestId(`investment-${index}-manual-address-input`)
      ).not.toHaveClass("d-none");

      userEvent.type(
        getByTestId(`investment-0-addressUnitNumber`),
        guarantor.investmentPropertyAddressUnitNumber
      );
      userEvent.type(
        getByTestId(`investment-0-addressStreetNumber`),
        guarantor.investmentPropertyAddressStreetNumber
      );
      userEvent.type(
        getByTestId(`investment-0-addressStreetName`),
        guarantor.investmentPropertyAddressStreetName
      );
      userEvent.type(
        getByTestId(`investment-0-addressSuburb`),
        guarantor.investmentPropertyAddressSuburb
      );
      userEvent.selectOptions(
        getByTestId(`investment-0-addressState`),
        guarantor.investmentPropertyAddressState
      );
      userEvent.type(
        getByTestId(`investment-0-addressPostcode`),
        guarantor.investmentPropertyAddressPostcode
      );
    }

    assertFinancialSummary(guarantor.assets, guarantor.liabilities, index);
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
    mockAdapter.reset();
    cleanup();
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

    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    expect(
      queryByTestId("investment-0-addressUnitNumber")
    ).not.toBeInTheDocument();
    expect(
      queryByTestId("investment-0-addressStreetNumber")
    ).not.toBeInTheDocument();
    expect(
      queryByTestId("investment-0-addressStreetName")
    ).not.toBeInTheDocument();
    expect(queryByTestId("investment-0-addressSuburb")).not.toBeInTheDocument();
    expect(queryByTestId("investment-0-addressState")).not.toBeInTheDocument();
    expect(
      queryByTestId("investment-0-addressPostcode")
    ).not.toBeInTheDocument();
    expect(queryByTestId("add-guarantor")).toBeInTheDocument();
    expect(queryByTestId("guarantor-1")).not.toBeInTheDocument();
  });

  it("validates the form - mandatory fields", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    userEvent.click(getByTestId("guarantor-0-addressInputType-label"));

    userEvent.selectOptions(
      getByTestId("guarantor-0-assets-type-0"),
      GUARANTOR_ASSET_TYPES.CASH
    );
    userEvent.type(getByTestId("guarantor-0-liabilities-amount-0"), "50000");

    userEvent.click(getByTestId("guarantor-0-add-asset"));
    userEvent.click(getByTestId("guarantor-0-add-liability"));

    userEvent.type(getByTestId("guarantor-0-assets-amount-1"), "1000");
    userEvent.selectOptions(
      getByTestId("guarantor-0-liabilities-type-1"),
      GUARANTOR_LIABILITY_TYPES.CREDIT_CARD
    );

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(getByTestId("0-title-error")).toBeInTheDocument();
      expect(getByTestId("0-firstName-error")).toBeInTheDocument();
      expect(getByTestId("0-lastName-error")).toBeInTheDocument();
      expect(getByTestId("0-dateOfBirth-error")).toBeInTheDocument();
      expect(getByTestId("0-maritalStatus-error")).toBeInTheDocument();
      expect(getByTestId("0-dependentNumber-error")).toBeInTheDocument();
      expect(getByTestId("0-mobile-error")).toBeInTheDocument();
      expect(getByTestId("0-email-error")).toBeInTheDocument();
      expect(getByTestId("0-residentialStatus-error")).toBeInTheDocument();
      expect(
        getByTestId("guarantor-0-addressStreetNumber-error")
      ).toBeInTheDocument();
      expect(
        getByTestId("guarantor-0-addressStreetName-error")
      ).toBeInTheDocument();
      expect(
        getByTestId("guarantor-0-addressSuburb-error")
      ).toBeInTheDocument();
      expect(getByTestId("guarantor-0-addressState-error")).toBeInTheDocument();
      expect(
        getByTestId("guarantor-0-addressPostcode-error")
      ).toBeInTheDocument();

      const assetError1 = getByTestId("guarantor-0-assets-amount-0-error");
      expect(assetError1).toBeInTheDocument();
      expect(assetError1).toHaveTextContent("Amount is required");
      const liabilityError1 = getByTestId(
        "guarantor-0-liabilities-amount-0-error"
      );
      expect(liabilityError1).toBeInTheDocument();
      expect(liabilityError1).toHaveTextContent(
        "Type is required when amount is entered"
      );

      const assetError2 = getByTestId("guarantor-0-assets-amount-1-error");
      expect(assetError2).toBeInTheDocument();
      expect(assetError2).toHaveTextContent(
        "Type is required when amount is entered"
      );
      const liabilityError2 = getByTestId(
        "guarantor-0-liabilities-amount-1-error"
      );
      expect(liabilityError2).toBeInTheDocument();
      expect(liabilityError2).toHaveTextContent("Amount is required");

      expect(getByTestId("validation-error-message")).toBeInTheDocument();
    });
  });

  it("validates the form - invalid fields' values", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    userEvent.type(getByTestId("0-mobile"), "23908203");
    userEvent.type(getByTestId("0-email"), "test.com");

    const dateOfBirth = getByTestId("0-dateOfBirth");
    const currentDate = new Date();
    const invalidMinAge = subtract(currentDate, {
      years: GUARANTOR_MIN_AGE - 1,
    });
    userEvent.type(
      dateOfBirth,
      dateFormat(invalidMinAge, DEFAULT_DATE_INPUT_FORMAT)
    );

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      const mobileError = getByTestId("0-mobile-error");
      expect(mobileError).toBeInTheDocument();
      expect(mobileError).toHaveTextContent("Mobile phone number is invalid");

      const emailError = getByTestId("0-email-error");
      expect(emailError).toBeInTheDocument();
      expect(emailError).toHaveTextContent("Email is invalid");

      const dateOfBirthError = getByTestId("0-dateOfBirth-error");
      expect(dateOfBirthError).toBeInTheDocument();
      expect(dateOfBirthError).toHaveTextContent(
        `Minimum age of the guarantor is ${GUARANTOR_MIN_AGE}`
      );

      expect(getByTestId("validation-error-message")).toBeInTheDocument();
    });

    const invalidMaxAge = subtract(currentDate, {
      years: GUARANTOR_MAX_AGE + 1,
    });
    userEvent.clear(dateOfBirth);
    userEvent.type(
      dateOfBirth,
      dateFormat(invalidMaxAge, DEFAULT_DATE_INPUT_FORMAT)
    );

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      const dateOfBirthError = getByTestId("0-dateOfBirth-error");
      expect(dateOfBirthError).toBeInTheDocument();
      expect(dateOfBirthError).toHaveTextContent(
        `Maximum age of the guarantor is ${GUARANTOR_MAX_AGE}`
      );

      expect(getByTestId("validation-error-message")).toBeInTheDocument();
    });
  });

  it("validates inputs' formatting", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    const dateOfBirth = getByTestId("0-dateOfBirth");
    const guarantor0AssetsAmount = getByTestId("guarantor-0-assets-amount-0");
    const mobile = getByTestId("0-mobile");

    userEvent.type(dateOfBirth, "17021995");
    userEvent.type(guarantor0AssetsAmount, "5000");
    userEvent.type(mobile, "0410120411");

    expect(dateOfBirth).toHaveValue("17/02/1995");
    expect(guarantor0AssetsAmount).toHaveValue("5,000");
    expect(mobile).toHaveValue("0410 120 411");
  });

  it("adds #1 guarantor", async () => {
    const { id } = mockApplicationResponseData.data;
    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, mockApplicationResponseData);

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/guarantors`))
      .replyOnce(200, {
        data: {
          guarantors: [mockGuarantorSaveResponse1],
          isDraft: false,
        },
      });

    const { getByTestId, queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(
        queryByTestId("investment-0-addressUnitNumber")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("investment-0-addressStreetNumber")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("investment-0-addressStreetName")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("investment-0-addressSuburb")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("investment-0-addressState")
      ).not.toBeInTheDocument();
      expect(
        queryByTestId("investment-0-addressPostcode")
      ).not.toBeInTheDocument();
      expect(queryByTestId("add-guarantor")).toBeInTheDocument();
      expect(queryByTestId("guarantor-1")).not.toBeInTheDocument();
    });

    addGuarantor(guarantor1);

    expect(queryByTestId("investment-0-addressUnitNumber")).toBeInTheDocument();
    expect(
      queryByTestId("investment-0-addressStreetNumber")
    ).toBeInTheDocument();
    expect(queryByTestId("investment-0-addressStreetName")).toBeInTheDocument();
    expect(queryByTestId("investment-0-addressSuburb")).toBeInTheDocument();
    expect(queryByTestId("investment-0-addressState")).toBeInTheDocument();
    expect(queryByTestId("investment-0-addressPostcode")).toBeInTheDocument();

    const updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        guarantors: [mockGuarantorSaveResponse1],
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post).toHaveLength(1);
      expect(JSON.parse(mockAdapter.history.post[0].data)).toMatchObject({
        guarantors: [guarantor1],
        isDraft: false,
      });
    });
  });

  it("adds #2 guarantor and updates guarantor #1", async () => {
    const { id } = mockApplicationResponseData.data;

    const assets = [...guarantor1.assets];
    assets.pop();

    let updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        guarantors: [mockGuarantorSaveResponse1],
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/guarantors`))
      .replyOnce(200, {
        data: {
          guarantors: [mockGuarantorSaveResponse1],
          isDraft: false,
        },
      });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
      expect(getByTestId("investment-0-addressUnitNumber")).toBeInTheDocument();
      expect(
        getByTestId("investment-0-addressStreetNumber")
      ).toBeInTheDocument();
      expect(getByTestId("investment-0-addressStreetName")).toBeInTheDocument();
      expect(getByTestId("investment-0-addressSuburb")).toBeInTheDocument();
      expect(getByTestId("investment-0-addressState")).toBeInTheDocument();
      expect(getByTestId("investment-0-addressPostcode")).toBeInTheDocument();
    });

    userEvent.click(getByTestId("delete-guarantor-0-assets-2"));

    userEvent.click(getByTestId("add-guarantor"));

    addGuarantor(guarantor2, 1);

    updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        guarantors: [mockGuarantorSaveResponse1, mockGuarantorSaveResponse2],
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post).toHaveLength(1);
      expect(JSON.parse(mockAdapter.history.post[0].data)).toMatchObject({
        guarantors: [
          {
            ...guarantor1,
            id: "1",
            assets,
            investmentPropertyAddressPostcode: "",
            investmentPropertyAddressState: "",
            investmentPropertyAddressStreetName: "",
            investmentPropertyAddressStreetNumber: "",
            investmentPropertyAddressSuburb: "",
            investmentPropertyAddressUnitNumber: "",
          },
          guarantor2,
        ],
        isDraft: false,
      });
    });
  });

  it("deletes guarantor #2", async () => {
    const { id } = mockApplicationResponseData.data;

    const updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        guarantors: [mockGuarantorSaveResponse1, mockGuarantorSaveResponse2],
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/guarantors`))
      .replyOnce(200, {
        data: {
          guarantors: [mockGuarantorSaveResponse1],
          isDraft: false,
        },
      });

    const { getByTestId, queryByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    const deleteGuarantor2 = queryByTestId("delete-guarantor-1");
    expect(deleteGuarantor2).toBeInTheDocument();
    userEvent.click(deleteGuarantor2 as HTMLElement);

    expect(getByTestId("guarantor-delete-confirmation")).toBeVisible();
    expect(getByTestId("confirm-delete-guarantor-1")).toBeVisible();

    userEvent.click(getByTestId("confirm-delete-guarantor-1"));

    await waitFor(() => {
      expect(deleteGuarantor2).not.toBeInTheDocument();
      expect(queryByTestId("guarantor-1")).not.toBeInTheDocument();
    });

    userEvent.click(getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post).toHaveLength(1);
      expect(
        JSON.parse(mockAdapter.history.post[0].data).guarantors
      ).toHaveLength(1);
    });
  });

  it("Save and exits existing application with guarantors - WITH CHANGES - success", async () => {
    const { id } = mockApplicationResponseData.data;

    let updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        guarantors: [mockGuarantorSaveResponse1],
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/guarantors`))
      .replyOnce(200, {
        data: {
          guarantors: [mockGuarantorSaveResponse1],
          isDraft: false,
        },
      });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    const mobile = "0410987098";
    const mobileInput = getByTestId("0-mobile");
    userEvent.clear(mobileInput);
    userEvent.type(mobileInput, mobile);

    updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        guarantors: [
          {
            ...mockGuarantorSaveResponse1,
            mobile,
          },
        ],
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(() => {
      expect(mockAdapter.history.post.length).toBe(1);
      expect(JSON.parse(mockAdapter.history.post[0].data)).toMatchObject({
        guarantors: [
          {
            ...guarantor1,
            id: "1",
            mobile,
          },
        ],
        isDraft: true,
      });
      expect(mockAdapter.history.get.length).toBe(2);
      expect(getByTestId(applicationsListTestId)).toBeInTheDocument();
    });
  });

  it("Save and exits existing application with guarantors - WITH CHANGES - network error", async () => {
    const { id } = mockApplicationResponseData.data;

    let updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        guarantors: [mockGuarantorSaveResponse1],
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

    mockAdapter
      .onPost(new RegExp(`/application/applications/${id}/guarantors`))
      .networkErrorOnce();

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get.length).toBe(1);
    });

    const mobile = "0410987098";
    const mobileInput = getByTestId("0-mobile");
    userEvent.clear(mobileInput);
    userEvent.type(mobileInput, mobile);

    updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        guarantors: [
          {
            ...mockGuarantorSaveResponse1,
            mobile,
          },
        ],
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

    userEvent.click(getByTestId("save-and-exit-button"));

    await waitFor(() => {
      const notification = getByTestId("notification");
      const { getByText } = within(notification);
      expect(notification).toBeInTheDocument();
      expect(getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });

  it("Save and exits existing application with guarantors - WITHOUT", async () => {
    const { id } = mockApplicationResponseData.data;

    const updatedApplication = {
      data: {
        ...mockApplicationResponseData.data,
        guarantors: [mockGuarantorSaveResponse1],
      },
    };

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, updatedApplication);

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

    expect(getByTestId("applicant-step")).toBeInTheDocument();
    expect(
      queryByTestId("amendment-confirmation-modal")
    ).not.toBeInTheDocument();
  });

  it("Amend application - proceed with change", async () => {
    const { confirmBtn } = await amendmentScenario();
    userEvent.click(confirmBtn);

    const { queryByTestId, getByTestId } = screen;

    await waitFor(() => {
      expect(getByTestId("applicant-step")).toBeInTheDocument();
      expect(mockAdapter.history.post).toHaveLength(1);
      expect(
        queryByTestId("amendment-confirmation-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("Validates address similarity with applicant", async () => {
    const { id } = mockApplicationResponseData.data;

    mockAdapter
      .onGet(new RegExp(`/application/applications/${id}`))
      .replyOnce(200, {
        data: {
          ...mockApplicationResponseData.data,
          applicant: {
            ...mockApplicationResponseData.data.applicant,
            ...applicantAddressInput,
          },
        },
      });

    const { getByTestId } = renderComponent();

    await waitFor(() => {
      expect(mockAdapter.history.get).toHaveLength(1);
    });

    addGuarantor({
      ...guarantor1,
      isAddressSameAsApplicant: true,
    });

    expect(getByTestId("guarantor-0-addressUnitNumber")).toHaveValue(
      applicantAddressInput.addressUnitNumber
    );
    expect(getByTestId("guarantor-0-addressStreetName")).toHaveValue(
      applicantAddressInput.addressStreetName
    );
    expect(getByTestId("guarantor-0-addressSuburb")).toHaveValue(
      applicantAddressInput.addressSuburb
    );
    expect(getByTestId("guarantor-0-addressState")).toHaveValue(
      applicantAddressInput.addressState
    );
    expect(getByTestId("guarantor-0-addressPostcode")).toHaveValue(
      applicantAddressInput.addressPostcode
    );
    expect(getByTestId("guarantor-0-addressInputType")).toBeChecked();
  });
});

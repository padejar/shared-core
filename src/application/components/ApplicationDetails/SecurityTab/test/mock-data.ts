import { ADDRESS_INPUT_TYPES } from "../../../../../address-autocomplete";
import { numberToString } from "../../../../../common/utils/string";
import { AMOUNT_TYPES } from "../../../../constants/amountTypes";
import { APPLICATION_STATUSES } from "../../../../constants/applicationStatuses";
import {
  ASSET_TYPE_CATEGORIES,
  CARS_AND_LIGHT_TRUCKS,
} from "../../../../constants/assetTypes";
import { REPAYMENT_TERM_OPTIONS } from "../../../../constants/repaymentTermOptions";
import { SECURITY_DETAILS_INPUT_TYPES } from "../../../../constants/securityDetailsInputTypes";
import { SUPPLIER_TYPES } from "../../../../constants/supplierTypes";
import { USAGE_TYPES } from "../../../../constants/usageTypes";
import { noteResponseDefaultValue } from "../../../../types/NoteResponse";

export const mockApplicationResponseData = {
  data: {
    id: "65c50784-45a8-4975-8506-2849b1e50119",
    userId: 6,
    assessmentId: null,
    name: "Test Applicant Name",
    applicationNumber: "QF10362",
    status: APPLICATION_STATUSES.DRAFTED_NEW,
    submittedAt: null,
    quote: {
      id: "700960e5-ff65-4e19-9a08-60f9bf1ce6f0",
      applicationId: "65c50784-45a8-4975-8506-2849b1e50119",
      state: true,
      financeType: "CHATTEL_MORTGAGE",
      assetTypeCategory: ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS as string,
      assetType: CARS_AND_LIGHT_TRUCKS.PASSENGER_VEHICLES as string,
      assetManufactureYear: 2021,
      supplierType: SUPPLIER_TYPES.DEALER as string,
      isPropertyOwner: true,
      purchaseAmount: 50000,
      depositAmount: 0,
      tradeInAmount: 0,
      tradePayoutAmount: 0,
      repaymentTermOption: REPAYMENT_TERM_OPTIONS.MONTHLY as string,
      repaymentTermMonth: 60,
      balloonType: AMOUNT_TYPES.FIXED as string,
      balloonAmount: 0,
      brokerageType: AMOUNT_TYPES.FIXED as string,
      brokerageAmount: 0,
      isFinancierRateManual: false,
      baseRate: 7.5,
      includeFees: false,
      brokerOriginationFeeAmount: 0,
      brokerOriginationFeeAmountWithGst: 0,
      advanceOrArrears: "ADVANCE",
      hasStructuredPayment: false,
      structuredPaymentNthPaymentAmount: 0,
      structuredPaymentAmount: 0,
      firstInstallmentAmount: 1430.18,
      totalPaymentToBroker: 0,
      totalPaymentToBrokerWithGst: 0,
      installmentAmount: 995.68,
      applicationFee: 395,
      applicationFeeWithGst: 434.5,
      balloonNominal: 0,
      brokerageNominal: 0,
      brokerageNominalWithGst: 0,
      financierRate: 7.5,
      customerRate: 7.5,
      amountFinanced: 50000,
    },
    applicant: {
      id: "7fa28802-a315-405e-b46b-65e9e177157c",
      applicationId: "65c50784-45a8-4975-8506-2849b1e50119",
      state: true,
      abn: "66666666666",
      entityName: "Test Applicant Name",
      tradingName: "Test Applicant Trading",
      entityType: "SOLE_TRADER",
      trusteeType: null,
      trusteeName: null,
      trusteeAcn: null,
      abnRegisteredDate: "2018-01-01",
      gstRegisteredDate: "2018-01-01",
      phone: "0465555555",
      industry: "FISHERIES",
      industryType: "FISHING_BUSINESSES",
      addressInputType: ADDRESS_INPUT_TYPES.AUTOCOMPLETE as string,
      addressState: "VIC",
      addressStreetName: "Nicholson St",
      addressStreetNumber: "9",
      addressUnitNumber: "",
      addressSuburb: "Carlton",
      addressPostcode: "3053",
    },
    security: {
      name: "2021",
      id: "6ba521cd-8390-4472-81ef-fbf2975f59a7",
      applicationId: "65c50784-45a8-4975-8506-2849b1e50119",
      state: false,
      supplierType: SUPPLIER_TYPES.DEALER as string,
      supplierName: "",
      usageType: "",
      assetTypeCategory: ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS as string,
      assetType: CARS_AND_LIGHT_TRUCKS.PASSENGER_VEHICLES as string,
      securityDetailsInputType: "",
      manufactureYear: 2021,
      make: "",
      model: "",
      retailValue: 0,
      nvic: "",
      serialNumber: "",
      registrationNumber: "",
      description: "",
      actualKm: 0,
      options: [],
      modelTypeCode: "",
      manufacturerCode: "",
      familyCode: "",
      variantName: "",
      seriesCode: "",
      rrp: 0,
      trade: 0,
      retail: 0,
      kmAdjustmentTradeValue: 0,
      kmAdjustmentRetailValue: 0,
      optionsRrpValue: 0,
      optionsTradeValue: 0,
      optionsRetailValue: 0,
      adjustedRrpValue: 0,
      adjustedTradeValue: 0,
      adjustedRetailValue: 0,
    },
    note: noteResponseDefaultValue,
    guarantors: [
      {
        driverLicenseNumber: "5343534",
        id: "c063d72a-f8cf-4e87-85d5-7cf3662a8d56",
        applicationId: "65c50784-45a8-4975-8506-2849b1e50119",
        state: true,
        title: "MR",
        firstName: "John",
        middleName: null,
        lastName: "Doe",
        dateOfBirth: "1995-02-16",
        driverLicenseState: "NSW",
        maritalStatus: "MARRIED",
        dependentNumber: 1,
        mobile: "0416555555",
        email: "john.doe@customemail.com",
        isAddressSameAsApplicant: true,
        residentialStatus: "OWNING",
        addressInputType: ADDRESS_INPUT_TYPES.AUTOCOMPLETE as string,
        addressState: "VIC",
        addressStreetName: "Nicholson St",
        addressStreetNumber: "9",
        addressUnitNumber: "",
        addressSuburb: "Carlton",
        addressPostcode: "3053",
        assets: [
          {
            type: "PROPERTY",
            amount: 56000,
          },
          {
            type: "INVESTMENT_PROPERTY",
            amount: 152000,
          },
        ],
        liabilities: [
          {
            type: "CREDIT_CARD",
            amount: 58000,
          },
        ],
        investmentPropertyAddressInputType: ADDRESS_INPUT_TYPES.MANUAL,
        investmentPropertyAddressState: "NSW",
        investmentPropertyAddressStreetName: "InvestmentX",
        investmentPropertyAddressStreetNumber: "2",
        investmentPropertyAddressUnitNumber: "24",
        investmentPropertyAddressSuburb: "InvestmentS",
        investmentPropertyAddressPostcode: "4000",
      },
      {
        driverLicenseNumber: "65656565",
        id: "693b4546-47c0-4283-9de6-5765b370b89c",
        applicationId: "65c50784-45a8-4975-8506-2849b1e50119",
        state: true,
        title: "MRS",
        firstName: "Jane",
        middleName: null,
        lastName: "Doe",
        dateOfBirth: "1988-08-16",
        driverLicenseState: "NSW",
        maritalStatus: "MARRIED",
        dependentNumber: 1,
        mobile: "0456666666",
        email: "jane.doe@customemail.com",
        isAddressSameAsApplicant: true,
        residentialStatus: "OWNING",
        addressInputType: ADDRESS_INPUT_TYPES.AUTOCOMPLETE as string,
        addressState: "VIC",
        addressStreetName: "Nicholson St",
        addressStreetNumber: "9",
        addressUnitNumber: "",
        addressSuburb: "Carlton",
        addressPostcode: "3053",
        assets: [
          {
            type: "CASH",
            amount: 56000,
          },
          {
            type: "VEHICLE",
            amount: 45000,
          },
          {
            type: "INVESTMENT_PROPERTY",
            amount: 75000,
          },
        ],
        liabilities: [
          {
            type: "PERSONAL_LOAN",
            amount: 12500,
          },
        ],
        investmentPropertyAddressInputType: ADDRESS_INPUT_TYPES.MANUAL,
        investmentPropertyAddressState: "NSW",
        investmentPropertyAddressStreetName: "InvestmentX",
        investmentPropertyAddressStreetNumber: "2",
        investmentPropertyAddressUnitNumber: "24",
        investmentPropertyAddressSuburb: "InvestmentS",
        investmentPropertyAddressPostcode: "4000",
      },
    ],
    publicStatus: "DRAFTED",
    user: {
      id: 6,
      firstName: "Broker",
      lastName: "Tester",
      email: "broker@quest.finance",
      mobile: "+614112345678",
      client: "Quest Finance Australia Pty Ltd",
    },
  },
};

export const mockSecurityResponseData = {
  data: {
    name:
      "2021 HONDA HONDA HR-V VTi MY21 4D WAGON INLINE 4 1799 cc MPFI CONTINUOUS VARIABLE",
    id: "6ba521cd-8390-4472-81ef-fbf2975f59a7",
    applicationId: "65c50784-45a8-4975-8506-2849b1e50119",
    entityId: 10004,
    state: true,
    supplierType: "DEALER",
    supplierName: "Supplier test",
    usageType: "NEW",
    assetTypeCategory: "CARS_AND_LIGHT_TRUCKS",
    assetType: "PASSENGER_VEHICLES",
    securityDetailsInputType: "GLASS_GUIDE",
    manufactureYear: 2021,
    make: "HONDA",
    model:
      "HONDA HR-V VTi MY21 4D WAGON INLINE 4 1799 cc MPFI CONTINUOUS VARIABLE",
    retailValue: 26900,
    nvic: "079I21",
    serialNumber: "",
    registrationNumber: "",
    description: "",
    actualKm: 15000,
    options: [],
    modelTypeCode: "A",
    manufacturerCode: "HON",
    familyCode: "HRV",
    variantName: "VTi",
    seriesCode: "21",
    rrp: 26900,
    trade: 20400,
    retail: 25200,
    kmAdjustmentTradeValue: 0,
    kmAdjustmentRetailValue: 0,
    optionsRrpValue: 0,
    optionsTradeValue: 0,
    optionsRetailValue: 0,
    adjustedRrpValue: 26900,
    adjustedTradeValue: 20400,
    adjustedRetailValue: 25200,
    createdAt: "2021-11-03T07:39:22.276Z",
    updatedAt: "2021-11-05T04:17:35.814Z",
  },
};

export const input: {
  supplierType: string;
  supplierName: string;
  usageType: string;
  securityDetailsInputType: string;
  assetTypeCategory: string;
  assetType: string;
  manufactureYear: string;
  actualKm: string;
  make: string;
  model: string;
  retailValue: string;
  description: string;
} = {
  supplierType: SUPPLIER_TYPES.DEALER as string,
  supplierName: "Supplier test",
  usageType: USAGE_TYPES.NEW,
  securityDetailsInputType: SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP,
  assetTypeCategory: ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS as string,
  assetType: CARS_AND_LIGHT_TRUCKS.PASSENGER_VEHICLES as string,
  manufactureYear: numberToString(
    mockApplicationResponseData.data.quote.assetManufactureYear
  ),
  actualKm: "",
  make: "",
  model: "",
  retailValue: "",
  description: "Test description",
};

export const glassGuideInput = {
  yearCreate: 2021,
  manufacturerCode: "HON",
  familyCode: "HRV",
  variantName: "VTi",
  seriesCode: "21",
  nvic: "079I21",
};

export const glassGuideInput2 = {
  yearCreate: 2021,
  manufacturerCode: "TOY",
  familyCode: "YAR",
  variantName: "ZR",
  seriesCode: "MX",
  nvic: "09JX21",
};

export const yearList = [2021, 2020, 2018];
export const makeList = [
  {
    code: "HON",
    name: "HONDA",
  },
  {
    code: "TOY",
    name: "TOYOTA",
  },
];
export const modelList = [
  {
    name: "HR-V",
    code: "HRV",
  },
  {
    name: "YARIS",
    code: "YAR",
  },
];
export const variantList = ["VTi", "ZR"];
export const seriesList = [
  {
    name: "MY20",
    code: "20",
  },
  {
    name: "MY21",
    code: "21",
  },
  {
    name: "MXPA10R",
    code: "MX",
  },
];
export const nvicList = [
  {
    nvicCur: "079I21",
    nvicModel: "079I",
    modelName:
      "HONDA HR-V VTi MY21 4D WAGON INLINE 4 1799 cc MPFI CONTINUOUS VARIABLE",
  },
  {
    modelName:
      "TOYOTA YARIS ZR MXPA10R 5D HATCHBACK INLINE 3 1490 cc DMPFI CONTINUOUS VARIABLE",
    nvicCur: "09JX21",
    nvicModel: "09JX",
  },
];
export const nvicOptionList = [
  {
    optionCode: "MP",
    optionName: "Metallic Paint",
    optionType: "O",
    rrpAmount: 650,
    retailAmount: 300,
  },
  {
    optionCode: "PPNT",
    optionName: "Pearlescent Paint",
    optionType: "O",
    rrpAmount: 650,
    retailAmount: 400,
  },
  {
    optionCode: "SOP",
    optionName: "Solid Paint",
    optionType: "N",
    rrpAmount: 0,
    retailAmount: 0,
  },
];
export const detailsSpec = {
  nvicCur: "079I21",
  yearCreate: 2021,
  manufacturerName: "HONDA",
  familyName: "HR-V",
  variantName: "VTi",
  seriesName: "MY21",
  bodyName: "4D WAGON",
  ccName: "1799 cc",
  transmissionName: "CONTINUOUS VARIABLE",
  tradeLow: 17600,
  trade: 20400,
  retail: 25200,
  rrp: 26900,
  averageKm: 15000,
  engineName: "MULTI POINT F/INJ",
  kmAdjustmentTradeValue: 0,
  kmAdjustmentRetailValue: 0,
  optionsRrpValue: 0,
  optionsTradeValue: 0,
  optionsRetailValue: 0,
  adjustedRrpValue: 26900,
  adjustedTradeValue: 20400,
  adjustedRetailValue: 25200,
};

export const detailsSpec2 = {
  adjustedRetailValue: 29500,
  adjustedRrpValue: 30200,
  adjustedTradeValue: 23900,
  averageKm: 14000,
  bodyName: "5D HATCHBACK",
  ccName: "1490 cc",
  engineName: "DIRECT MPFI",
  familyName: "YARIS",
  kmAdjustmentRetailValue: 0,
  kmAdjustmentTradeValue: 0,
  manufacturerName: "TOYOTA",
  nvicCur: "09JX21",
  optionsRetailValue: 0,
  optionsRrpValue: 0,
  optionsTradeValue: 0,
  retail: 29500,
  rrp: 30200,
  seriesName: "MXPA10R",
  trade: 23900,
  tradeLow: 20700,
  transmissionName: "CONTINUOUS VARIABLE",
  variantName: "ZR",
  yearCreate: 2021,
};

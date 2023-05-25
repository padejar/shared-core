import { ADDRESS_INPUT_TYPES } from "../../../../../address-autocomplete";
import { AMOUNT_TYPES } from "../../../../constants/amountTypes";
import {
  APPLICATION_STATUSES,
  APPLICATION_PUBLIC_STATUSES,
} from "../../../../constants/applicationStatuses";
import {
  ASSET_TYPE_CATEGORIES,
  CARS_AND_LIGHT_TRUCKS,
} from "../../../../constants/assetTypes";
import { REPAYMENT_TERM_OPTIONS } from "../../../../constants/repaymentTermOptions";
import { SUPPLIER_TYPES } from "../../../../constants/supplierTypes";
import { ApplicationResponse } from "../../../../types/ApplicationResponse";
import { noteResponseDefaultValue } from "../../../../types/NoteResponse";

export const application: ApplicationResponse = {
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
    assetTypeCategory: ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS,
    assetType: CARS_AND_LIGHT_TRUCKS.PASSENGER_VEHICLES,
    assetManufactureYear: 2021,
    supplierType: SUPPLIER_TYPES.DEALER,
    isPropertyOwner: true,
    purchaseAmount: 50000,
    depositAmount: 0,
    tradeInAmount: 0,
    tradePayoutAmount: 0,
    repaymentTermOption: REPAYMENT_TERM_OPTIONS.MONTHLY,
    repaymentTermMonth: 60,
    balloonType: AMOUNT_TYPES.FIXED,
    balloonAmount: 0,
    brokerageType: AMOUNT_TYPES.FIXED,
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
    addressInputType: ADDRESS_INPUT_TYPES.AUTOCOMPLETE,
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
    state: true,
    supplierType: SUPPLIER_TYPES.DEALER as string,
    supplierName: "OFFICIAL TOYOTA RESELLER",
    usageType: "",
    assetTypeCategory: ASSET_TYPE_CATEGORIES.CARS_AND_LIGHT_TRUCKS as string,
    assetType: CARS_AND_LIGHT_TRUCKS.PASSENGER_VEHICLES as string,
    securityDetailsInputType: null,
    manufactureYear: 2021,
    make: "",
    model: "",
    retailValue: 0,
    nvic: "",
    serialNumber: "1234567890",
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
      licenseCardNumber: "123123",
      id: "c063d72a-f8cf-4e87-85d5-7cf3662a8d56",
      applicationId: "65c50784-45a8-4975-8506-2849b1e50119",
      state: true,
      title: "MR",
      firstName: "John",
      middleName: null,
      lastName: "Doe",
      dateOfBirth: "1995-02-17",
      driverLicenseState: "NSW",
      maritalStatus: "MARRIED",
      dependentNumber: 1,
      mobile: "0416555555",
      email: "john.doe@customemail.com",
      isAddressSameAsApplicant: true,
      residentialStatus: "OWNING",
      addressInputType: ADDRESS_INPUT_TYPES.AUTOCOMPLETE,
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
      licenseCardNumber: "123123",
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
      addressInputType: ADDRESS_INPUT_TYPES.AUTOCOMPLETE,
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
};

export const approvedApplication = {
  ...application,
  publicStatus: APPLICATION_PUBLIC_STATUSES.APPROVED,
  status: APPLICATION_STATUSES.APPROVED_WAITING_FOR_MORE_INFO,
};

export const approvalConditions = Array.from({ length: 5 }, (v, i) => ({
  condition: `Approval condition ${i}`,
  status: null,
}));

export const approver = {
  email: "admin@quest.finance",
  firstName: "Admin",
  lastName: "Quest",
  mobile: "+614112345678",
};

export const settlementDocument = {
  id: "3e8dc4e4-a10f-457b-afa7-001537bf3a21",
  applicationId: application.id,
  createdAt: "2021-11-15T06:59:35.321Z",
  deletedAt: null,
  filename: "dummy-2-d05400ee.pdf",
  originalFilename: "dummy-2.pdf",
  purpose: "SETTLEMENT_DOCUMENT",
  securedSigningId: null,
  type: "NOTE",
  updatedAt: "2021-11-15T06:59:35.321Z",
  versionNumber: null,
};

export const settlementDocuments = Array.from({ length: 5 }, (v, k) => {
  return {
    ...settlementDocument,
    id: settlementDocument.id + k,
    filename: `doc-${k}.docx`,
    originalFilename: `orig-doc-${k}.docx`,
  };
});

export const contract = {
  id: "1ddcf327-fba6-4bb0-90d8-39eafeab8946",
  applicationId: application.id,
  createdAt: "2021-11-15T06:59:11.515Z",
  deletedAt: null,
  filename: "Cypress Test document 2021-11-15 QF14295-contract_pack-1.pdf",
  originalFilename: "PDF Contract Pack v1.pdf",
  purpose: "GENERATED",
  securedSigningId: null,
  type: "CONTRACT_PACK",
  updatedAt: "2021-11-15T06:59:32.158Z",
  versionNumber: 1,
};

export const contracts = Array.from({ length: 5 }, (v, k) => {
  return {
    ...contract,
    id: contract.id + k,
    filename: `doc-${k}.docx`,
    originalFilename: `orig-doc-${k}.docx`,
  };
});

export const downloadFileResponse = {
  data: "http://testFilesServer.com",
};

export const pairedStatuses = [
  {
    status: APPLICATION_STATUSES.QUOTED,
    publicStatus: APPLICATION_PUBLIC_STATUSES.QUOTED,
  },
  {
    status: APPLICATION_STATUSES.DRAFTED_NEW,
    publicStatus: APPLICATION_PUBLIC_STATUSES.DRAFTED,
  },
  {
    status: APPLICATION_STATUSES.SUBMITTED_NEW,
    publicStatus: APPLICATION_PUBLIC_STATUSES.SUBMITTED,
  },
  {
    status: APPLICATION_STATUSES.IN_PROGRESS_CREDIT_IN_PROGRESS,
    publicStatus: APPLICATION_PUBLIC_STATUSES.IN_PROGRESS,
  },
  {
    status: APPLICATION_STATUSES.APPROVED_WAITING_FOR_MORE_INFO,
    publicStatus: APPLICATION_PUBLIC_STATUSES.APPROVED,
  },
  {
    status: APPLICATION_STATUSES.IN_SETTLEMENT_SETTLEMENT_IN_PROGRESS,
    publicStatus: APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT,
  },
  {
    status: APPLICATION_STATUSES.IN_SETTLEMENT_READY_FOR_SETTLEMENT,
    publicStatus: APPLICATION_PUBLIC_STATUSES.SETTLED,
  },
  {
    status: APPLICATION_STATUSES.DECLINED,
    publicStatus: APPLICATION_PUBLIC_STATUSES.DECLINED,
  },
  {
    status: APPLICATION_STATUSES.WITHDRAWN_BY_INTRODUCER,
    publicStatus: APPLICATION_PUBLIC_STATUSES.WITHDRAWN,
  },
];

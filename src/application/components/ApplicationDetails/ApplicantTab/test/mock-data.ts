import { add } from "date-fns";
import { ADDRESS_INPUT_TYPES } from "../../../../../address-autocomplete";
import { DEFAULT_DATE_INPUT_FORMAT } from "../../../../../common/constants/date";
import { ENTITY_TYPES } from "../../../../../common/constants/entityTypes";
import { dateFormat } from "../../../../../common/utils/date";
import { AMOUNT_TYPES } from "../../../../constants/amountTypes";
import { APPLICATION_STATUSES } from "../../../../constants/applicationStatuses";
import {
  ASSET_TYPE_CATEGORIES,
  CARS_AND_LIGHT_TRUCKS,
} from "../../../../constants/assetTypes";
import {
  INDUSTRY,
  INDUSTRY_BUILDING_CONSTRUCTION,
} from "../../../../constants/industryTypes";
import { REPAYMENT_TERM_OPTIONS } from "../../../../constants/repaymentTermOptions";
import { SUPPLIER_TYPES } from "../../../../constants/supplierTypes";
import { TRUSTEE_TYPES } from "../../../../constants/trusteeTypes";

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
    applicant: null,
    security: null,
    note: null,
    guarantors: [],
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

export const applicantDataSet1 = {
  abn: "50940571251",
  entityName: "",
  tradingName: "",
  entityType: ENTITY_TYPES.TRUST as string,
  trusteeType: TRUSTEE_TYPES.COMPANY as string,
  trusteeAcn: "619829622",
  trusteeName: "",
  abnRegisteredDate: "",
  gstRegisteredDate: "",
  phone: "1300000000",
  industry: INDUSTRY.BUILDING_CONSTRUCTION as string,
  industryType: INDUSTRY_BUILDING_CONSTRUCTION.BUSINESSES_CONSTRUCTION_SERVICES as string,
  addressInputType: ADDRESS_INPUT_TYPES.MANUAL,
  addressPostcode: "2000",
  addressState: "NSW",
  addressStreetName: "X",
  addressStreetNumber: "2",
  addressSuburb: "Y",
  addressUnitNumber: "12",
};

export const applicantDataSet2 = {
  abn: "12123123123",
  entityName: "Custom entity",
  tradingName: "Custom trading name",
  entityType: ENTITY_TYPES.TRUST as string,
  trusteeType: TRUSTEE_TYPES.COMPANY as string,
  trusteeAcn: "123123123",
  trusteeName: "Custom trustee name",
  abnRegisteredDate: "09/05/2005",
  gstRegisteredDate: "09/05/2005",
  phone: "1300000000",
  industry: INDUSTRY.BUILDING_CONSTRUCTION as string,
  industryType: INDUSTRY_BUILDING_CONSTRUCTION.BUSINESSES_CONSTRUCTION_SERVICES as string,
  addressInputType: ADDRESS_INPUT_TYPES.MANUAL,
  addressPostcode: "2000",
  addressState: "NSW",
  addressStreetName: "X",
  addressStreetNumber: "2",
  addressSuburb: "Y",
  addressUnitNumber: "12",
};

export const mockApplicantResponse = {
  id: "1bf196b3-c91d-4a9e-a28c-9867455bebce",
  addressInputType: "MANUAL",
  addressState: "NSW",
  addressStreetName: "X",
  addressStreetNumber: "2",
  addressUnitNumber: "12",
  addressSuburb: "Y",
  addressPostcode: "2000",
  abn: "50940571251",
  entityName: "The Trustee for SAURABH PRINTERS DISCRETIONARY TRUST",
  tradingName: "Westend Printing",
  entityType: "TRUST",
  trusteeType: "COMPANY",
  trusteeName: "BIG STONE CONSTRUCTION PTY LTD",
  trusteeAcn: "619829622",
  abnRegisteredDate: "2005-05-09",
  gstRegisteredDate: "2005-05-09",
  phone: "1300000000",
  industry: "BUILDING_CONSTRUCTION",
  industryType: "BUSINESSES_CONSTRUCTION_SERVICES",
  entityId: 10011,
  state: true,
  applicationId: mockApplicationResponseData.data.id,
  updatedAt: "2021-11-10T03:39:12.044Z",
  createdAt: "2021-11-10T03:39:12.044Z",
};

export const mockAbnResponse = {
  entityName: "The Trustee for SAURABH PRINTERS DISCRETIONARY TRUST",
  entityType: "TRUST",
  tradingNames: ["Westend Printing", "Packaging Galore"],
  acn: "",
  abnActiveFrom: "2005-05-09",
  gstActiveFrom: "2005-05-09",
};

export const mockAcnResponse = {
  entityName: "BIG STONE CONSTRUCTION PTY LTD",
  entityType: "COMPANY",
  tradingNames: [],
  acn: "619829622",
  abnActiveFrom: "2017-06-19",
  gstActiveFrom: "2018-06-29",
};

export const invalidDateInputs = {
  incomplete: "01/2",
  invalidMonth: "12/13/1995",
  futureDate: dateFormat(
    add(new Date(), {
      days: 1,
    }),
    DEFAULT_DATE_INPUT_FORMAT
  ),
};

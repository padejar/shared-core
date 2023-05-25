import { applicationStatuses } from "../../../";

const {
  APPLICATION_STATUSES,
  APPLICATION_PUBLIC_STATUSES,
  STATUS_GROUP_OTHER,
} = applicationStatuses;

export const statusReasons = [
  {
    id: 1,
    reason: "Change of mind",
    statusGroup: APPLICATION_STATUSES.WITHDRAWN_BY_INTRODUCER,
  },
  {
    id: 2,
    reason: "Other",
    statusGroup: STATUS_GROUP_OTHER,
  },
];

export const quotedApplication = {
  id: 1,
  name: "Applicant name 1",
  applicationNumber: "QF1001",
  status: APPLICATION_STATUSES.QUOTED,
  publicStatus: APPLICATION_PUBLIC_STATUSES.QUOTED,
  submittedAt: "2021-10-28T10:45:26.345Z",
  quote: {
    amountFinanced: 5001,
  },
  security: {
    name: "Security 1",
  },
};

export const submittedApplication = {
  id: 2,
  name: "Applicant name 2",
  applicationNumber: "QF1002",
  status: APPLICATION_STATUSES.SUBMITTED_NEW,
  publicStatus: APPLICATION_PUBLIC_STATUSES.SUBMITTED,
  submittedAt: "2021-10-28T10:45:26.345Z",
  assessmentId: "1002",
  quote: {
    amountFinanced: 5002,
  },
  security: {
    name: "Security 2",
  },
};

export const applicationRecords = [
  {
    id: 1,
    name: "Applicant name 1",
    applicationNumber: "QF1001",
    status: APPLICATION_STATUSES.QUOTED,
    publicStatus: APPLICATION_PUBLIC_STATUSES.QUOTED,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 5001,
    },
    security: {
      name: "Security 1",
    },
  },
  {
    id: 2,
    name: "Applicant name 2",
    applicationNumber: "QF1002",
    status: APPLICATION_STATUSES.DRAFTED_NEW,
    publicStatus: APPLICATION_PUBLIC_STATUSES.DRAFTED,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 5002,
    },
    security: {
      name: "Security 2",
    },
  },
  {
    id: 3,
    name: "Applicant name 3",
    applicationNumber: "QF1003",
    status: APPLICATION_STATUSES.DRAFTED_AMENDED,
    publicStatus: APPLICATION_PUBLIC_STATUSES.DRAFTED,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 5003,
    },
    security: {
      name: "Security 3",
    },
  },
  {
    id: 4,
    name: "Applicant name 4",
    applicationNumber: "QF1004",
    status: APPLICATION_STATUSES.SUBMITTED_NEW,
    publicStatus: APPLICATION_PUBLIC_STATUSES.SUBMITTED,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 5004,
    },
    security: {
      name: "Security 4",
    },
  },
  {
    id: 5,
    name: "Applicant name 5",
    applicationNumber: "QF1005",
    status: APPLICATION_STATUSES.SUBMITTED_AMENDED,
    publicStatus: APPLICATION_PUBLIC_STATUSES.SUBMITTED,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 5005,
    },
    security: {
      name: "Security 5",
    },
  },
  {
    id: 6,
    name: "Applicant name 6",
    applicationNumber: "QF1006",
    status: APPLICATION_STATUSES.IN_PROGRESS_CREDIT_WAITING_FOR_MORE_INFO,
    publicStatus: APPLICATION_PUBLIC_STATUSES.IN_PROGRESS,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 5006,
    },
    security: {
      name: "Security 6",
    },
  },
  {
    id: 7,
    name: "Applicant name 7",
    applicationNumber: "QF1007",
    status: APPLICATION_STATUSES.IN_PROGRESS_CREDIT_IN_PROGRESS,
    publicStatus: APPLICATION_PUBLIC_STATUSES.IN_PROGRESS,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 5007,
    },
    security: {
      name: "Security 7",
    },
  },
  {
    id: 8,
    name: "Applicant name 8",
    applicationNumber: "QF1008",
    status: APPLICATION_STATUSES.IN_PROGRESS_CREDIT_REFERRED,
    publicStatus: APPLICATION_PUBLIC_STATUSES.IN_PROGRESS,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 5008,
    },
    security: {
      name: "Security 8",
    },
  },
  {
    id: 9,
    name: "Applicant name 9",
    applicationNumber: "QF1009",
    status: APPLICATION_STATUSES.APPROVED_WAITING_FOR_MORE_INFO,
    publicStatus: APPLICATION_PUBLIC_STATUSES.APPROVED,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 5009,
    },
    security: {
      name: "Security 9",
    },
  },
  {
    id: 10,
    name: "Applicant name 10",
    applicationNumber: "QF10010",
    status: APPLICATION_STATUSES.IN_SETTLEMENT_READY_FOR_SETTLEMENT,
    publicStatus: APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 50010,
    },
    security: {
      name: "Security 10",
    },
  },
  {
    id: 11,
    name: "Applicant name 11",
    applicationNumber: "QF10011",
    status: APPLICATION_STATUSES.IN_SETTLEMENT_SETTLEMENT_IN_PROGRESS,
    publicStatus: APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 50011,
    },
    security: {
      name: "Security 11",
    },
  },
  {
    id: 12,
    name: "Applicant name 12",
    applicationNumber: "QF10012",
    status: APPLICATION_STATUSES.IN_SETTLEMENT_SETTLEMENT_REFERRED,
    publicStatus: APPLICATION_PUBLIC_STATUSES.IN_SETTLEMENT,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 50012,
    },
    security: {
      name: "Security 12",
    },
  },
  {
    id: 13,
    name: "Applicant name 13",
    applicationNumber: "QF10013",
    status: APPLICATION_STATUSES.SETTLED,
    publicStatus: APPLICATION_PUBLIC_STATUSES.SETTLED,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 50013,
    },
    security: {
      name: "Security 13",
    },
  },
  {
    id: 14,
    name: "Applicant name 14",
    applicationNumber: "QF10014",
    status: APPLICATION_STATUSES.WITHDRAWN_BY_INTRODUCER,
    publicStatus: APPLICATION_PUBLIC_STATUSES.WITHDRAWN,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 50014,
    },
    security: {
      name: "Security 14",
    },
  },
  {
    id: 15,
    name: "Applicant name 15",
    applicationNumber: "QF10015",
    status: APPLICATION_STATUSES.WITHDRAWN_BY_LENDER,
    publicStatus: APPLICATION_PUBLIC_STATUSES.WITHDRAWN,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 50015,
    },
    security: {
      name: "Security 15",
    },
  },
  {
    id: 16,
    name: "Applicant name 16",
    applicationNumber: "QF10016",
    status: APPLICATION_STATUSES.DECLINED,
    publicStatus: APPLICATION_PUBLIC_STATUSES.DECLINED,
    submittedAt: "2021-10-28T10:45:26.345Z",
    quote: {
      amountFinanced: 50016,
    },
    security: {
      name: "Security 16",
    },
  },
];

export const applicationList = {
  data: applicationRecords,
  count: applicationRecords.length,
};

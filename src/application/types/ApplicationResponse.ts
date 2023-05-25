import { APPLICATION_STATUSES } from "../constants/applicationStatuses";
import {
  ApplicantResponse,
  applicantResponseDefaultValue,
} from "./ApplicantResponse";
import { Guarantor, guarantorDefaultValue } from "./Guarantor";
import { NoteResponse, noteResponseDefaultValue } from "./NoteResponse";
import { QuoteResponse, quoteResponseDefaultValue } from "./QuoteResponse";
import {
  SecurityResponse,
  securityResponseDefaultValue,
} from "./SecurityResponse";

export interface ApplicationResponse {
  id: string;
  userId: number;
  name: string | null;
  applicationNumber: string;
  status: string;
  publicStatus: string;
  submittedAt: Date | null;
  quote: QuoteResponse;
  applicant: ApplicantResponse;
  note: NoteResponse;
  security: SecurityResponse;
  guarantors: Guarantor[];
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    client: string | null;
  } | null;
  assessmentId: string | null;
  updatedAt?: Date;
  createdAt?: Date;
}

export const applicationResponseDefaultValue: ApplicationResponse = {
  id: "",
  userId: 0,
  name: "",
  applicationNumber: "",
  status: APPLICATION_STATUSES.QUOTED,
  publicStatus: "",
  submittedAt: null,
  quote: quoteResponseDefaultValue,
  applicant: applicantResponseDefaultValue,
  note: noteResponseDefaultValue,
  security: securityResponseDefaultValue,
  guarantors: [guarantorDefaultValue],
  user: null,
  assessmentId: null,
};

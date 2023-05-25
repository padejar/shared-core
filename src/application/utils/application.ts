import { extractProperties } from "../../common/utils/object";
import {
  ApplicantForm,
  applicantFormDefaultValue,
} from "../types/ApplicantForm";
import { ApplicationResponse } from "../types/ApplicationResponse";
import { ApplicationStates } from "../types/ApplicationStates";
import {
  GuarantorForm,
  guarantorFormDefaultValue,
} from "../types/GuarantorForm";
import { NoteRequest, noteRequestDefaultValue } from "../types/NoteRequest";
import { NoteResponse } from "../types/NoteResponse";
import {
  QuoteFormSave,
  quoteFormSaveDefaultValue,
} from "../types/QuoteFormSave";
import { SecurityForm, securityFormDefaultValue } from "../types/SecurityForm";
import { transformToApplicantForm } from "./applicant";
import { transformToGuarantorForms } from "./guarantors";
import { transformToQuoteForm } from "./quote";
import { transformToSecurityForm } from "./security";

export const getApplicationStates = (
  application: ApplicationResponse
): ApplicationStates => {
  let quote = false;
  let applicant = false;
  let guarantors = false;
  let security = false;
  let notes = false;

  if (application.quote) {
    if (application.quote.state) {
      quote = true;
    }
  }

  if (application.applicant) {
    if (application.applicant.state) {
      applicant = true;
    }
  }

  if (application.guarantors) {
    guarantors =
      application.guarantors.length > 0
        ? application.guarantors.every((guarantor) => {
            return guarantor.state;
          })
        : false;
  }

  if (application.security) {
    if (application.security.state) security = true;
  }

  if (application.note) {
    if (application.note.state) notes = true;
  }

  return {
    quote,
    applicant,
    guarantors,
    security,
    notes,
  };
};

export const transformApplication = (
  application: ApplicationResponse
): {
  quoteForm: QuoteFormSave;
  applicantForm: ApplicantForm;
  guarantorForms: GuarantorForm[];
  securityForm: SecurityForm;
  noteForm: NoteRequest;
} => {
  let quoteForm = quoteFormSaveDefaultValue;
  let applicantForm = applicantFormDefaultValue;
  let guarantorForms = [guarantorFormDefaultValue];
  let securityForm = securityFormDefaultValue;
  let noteForm = noteRequestDefaultValue;
  if (application.quote) quoteForm = transformToQuoteForm(application.quote);
  if (application.applicant)
    applicantForm = transformToApplicantForm(application.applicant);
  if (application.guarantors && application.guarantors.length > 0)
    guarantorForms = transformToGuarantorForms(application.guarantors);
  if (application.security)
    securityForm = transformToSecurityForm(application.security);
  if (application.note)
    noteForm = extractProperties<NoteResponse>(
      application.note,
      Object.keys(noteRequestDefaultValue)
    ) as NoteRequest;
  return {
    quoteForm,
    applicantForm,
    guarantorForms,
    securityForm,
    noteForm,
  };
};

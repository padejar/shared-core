import IconApplicantHeader from "../assets/images/icon-circle-applicant-header.svg";
import IconApplicant from "../assets/images/icon-circle-applicant.svg";
import IconContractsHeader from "../assets/images/icon-circle-contracts-header.svg";
import IconContracts from "../assets/images/icon-circle-contracts.svg";
import IconGuarantorsHeader from "../assets/images/icon-circle-guarantors-header.svg";
import IconGuarantors from "../assets/images/icon-circle-guarantors.svg";
import IconNotesHeader from "../assets/images/icon-circle-notes-header.svg";
import IconNotes from "../assets/images/icon-circle-notes.svg";
import IconQuotesHeader from "../assets/images/icon-circle-quotes-header.svg";
import IconQuotes from "../assets/images/icon-circle-quotes.svg";
import IconSecurityHeader from "../assets/images/icon-circle-security-header.svg";
import IconSecurity from "../assets/images/icon-circle-security.svg";
import { ApplicationSteps } from "../types/ApplicationStep";

export enum APPLICATION_STEPS {
  quotes = "quotes",
  applicant = "applicant",
  guarantors = "guarantors",
  security = "security",
  notes = "notes",
  contracts = "contracts",
}

export const APPLICATION_STEPS_LABELS = {
  [APPLICATION_STEPS.quotes]: "Quotes",
  [APPLICATION_STEPS.applicant]: "Applicant",
  [APPLICATION_STEPS.guarantors]: "Guarantors",
  [APPLICATION_STEPS.security]: "Security",
  [APPLICATION_STEPS.notes]: "Notes",
  [APPLICATION_STEPS.contracts]: "Contracts",
};

export const APPLICATION_HEADER_LABELS = {
  [APPLICATION_STEPS.quotes]: "Quotes",
  [APPLICATION_STEPS.applicant]: "Applicant",
  [APPLICATION_STEPS.guarantors]: "Guarantors",
  [APPLICATION_STEPS.security]: "Security",
  [APPLICATION_STEPS.notes]: "Notes",
  [APPLICATION_STEPS.contracts]: "Contracts & Settlements",
};

export const applicationSteps: ApplicationSteps = {
  [APPLICATION_STEPS.quotes]: {
    stepName: APPLICATION_STEPS_LABELS[APPLICATION_STEPS.quotes],
    stepIcon: IconQuotes,
    headerIcon: IconQuotesHeader,
    headerName: APPLICATION_HEADER_LABELS[APPLICATION_STEPS.quotes],
    stepSlug: APPLICATION_STEPS.quotes,
    isStepDone: false,
    isClickable: false,
  },
  [APPLICATION_STEPS.applicant]: {
    stepName: APPLICATION_STEPS_LABELS[APPLICATION_STEPS.applicant],
    stepIcon: IconApplicant,
    headerIcon: IconApplicantHeader,
    headerName: APPLICATION_HEADER_LABELS[APPLICATION_STEPS.applicant],
    stepSlug: APPLICATION_STEPS.applicant,
    isStepDone: false,
    isClickable: true,
  },
  [APPLICATION_STEPS.guarantors]: {
    stepName: APPLICATION_STEPS_LABELS[APPLICATION_STEPS.guarantors],
    stepIcon: IconGuarantors,
    headerIcon: IconGuarantorsHeader,
    headerName: APPLICATION_HEADER_LABELS[APPLICATION_STEPS.guarantors],
    stepSlug: APPLICATION_STEPS.guarantors,
    isStepDone: false,
    isClickable: true,
  },
  [APPLICATION_STEPS.security]: {
    stepName: APPLICATION_STEPS_LABELS[APPLICATION_STEPS.security],
    stepIcon: IconSecurity,
    headerIcon: IconSecurityHeader,
    headerName: APPLICATION_HEADER_LABELS[APPLICATION_STEPS.security],
    stepSlug: APPLICATION_STEPS.security,
    isStepDone: false,
    isClickable: true,
  },
  [APPLICATION_STEPS.notes]: {
    stepName: APPLICATION_STEPS_LABELS[APPLICATION_STEPS.notes],
    stepIcon: IconNotes,
    headerIcon: IconNotesHeader,
    headerName: APPLICATION_HEADER_LABELS[APPLICATION_STEPS.notes],
    stepSlug: APPLICATION_STEPS.notes,
    isStepDone: false,
    isClickable: true,
  },
  [APPLICATION_STEPS.contracts]: {
    stepName: APPLICATION_STEPS_LABELS[APPLICATION_STEPS.contracts],
    stepIcon: IconContracts,
    headerIcon: IconContractsHeader,
    headerName: APPLICATION_HEADER_LABELS[APPLICATION_STEPS.contracts],
    stepSlug: APPLICATION_STEPS.contracts,
    isStepDone: false,
    isClickable: true,
  },
};

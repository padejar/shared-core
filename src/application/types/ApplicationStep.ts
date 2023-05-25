import { APPLICATION_STEPS } from "../constants/applicationSteps";

export interface ApplicationStep {
  stepName: string;
  stepIcon: string;
  headerIcon: string;
  headerName: string;
  stepSlug: APPLICATION_STEPS;
  isStepDone: boolean;
  isClickable: boolean;
}

export const applicationStepDefaultValue: ApplicationStep = {
  stepName: "Quotes",
  stepIcon: "",
  headerIcon: "",
  headerName: "",
  stepSlug: APPLICATION_STEPS.quotes,
  isStepDone: false,
  isClickable: false,
};

export interface ApplicationSteps {
  quotes: ApplicationStep;
  applicant: ApplicationStep;
  guarantors: ApplicationStep;
  security: ApplicationStep;
  notes: ApplicationStep;
  contracts: ApplicationStep;
}

export const applicationStepsDefaultValue: ApplicationSteps = {
  quotes: applicationStepDefaultValue,
  applicant: applicationStepDefaultValue,
  guarantors: applicationStepDefaultValue,
  security: applicationStepDefaultValue,
  notes: applicationStepDefaultValue,
  contracts: applicationStepDefaultValue,
};

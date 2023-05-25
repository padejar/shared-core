import { applicationSteps } from "../constants/applicationSteps";
import { REDIRECT_TYPES } from "../constants/redirectTypes";
import { ApplicantForm, applicantFormDefaultValue } from "./ApplicantForm";
import {
  ApplicationResponse,
  applicationResponseDefaultValue,
} from "./ApplicationResponse";
import { ApplicationStep, ApplicationSteps } from "./ApplicationStep";
import { GuarantorForm, guarantorFormDefaultValue } from "./GuarantorForm";
import { NoteRequest, noteRequestDefaultValue } from "./NoteRequest";
import { QuoteFormSave, quoteFormSaveDefaultValue } from "./QuoteFormSave";
import {
  RequiredDocuments,
  requiredDocumentsDefaultValue,
} from "./RequiredDocuments";
import {
  SecurityComparison,
  securityComparisonDefaultValue,
} from "./SecurityComparison";
import { SecurityForm, securityFormDefaultValue } from "./SecurityForm";

export interface ApplicationFormState {
  application: ApplicationResponse;
  quoteForm: QuoteFormSave;
  quoteFormTemp: QuoteFormSave;
  quoteChangedPopUpShown: boolean;
  applicantForm: ApplicantForm;
  applicantFormTemp: ApplicantForm;
  guarantorForms: GuarantorForm[];
  guarantorFormsTemp: GuarantorForm[];
  securityForm: SecurityForm;
  securityFormTemp: SecurityForm;
  securityComparison: SecurityComparison;
  contractsGenerationErrors?: {
    supplierName?: string;
    serialNumber?: string;
  };
  noteForm: NoteRequest;
  noteFormTemp: NoteRequest;
  requiredDocuments: RequiredDocuments;
  redirectPath: string;
  redirectType: REDIRECT_TYPES;
  steps: ApplicationSteps;
  previousStep?: ApplicationStep;
  currentStep?: ApplicationStep;
  isFormLoading: boolean;
  getDetailsLoading: boolean;
  getRequiredDocumentsLoading: boolean;
  clonedApplicationId: string | null;
  cloneApplicationLoading: boolean;
  withdrawApplicationLoading: boolean;
  isGlassGuideAvailable: boolean;
  isApplicationSubmitted: boolean;
  isApplicationAmended: boolean;
  nextPath: string;
}

export const applicationFormStateDefaultValue: ApplicationFormState = {
  application: applicationResponseDefaultValue,
  quoteForm: quoteFormSaveDefaultValue,
  quoteFormTemp: quoteFormSaveDefaultValue,
  quoteChangedPopUpShown: false,
  applicantForm: applicantFormDefaultValue,
  applicantFormTemp: applicantFormDefaultValue,
  guarantorForms: [guarantorFormDefaultValue],
  guarantorFormsTemp: [guarantorFormDefaultValue],
  securityForm: securityFormDefaultValue,
  securityFormTemp: securityFormDefaultValue,
  securityComparison: securityComparisonDefaultValue,
  noteForm: noteRequestDefaultValue,
  noteFormTemp: noteRequestDefaultValue,
  requiredDocuments: requiredDocumentsDefaultValue,
  redirectPath: "",
  redirectType: REDIRECT_TYPES.PUSH,
  steps: applicationSteps,
  isFormLoading: false,
  getDetailsLoading: false,
  getRequiredDocumentsLoading: false,
  clonedApplicationId: null,
  cloneApplicationLoading: false,
  withdrawApplicationLoading: false,
  isGlassGuideAvailable: false,
  isApplicationSubmitted: false,
  isApplicationAmended: false,
  nextPath: "",
};

import { Action } from "redux";
import { APPLICATION_STEPS } from "../../constants/applicationSteps";
import { REDIRECT_TYPES } from "../../constants/redirectTypes";
import { ApplicantForm } from "../../types/ApplicantForm";
import { ApplicantResponse } from "../../types/ApplicantResponse";
import { ApplicationForm } from "../../types/ApplicationForm";
import { ApplicationResponse } from "../../types/ApplicationResponse";
import { GuarantorForm } from "../../types/GuarantorForm";
import { NoteRequest } from "../../types/NoteRequest";
import { NoteResponse } from "../../types/NoteResponse";
import { QuoteCalculateResponse } from "../../types/QuoteCalculateResponse";
import { QuoteFormSave } from "../../types/QuoteFormSave";
import { QuoteResponse } from "../../types/QuoteResponse";
import { RequiredDocuments } from "../../types/RequiredDocuments";
import { SecurityComparison } from "../../types/SecurityComparison";
import { SecurityForm } from "../../types/SecurityForm";
import { SecurityResponse } from "../../types/SecurityResponse";

export const RESET_APPLICATION_DETAILS = "RESET_APPLICATION_DETAILS";
export interface ResetApplicationDetails extends Action {
  type: typeof RESET_APPLICATION_DETAILS;
}

export const GET_APPLICATION_DETAILS = "GET_APPLICATION_DETAILS";
export interface GetApplicationDetails extends Action {
  type: typeof GET_APPLICATION_DETAILS;
  id?: string;
}

export const GET_APPLICATION_DETAILS_SUCCESS =
  "GET_APPLICATION_DETAILS_SUCCESS";
export interface GetApplicationDetailsSuccess extends Action {
  type: typeof GET_APPLICATION_DETAILS_SUCCESS;
  application: ApplicationResponse;
}

export const GET_APPLICATION_DETAILS_FAILED = "GET_APPLICATION_DETAILS_FAILED";
export interface GetApplicationDetailsFailed extends Action {
  type: typeof GET_APPLICATION_DETAILS_FAILED;
}

export const UPDATE_APPLICATION = "UPDATE_APPLICATION";
export interface UpdateApplication extends Action {
  type: typeof UPDATE_APPLICATION;
  application: Partial<ApplicationResponse>;
}

export const SAVE_APPLICATION = "SAVE_APPLICATION";
export interface SaveApplication extends Action {
  type: typeof SAVE_APPLICATION;
  applicationForm: ApplicationForm;
  isDraft: boolean;
  nextStep?: string;
}

export const SAVE_APPLICATION_SUCCESS = "SAVE_APPLICATION_SUCCESS";
export interface SaveApplicationSuccess extends Action {
  type: typeof SAVE_APPLICATION_SUCCESS;
  applicationResponse: ApplicationResponse;
}

export const SUBMIT_APPLICATION = "SUBMIT_APPLICATION";
export interface SubmitApplication extends Action {
  type: typeof SUBMIT_APPLICATION;
  applicationId: string;
}

export const SUBMIT_APPLICATON_SUCCESS = "SUBMIT_APPLICATON_SUCCESS";
export interface SubmitApplicationSuccess extends Action {
  type: typeof SUBMIT_APPLICATON_SUCCESS;
  applicationResponse: ApplicationResponse;
}

export const SET_IS_APPLICATION_SUBMITTED = "SET_IS_APPLICATION_SUBMITTED";
export interface SetIsApplicationSubmitted extends Action {
  type: typeof SET_IS_APPLICATION_SUBMITTED;
  isApplicationSubmitted: boolean;
}

export const CLONE_APPLICATION = "CLONE_APPLICATION";
export interface CloneApplication extends Action {
  type: typeof CLONE_APPLICATION;
  applicationId: string;
}

export const CLONE_APPLICATION_SUCCESS = "CLONE_APPLICATION_SUCCESS";
export interface CloneApplicationSuccess extends Action {
  type: typeof CLONE_APPLICATION_SUCCESS;
  clonedApplicationId: string;
}

export const CLEAR_CLONED_APPLICATION_ID = "CLEAR_CLONED_APPLICATION_ID";
export interface ClearClonedApplicationId extends Action {
  type: typeof CLEAR_CLONED_APPLICATION_ID;
}

type ApplicationActions =
  | ResetApplicationDetails
  | GetApplicationDetails
  | GetApplicationDetailsFailed
  | GetApplicationDetailsSuccess
  | UpdateApplication
  | SaveApplication
  | SaveApplicationSuccess
  | SubmitApplication
  | SubmitApplicationSuccess
  | SetIsApplicationSubmitted
  | CloneApplication
  | CloneApplicationSuccess
  | ClearClonedApplicationId;

export const UPDATE_QUOTE = "UPDATE_QUOTE";
export interface UpdateQuote extends Action {
  type: typeof UPDATE_QUOTE;
  quoteForm: Partial<QuoteFormSave>;
}

export const CALCULATE_QUOTE = "CALCULATE_QUOTE";
export interface CalculateQuote extends Action {
  type: typeof CALCULATE_QUOTE;
  quoteForm: QuoteFormSave;
}

export const CALCULATE_QUOTE_SUCCESS = "CALCULATE_QUOTE_SUCCESS";
export interface CalculateQuoteSuccess extends Action {
  type: typeof CALCULATE_QUOTE_SUCCESS;
  quoteCalculateResponse: QuoteCalculateResponse;
}

export const SET_CALCULATION_LOADING = "SET_CALCULATION_LOADING";
export interface SetCalculationLoading extends Action {
  type: typeof SET_CALCULATION_LOADING;
  calculationLoading: boolean;
}

export const SAVE_QUOTE = "SAVE_QUOTE";
export interface SaveQuote extends Action {
  type: typeof SAVE_QUOTE;
  applicationId: string;
  quoteForm: QuoteFormSave;
  isDraft: boolean;
  nextPath: string;
}

export const SAVE_QUOTE_SUCCESS = "SAVE_QUOTE_SUCCESS";
export interface SaveQuoteSuccess extends Action {
  type: typeof SAVE_QUOTE_SUCCESS;
  quoteResponse: QuoteResponse;
}

type QuoteActions =
  | UpdateQuote
  | SaveQuote
  | SaveQuoteSuccess
  | CalculateQuote
  | SetCalculationLoading
  | CalculateQuoteSuccess;

export const UPDATE_APPLICANT = "UPDATE_APPLICANT";
export interface UpdateApplicant extends Action {
  type: typeof UPDATE_APPLICANT;
  applicantForm: Partial<ApplicantForm>;
}

export const SAVE_APPLICANT = "SAVE_APPLICANT";
export interface SaveApplicant extends Action {
  type: typeof SAVE_APPLICANT;
  applicationId: string;
  applicantForm: ApplicantForm;
  isDraft: boolean;
  nextPath?: string;
}

export const SAVE_APPLICANT_SUCCESS = "SAVE_APPLICANT_SUCCESS";
export interface SaveApplicantSuccess extends Action {
  type: typeof SAVE_APPLICANT_SUCCESS;
  applicantResponse: ApplicantResponse;
}

type ApplicantActions = UpdateApplicant | SaveApplicant | SaveApplicantSuccess;

export const UPDATE_GUARANTOR = "UPDATE_GUARANTOR";
export interface UpdateGuarantor extends Action {
  type: typeof UPDATE_GUARANTOR;
  guarantorForm: Partial<GuarantorForm>;
  index: number;
}

export const UPDATE_GUARANTORS = "UPDATE_GUARANTORS";
export interface UpdateGuarantors extends Action {
  type: typeof UPDATE_GUARANTORS;
  guarantorForms: GuarantorForm[];
}

export const SAVE_GUARANTORS = "SAVE_GUARANTORS";
export interface SaveGuarantors extends Action {
  type: typeof SAVE_GUARANTORS;
  applicationId: string;
  guarantorForms: GuarantorForm[];
  isDraft: boolean;
  nextPath?: string;
}

export const SAVE_GUARANTORS_SUCCESS = "SAVE_GUARANTORS_SUCCESS";
export interface SaveGuarantorsSuccess extends Action {
  type: typeof SAVE_GUARANTORS_SUCCESS;
}

type GuarantorsAction =
  | UpdateGuarantor
  | UpdateGuarantors
  | SaveGuarantors
  | SaveGuarantorsSuccess;

export const INIT_SECURITY_FORM = "INIT_SECURITY_FORM";
export interface InitSecurityForm extends Action {
  type: typeof INIT_SECURITY_FORM;
}

export const CHECK_GLASS_GUIDE_AVAILABILITY = "CHECK_GLASS_GUIDE_AVAILABILITY";
export interface CheckGlassGuideAvailability extends Action {
  type: typeof CHECK_GLASS_GUIDE_AVAILABILITY;
}

export const CHECK_GLASS_GUIDE_AVAILABILITY_SUCCESS =
  "CHECK_GLASS_GUIDE_AVAILABILITY_SUCCESS";
export interface CheckGlassGuideAvailabilitySuccess extends Action {
  type: typeof CHECK_GLASS_GUIDE_AVAILABILITY_SUCCESS;
  isAvailable: boolean;
}

export const CHECK_GLASS_GUIDE_AVAILABILITY_FAILED =
  "CHECK_GLASS_GUIDE_AVAILABILITY_FAILED";
export interface CheckGlassGuideAvailabilityFailed extends Action {
  type: typeof CHECK_GLASS_GUIDE_AVAILABILITY_FAILED;
}

export const SET_GLASS_GUIDE_SHOWN = "SET_GLASS_GUIDE_SHOWN";
export interface SetGlassGuideShown extends Action {
  type: typeof SET_GLASS_GUIDE_SHOWN;
  isGlassGuideShown: boolean;
}

export const SET_SECURITY_COMPARISON = "SET_SECURITY_COMPARISON";
export interface SetSecurityComparison extends Action {
  type: typeof SET_SECURITY_COMPARISON;
  securityComparison: Partial<SecurityComparison>;
}

export const UPDATE_SECURITY = "UPDATE_SECURITY";
export interface UpdateSecurity extends Action {
  type: typeof UPDATE_SECURITY;
  securityForm: Partial<SecurityForm>;
}

export const SAVE_SECURITY = "SAVE_SECURITY";
export interface SaveSecurity extends Action {
  type: typeof SAVE_SECURITY;
  applicationId: string;
  securityForm: SecurityForm;
  isDraft: boolean;
  nextPath?: string;
  popupQuoteChanged?: boolean;
}

export const SAVE_SECURITY_SUCCESS = "SAVE_SECURITY_SUCCESS";
export interface SaveSecuritySuccess extends Action {
  type: typeof SAVE_SECURITY_SUCCESS;
  securityResponse: SecurityResponse;
}

export const QUOTE_CHANGED_POPUP_TOGGLE = "QUOTE_CHANGED_POPUP_TOGGLE";
export interface QuoteChangedPopupToggle extends Action {
  type: typeof QUOTE_CHANGED_POPUP_TOGGLE;
  quoteChangedPopUpShown: boolean;
}

type SecurityActions =
  | InitSecurityForm
  | CheckGlassGuideAvailability
  | CheckGlassGuideAvailabilitySuccess
  | CheckGlassGuideAvailabilityFailed
  | SetGlassGuideShown
  | SetSecurityComparison
  | UpdateSecurity
  | SaveSecurity
  | SaveSecuritySuccess
  | QuoteChangedPopupToggle;

export const UPDATE_NOTE = "UPDATE_NOTE";
export interface UpdateNote extends Action {
  type: typeof UPDATE_NOTE;
  note: Partial<NoteRequest>;
}

export const SAVE_NOTE = "SAVE_NOTE";
export interface SaveNote extends Action {
  type: typeof SAVE_NOTE;
  applicationId: string;
  note: NoteRequest;
  isDraft: boolean;
  nextPath?: string;
}

export const SAVE_NOTE_SUCCESS = "SAVE_NOTE_SUCCESS";
export interface SaveNoteSuccess extends Action {
  type: typeof SAVE_NOTE_SUCCESS;
  note: NoteResponse;
}

type NoteActions = UpdateNote | SaveNote | SaveNoteSuccess;

export const GET_REQUIRED_DOCUMENTS = "GET_REQUIRED_DOCUMENTS";
export interface GetRequiredDocuments {
  type: typeof GET_REQUIRED_DOCUMENTS;
  applicationId: string;
}

export const GET_REQUIRED_DOCUMENTS_SUCCESS = "GET_REQUIRED_DOCUMENTS_SUCCESS";
export interface GetRequiredDocumentsSuccess extends Action {
  type: typeof GET_REQUIRED_DOCUMENTS_SUCCESS;
  requiredDocuments: RequiredDocuments;
}

export const GET_REQUIRED_DOCUMENTS_COMPLETE =
  "GET_REQUIRED_DOCUMENTS_COMPLETE";
export interface GetRequiredDocumentsComplete extends Action {
  type: typeof GET_REQUIRED_DOCUMENTS_COMPLETE;
}

type RequiredDocumentsActions =
  | GetRequiredDocuments
  | GetRequiredDocumentsSuccess
  | GetRequiredDocumentsComplete;

export const SET_ACTIVE_STEP = "SET_ACTIVE_STEP";
export interface SetActiveStep extends Action {
  type: typeof SET_ACTIVE_STEP;
  stepName: APPLICATION_STEPS;
  previousStep?: APPLICATION_STEPS;
}

export const SET_FORM_LOADING = "SET_FORM_LOADING";
export interface SetFormLoading extends Action {
  type: typeof SET_FORM_LOADING;
  isLoading: boolean;
}

export const SET_REDIRECT_PATH = "SET_REDIRECT_PATH";
export interface SetRedirectpath extends Action {
  type: typeof SET_REDIRECT_PATH;
  redirectPath: string;
  redirectType: REDIRECT_TYPES;
}

export const CLEAR_REDIRECT_PATH = "CLEAR_REDIRECT_PATH";
export interface ClearRedirectPath extends Action {
  type: typeof CLEAR_REDIRECT_PATH;
}

export const SET_IS_APPLICATION_AMENDED = "SET_IS_APPLICATION_AMENDED";
export interface SetIsApplicationAmended extends Action {
  type: typeof SET_IS_APPLICATION_AMENDED;
  isApplicationAmended: boolean;
}

export const REVERT_CHANGES = "REVERT_CHANGES";
export interface RevertChanges extends Action {
  type: typeof REVERT_CHANGES;
  stepName: APPLICATION_STEPS;
  nextPath?: string;
}

export const SAVE_FORM = "SAVE_FORM";
export interface SaveForm extends Action {
  type: typeof SAVE_FORM;
  applicationId: string;
  stepName: APPLICATION_STEPS;
  nextPath: string;
  isDraft: boolean;
}

export const CLEAR_APPLICATION_FORM_STATE = "CLEAR_APPLICATION_FORM_STATE";
export interface ClearApplicationFormState extends Action {
  type: typeof CLEAR_APPLICATION_FORM_STATE;
}

export const SAVE_AND_EXIT = "SAVE_AND_EXIT";
export interface SaveAndExit extends Action {
  type: typeof SAVE_AND_EXIT;
  currentStep: APPLICATION_STEPS;
  nextPath: string;
}

export const SET_CONTRACT_GENERATION_ERRORS = "SET_CONTRACT_GENERATION_ERRORS";
export interface SetContractGenerationErrors extends Action {
  type: typeof SET_CONTRACT_GENERATION_ERRORS;
  contractGenerationErrors: Record<string, string> | undefined;
}

type FormActions =
  | SetActiveStep
  | SetFormLoading
  | SetRedirectpath
  | ClearRedirectPath
  | SetIsApplicationAmended
  | RevertChanges
  | SaveForm
  | ClearApplicationFormState
  | SaveAndExit
  | SetContractGenerationErrors;

export type ApplicationFormActions =
  | ApplicationActions
  | QuoteActions
  | ApplicantActions
  | GuarantorsAction
  | SecurityActions
  | NoteActions
  | RequiredDocumentsActions
  | FormActions;

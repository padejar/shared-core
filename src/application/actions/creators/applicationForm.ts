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
import * as types from "../types/applicationForm";

export const resetApplicationDetails = (): types.ResetApplicationDetails => ({
  type: types.RESET_APPLICATION_DETAILS,
});

export const getApplicationDetails = (
  id?: string
): types.GetApplicationDetails => ({
  type: types.GET_APPLICATION_DETAILS,
  id,
});

export const updateApplication = (
  application: Partial<ApplicationResponse>
): types.UpdateApplication => ({
  type: types.UPDATE_APPLICATION,
  application,
});

export const getApplicationDetailsSuccess = (
  application: ApplicationResponse
): types.GetApplicationDetailsSuccess => ({
  type: types.GET_APPLICATION_DETAILS_SUCCESS,
  application,
});

export const getApplicationDetailsFailed = (): types.GetApplicationDetailsFailed => ({
  type: types.GET_APPLICATION_DETAILS_FAILED,
});

export const saveApplication = (
  applicationForm: ApplicationForm,
  isDraft: boolean,
  nextStep?: string
): types.SaveApplication => ({
  type: types.SAVE_APPLICATION,
  applicationForm,
  isDraft,
  nextStep,
});

export const saveApplicationSuccess = (
  applicationResponse: ApplicationResponse
): types.SaveApplicationSuccess => ({
  type: types.SAVE_APPLICATION_SUCCESS,
  applicationResponse,
});

export const submitApplication = (
  applicationId: string
): types.SubmitApplication => ({
  type: types.SUBMIT_APPLICATION,
  applicationId,
});

export const submitApplicationSuccess = (
  applicationResponse: ApplicationResponse
): types.SubmitApplicationSuccess => ({
  type: types.SUBMIT_APPLICATON_SUCCESS,
  applicationResponse,
});

export const setIsApplicationSubmitted = (
  isApplicationSubmitted: boolean
): types.SetIsApplicationSubmitted => ({
  type: types.SET_IS_APPLICATION_SUBMITTED,
  isApplicationSubmitted,
});

export const cloneApplication = (
  applicationId: string
): types.CloneApplication => ({
  type: types.CLONE_APPLICATION,
  applicationId,
});

export const cloneApplicationSuccess = (
  clonedApplicationId: string
): types.CloneApplicationSuccess => ({
  type: types.CLONE_APPLICATION_SUCCESS,
  clonedApplicationId,
});

export const clearClonedApplicationId = (): types.ClearClonedApplicationId => ({
  type: types.CLEAR_CLONED_APPLICATION_ID,
});

export const updateQuote = (
  quoteForm: Partial<QuoteFormSave>
): types.UpdateQuote => ({
  type: types.UPDATE_QUOTE,
  quoteForm,
});

export const calculateQuote = (
  quoteForm: QuoteFormSave
): types.CalculateQuote => ({
  type: types.CALCULATE_QUOTE,
  quoteForm,
});

export const calculateQuoteSuccess = (
  quoteCalculateResponse: QuoteCalculateResponse
): types.CalculateQuoteSuccess => ({
  type: types.CALCULATE_QUOTE_SUCCESS,
  quoteCalculateResponse,
});

export const setCalculationLoading = (
  calculationLoading: boolean
): types.SetCalculationLoading => ({
  type: types.SET_CALCULATION_LOADING,
  calculationLoading,
});

export const saveQuote = (
  applicationId: string,
  quoteForm: QuoteFormSave,
  isDraft: boolean,
  nextPath: string
): types.SaveQuote => ({
  type: types.SAVE_QUOTE,
  applicationId,
  quoteForm,
  isDraft,
  nextPath,
});

export const saveQuoteSuccess = (
  quoteResponse: QuoteResponse
): types.SaveQuoteSuccess => ({
  type: types.SAVE_QUOTE_SUCCESS,
  quoteResponse,
});

export const updateApplicant = (
  applicantForm: Partial<ApplicantForm>
): types.UpdateApplicant => ({
  type: types.UPDATE_APPLICANT,
  applicantForm,
});

export const saveApplicant = (
  applicationId: string,
  applicantForm: ApplicantForm,
  isDraft: boolean,
  nextPath?: string
): types.SaveApplicant => ({
  type: types.SAVE_APPLICANT,
  applicationId,
  applicantForm,
  isDraft,
  nextPath,
});

export const saveApplicantSuccess = (
  applicantResponse: ApplicantResponse
): types.SaveApplicantSuccess => ({
  type: types.SAVE_APPLICANT_SUCCESS,
  applicantResponse,
});

export const updateGuarantor = (
  guarantorForm: Partial<GuarantorForm>,
  index: number
): types.UpdateGuarantor => ({
  type: types.UPDATE_GUARANTOR,
  guarantorForm,
  index,
});

export const updateGuarantors = (
  guarantorForms: GuarantorForm[]
): types.UpdateGuarantors => ({
  type: types.UPDATE_GUARANTORS,
  guarantorForms,
});

export const saveGuarantors = (
  applicationId: string,
  guarantorForms: GuarantorForm[],
  isDraft: boolean,
  nextPath?: string
): types.SaveGuarantors => ({
  type: types.SAVE_GUARANTORS,
  applicationId,
  guarantorForms,
  isDraft,
  nextPath,
});

export const saveGuarantorsSuccess = (): types.SaveGuarantorsSuccess => ({
  type: types.SAVE_GUARANTORS_SUCCESS,
});

export const initSecurityForm = (): types.InitSecurityForm => ({
  type: types.INIT_SECURITY_FORM,
});

export const checkGlassGuideAvailability = (): types.CheckGlassGuideAvailability => ({
  type: types.CHECK_GLASS_GUIDE_AVAILABILITY,
});

export const checkGlassGuideAvailabilitySuccess = (
  isAvailable: boolean
): types.CheckGlassGuideAvailabilitySuccess => ({
  type: types.CHECK_GLASS_GUIDE_AVAILABILITY_SUCCESS,
  isAvailable,
});

export const CheckGlassGuideAvailabilityFailed = (): types.CheckGlassGuideAvailabilityFailed => ({
  type: types.CHECK_GLASS_GUIDE_AVAILABILITY_FAILED,
});

export const setGlassGuideShown = (
  isGlassGuideShown: boolean
): types.SetGlassGuideShown => ({
  type: types.SET_GLASS_GUIDE_SHOWN,
  isGlassGuideShown,
});

export const setSecurityComparison = (
  securityComparison: Partial<SecurityComparison>
): types.SetSecurityComparison => ({
  type: types.SET_SECURITY_COMPARISON,
  securityComparison,
});

export const updateSecurity = (
  securityForm: Partial<SecurityForm>
): types.UpdateSecurity => ({
  type: types.UPDATE_SECURITY,
  securityForm,
});

export const saveSecurity = (
  applicationId: string,
  securityForm: SecurityForm,
  isDraft: boolean,
  nextPath?: string,
  popupQuoteChanged?: boolean
): types.SaveSecurity => ({
  type: types.SAVE_SECURITY,
  applicationId,
  securityForm,
  isDraft,
  nextPath,
  popupQuoteChanged,
});

export const saveSecuritySuccess = (
  securityResponse: SecurityResponse
): types.SaveSecuritySuccess => ({
  type: types.SAVE_SECURITY_SUCCESS,
  securityResponse,
});

export const quoteChangedPopupToggle = (
  quoteChangedPopUpShown: boolean
): types.QuoteChangedPopupToggle => ({
  type: types.QUOTE_CHANGED_POPUP_TOGGLE,
  quoteChangedPopUpShown,
});

export const updateNote = (note: Partial<NoteRequest>): types.UpdateNote => ({
  type: types.UPDATE_NOTE,
  note,
});

export const saveNote = (
  applicationId: string,
  note: NoteRequest,
  isDraft: boolean,
  nextPath?: string
): types.SaveNote => ({
  type: types.SAVE_NOTE,
  applicationId,
  note,
  isDraft,
  nextPath,
});

export const saveNoteSuccess = (note: NoteResponse): types.SaveNoteSuccess => ({
  type: types.SAVE_NOTE_SUCCESS,
  note,
});

export const getRequiredDocuments = (
  applicationId: string
): types.GetRequiredDocuments => ({
  type: types.GET_REQUIRED_DOCUMENTS,
  applicationId,
});

export const getRequiredDocumentsSuccess = (
  requiredDocuments: RequiredDocuments
): types.GetRequiredDocumentsSuccess => ({
  type: types.GET_REQUIRED_DOCUMENTS_SUCCESS,
  requiredDocuments,
});

export const getRequiredDocumentsComplete = (): types.GetRequiredDocumentsComplete => ({
  type: types.GET_REQUIRED_DOCUMENTS_COMPLETE,
});

export const setActiveStep = (
  stepName: APPLICATION_STEPS,
  previousStep?: APPLICATION_STEPS
): types.SetActiveStep => ({
  type: types.SET_ACTIVE_STEP,
  stepName,
  previousStep,
});

export const setFormLoading = (isLoading: boolean): types.SetFormLoading => ({
  type: types.SET_FORM_LOADING,
  isLoading,
});

export const setRedirectPath = (
  redirectPath: string,
  redirectType: REDIRECT_TYPES
): types.SetRedirectpath => ({
  type: types.SET_REDIRECT_PATH,
  redirectPath,
  redirectType,
});

export const clearRedirectPath = (): types.ClearRedirectPath => ({
  type: types.CLEAR_REDIRECT_PATH,
});

export const setIsApplicationAmended = (
  isApplicationAmended: boolean
): types.SetIsApplicationAmended => ({
  type: types.SET_IS_APPLICATION_AMENDED,
  isApplicationAmended,
});

export const revertChanges = (
  stepName: APPLICATION_STEPS,
  nextPath?: string
): types.RevertChanges => ({
  type: types.REVERT_CHANGES,
  stepName,
  nextPath,
});

export const saveForm = (
  stepName: APPLICATION_STEPS,
  applicationId: string,
  isDraft: boolean,
  nextPath: string
): types.SaveForm => ({
  type: types.SAVE_FORM,
  stepName,
  nextPath,
  applicationId,
  isDraft,
});

export const clearApplicationState = (): types.ClearApplicationFormState => ({
  type: types.CLEAR_APPLICATION_FORM_STATE,
});

export const saveAndExit = (
  currentStep: APPLICATION_STEPS,
  nextPath: string
): types.SaveAndExit => ({
  type: types.SAVE_AND_EXIT,
  currentStep,
  nextPath,
});

export const setContractGenerationErrors = (
  contractGenerationErrors: Record<string, string> | undefined
): types.SetContractGenerationErrors => ({
  type: types.SET_CONTRACT_GENERATION_ERRORS,
  contractGenerationErrors,
});

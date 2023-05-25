import { createSelector } from "reselect";
import { isSameObject } from "../../common/utils/object";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_GROUP,
} from "../constants/applicationStatuses";
import {
  APPLICATION_STEPS,
  APPLICATION_STEPS_LABELS,
} from "../constants/applicationSteps";
import { ApplicationFormState } from "../types/ApplicationFormState";
import { ApplicationState } from "../types/ApplicationState";
import { quoteResponseDefaultValue } from "../types/QuoteResponse";
import { getApplicationStates } from "../utils/application";

export const applicationFormSelector = (
  state: ApplicationState
): ApplicationFormState => state.application.applicationForm;

export const getApplicationSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.application
);

export const getApplicationInvalidStates = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const applicationStates = getApplicationStates(applicationForm.application);
    const invalidStates: string[] = [];
    for (const state in applicationStates) {
      if (!applicationStates[state])
        invalidStates.push(
          APPLICATION_STEPS_LABELS[state as APPLICATION_STEPS]
        );
    }
    return invalidStates;
  }
);

export const getApplicationStatusSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.application.status
);

export const getIsApplicationReadyToSubmitSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const applicationStates = getApplicationStates(applicationForm.application);
    for (const state of Object.keys(applicationStates)) {
      if (state !== "notes" && !applicationStates[state]) return false;
    }

    if (
      !(APPLICATION_STATUS_GROUP.TO_BE_SUBMITTED as string[]).includes(
        applicationForm.application.status
      )
    )
      return false;

    if (!applicationForm.noteForm.hasApplicantConsent) return false;
    if (applicationForm.noteForm.hasForeseeableFinancialChange === null)
      return false;

    return true;
  }
);

export const getIsApplicationStatusSubmittedSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const {
      application: { status },
    } = applicationForm;
    if ((APPLICATION_STATUS_GROUP.SUBMITTED as string[]).includes(status))
      return true;

    return false;
  }
);

export const getIsApplicationStatusInProgressSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const {
      application: { status },
    } = applicationForm;
    if ((APPLICATION_STATUS_GROUP.IN_PROGRESS as string[]).includes(status))
      return true;

    return false;
  }
);

export const getIsApplicationStatusApprovedSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const {
      application: { status },
    } = applicationForm;
    if ((APPLICATION_STATUS_GROUP.APPROVED as string[]).includes(status))
      return true;

    return false;
  }
);

export const getIsApplicationStatusInSettlementSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const {
      application: { status },
    } = applicationForm;
    if ((APPLICATION_STATUS_GROUP.IN_SETTLEMENT as string[]).includes(status))
      return true;

    return false;
  }
);

export const getIsApplicationStatusLockedSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const {
      application: { status },
    } = applicationForm;
    if ((APPLICATION_STATUS_GROUP.LOCKED as string[]).includes(status))
      return true;

    return false;
  }
);

export const getIsApplicationStatusWithdrawnSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const {
      application: { status },
    } = applicationForm;
    if (
      ([
        APPLICATION_STATUSES.WITHDRAWN_BY_INTRODUCER,
        APPLICATION_STATUSES.WITHDRAWN_BY_LENDER,
      ] as string[]).includes(status)
    )
      return true;

    return false;
  }
);

export const getIsApplicationStatusSettledSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const {
      application: { status },
    } = applicationForm;
    if (status === APPLICATION_STATUSES.SETTLED) return true;

    return false;
  }
);

export const getIsApplicationStatusDeclinedSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const {
      application: { status },
    } = applicationForm;
    if (status === APPLICATION_STATUSES.DECLINED) return true;

    return false;
  }
);

export const getApplicationApplicantSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.application.applicant
);

export const getApplicationQuoteSelector = createSelector(
  applicationFormSelector,
  (applicationForm) =>
    applicationForm.application.quote ?? quoteResponseDefaultValue
);

export const getApplicationGuarantorsSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.application.guarantors
);

export const getApplicationSecuritySelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.application.security
);

export const getApplicationNoteSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.application.note
);

export const getApplicantFormSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.applicantForm
);

export const getApplicantFormTempSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.applicantFormTemp
);

export const getQuoteFormSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.quoteForm
);

export const getQuoteFormTempSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.quoteFormTemp
);

export const getQuoteCalculationLoading = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.quoteForm.calculationLoading
);

export const getGuarantorFormsSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.guarantorForms
);

export const getGuarantorFormsTempSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.guarantorFormsTemp
);

export const getSecurityFormSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.securityForm
);

export const getSecurityFormTempSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.securityFormTemp
);

export const getSecurityComparisonSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.securityComparison
);

export const getNoteFormSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.noteForm
);

export const getNoteFormTempSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.noteFormTemp
);

export const getRequiredDocumentsSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.requiredDocuments
);

export const getRedirectSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => ({
    redirectPath: applicationForm.redirectPath,
    redirectType: applicationForm.redirectType,
  })
);

export const getStepsSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.steps
);

export const getPreviousStepSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.previousStep
);

export const getCurrentStepSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.currentStep
);

export const getIsFormLoadingSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.isFormLoading
);

export const getDetailsLoadingSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.getDetailsLoading
);

export const getRequiredDocumentsLoadingSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.getRequiredDocumentsLoading
);

export const getCloneApplicationLoadingSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.cloneApplicationLoading
);

export const getClonedApplicationIdSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.clonedApplicationId
);

export const getIsApplicationSubmittedSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.isApplicationSubmitted
);

export const getIsApplicationAmendedSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.isApplicationAmended
);

export const getIsGlassGuideAvailableSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.isGlassGuideAvailable
);

export const getIsNotesFormDirtySelector = createSelector(
  applicationFormSelector,
  (applicationForm) => {
    const oldObject = (applicationForm.noteFormTemp as unknown) as Record<
      string,
      unknown
    >;
    const newObject = (applicationForm.noteForm as unknown) as Record<
      string,
      unknown
    >;
    return !isSameObject(oldObject, newObject);
  }
);

export const getNextPathSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.nextPath
);

export const getAssessmentIdSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.application.assessmentId
);

export const getQuoteChangedPopupSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.quoteChangedPopUpShown
);

export const getContractGenerationErrorsSelector = createSelector(
  applicationFormSelector,
  (applicationForm) => applicationForm.contractsGenerationErrors
);

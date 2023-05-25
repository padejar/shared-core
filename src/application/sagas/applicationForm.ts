import { AxiosError } from "axios";
import { put, call, ForkEffect, takeLatest, select } from "redux-saga/effects";
import { HTTP_STATUS_CODES } from "../../common/constants/httpStatusCodes";
import { SingleResponse } from "../../common/types/SingleResponse";
import {
  extractProperties,
  isSameArray,
  isSameObject,
} from "../../common/utils/object";
import { processErrorMessage } from "../../error-handler/utils";
import { GlassGuideService } from "../../glass-guide";
import { actionCreator as notifAction } from "../../notification";
import * as actionCreators from "../actions/creators/applicationForm";
import * as actionTypes from "../actions/types/applicationForm";
import {
  AMENDMENT_TRIGGER_STATUSES,
  APPLICATION_STATUSES,
} from "../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../constants/applicationSteps";
import { NOTIFICATION_IDS } from "../constants/notificationIds";
import { REDIRECT_TYPES } from "../constants/redirectTypes";
import {
  getApplicantFormSelector,
  getApplicantFormTempSelector,
  getApplicationSelector,
  getApplicationStatusSelector,
  getGuarantorFormsSelector,
  getGuarantorFormsTempSelector,
  getNoteFormSelector,
  getNoteFormTempSelector,
  getQuoteFormSelector,
  getQuoteFormTempSelector,
  getSecurityFormSelector,
  getSecurityFormTempSelector,
} from "../selectors/applicationForm";
import ApplicationService from "../services/ApplicationService";
import QuoteService from "../services/QuoteService";
import { ApplicantForm } from "../types/ApplicantForm";
import { ApplicantResponse } from "../types/ApplicantResponse";
import {
  ApplicationResponse,
  applicationResponseDefaultValue,
} from "../types/ApplicationResponse";
import { GuarantorForm } from "../types/GuarantorForm";
import { NoteRequest } from "../types/NoteRequest";
import { NoteResponse } from "../types/NoteResponse";
import { QuoteCalculateResponse } from "../types/QuoteCalculateResponse";
import { QuoteFormSave } from "../types/QuoteFormSave";
import { QuoteResponse } from "../types/QuoteResponse";
import { RequiredDocuments } from "../types/RequiredDocuments";
import { SecurityForm } from "../types/SecurityForm";
import {
  SecurityRequest,
  securityRequestDefaultValue,
} from "../types/SecurityRequest";
import { transformToApplicantRequest } from "../utils/applicant";
import { transformToGuarantorsRequest } from "../utils/guarantors";
import { processCalculatePayload, processSavePayload } from "../utils/quote";
import { transformToSecurityRequest } from "../utils/security";

function* resetApplicationDetailsWorker() {
  yield put(actionCreators.updateApplication(applicationResponseDefaultValue));
}

function* getApplicationDetailsWorker({
  id,
}: actionTypes.GetApplicationDetails) {
  try {
    if (id && id !== "new") {
      const result: SingleResponse<ApplicationResponse> = yield call(
        ApplicationService.getApplicationDetails,
        id
      );
      yield put(actionCreators.getApplicationDetailsSuccess(result.data));
    } else {
      yield put(
        actionCreators.getApplicationDetailsSuccess(
          applicationResponseDefaultValue
        )
      );
    }
  } catch (e) {
    const error = e as AxiosError;
    const message = processErrorMessage(error);
    let notifId = "";
    if (error.isAxiosError) {
      if (error.response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
        notifId = NOTIFICATION_IDS.NOT_FOUND_ERRORS + id;
      }
    }
    yield put(
      notifAction.setNotification({
        id: notifId,
        body: message,
        className: "qst-notif-danger",
      })
    );
  }
}

function* getApplicationDetailsSuccessWorker({
  application,
}: actionTypes.GetApplicationDetailsSuccess) {
  if (!application.id) return;
  yield put(actionCreators.updateApplication(application));
}

function* saveApplicationWorker({
  applicationForm,
  isDraft,
  nextStep,
}: actionTypes.SaveApplication) {
  try {
    const clonedApplication = Object.assign({}, applicationForm);
    const applicationRequest = {
      name: clonedApplication.name,
      isDraft,
      quote: processSavePayload(clonedApplication.quote, isDraft),
    };
    const result: SingleResponse<ApplicationResponse> = yield call(
      ApplicationService.saveApplication,
      applicationRequest
    );
    yield put(actionCreators.saveApplicationSuccess(result.data));
    yield put(actionCreators.updateApplication(result.data));

    if (nextStep) {
      yield put(
        actionCreators.setRedirectPath(
          `/application/applications/${result.data.id}/${nextStep}`,
          REDIRECT_TYPES.REPLACE
        )
      );
    } else {
      yield put(
        actionCreators.setRedirectPath(
          `/application/applications`,
          REDIRECT_TYPES.REPLACE
        )
      );
    }
  } catch (e) {
    const message = processErrorMessage(e as AxiosError);
    yield put(
      notifAction.setNotification({
        body: message,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.setFormLoading(false));
  }
}

function* calculateQuoteWorker({ quoteForm }: actionTypes.CalculateQuote) {
  try {
    const quoteCalculateRequest = processCalculatePayload(quoteForm);
    const result: SingleResponse<QuoteCalculateResponse> = yield call(
      QuoteService.calculateQuote,
      quoteCalculateRequest
    );
    yield put(actionCreators.calculateQuoteSuccess(result.data));
  } catch (e) {
    yield put(actionCreators.setCalculationLoading(false));
    const message = processErrorMessage(e as AxiosError);
    yield put(
      notifAction.setNotification({
        id: NOTIFICATION_IDS.QUOTE_CALCULATE_ERROR,
        body: message,
        className: "qst-notif-danger",
      })
    );
  }
}

function* saveQuoteWorker({
  quoteForm,
  isDraft,
  applicationId,
  nextPath,
}: actionTypes.SaveQuote) {
  try {
    const quoteSaveRequest = processSavePayload(quoteForm, isDraft);
    const result: SingleResponse<QuoteResponse> = yield call(
      ApplicationService.saveQuote,
      quoteSaveRequest,
      applicationId
    );
    yield put(actionCreators.saveQuoteSuccess(result.data));
    yield put(actionCreators.getApplicationDetails(applicationId));
    if (nextPath) {
      yield put(
        actionCreators.setRedirectPath(nextPath, REDIRECT_TYPES.REPLACE)
      );
    } else {
      yield put(actionCreators.setRedirectPath(nextPath, REDIRECT_TYPES.PUSH));
    }
  } catch (e) {
    const message = processErrorMessage(e as AxiosError);
    yield put(
      notifAction.setNotification({
        body: message,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.setFormLoading(false));
  }
}

function* saveApplicantWorker({
  applicantForm,
  isDraft,
  applicationId,
  nextPath,
}: actionTypes.SaveApplicant) {
  try {
    const applicantSaveRequest = transformToApplicantRequest(
      applicantForm,
      isDraft
    );
    const result: SingleResponse<ApplicantResponse> = yield call(
      ApplicationService.saveApplicant,
      applicantSaveRequest,
      applicationId
    );
    yield put(actionCreators.saveApplicantSuccess(result.data));
    yield put(actionCreators.getApplicationDetails(applicationId));
    if (nextPath) {
      yield put(actionCreators.setRedirectPath(nextPath, REDIRECT_TYPES.PUSH));
    } else {
      yield put(
        actionCreators.setRedirectPath(
          `/application/applications`,
          REDIRECT_TYPES.PUSH
        )
      );
    }
  } catch (e) {
    const message = processErrorMessage(e as AxiosError);
    yield put(
      notifAction.setNotification({
        body: message,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.setFormLoading(false));
  }
}

function* saveGuarantorWorker({
  guarantorForms,
  isDraft,
  applicationId,
  nextPath,
}: actionTypes.SaveGuarantors) {
  try {
    const guarantors = transformToGuarantorsRequest(guarantorForms, isDraft);
    yield call(ApplicationService.saveGuarantors, guarantors, applicationId);
    yield put(actionCreators.saveGuarantorsSuccess());
    yield put(actionCreators.getApplicationDetails(applicationId));
    if (nextPath) {
      yield put(actionCreators.setRedirectPath(nextPath, REDIRECT_TYPES.PUSH));
    } else {
      yield put(
        actionCreators.setRedirectPath(
          `/application/applications`,
          REDIRECT_TYPES.PUSH
        )
      );
    }
  } catch (e) {
    const message = processErrorMessage(e as AxiosError);
    yield put(
      notifAction.setNotification({
        body: message,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.setFormLoading(false));
  }
}

function* saveSecurityWorker({
  securityForm,
  isDraft,
  applicationId,
  nextPath,
  popupQuoteChanged,
}: actionTypes.SaveSecurity) {
  try {
    const securityRequest = transformToSecurityRequest(securityForm, isDraft);
    const result: SingleResponse<SecurityRequest> = yield call(
      ApplicationService.saveSecurity,
      securityRequest,
      applicationId
    );
    yield put(actionCreators.saveSecuritySuccess(result.data));
    yield put(actionCreators.getApplicationDetails(applicationId));

    if (popupQuoteChanged) {
      yield put(actionCreators.quoteChangedPopupToggle(true));
    }

    if (nextPath) {
      yield put(actionCreators.setRedirectPath(nextPath, REDIRECT_TYPES.PUSH));
    } else {
      yield put(
        actionCreators.setRedirectPath(
          `/application/applications`,
          REDIRECT_TYPES.PUSH
        )
      );
    }
  } catch (e) {
    const message = processErrorMessage(e as AxiosError);
    yield put(
      notifAction.setNotification({
        body: message,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.setFormLoading(false));
  }
}

function* updateSecurityWorker({ securityForm }: actionTypes.UpdateSecurity) {
  const application: ApplicationResponse = yield select(getApplicationSelector);
  const oldSecurityForm: SecurityForm = yield select(
    getSecurityFormTempSelector
  );

  yield put(actionCreators.setContractGenerationErrors(undefined));

  if (
    securityForm.manufactureYear &&
    oldSecurityForm.manufactureYear !== securityForm.manufactureYear
  ) {
    if (
      AMENDMENT_TRIGGER_STATUSES.includes(
        application.status as APPLICATION_STATUSES
      )
    ) {
      yield put(actionCreators.setIsApplicationAmended(true));
    } else {
      const newSecurityForm: SecurityForm = yield select(
        getSecurityFormSelector
      );
      yield put(
        actionCreators.saveSecurity(
          application.id,
          {
            ...oldSecurityForm,
            ...newSecurityForm,
            ...securityForm,
          },
          true,
          `/application/applications/${application.id}/${APPLICATION_STEPS.security}`,
          true
        )
      );
    }
  }
}

function* saveNoteWorker({
  note,
  isDraft,
  applicationId,
  nextPath,
}: actionTypes.SaveNote) {
  try {
    const result: SingleResponse<NoteResponse> = yield call(
      ApplicationService.saveNote,
      {
        ...note,
        hasBrokerConsent: true,
        hasForeseeableFinancialChange: false,
        isDraft,
      },
      applicationId
    );
    if (!isDraft) {
      yield put(
        actionCreators.submitApplication(result.data.applicationId as string)
      );
    } else {
      yield put(actionCreators.getApplicationDetails(applicationId));
      yield put(actionCreators.saveNoteSuccess(result.data));
      if (nextPath) {
        yield put(
          actionCreators.setRedirectPath(nextPath, REDIRECT_TYPES.PUSH)
        );
      } else {
        yield put(
          actionCreators.setRedirectPath(
            `/application/applications`,
            REDIRECT_TYPES.PUSH
          )
        );
      }
    }
  } catch (e) {
    const message = processErrorMessage(e as AxiosError);
    yield put(
      notifAction.setNotification({
        body: message,
        className: "qst-notif-danger",
      })
    );
    yield put(actionCreators.setFormLoading(false));
  }
}

function* getRequiredDocumentsWorker({
  applicationId,
}: actionTypes.GetRequiredDocuments) {
  try {
    const result: SingleResponse<RequiredDocuments> = yield call(
      ApplicationService.getRequiredDocuments,
      applicationId
    );
    yield put(actionCreators.getRequiredDocumentsSuccess(result.data));
  } catch (e) {
    const message = processErrorMessage(e as AxiosError);
    yield put(
      notifAction.setNotification({
        body: message,
        className: "qst-notif-danger",
      })
    );
  } finally {
    yield put(actionCreators.getRequiredDocumentsComplete());
  }
}

function* submitApplicationWorker({
  applicationId,
}: actionTypes.SubmitApplication) {
  try {
    const result: SingleResponse<ApplicationResponse> = yield call(
      ApplicationService.submitApplication,
      applicationId
    );
    yield put(actionCreators.submitApplicationSuccess(result.data));
    yield put(actionCreators.getApplicationDetails(applicationId));
  } catch (e) {
    yield put(actionCreators.setFormLoading(false));
    const message = processErrorMessage(e as AxiosError);
    yield put(
      notifAction.setNotification({
        body: message,
        className: "qst-notif-danger",
      })
    );
  }
}

function* cloneApplicationWorker({
  applicationId,
}: actionTypes.CloneApplication) {
  try {
    const result: SingleResponse<ApplicationResponse> = yield call(
      ApplicationService.cloneApplication,
      applicationId
    );
    yield put(actionCreators.cloneApplicationSuccess(result.data.id));
  } catch (e) {
    const message = processErrorMessage(e as AxiosError);
    yield put(
      notifAction.setNotification({
        body: message,
        className: "qst-notif-danger",
      })
    );
  } finally {
    yield put(actionCreators.setFormLoading(false));
  }
}

function* amendmendChecker(stepName: APPLICATION_STEPS) {
  let isApplicationAmended = false;
  if (stepName !== APPLICATION_STEPS.contracts) {
    if (stepName === APPLICATION_STEPS.guarantors) {
      const oldGuarantorForms: GuarantorForm[] = yield select(
        getGuarantorFormsTempSelector
      );
      const newGuarantorForms: GuarantorForm[] = yield select(
        getGuarantorFormsSelector
      );
      isApplicationAmended = !isSameArray(oldGuarantorForms, newGuarantorForms);
    } else {
      let oldObject: Record<string, unknown> = {};
      let newObject: Record<string, unknown> = {};
      if (stepName === APPLICATION_STEPS.quotes) {
        oldObject = yield select(getQuoteFormTempSelector);
        newObject = yield select(getQuoteFormSelector);
      } else if (stepName === APPLICATION_STEPS.applicant) {
        oldObject = yield select(getApplicantFormTempSelector);
        newObject = yield select(getApplicantFormSelector);
      } else if (stepName === APPLICATION_STEPS.security) {
        oldObject = yield select(getSecurityFormTempSelector);
        newObject = yield select(getSecurityFormSelector);
        oldObject = extractProperties(
          oldObject,
          Object.keys(securityRequestDefaultValue)
        ) as Record<string, unknown>;
        newObject = extractProperties(
          newObject,
          Object.keys(securityRequestDefaultValue)
        ) as Record<string, unknown>;
      } else {
        oldObject = yield select(getNoteFormTempSelector);
        newObject = yield select(getNoteFormSelector);
      }

      isApplicationAmended = !isSameObject(oldObject, newObject);
    }
  }
  return isApplicationAmended;
}

function* saveAndExitWorker({
  currentStep,
  nextPath,
}: actionTypes.SaveAndExit) {
  const application: ApplicantResponse = yield select(getApplicationSelector);
  const applicationStatus: APPLICATION_STATUSES = yield select(
    getApplicationStatusSelector
  );

  const isApplicationAmended: boolean = yield call(
    amendmendChecker,
    currentStep
  );

  if (isApplicationAmended) {
    if (AMENDMENT_TRIGGER_STATUSES.includes(applicationStatus)) {
      yield put(actionCreators.setIsApplicationAmended(true));
    } else {
      yield put(
        actionCreators.saveForm(
          currentStep,
          application.id as string,
          true,
          nextPath
        )
      );
    }
  } else {
    yield put(actionCreators.setRedirectPath(nextPath, REDIRECT_TYPES.PUSH));
  }
}

function* setActiveStateWorker({
  stepName,
  previousStep,
}: actionTypes.SetActiveStep) {
  if (previousStep) {
    const application: ApplicantResponse = yield select(getApplicationSelector);
    const applicationStatus: APPLICATION_STATUSES = yield select(
      getApplicationStatusSelector
    );
    const isApplicationAmended: boolean = yield call(
      amendmendChecker,
      previousStep
    );

    if (isApplicationAmended) {
      if (AMENDMENT_TRIGGER_STATUSES.includes(applicationStatus)) {
        yield put(actionCreators.setIsApplicationAmended(true));
      } else {
        if (previousStep) {
          yield put(
            actionCreators.saveForm(
              previousStep,
              application.id as string,
              true,
              stepName
            )
          );
        }
      }
    } else {
      yield put(
        actionCreators.setRedirectPath(
          `/application/applications/${application.id}/${stepName}`,
          REDIRECT_TYPES.PUSH
        )
      );
    }
  }
}

function* revertChangesWorker({
  stepName,
  nextPath,
}: actionTypes.RevertChanges) {
  yield put(actionCreators.setIsApplicationAmended(false));
  if (stepName === APPLICATION_STEPS.quotes) {
    const oldQuoteForm: QuoteFormSave = yield select(getQuoteFormTempSelector);
    yield put(actionCreators.updateQuote(oldQuoteForm));
  } else if (stepName === APPLICATION_STEPS.applicant) {
    const oldApplicantForm: ApplicantForm = yield select(
      getApplicantFormTempSelector
    );
    yield put(actionCreators.updateApplicant(oldApplicantForm));
  } else if (stepName === APPLICATION_STEPS.guarantors) {
    const oldGuararantorsForm: GuarantorForm[] = yield select(
      getGuarantorFormsTempSelector
    );
    yield put(actionCreators.updateGuarantors(oldGuararantorsForm));
  } else if (stepName === APPLICATION_STEPS.security) {
    const oldSecurityForm: SecurityForm = yield select(
      getSecurityFormTempSelector
    );
    yield put(actionCreators.updateSecurity(oldSecurityForm));
  } else {
    const oldNotesForm: NoteRequest = yield select(getNoteFormTempSelector);
    yield put(actionCreators.updateNote(oldNotesForm));
  }

  if (nextPath) {
    yield put(actionCreators.setRedirectPath(nextPath, REDIRECT_TYPES.PUSH));
  }
}

function* saveFormWorker({
  stepName,
  applicationId,
  isDraft,
  nextPath,
}: actionTypes.SaveForm) {
  yield put(actionCreators.setIsApplicationAmended(false));
  if (stepName === APPLICATION_STEPS.quotes) {
    const quoteForm: QuoteFormSave = yield select(getQuoteFormSelector);
    yield put(
      actionCreators.saveQuote(applicationId, quoteForm, isDraft, nextPath)
    );
  } else if (stepName === APPLICATION_STEPS.applicant) {
    const applicantForm: ApplicantForm = yield select(getApplicantFormSelector);
    yield put(
      actionCreators.saveApplicant(
        applicationId,
        applicantForm,
        isDraft,
        nextPath
      )
    );
  } else if (stepName === APPLICATION_STEPS.guarantors) {
    const guarantorForms: GuarantorForm[] = yield select(
      getGuarantorFormsSelector
    );
    yield put(
      actionCreators.saveGuarantors(
        applicationId,
        guarantorForms,
        isDraft,
        nextPath
      )
    );
  } else if (stepName === APPLICATION_STEPS.security) {
    const securityForm: SecurityForm = yield select(getSecurityFormSelector);
    const oldSecurityForm: SecurityForm = yield select(
      getSecurityFormTempSelector
    );
    let popupQuoteChanged = false;
    if (oldSecurityForm.manufactureYear !== securityForm.manufactureYear) {
      popupQuoteChanged = true;
    }
    yield put(
      actionCreators.saveSecurity(
        applicationId,
        securityForm,
        isDraft,
        nextPath,
        popupQuoteChanged
      )
    );
  } else {
    const noteForm: NoteRequest = yield select(getNoteFormSelector);
    yield put(
      actionCreators.saveNote(applicationId, noteForm, isDraft, nextPath)
    );
  }
}

function* checkGlassGuideWorker() {
  try {
    const { data: isAvailable }: SingleResponse<boolean> = yield call(
      GlassGuideService.checkGlassGuide
    );
    yield put(actionCreators.checkGlassGuideAvailabilitySuccess(isAvailable));
  } catch (error) {
    yield put(actionCreators.CheckGlassGuideAvailabilityFailed());
    const message = processErrorMessage(error as AxiosError);
    yield put(
      notifAction.setNotification({
        body: message,
        className: "qst-notif-danger",
      })
    );
  }
}

function* watchApplicationForm(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest(
    actionTypes.RESET_APPLICATION_DETAILS,
    resetApplicationDetailsWorker
  );
  yield takeLatest(
    actionTypes.GET_APPLICATION_DETAILS,
    getApplicationDetailsWorker
  );
  yield takeLatest(
    actionTypes.GET_APPLICATION_DETAILS_SUCCESS,
    getApplicationDetailsSuccessWorker
  );
  yield takeLatest(actionTypes.SAVE_APPLICATION, saveApplicationWorker);
  yield takeLatest(actionTypes.CALCULATE_QUOTE, calculateQuoteWorker);
  yield takeLatest(actionTypes.SAVE_QUOTE, saveQuoteWorker);
  yield takeLatest(actionTypes.SAVE_APPLICANT, saveApplicantWorker);
  yield takeLatest(actionTypes.SAVE_GUARANTORS, saveGuarantorWorker);
  yield takeLatest(actionTypes.SAVE_SECURITY, saveSecurityWorker);
  yield takeLatest(actionTypes.UPDATE_SECURITY, updateSecurityWorker);
  yield takeLatest(actionTypes.SAVE_NOTE, saveNoteWorker);
  yield takeLatest(actionTypes.SUBMIT_APPLICATION, submitApplicationWorker);
  yield takeLatest(
    actionTypes.GET_REQUIRED_DOCUMENTS,
    getRequiredDocumentsWorker
  );
  yield takeLatest(actionTypes.CLONE_APPLICATION, cloneApplicationWorker);
  yield takeLatest(actionTypes.SET_ACTIVE_STEP, setActiveStateWorker);
  yield takeLatest(actionTypes.REVERT_CHANGES, revertChangesWorker);
  yield takeLatest(actionTypes.SAVE_FORM, saveFormWorker);
  yield takeLatest(
    actionTypes.CHECK_GLASS_GUIDE_AVAILABILITY,
    checkGlassGuideWorker
  );
  yield takeLatest(actionTypes.SAVE_AND_EXIT, saveAndExitWorker);
}

export default watchApplicationForm;

import { parseNumber } from "../../common/utils/number";
import { numberToString } from "../../common/utils/string";
import * as actions from "../actions/types/applicationForm";
import { AMOUNT_TYPES } from "../constants/amountTypes";
import { APPLICATION_STATUSES } from "../constants/applicationStatuses";
import {
  ASSET_TYPE_LIST,
  DISABLED_ASSET_TYPE_LIST,
} from "../constants/assetTypes";
import {
  FINANCE_TYPE_CHATTEL_MORTGAGE,
  QUOTE_ADVANCE_OR_ARREARS,
} from "../constants/quote";
import { REPAYMENT_TERM_OPTIONS } from "../constants/repaymentTermOptions";
import { SECURITY_DETAILS_INPUT_TYPES } from "../constants/securityDetailsInputTypes";
import { USAGE_TYPES } from "../constants/usageTypes";
import {
  ApplicationFormState,
  applicationFormStateDefaultValue,
} from "../types/ApplicationFormState";
import { QuoteFormSave } from "../types/QuoteFormSave";
import { QuoteResponse } from "../types/QuoteResponse";
import { SecurityComparison } from "../types/SecurityComparison";
import { getAddressFromEntity } from "../utils/address";
import {
  getApplicationStates,
  transformApplication,
} from "../utils/application";
import { processBalloonAndBrokerageForm } from "../utils/quote";

const applicationFormState: ApplicationFormState = applicationFormStateDefaultValue;

const setAssetSubTypes = (
  state: ApplicationFormState
): ApplicationFormState => {
  if (state.securityForm.assetTypeCategory !== "") {
    const matchingAssetType = ASSET_TYPE_LIST.find(
      (type) => type.value === state.securityForm.assetTypeCategory
    );

    let assetSubtypes = matchingAssetType?.subTypes;

    assetSubtypes = matchingAssetType?.subTypes.filter(
      (item) =>
        !DISABLED_ASSET_TYPE_LIST.includes(item.value) ||
        state.application.security.assetType === item.value
    );

    if (matchingAssetType) {
      return {
        ...state,
        securityForm: {
          ...state.securityForm,
          assetSubtypes,
        },
      };
    }
  }

  return state;
};

export const reducer = (
  state: ApplicationFormState = applicationFormState,
  action: actions.ApplicationFormActions
): ApplicationFormState => {
  switch (action.type) {
    case actions.RESET_APPLICATION_DETAILS: {
      return {
        ...state,
        getDetailsLoading: false,
      };
    }
    case actions.GET_APPLICATION_DETAILS: {
      return {
        ...state,
        getDetailsLoading: true,
      };
    }
    case actions.GET_APPLICATION_DETAILS_SUCCESS: {
      return {
        ...state,
        getDetailsLoading: false,
      };
    }
    case actions.GET_APPLICATION_DETAILS_FAILED: {
      return {
        ...state,
        getDetailsLoading: false,
      };
    }
    case actions.UPDATE_APPLICATION: {
      const application = {
        ...state.application,
        ...action.application,
      };
      const {
        quoteForm,
        applicantForm,
        guarantorForms,
        securityForm,
        noteForm,
      } = transformApplication(application);
      const applicationStates = getApplicationStates(application);
      const steps = Object.assign({}, state.steps);
      steps.quotes = {
        ...steps.quotes,
        isStepDone: applicationStates.quote,
        isClickable: true,
      };
      steps.applicant = {
        ...steps.applicant,
        isStepDone: applicationStates.applicant,
        isClickable:
          application.applicant !== null || applicationStates.quote === true,
      };
      steps.guarantors = {
        ...steps.guarantors,
        isStepDone: applicationStates.guarantors,
        isClickable:
          application.guarantors.length > 0 ||
          applicationStates.applicant === true,
      };
      steps.security = {
        ...steps.security,
        isStepDone: applicationStates.security,
        isClickable:
          application.security !== null ||
          applicationStates.guarantors === true,
      };
      steps.notes = {
        ...steps.notes,
        isStepDone: applicationStates.notes,
        isClickable:
          application.note !== null || applicationStates.security === true,
      };
      steps.contracts = {
        ...steps.contracts,
        isClickable:
          !([
            APPLICATION_STATUSES.QUOTED,
            APPLICATION_STATUSES.DRAFTED_AMENDED,
            APPLICATION_STATUSES.DRAFTED_NEW,
          ] as string[]).includes(application.status) ||
          applicationStates.notes === true,
      };
      return {
        ...state,
        isFormLoading: false,
        application,
        quoteForm,
        quoteFormTemp: quoteForm,
        applicantForm,
        applicantFormTemp: applicantForm,
        guarantorForms,
        guarantorFormsTemp: guarantorForms,
        securityForm,
        securityFormTemp: securityForm,
        noteForm,
        noteFormTemp: noteForm,
        steps,
      };
    }
    case actions.SAVE_APPLICATION: {
      return {
        ...state,
        isFormLoading: true,
      };
    }
    case actions.SAVE_APPLICATION_SUCCESS: {
      return {
        ...state,
        isFormLoading: false,
      };
    }
    case actions.SUBMIT_APPLICATION: {
      return {
        ...state,
        isFormLoading: true,
        isApplicationSubmitted: false,
      };
    }
    case actions.SUBMIT_APPLICATON_SUCCESS: {
      return {
        ...state,
        ...action.applicationResponse,
        isFormLoading: false,
        isApplicationSubmitted: true,
      };
    }
    case actions.SET_IS_APPLICATION_SUBMITTED: {
      return {
        ...state,
        isApplicationSubmitted: action.isApplicationSubmitted,
      };
    }
    case actions.UPDATE_QUOTE: {
      let quoteForm = {
        ...state.quoteForm,
        ...action.quoteForm,
        financeType: FINANCE_TYPE_CHATTEL_MORTGAGE,
        hasStructuredPayment: false,
        structuredPaymentAmount: "",
        structuredPaymentNthPaymentAmount: "",
      };

      if (state.quoteForm.balloonType === null) {
        quoteForm = {
          ...quoteForm,
          balloonType: AMOUNT_TYPES.PERCENTAGE,
        };
      }

      if (state.quoteForm.brokerageType === null) {
        quoteForm = {
          ...quoteForm,
          brokerageType: AMOUNT_TYPES.PERCENTAGE,
        };
      }

      if (state.quoteForm.isFinancierRateManual === null) {
        quoteForm = {
          ...quoteForm,
          isFinancierRateManual: false,
        };
      }

      if (state.quoteForm.includeFees === null) {
        quoteForm = {
          ...quoteForm,
          includeFees: false,
        };
      }

      if (state.quoteForm.advanceOrArrears === null) {
        quoteForm = {
          ...quoteForm,
          advanceOrArrears: QUOTE_ADVANCE_OR_ARREARS.ADVANCE,
        };
      }

      if (state.quoteForm.repaymentTermOption === null) {
        quoteForm = {
          ...quoteForm,
          repaymentTermOption: REPAYMENT_TERM_OPTIONS.MONTHLY,
        };
      }

      return {
        ...state,
        quoteForm,
      };
    }
    case actions.CALCULATE_QUOTE: {
      return {
        ...state,
        quoteForm: {
          ...state.quoteForm,
          calculationLoading: true,
          shouldCompareQuote: false,
        },
      };
    }
    case actions.CALCULATE_QUOTE_SUCCESS: {
      const quote: QuoteResponse = {
        ...state.application.quote,
        ...action.quoteCalculateResponse,
      };

      if (state.quoteForm.brokerageType === AMOUNT_TYPES.PERCENTAGE) {
        quote.brokerageAmount = parseNumber(
          state.quoteForm.brokeragePercentage
        );
      } else {
        quote.brokerageAmount = parseNumber(state.quoteForm.brokerageNominal);
      }

      if (state.quoteForm.balloonType === AMOUNT_TYPES.PERCENTAGE) {
        quote.balloonAmount = parseNumber(state.quoteForm.balloonPercentage);
      } else {
        quote.balloonAmount = parseNumber(state.quoteForm.balloonNominal);
      }

      const {
        balloonPercentage,
        balloonNominal,
        brokeragePercentage,
        brokerageNominal,
      } = processBalloonAndBrokerageForm(quote, state.quoteForm);

      const quoteForm: QuoteFormSave = {
        ...state.quoteForm,
        balloonPercentage,
        balloonNominal,
        brokeragePercentage,
        brokerageNominal,
        shouldCompareQuote: false,
        financierRate: numberToString(
          action.quoteCalculateResponse.financierRate
        ),
        calculationLoading: false,
      };

      return {
        ...state,
        application: {
          ...state.application,
          quote,
        },
        quoteForm,
      };
    }
    case actions.SET_CALCULATION_LOADING: {
      return {
        ...state,
        quoteForm: {
          ...state.quoteForm,
          calculationLoading: action.calculationLoading,
        },
      };
    }
    case actions.SAVE_QUOTE: {
      return {
        ...state,
        isFormLoading: true,
      };
    }
    case actions.SAVE_QUOTE_SUCCESS: {
      return {
        ...state,
        isFormLoading: false,
      };
    }
    case actions.UPDATE_APPLICANT: {
      return {
        ...state,
        applicantForm: {
          ...state.applicantForm,
          ...action.applicantForm,
        },
      };
    }
    case actions.SAVE_APPLICANT: {
      return {
        ...state,
        isFormLoading: true,
      };
    }
    case actions.SAVE_APPLICANT_SUCCESS: {
      let guarantors = [...state.application.guarantors];
      guarantors = guarantors.map((guarantor) => {
        let clonedGuarantor = Object.assign({}, guarantor);

        if (clonedGuarantor.isAddressSameAsApplicant) {
          clonedGuarantor = {
            ...clonedGuarantor,
            ...getAddressFromEntity(action.applicantResponse),
          };
        }

        return clonedGuarantor;
      });

      return {
        ...state,
        application: {
          ...state.application,
          applicant: action.applicantResponse,
          guarantors,
        },
        isFormLoading: false,
      };
    }
    case actions.UPDATE_GUARANTORS: {
      return {
        ...state,
        guarantorForms: [...action.guarantorForms],
      };
    }
    case actions.UPDATE_GUARANTOR: {
      const guarantorForms = [...state.guarantorForms];
      let guarantorForm = Object.assign({}, guarantorForms[action.index]);
      guarantorForm = {
        ...guarantorForm,
        ...action.guarantorForm,
      };
      guarantorForms[action.index] = guarantorForm;

      return {
        ...state,
        guarantorForms,
      };
    }
    case actions.SAVE_GUARANTORS: {
      return {
        ...state,
        isFormLoading: true,
      };
    }
    case actions.SAVE_GUARANTORS_SUCCESS: {
      return {
        ...state,
        isFormLoading: false,
      };
    }
    case actions.CHECK_GLASS_GUIDE_AVAILABILITY_SUCCESS: {
      return {
        ...state,
        isGlassGuideAvailable: action.isAvailable,
      };
    }
    case actions.SET_GLASS_GUIDE_SHOWN: {
      return {
        ...state,
        securityForm: {
          ...state.securityForm,
          isGlassGuideShown: action.isGlassGuideShown,
        },
      };
    }
    case actions.SET_SECURITY_COMPARISON: {
      return {
        ...state,
        securityComparison: action.securityComparison as SecurityComparison,
      };
    }
    case actions.INIT_SECURITY_FORM: {
      let newState = Object.assign({}, state);
      if (newState.application.quote) {
        const {
          supplierType,
          assetType,
          assetTypeCategory,
          assetManufactureYear,
        } = newState.application.quote;
        const manufactureYear = numberToString(assetManufactureYear);
        newState = {
          ...newState,
          securityForm: {
            ...newState.securityForm,
            supplierType: supplierType ?? "",
            assetType,
            assetTypeCategory,
            manufactureYear,
            securityDetailsInputType: newState.securityForm
              .securityDetailsInputType
              ? newState.securityForm.securityDetailsInputType
              : SECURITY_DETAILS_INPUT_TYPES.MANUAL,
          },
        };
      }

      newState = setAssetSubTypes(newState);

      return newState;
    }
    case actions.UPDATE_SECURITY: {
      let newState = Object.assign({}, state);

      newState = {
        ...newState,
        securityForm: {
          ...newState.securityForm,
          ...action.securityForm,
        },
      };

      if (
        newState.securityForm.securityDetailsInputType ===
          SECURITY_DETAILS_INPUT_TYPES.GLASS_LOOKUP &&
        action.securityForm.usageType
      ) {
        let retailValue = newState.securityForm.retailValue;

        if (action.securityForm.usageType === USAGE_TYPES.NEW) {
          retailValue = newState.securityForm.adjustedRrpValue ?? "";
        } else {
          retailValue = newState.securityForm.adjustedRetailValue ?? "";
        }

        newState = {
          ...newState,
          securityForm: {
            ...newState.securityForm,
            retailValue,
          },
        };
      }

      newState = setAssetSubTypes(newState);

      if (newState.application.quote && newState.application.quote.id) {
        const { quote } = newState.application;
        const { securityForm } = newState;
        let securityComparison = {
          fieldLabel: "",
          quoteFieldLabel: "",
          field: "",
          showAlert: false,
          initialValue: "",
        };
        if (
          quote.supplierType &&
          quote.supplierType !== newState.securityForm.supplierType
        ) {
          newState.securityForm.supplierType = state.securityForm.supplierType;
          securityComparison = {
            fieldLabel: "Supplier type",
            quoteFieldLabel: "Supplier type",
            field: "supplierType",
            showAlert: true,
            initialValue: quote.supplierType,
          };
        }
        if (
          quote.assetTypeCategory &&
          quote.assetTypeCategory !== newState.securityForm.assetTypeCategory
        ) {
          newState.securityForm.assetTypeCategory =
            state.securityForm.assetTypeCategory;
          securityComparison = {
            fieldLabel: "Asset type category",
            quoteFieldLabel: "Asset type category",
            field: "assetTypeCategory",
            showAlert: true,
            initialValue: quote.assetTypeCategory,
          };
        }

        if (quote.assetType && quote.assetType !== securityForm.assetType) {
          newState.securityForm.assetType = state.securityForm.assetType;
          securityComparison = {
            fieldLabel: "Asset type",
            quoteFieldLabel: "Asset type",
            field: "assetType",
            showAlert: true,
            initialValue: quote.assetType,
          };
        }

        if (!newState.securityForm.manufactureYear) {
          newState = {
            ...newState,
            securityForm: {
              ...newState.securityForm,
              manufactureYear: newState.securityFormTemp.manufactureYear,
            },
          };
        }

        newState = {
          ...newState,
          securityForm: {
            ...newState.securityForm,
          },
          securityComparison,
        };
      }

      return newState;
    }
    case actions.SAVE_SECURITY: {
      return {
        ...state,
        isFormLoading: true,
      };
    }
    case actions.SAVE_SECURITY_SUCCESS: {
      return {
        ...state,
        isFormLoading: false,
      };
    }
    case actions.QUOTE_CHANGED_POPUP_TOGGLE: {
      return {
        ...state,
        quoteChangedPopUpShown: action.quoteChangedPopUpShown,
      };
    }
    case actions.UPDATE_NOTE: {
      return {
        ...state,
        noteForm: {
          ...state.noteForm,
          ...action.note,
        },
      };
    }
    case actions.SAVE_NOTE: {
      return {
        ...state,
        isFormLoading: true,
      };
    }
    case actions.SAVE_NOTE_SUCCESS: {
      return {
        ...state,
        isFormLoading: false,
      };
    }
    case actions.GET_REQUIRED_DOCUMENTS: {
      return {
        ...state,
        getRequiredDocumentsLoading: true,
      };
    }
    case actions.GET_REQUIRED_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        requiredDocuments: action.requiredDocuments,
      };
    }
    case actions.GET_REQUIRED_DOCUMENTS_COMPLETE: {
      return {
        ...state,
        getRequiredDocumentsLoading: false,
      };
    }
    case actions.SET_FORM_LOADING: {
      return {
        ...state,
        isFormLoading: action.isLoading,
      };
    }
    case actions.CLONE_APPLICATION: {
      return {
        ...state,
        cloneApplicationLoading: true,
      };
    }
    case actions.CLONE_APPLICATION_SUCCESS: {
      return {
        ...state,
        clonedApplicationId: action.clonedApplicationId,
        cloneApplicationLoading: false,
      };
    }
    case actions.CLEAR_CLONED_APPLICATION_ID: {
      return {
        ...state,
        clonedApplicationId: null,
      };
    }
    case actions.SET_ACTIVE_STEP: {
      const previousStep = state.currentStep;
      const currentStep = state.steps[action.stepName];
      return {
        ...state,
        previousStep,
        currentStep,
        nextPath: `/application/applications/${state.application.id}/${action.stepName}`,
      };
    }
    case actions.SET_REDIRECT_PATH: {
      return {
        ...state,
        redirectType: action.redirectType,
        redirectPath: action.redirectPath,
      };
    }
    case actions.CLEAR_REDIRECT_PATH: {
      return {
        ...state,
        redirectPath: "",
      };
    }
    case actions.SET_IS_APPLICATION_AMENDED: {
      return {
        ...state,
        isApplicationAmended: action.isApplicationAmended,
      };
    }
    case actions.SAVE_AND_EXIT: {
      return {
        ...state,
        nextPath: action.nextPath,
      };
    }
    case actions.SET_CONTRACT_GENERATION_ERRORS: {
      return {
        ...state,
        contractsGenerationErrors: action.contractGenerationErrors,
      };
    }
    case actions.CLEAR_APPLICATION_FORM_STATE: {
      return applicationFormStateDefaultValue;
    }
    default: {
      return state;
    }
  }
};

import React, { useEffect } from "react";
import { CAlert } from "@coreui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  setFormErrors,
  getErrorMessageSelector,
} from "../../../../error-handler";
import {
  saveQuote,
  saveApplication,
  setActiveStep,
  saveAndExit,
} from "../../../actions/creators/applicationForm";
import ButtonsContainer from "../../../components/ButtonsContainer";
import QuoteForm from "../../../components/QuoteForm";
import { APPLICATION_STATUS_GROUP } from "../../../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../../../constants/applicationSteps";
import { useApplicationFormDispatch } from "../../../dispatchers";
import {
  getApplicationQuoteSelector,
  getApplicationStatusSelector,
  getIsApplicationStatusLockedSelector,
  getIsFormLoadingSelector,
  getQuoteCalculationLoading,
  getQuoteFormSelector,
} from "../../../selectors/applicationForm";
import { ApplicationTabProps } from "../../../types/ApplicationForm";
import { QuoteFormSave } from "../../../types/QuoteFormSave";
import { quoteSchema } from "../../../validations/quote";

const QuoteTab: React.FunctionComponent<ApplicationTabProps> = ({
  applicationId,
  pageAfterSave,
}: ApplicationTabProps) => {
  const applicationStatus = useSelector(getApplicationStatusSelector);
  const quote = useSelector(getApplicationQuoteSelector);
  const quoteForm = useSelector(getQuoteFormSelector);
  const isFormLoading = useSelector(getIsFormLoadingSelector);
  const calculationLoading = useSelector(getQuoteCalculationLoading);
  const errors = useSelector(getErrorMessageSelector);
  const isApplicationLocked = useSelector(getIsApplicationStatusLockedSelector);
  const dispatch = useApplicationFormDispatch();
  const hookFormMethods = useForm<QuoteFormSave>({
    resolver: joiResolver(quoteSchema),
    defaultValues: quoteForm,
  });

  useEffect(() => {
    hookFormMethods.setValue(
      "isFinancierRateManual",
      quoteForm.isFinancierRateManual
    );
    hookFormMethods.setValue("supplierType", quoteForm.supplierType);
    hookFormMethods.setValue("isPropertyOwner", quoteForm.isPropertyOwner);
    hookFormMethods.setValue(
      "repaymentTermMonth",
      quoteForm.repaymentTermMonth
    );
    hookFormMethods.setValue("includeFees", quoteForm.includeFees);
    hookFormMethods.setValue("balloonType", quoteForm.balloonType);
    hookFormMethods.setValue("brokerageType", quoteForm.brokerageType);
  }, [hookFormMethods, quoteForm, applicationStatus]);

  useEffect(() => {
    if (errors) {
      if (typeof errors !== "string") {
        setFormErrors(errors, hookFormMethods.setError);
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }, [errors, hookFormMethods.setError]);

  const createOrUpdateQuote = (
    isDraft: boolean,
    nextStep?: APPLICATION_STEPS
  ) => {
    const newApplication = applicationId === "new";

    const quote = { ...quoteForm, ...hookFormMethods.getValues() };
    if (newApplication) {
      dispatch(
        saveApplication(
          {
            name: "",
            quote,
          },
          isDraft,
          nextStep
        )
      );
    } else {
      const nextPath =
        nextStep || `/application/applications/${applicationId}/${nextStep}`;
      dispatch(saveQuote(applicationId as string, quote, isDraft, nextPath));
    }
  };

  const handleSaveAndExit = () => {
    if (applicationId === "new") {
      createOrUpdateQuote(true);
    } else {
      dispatch(saveAndExit(APPLICATION_STEPS.quotes, pageAfterSave));
    }
  };

  const handleNextClick = async () => {
    const isQuoteValid = await hookFormMethods.trigger();
    if (!isQuoteValid) return;

    if (
      (APPLICATION_STATUS_GROUP.TO_BE_SUBMITTED as string[]).includes(
        applicationStatus
      )
    ) {
      createOrUpdateQuote(false, APPLICATION_STEPS.applicant);
    } else {
      dispatch(
        setActiveStep(APPLICATION_STEPS.applicant, APPLICATION_STEPS.quotes)
      );
    }
  };

  return (
    <>
      <form autoComplete="off">
        {errors && typeof errors === "string" && (
          <CAlert color="danger">{errors}</CAlert>
        )}
        <FormProvider {...hookFormMethods}>
          <QuoteForm
            quoteForm={quoteForm}
            quoteDetails={quote}
            isLoading={isFormLoading}
            readOnly={isApplicationLocked}
          />
        </FormProvider>
        {Object.keys(hookFormMethods.errors).length > 0 && (
          <CAlert color="danger" data-testid="validation-error-message">
            There are missing information or invalid information
          </CAlert>
        )}
        <ButtonsContainer
          disabled={isFormLoading || calculationLoading}
          disableSave={isApplicationLocked}
          onSaveClick={() => handleSaveAndExit()}
          onSubmitClick={() => handleNextClick()}
        />
      </form>
    </>
  );
};

export default QuoteTab;

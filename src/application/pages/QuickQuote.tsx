import "./QuickQuote.scss";
import React, { useEffect, useState } from "react";
import { CAlert, CCard, CCardBody, CCol, CForm, CRow } from "@coreui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { getErrorMessageSelector, setFormErrors } from "../../error-handler";
import {
  clearRedirectPath,
  resetApplicationDetails,
  saveApplication,
} from "../actions/creators/applicationForm";
import ButtonsContainer from "../components/ButtonsContainer";
import ModalApplicationName from "../components/ModalApplicationName";
import QuoteForm from "../components/QuoteForm";
import { APPLICATION_STEPS } from "../constants/applicationSteps";
import { useApplicationFormDispatch } from "../dispatchers";
import {
  getApplicationQuoteSelector,
  getIsFormLoadingSelector,
  getQuoteCalculationLoading,
  getQuoteFormSelector,
  getRedirectSelector,
} from "../selectors/applicationForm";
import { QuoteFormSave } from "../types/QuoteFormSave";
import { quoteSchema } from "../validations/quote";

const QuickQuote: React.FunctionComponent<RouteComponentProps> = () => {
  const quote = useSelector(getApplicationQuoteSelector);
  const quoteForm = useSelector(getQuoteFormSelector);
  const isFormLoading = useSelector(getIsFormLoadingSelector);
  const calculationLoading = useSelector(getQuoteCalculationLoading);
  const { redirectPath } = useSelector(getRedirectSelector);
  const dispatch = useApplicationFormDispatch();
  const [applicationName, setApplicationName] = useState<string>("");
  const [isModalShown, setIsModalShown] = useState<boolean>(false);
  const hookFormMethods = useForm<QuoteFormSave>({
    defaultValues: quoteForm,
    resolver: joiResolver(quoteSchema),
  });
  const errors = useSelector(getErrorMessageSelector);

  useEffect(() => {
    if (errors) {
      if (typeof errors !== "string") {
        setFormErrors(errors, hookFormMethods.setError);
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }, [errors, hookFormMethods.setError]);

  const [error, setError] = useState<string>("");

  const history = useHistory();

  useEffect(() => {
    dispatch(resetApplicationDetails());
  }, [dispatch]);

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
  }, [hookFormMethods, quoteForm]);

  useEffect(() => {
    if (redirectPath) {
      history.replace(redirectPath);
    }
    return () => {
      dispatch(clearRedirectPath());
    };
  }, [redirectPath, history, dispatch]);

  const createApplication = async (
    isDraft: boolean,
    nextStep?: APPLICATION_STEPS
  ) => {
    const applicationForm = {
      name: applicationName,
      quote: { ...quoteForm, ...hookFormMethods.getValues() },
    };
    dispatch(saveApplication(applicationForm, isDraft, nextStep));
  };

  const handleSaveAndExit = () => {
    setIsModalShown(true);
    setError("");
  };

  const handleSaveForLater = () => {
    if (isModalShown && !applicationName) {
      setError("You have to provide an applicant name.");
      return false;
    }
    createApplication(true);
  };

  const createApplicationFromQuote = async () => {
    const isQuoteValid = await hookFormMethods.trigger();
    if (!isQuoteValid) return false;
    createApplication(false, APPLICATION_STEPS.applicant);
  };

  return (
    <>
      <CRow className="quest-page-header-section">
        <CCol xs={12} className="align-items-center d-flex">
          <h2 className="quest-header-text">Quick Quote</h2>
        </CCol>
      </CRow>
      <CRow className="quote-content">
        <CCol xs={12}>
          <CCard className="quest-card">
            <CForm className="quest-form" autoComplete="off">
              <CCardBody>
                {errors && typeof errors === "string" && (
                  <CAlert color="danger">{errors}</CAlert>
                )}
                <FormProvider {...hookFormMethods}>
                  <QuoteForm
                    quoteForm={quoteForm}
                    quoteDetails={quote}
                    isLoading={isFormLoading}
                  />
                </FormProvider>
                <ButtonsContainer
                  disabled={isFormLoading || calculationLoading}
                  onSaveClick={() => handleSaveAndExit()}
                  btnSubmitText="Create Application"
                  onSubmitClick={() => createApplicationFromQuote()}
                />
              </CCardBody>
            </CForm>
          </CCard>
        </CCol>
      </CRow>
      <ModalApplicationName
        name={applicationName}
        errorText={error}
        isShown={isModalShown}
        isLoading={isFormLoading}
        onNameChange={(name) => setApplicationName(name)}
        toggler={() => setIsModalShown(!isModalShown)}
        submitButtonText={"Save quote for later"}
        onModalSubmit={() => handleSaveForLater()}
      />
    </>
  );
};

export default QuickQuote;

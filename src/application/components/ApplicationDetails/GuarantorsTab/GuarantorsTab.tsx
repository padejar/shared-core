import "./GuarantorsTab.scss";
import React, { useEffect, useState } from "react";
import { CAlert, CButton, CCol, CRow } from "@coreui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  setFormErrors,
  getErrorMessageSelector,
} from "../../../../error-handler";
import {
  saveAndExit,
  saveGuarantors,
  setActiveStep,
  updateGuarantors,
} from "../../../actions/creators/applicationForm";
import ButtonsContainer from "../../../components/ButtonsContainer";
import GuarantorFormComponent from "../../../components/GuarantorFormComponent";
import ModalGuarantorDeleteConfirmation from "../../../components/ModalGuarantorDeleteConfirmation";
import { APPLICATION_STATUS_GROUP } from "../../../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../../../constants/applicationSteps";
import { useApplicationFormDispatch } from "../../../dispatchers";
import {
  getApplicantFormSelector,
  getApplicationStatusSelector,
  getGuarantorFormsSelector,
  getIsApplicationStatusLockedSelector,
  getIsFormLoadingSelector,
} from "../../../selectors/applicationForm";
import { ApplicationTabProps } from "../../../types/ApplicationForm";
import {
  GuarantorForm,
  guarantorFormDefaultValue,
} from "../../../types/GuarantorForm";
import { getAddressFromEntity } from "../../../utils/address";
import { guarantorsSchema } from "../../../validations/guarantor";

const GuarantorsTab: React.FunctionComponent<ApplicationTabProps> = ({
  applicationId,
  pageAfterSave,
}: ApplicationTabProps) => {
  const applicationStatus = useSelector(getApplicationStatusSelector);
  const guarantorForms = useSelector(getGuarantorFormsSelector);
  const isFormLoading = useSelector(getIsFormLoadingSelector);
  const applicantForm = useSelector(getApplicantFormSelector);
  const errors = useSelector(getErrorMessageSelector);
  const isApplicationLocked = useSelector(getIsApplicationStatusLockedSelector);
  const dispatch = useApplicationFormDispatch();
  const hookFormMethods = useForm<{
    guarantors: GuarantorForm[];
  }>({
    resolver: joiResolver(guarantorsSchema),
    shouldFocusError: true,
  });

  useEffect(() => {
    guarantorForms.forEach((guarantorForm, index) => {
      hookFormMethods.setValue(
        `guarantors[${index}].addressInputType`,
        guarantorForm.addressInputType
      );
      hookFormMethods.setValue(
        `guarantors[${index}].residentialStatus`,
        guarantorForm.residentialStatus
      );
      hookFormMethods.setValue(
        `guarantors[${index}].investmentPropertyAddressInputType`,
        guarantorForm.investmentPropertyAddressInputType
      );
    });
  }, [guarantorForms, hookFormMethods]);

  useEffect(() => {
    if (errors) {
      if (typeof errors !== "string") {
        setFormErrors<{
          guarantors: GuarantorForm[];
        }>(errors, hookFormMethods.setError);
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }, [errors, hookFormMethods.setError]);

  const [guarantorIndex, setGuarantorIndex] = useState<number>(0);
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  const addGuarantor = () => {
    if (guarantorForms.length >= 2) return;
    const tempGuarantors = [...guarantorForms];
    tempGuarantors.push(guarantorFormDefaultValue);
    dispatch(updateGuarantors(tempGuarantors));
  };

  const requestDeleteGuarantor = (index: number) => {
    setGuarantorIndex(index);
    setIsModalShown(true);
  };

  const confirmDeleteGuarantor = (index: number) => {
    const tempGuarantors = [...guarantorForms];
    tempGuarantors.splice(index, 1);
    dispatch(updateGuarantors(tempGuarantors));
  };

  const handleGuarantorSave = (
    isDraft: boolean,
    nextStep?: APPLICATION_STEPS
  ) => {
    let nextPath;
    if (nextStep) {
      nextPath = `/application/applications/${applicationId}/${nextStep}`;
    }
    dispatch(
      saveGuarantors(applicationId as string, guarantorForms, isDraft, nextPath)
    );
  };

  const handleSaveAndExit = () => {
    dispatch(saveAndExit(APPLICATION_STEPS.guarantors, pageAfterSave));
  };

  const handlePreviousClick = () => {
    if (
      (APPLICATION_STATUS_GROUP.TO_BE_SUBMITTED as string[]).includes(
        applicationStatus
      )
    ) {
      handleGuarantorSave(true, APPLICATION_STEPS.applicant);
    } else {
      dispatch(
        setActiveStep(APPLICATION_STEPS.applicant, APPLICATION_STEPS.guarantors)
      );
    }
  };

  const handleNextClick = async () => {
    const isFormValid = await hookFormMethods.trigger();
    if (!isFormValid) return;

    if (
      (APPLICATION_STATUS_GROUP.TO_BE_SUBMITTED as string[]).includes(
        applicationStatus
      )
    ) {
      handleGuarantorSave(false, APPLICATION_STEPS.security);
    } else {
      dispatch(
        setActiveStep(APPLICATION_STEPS.security, APPLICATION_STEPS.guarantors)
      );
    }
  };

  return (
    <>
      {errors && typeof errors === "string" && (
        <CAlert color="danger">{errors}</CAlert>
      )}
      <form autoComplete="off" className="quest-form guarantors-form">
        <FormProvider {...hookFormMethods}>
          {guarantorForms.map((guarantor, index) => (
            <React.Fragment key={index}>
              {!!index && <hr className="mb-5 separator" />}
              <GuarantorFormComponent
                readOnly={isApplicationLocked}
                applicantAddress={getAddressFromEntity(applicantForm)}
                guarantor={guarantor}
                indexNumber={index}
                deleteFunction={() => requestDeleteGuarantor(index)}
                isLoading={isFormLoading}
              />
              {index + 1 === guarantorForms.length && <hr className="mb-5" />}
            </React.Fragment>
          ))}
        </FormProvider>
        {guarantorForms.length < 2 && (
          <>
            <CRow className="mb-5">
              <CCol xs={12}>
                <CButton
                  className="quest-button purple"
                  type="button"
                  onClick={() => addGuarantor()}
                  disabled={isApplicationLocked}
                  data-testid="add-guarantor"
                >
                  + Add another director
                </CButton>
              </CCol>
            </CRow>
            <hr className="mb-5" />
          </>
        )}
        {Object.keys(hookFormMethods.errors).length > 0 && (
          <CAlert color="danger" data-testid="validation-error-message">
            There are missing information or invalid input
          </CAlert>
        )}
        <ButtonsContainer
          disabled={isFormLoading}
          disableSave={isApplicationLocked}
          onSaveClick={() => handleSaveAndExit()}
          onPreviousClick={() => handlePreviousClick()}
          onSubmitClick={() => handleNextClick()}
        />
        <ModalGuarantorDeleteConfirmation
          guarantorIndex={guarantorIndex}
          isShown={isModalShown}
          toggler={() => setIsModalShown(!isModalShown)}
          onConfirm={() => confirmDeleteGuarantor(guarantorIndex)}
        />
      </form>
    </>
  );
};

export default GuarantorsTab;

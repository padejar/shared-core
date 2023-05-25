import "./NotesTab.scss";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  CAlert,
  CButton,
  CCol,
  CFormGroup,
  CInput,
  CInputCheckbox,
  CLabel,
  CRow,
  CTextarea,
} from "@coreui/react";
import { joiResolver } from "@hookform/resolvers/joi";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ArrowContainer, Popover } from "react-tiny-popover";
import { BUTTON_COLORS } from "../../../../common/components/QuestButton";
import { copyToClipboard } from "../../../../common/utils/copyToClipboard";
import {
  setFormErrors,
  getErrorMessageSelector,
} from "../../../../error-handler";
import { DropzoneUploader, UploadedFileTable } from "../../../../files";
import useDownloadDocument from "../../../../files/hooks/useDownloadDocument";
import * as notification from "../../../../notification";
import {
  saveNote,
  getRequiredDocuments,
  updateNote,
  setIsApplicationSubmitted,
  setActiveStep,
  saveAndExit,
} from "../../../actions/creators/applicationForm";
import {
  deleteDocument,
  getDocumentList,
  uploadDocument,
} from "../../../actions/creators/documentForm";
import ButtonsContainer from "../../../components/ButtonsContainer";
import ReturnToDashboard from "../../../components/ReturnToDashboard";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_GROUP,
} from "../../../constants/applicationStatuses";
import { APPLICATION_STEPS } from "../../../constants/applicationSteps";
import { DOCUMENT_PURPOSES } from "../../../constants/documentPurposes";
import { NOTIFICATION_IDS } from "../../../constants/notificationIds";
import {
  useApplicationFormDispatch,
  useDocumentFormDispatch,
} from "../../../dispatchers";
import {
  getApplicationInvalidStates,
  getIsApplicationReadyToSubmitSelector,
  getIsApplicationStatusInSettlementSelector,
  getIsApplicationStatusSubmittedSelector,
  getIsApplicationSubmittedSelector,
  getIsFormLoadingSelector,
  getNoteFormSelector,
  getRequiredDocumentsLoadingSelector,
  getRequiredDocumentsSelector,
  getIsApplicationStatusApprovedSelector,
  getApplicationStatusSelector,
  getIsNotesFormDirtySelector,
  getIsApplicationStatusInProgressSelector,
  getIsApplicationStatusLockedSelector,
  getIsApplicationStatusSettledSelector,
  getIsApplicationStatusDeclinedSelector,
  getIsApplicationStatusWithdrawnSelector,
} from "../../../selectors/applicationForm";
import {
  getIsUploadingSelector,
  getUploadProgressSelector,
  getDocumentListSelector,
  getDocumentsLoadingSelector,
} from "../../../selectors/documentForm";
import { ApplicationTabProps } from "../../../types/ApplicationForm";
import { NoteRequest } from "../../../types/NoteRequest";
import { notesSchema } from "../../../validations/notes";

const {
  dispatch: { useNotificationDispatch },
  actionCreator: { unsetNotification },
} = notification;

const NotesTab: React.FunctionComponent<ApplicationTabProps> = ({
  applicationId,
  pageAfterSave,
}: ApplicationTabProps) => {
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const noteForm = useSelector(getNoteFormSelector);
  const requiredDocuments = useSelector(getRequiredDocumentsSelector);
  const isFormLoading = useSelector(getIsFormLoadingSelector);
  const getRequiredDocumentsLoading = useSelector(
    getRequiredDocumentsLoadingSelector
  );
  const documentList = useSelector(getDocumentListSelector);
  const getDocumentsLoading = useSelector(getDocumentsLoadingSelector);
  const uploadProgress = useSelector(getUploadProgressSelector);
  const isUploading = useSelector(getIsUploadingSelector);
  const errors = useSelector(getErrorMessageSelector);
  const dispatchApplication = useApplicationFormDispatch();
  const dispatchDocument = useDocumentFormDispatch();
  const notifDispatch = useNotificationDispatch();
  const [copyBtnText, setCopyBtnText] = useState<string>("Copy Link");
  const bankStatementUrl = useRef<HTMLInputElement>(null);
  const isApplicationSubmitted = useSelector(getIsApplicationSubmittedSelector);
  const isApplicationStatusSubmitted = useSelector(
    getIsApplicationStatusSubmittedSelector
  );
  const isApplicationStatusInProgress = useSelector(
    getIsApplicationStatusInProgressSelector
  );
  const isApplicationStatusApproved = useSelector(
    getIsApplicationStatusApprovedSelector
  );
  const isApplicationStatusInSettlement = useSelector(
    getIsApplicationStatusInSettlementSelector
  );
  const isApplicationReadyToSubmit = useSelector(
    getIsApplicationReadyToSubmitSelector
  );
  const isApplicationSettled = useSelector(
    getIsApplicationStatusSettledSelector
  );
  const isApplicationDeclined = useSelector(
    getIsApplicationStatusDeclinedSelector
  );
  const isApplicationWithdrawn = useSelector(
    getIsApplicationStatusWithdrawnSelector
  );
  const isApplicationLocked = useSelector(getIsApplicationStatusLockedSelector);
  const applicationInvalidStates = useSelector(getApplicationInvalidStates);
  const applicationStatus = useSelector(getApplicationStatusSelector);
  const isNotesFormDirty = useSelector(getIsNotesFormDirtySelector);
  const {
    trigger: validate,
    errors: notesErrors,
    clearErrors,
    setError,
    register,
    setValue,
    control,
  } = useForm<NoteRequest>({
    defaultValues: noteForm,
    resolver: joiResolver(notesSchema),
    mode: "onChange",
    criteriaMode: "all",
  });
  const { downloadFile } = useDownloadDocument();
  const popoverCointaner = useRef<HTMLDivElement | null>(null);

  const isPrivacyConsentDisabled = useMemo(() => {
    return (
      isApplicationLocked ||
      !([
        APPLICATION_STATUSES.QUOTED,
        APPLICATION_STATUSES.DRAFTED_NEW,
      ] as string[]).includes(applicationStatus)
    );
  }, [isApplicationLocked, applicationStatus]);

  useEffect(() => {
    return () => {
      notifDispatch(unsetNotification(NOTIFICATION_IDS.DELETE_DOCUMENT_ERROR));
    };
  }, [notifDispatch]);

  useEffect(() => {
    if (errors) {
      if (typeof errors !== "string") {
        setFormErrors(errors, setError);
      } else {
        window.scrollTo({ top: 0 });
      }
    }
  }, [errors, setError]);

  useEffect(() => {
    setValue("supportingNotes", noteForm.supportingNotes);
    setValue(
      "hasForeseeableFinancialChange",
      noteForm.hasForeseeableFinancialChange
    );
    setValue("hasApplicantConsent", noteForm.hasApplicantConsent);
  }, [setValue, noteForm]);

  const upload = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        dispatchDocument(
          uploadDocument(
            applicationId as string,
            file,
            DOCUMENT_PURPOSES.SUPPORTING_DOCUMENT
          )
        );
      }
    },
    [dispatchDocument, applicationId]
  );

  useEffect(() => {
    dispatchDocument(
      getDocumentList(
        applicationId as string,
        DOCUMENT_PURPOSES.SUPPORTING_DOCUMENT
      )
    );
    dispatchApplication(getRequiredDocuments(applicationId as string));
  }, [dispatchDocument, dispatchApplication, applicationId]);

  const handleNoteChange = (newState: Partial<NoteRequest>) => {
    dispatchApplication(updateNote(newState));
  };

  const handleDelete = useCallback(
    async (documentId: string) => {
      dispatchDocument(deleteDocument(applicationId as string, documentId));
    },
    [dispatchDocument, applicationId]
  );

  const handleDownloadFile = useCallback(
    (documentId: string) => {
      downloadFile(
        `/application/applications/${applicationId}/documents/${documentId}/download`
      );
    },
    [downloadFile, applicationId]
  );

  useEffect(() => {
    if (
      requiredDocuments &&
      requiredDocuments.bankStatementRequired &&
      bankStatementUrl.current &&
      !getRequiredDocumentsLoading
    ) {
      bankStatementUrl.current.value = requiredDocuments.bankStatementLink;
    }
  }, [requiredDocuments, getRequiredDocumentsLoading]);

  const copyLink = () => {
    if (bankStatementUrl.current !== null)
      copyToClipboard(bankStatementUrl.current, () => {
        setCopyBtnText("Copied!");
        setTimeout(() => {
          setCopyBtnText("Copy Link");
        }, 1000);
      });
  };

  const handleSaveNote = async (
    isDraft: boolean,
    nextStep?: APPLICATION_STEPS
  ) => {
    let nextPath;
    if (nextStep) {
      nextPath = `/application/applications/${applicationId}/${nextStep}`;
    }
    dispatchApplication(
      saveNote(applicationId as string, noteForm, isDraft, nextPath)
    );
  };

  const handleSaveAndExit = () => {
    dispatchApplication(saveAndExit(APPLICATION_STEPS.notes, pageAfterSave));
  };

  const handleSubmit = async () => {
    clearErrors();
    const isFormValid = await validate();
    if (!isFormValid) {
      return;
    }

    if (!isApplicationReadyToSubmit && !isFormLoading && !isNotesFormDirty) {
      return;
    }

    handleSaveNote(false);
  };

  const handlePreviousClick = () => {
    if (
      (APPLICATION_STATUS_GROUP.TO_BE_SUBMITTED as string[]).includes(
        applicationStatus
      )
    ) {
      handleSaveNote(true, APPLICATION_STEPS.security);
    } else {
      dispatchApplication(
        setActiveStep(APPLICATION_STEPS.security, APPLICATION_STEPS.notes)
      );
    }
  };

  return (
    <>
      {errors && typeof errors === "string" && (
        <CAlert color="danger">{errors}</CAlert>
      )}
      <div className="quest-form notes-form">
        <CRow className="mb-3">
          <CCol xs={12}>
            <h3 className="f-bold section-header">Supporting Notes</h3>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12}>
            <CRow className="supporting-notes">
              <CCol xl={9} className="form-group">
                <CLabel>
                  Include the brief history on applicant/s and purpose of loan:
                </CLabel>
                <CTextarea
                  readOnly={isApplicationLocked}
                  innerRef={register()}
                  defaultValue={noteForm.supportingNotes}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                    handleNoteChange({ supportingNotes: event.target.value });
                  }}
                  name="supportingNotes"
                  rows={7}
                  data-testid="supportingNotes"
                ></CTextarea>
              </CCol>
            </CRow>
            <CRow className="supporting-docs mb-3">
              <CCol xs={12}>
                <h3 className="f-bold section-header">Supporting Documents</h3>
              </CCol>
            </CRow>
            <CRow>
              <CCol xl={9} className="form-group">
                <DropzoneUploader
                  uploadFunction={(acceptedFiles) => {
                    upload(acceptedFiles);
                  }}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  disabled={isApplicationLocked}
                  testIdPrefix="supporting-documents"
                />
                <div className="quest-responsive-table-container">
                  <UploadedFileTable
                    className="mt-4"
                    isLoading={getDocumentsLoading}
                    documents={documentList}
                    downloadFunction={(documentId) =>
                      handleDownloadFile(documentId)
                    }
                    deleteFunction={(documentId) => handleDelete(documentId)}
                    readOnly={isApplicationLocked}
                    testIdPrefix="supporting-documents"
                  />
                </div>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        {!getRequiredDocumentsLoading &&
          requiredDocuments &&
          requiredDocuments.bankStatementRequired && (
            <CRow className="bank-statement-container">
              <CCol xs={12}>
                <div className="info-container" ref={popoverCointaner}>
                  <CLabel className="mb-0">
                    6 months bank statements required for loans above $100,000
                    (including brokerage and fees)
                  </CLabel>
                  <Popover
                    isOpen={isPopOverOpen}
                    positions={["right", "top"]}
                    padding={0}
                    containerParent={popoverCointaner.current as HTMLDivElement}
                    content={({ position, childRect, popoverRect }) => (
                      <ArrowContainer
                        position={position}
                        childRect={childRect}
                        popoverRect={popoverRect}
                        arrowColor="#d1faf5"
                        arrowSize={10}
                      >
                        <div className="popover-content">
                          Why do we need bank statements?
                          <ul>
                            <li>
                              We are only looking for regular dishonours,
                              gambling and overdrawn account
                            </li>
                            <li>Borrowers are self-declaring affordability</li>
                          </ul>
                        </div>
                      </ArrowContainer>
                    )}
                  >
                    <span
                      className="popover-info"
                      onMouseEnter={() => setIsPopOverOpen(true)}
                      onMouseLeave={() => setIsPopOverOpen(false)}
                      onClick={() =>
                        setIsPopOverOpen((previousState) => !previousState)
                      }
                    >
                      ?
                    </span>
                  </Popover>
                </div>
                <CLabel>
                  Send the below URL to your client so they can authorise the
                  bank statement upload
                </CLabel>
                <CRow>
                  <CCol xl={9} xs={12} className="mb-sm-3 mb-xl-0">
                    <CInput
                      innerRef={bankStatementUrl}
                      id="bank-statement-url"
                      readOnly
                      data-testid="bank-statement-url"
                    />
                  </CCol>
                  <CCol xl={3} xs={12} className="pl-xl-0">
                    <CButton
                      className="quest-button purple inverted"
                      id="bank-statement-copy"
                      onClick={() => copyLink()}
                      data-testid="copy-bank-statement-url"
                    >
                      {copyBtnText}
                    </CButton>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          )}
        <CRow>
          <CCol xl={12}>
            <CRow className="mb-4">
              <CCol xl={9}>
                <Controller
                  control={control}
                  name="hasApplicantConsent"
                  defaultValue={noteForm.hasApplicantConsent}
                  render={({ onChange, value }) => (
                    <CFormGroup variant="custom-checkbox" inline>
                      <CInputCheckbox
                        disabled={isPrivacyConsentDisabled}
                        custom
                        className="quest-checkbox"
                        id="hasApplicantConsent"
                        name="hasApplicantConsent"
                        value={1}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          onChange(event.target.checked);
                          handleNoteChange({
                            hasApplicantConsent: event.target.checked,
                          });
                          clearErrors("hasApplicantConsent");
                        }}
                        checked={value}
                        data-testid="hasApplicantConsent"
                      />
                      <CLabel
                        variant="custom-checkbox"
                        htmlFor="hasApplicantConsent"
                        data-testid="hasApplicantConsent-label"
                      >
                        By ticking this box, I declare that I have fulfilled my
                        responsibilities under the Introducer Agreement, that I
                        have obtained a Privacy Consent Form from every
                        individual whose personal information is disclosed in
                        this application (which Quest Finance has approved or
                        provided). For more information on how Quest Finance
                        manages Personal Information see &nbsp;
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href="https://quest.finance/help-support/privacy-policy/"
                        >
                          Privacy Policy
                        </a>
                        .<CLabel className="required"></CLabel>
                      </CLabel>
                    </CFormGroup>
                  )}
                />

                {notesErrors.hasApplicantConsent && (
                  <span
                    className="validation-error"
                    data-testid="hasApplicantConsent-error"
                  >
                    {notesErrors.hasApplicantConsent.message}
                  </span>
                )}
              </CCol>
            </CRow>
          </CCol>
        </CRow>
        {Object.keys(notesErrors).length > 0 && (
          <CAlert color="danger" data-testid="validation-error-message">
            There are missing information or invalid information
          </CAlert>
        )}
        <ButtonsContainer
          popOverContent={() => (
            <div>
              {applicationInvalidStates.length > 0 && (
                <>
                  Please complete the required fields in the following tab(s):
                  <ul>
                    {applicationInvalidStates.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </>
              )}
              {(isApplicationStatusSubmitted ||
                isApplicationStatusInProgress ||
                isApplicationStatusApproved ||
                isApplicationStatusInSettlement) &&
                "This application has been submitted"}
              {isApplicationDeclined && "This application has been declined"}
              {isApplicationSettled && "This application has been settled"}
              {isApplicationWithdrawn && "This application has been withdrawn"}
            </div>
          )}
          disabled={
            isFormLoading &&
            (isApplicationStatusInSettlement ||
              isApplicationStatusInProgress ||
              isApplicationStatusApproved ||
              isApplicationStatusSubmitted)
          }
          onSaveClick={() => handleSaveAndExit()}
          onSubmitClick={() => handleSubmit()}
          btnSubmitText={
            applicationStatus === APPLICATION_STATUSES.DRAFTED_AMENDED ||
            ((isApplicationStatusSubmitted ||
              isApplicationStatusInProgress ||
              isApplicationStatusApproved ||
              isApplicationStatusInSettlement) &&
              isNotesFormDirty)
              ? "Re-submit"
              : isApplicationStatusSubmitted ||
                isApplicationStatusInProgress ||
                isApplicationStatusApproved ||
                isApplicationStatusInSettlement ||
                isApplicationSettled
              ? "Submitted"
              : "Submit"
          }
          onPreviousClick={() => handlePreviousClick()}
          useSubmitButton
          submitButtonColor={BUTTON_COLORS.COMMIT}
          isSubmitted={
            (isApplicationStatusSubmitted ||
              isApplicationStatusInProgress ||
              isApplicationStatusInSettlement ||
              isApplicationStatusApproved ||
              isApplicationSettled) &&
            !isNotesFormDirty
          }
          disableSubmit={!isApplicationReadyToSubmit && !isNotesFormDirty}
        />
      </div>
      {isApplicationSubmitted && (
        <ReturnToDashboard
          isShown={isApplicationSubmitted}
          toggler={() => {
            dispatchApplication(setIsApplicationSubmitted(false));
          }}
          dashboardLink={pageAfterSave}
        />
      )}
    </>
  );
};

export default NotesTab;

import "./ContractsTab.scss";
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import {
  CAlert,
  CButton,
  CCol,
  CFormGroup,
  CInputCheckbox,
  CLabel,
  CRow,
} from "@coreui/react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ArrowContainer, Popover } from "react-tiny-popover";
import ConfirmationModal, {
  MODAL_TYPE,
} from "../../../../common/components/ConfirmationModal";
import {
  BUTTON_COLORS,
  QuestButton,
} from "../../../../common/components/QuestButton";
import { dateFormat } from "../../../../common/utils/date";
import {
  getErrorMessageSelector,
  useErrorDispatch,
  clearErrors,
} from "../../../../error-handler";
import {
  UploadedFileTable,
  useDownloadDocument,
  DropzoneUploader,
} from "../../../../files";
import {
  dispatch as notificationDispatch,
  actionCreator as notificationActions,
} from "../../../../notification";
import {
  deleteContractsDocument,
  generateDocuments,
  getGeneratedDocuments,
  getUploadedDocuments,
  setEsignSuccessModal,
  setSubmittedForSettlement,
  setSelectedTypes,
  submitSettlement,
  toggleEsignWarning,
  uploadDocuments,
} from "../../../actions/creators/contracts";
import IconPdf from "../../../assets/images/icon-pdf.svg";
import IconUpload from "../../../assets/images/icon-upload.svg";
import GenerateDocumentsLoading from "../../../components/GenerateDocumentsLoading";
import ModalEsignWarning from "../../../components/ModalEsignWarning";
import { SubmitButtonContainer } from "../../../components/SubmitButton";
import { APPLICATION_STATUSES } from "../../../constants/applicationStatuses";
import { DOCUMENT_PURPOSES } from "../../../constants/documentPurposes";
import { DOCUMENT_TYPES_OPTIONS } from "../../../constants/documentTypes";
import { NOTIFICATION_IDS } from "../../../constants/notificationIds";
import { useContractsDispatch } from "../../../dispatchers";
import {
  getApplicationStatusSelector,
  getIsApplicationStatusInSettlementSelector,
  getIsApplicationStatusLockedSelector,
  getIsApplicationStatusSettledSelector,
} from "../../../selectors/applicationForm";
import {
  getEsignWarningSelector,
  getGeneratedDocumentsLoadingSelector,
  getGeneratedDocumentsSelector,
  getGenerateLoadingSelector,
  getIsUploadingSelector,
  getUploadProgressSelector,
  getisApplicationSubmittedForSettlementSelector,
  getSelectedTypesSelector,
  getSubmitSettlementLoading,
  getUploadedDocumentListSelector,
  getUploadedDocumentsLoadingSelector,
  getEsignSuccessModalShownSelector,
} from "../../../selectors/contracts";
import { ApplicationTabProps } from "../../../types/ApplicationForm";
import ApprovalConditions from "./ApprovalConditions/ApprovalConditions";

const ContractsTab: React.FunctionComponent<ApplicationTabProps> = ({
  applicationId,
  pageAfterSave,
}: ApplicationTabProps) => {
  const history = useHistory();
  const applicationStatus = useSelector(getApplicationStatusSelector);
  const selectedTypes = useSelector(getSelectedTypesSelector);
  const eSignWarningShown = useSelector(getEsignWarningSelector);
  const generatedDocuments = useSelector(getGeneratedDocumentsSelector);
  const uploadedDocuments = useSelector(getUploadedDocumentListSelector);
  const getGeneratedDocumentsLoading = useSelector(
    getGeneratedDocumentsLoadingSelector
  );
  const getUploadedDocumentsLoading = useSelector(
    getUploadedDocumentsLoadingSelector
  );
  const generateDocumentsLoading = useSelector(getGenerateLoadingSelector);
  const submitSettlementLoading = useSelector(getSubmitSettlementLoading);
  const isApplicationSubmittedForSettlement = useSelector(
    getisApplicationSubmittedForSettlementSelector
  );
  const isApplicationSettled = useSelector(
    getIsApplicationStatusSettledSelector
  );
  const errors = useSelector(getErrorMessageSelector);
  const uploadProgress = useSelector(getUploadProgressSelector);
  const isUploading = useSelector(getIsUploadingSelector);
  const [isContractsPopOverOpen, setIsContractsPopOverOpen] = useState(false);
  const [
    isSettlementDocsPopOverOpen,
    setIsSettlementDocsPopOverOpen,
  ] = useState(false);
  const isInSettlement = useSelector(
    getIsApplicationStatusInSettlementSelector
  );
  const isApplicationLocked = useSelector(getIsApplicationStatusLockedSelector);
  const eSignModalShown = useSelector(getEsignSuccessModalShownSelector);
  const contractPopover = useRef<HTMLElement>();
  const settlementDocsPopover = useRef<HTMLElement>();

  const dispatch = useContractsDispatch();
  const dispatchError = useErrorDispatch();
  const dispatchNotification = notificationDispatch.useNotificationDispatch();
  const { downloadFile } = useDownloadDocument();

  const isApplicationReadyToSettle = useMemo(() => {
    return ([
      APPLICATION_STATUSES.IN_SETTLEMENT_WAITING_FOR_MORE_INFO,
      APPLICATION_STATUSES.APPROVED_WAITING_FOR_MORE_INFO,
    ] as string[]).includes(applicationStatus);
  }, [applicationStatus]);

  useEffect(() => {
    if (errors) {
      window.scrollTo({ top: 0 });
    }
  }, [errors]);

  useEffect(() => {
    return () => {
      dispatch(setSubmittedForSettlement(false));
      dispatchNotification(
        notificationActions.unsetNotification(
          NOTIFICATION_IDS.CONTRACT_GENERATION_ERRORS
        )
      );
      dispatchNotification(
        notificationActions.unsetNotification(
          NOTIFICATION_IDS.DELETE_DOCUMENT_ERROR
        )
      );
    };
  }, [dispatch, dispatchNotification]);

  useEffect(() => {
    dispatch(setSelectedTypes(selectedTypes));
  }, [dispatch, selectedTypes]);

  useEffect(() => {
    dispatch(getGeneratedDocuments(applicationId as string));
    dispatch(getUploadedDocuments(applicationId as string));
  }, [dispatch, applicationId]);

  const handleUploadDocuments = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        dispatch(
          uploadDocuments(
            applicationId as string,
            DOCUMENT_PURPOSES.SETTLEMENT_DOCUMENT,
            file
          )
        );
      }
    },
    [dispatch, applicationId]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (errors) dispatchError(clearErrors());
    const checkedTypes = [...selectedTypes];
    const { checked, value } = event.target;

    if (checked) {
      checkedTypes.push(value);
    } else {
      checkedTypes.splice(checkedTypes.indexOf(value), 1);
    }

    dispatch(setSelectedTypes(checkedTypes));
  };

  const renderDocumentOptions = () => {
    const optionKeys = Object.keys(DOCUMENT_TYPES_OPTIONS);
    const divideBy = Math.ceil(optionKeys.length / 2);
    const columns = [...Array(Math.ceil(optionKeys.length / divideBy))];

    const optionColumns = columns.map((_, index) =>
      optionKeys.slice(index * divideBy, index * +divideBy + divideBy)
    );
    return optionColumns.map((column, index) => (
      <CCol sm={6} key={index} className="document-options">
        {column.map((option) => (
          <CFormGroup variant="custom-checkbox" className="mb-2" key={option}>
            <CInputCheckbox
              disabled={isApplicationLocked}
              custom
              className="quest-checkbox"
              id={`selectedTypes-${option}`}
              name="selectedTypes[]"
              onChange={handleChange}
              checked={selectedTypes.indexOf(option) !== -1}
              value={option}
              data-testid={`document-options-${option}`}
            />
            <CLabel
              className="f-normal mb-3"
              variant="custom-checkbox"
              htmlFor={`selectedTypes-${option}`}
              data-testid={`document-options-${option}-label`}
            >
              {DOCUMENT_TYPES_OPTIONS[option]}
            </CLabel>
          </CFormGroup>
        ))}
      </CCol>
    ));
  };

  const toggleEsignWarningModal = (showEsignWarning: boolean) => {
    dispatch(toggleEsignWarning(showEsignWarning));
  };

  const handleGenerateDocuments = (eSign: boolean) => {
    toggleEsignWarningModal(false);
    dispatch(generateDocuments(applicationId as string, selectedTypes, eSign));
  };

  const handleDeleteDocument = (
    documentId: string,
    purpose: DOCUMENT_PURPOSES
  ) => {
    dispatch(
      deleteContractsDocument(applicationId as string, documentId, purpose)
    );
  };

  const handleDownloadDocument = (documentId: string) => {
    downloadFile(
      `/application/applications/${applicationId}/documents/${documentId}/download`
    );
  };

  const handleSubmitSettlement = () => {
    if (!isApplicationReadyToSettle || isApplicationLocked) return;
    dispatch(submitSettlement(applicationId as string));
  };

  const handleGoToDashboard = () => {
    history.push(pageAfterSave);
  };

  return (
    <>
      <div className="quest-form contracts">
        {errors && typeof errors === "string" && (
          <CAlert color="danger" data-testid="error-message">
            {errors}
          </CAlert>
        )}
        <CRow className="mb-4">
          <CCol xs={12} innerRef={contractPopover}>
            <h2 className="f-bold mb-4 f-quest-navy">
              Contracts
              <Popover
                containerParent={contractPopover.current}
                isOpen={isContractsPopOverOpen}
                positions={["right", "top"]}
                padding={0}
                content={({ position, childRect, popoverRect }) => (
                  <ArrowContainer
                    position={position}
                    childRect={childRect}
                    popoverRect={popoverRect}
                    arrowColor="#d1faf5"
                    arrowSize={10}
                  >
                    <div className="popover-content">
                      For help on e-signing, please refer to the &quot;System
                      guide&quot; under the Resources tab in the side tool bar
                    </div>
                  </ArrowContainer>
                )}
              >
                <span
                  className="popover-info"
                  onMouseEnter={() => setIsContractsPopOverOpen(true)}
                  onMouseLeave={() => setIsContractsPopOverOpen(false)}
                  onClick={() =>
                    setIsContractsPopOverOpen((previousState) => !previousState)
                  }
                >
                  i
                </span>
              </Popover>
            </h2>
            <h4 className="f-bold f-quest-navy">
              Please select docs and choose to e-sign or print PDF
            </h4>
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol xl={9}>
            <CRow>{renderDocumentOptions()}</CRow>
          </CCol>
        </CRow>
        <CRow className="mb-5">
          <CCol xl={9} className="generate-buttons-container">
            <QuestButton
              disabled={generateDocumentsLoading || isApplicationLocked}
              color={BUTTON_COLORS.PRIMARY}
              className="generate-buttons"
              onClick={() => toggleEsignWarningModal(true)}
              data-testid="generate-e-sign"
            >
              Send e-sign document
            </QuestButton>
            <QuestButton
              disabled={generateDocumentsLoading || isApplicationLocked}
              color={BUTTON_COLORS.SECONDARY}
              className="generate-buttons"
              onClick={() => handleGenerateDocuments(false)}
              data-testid="generate-pdf"
            >
              Generate PDFs
            </QuestButton>
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={9}>
            <h3 className="f-bold f-quest-navy table-title">
              <img src={IconPdf} alt="icon-pdf" />
              Generated Contracts
            </h3>
            <div className="quest-responsive-table-container">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Document name</th>
                    <th>Time generated</th>
                    <th>Download link</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedDocuments.map((document) => (
                    <tr key={document.id}>
                      <td
                        data-testid={`generated-${document.id}-originalFileName`}
                      >
                        {document.originalFilename}
                      </td>
                      <td data-testid={`generated-${document.id}-createdAt`}>
                        {dateFormat(
                          new Date(document.createdAt),
                          "dd-MM-yy H:mm:ss"
                        )}
                      </td>
                      <td>
                        <div className="action-container">
                          <CButton
                            type="button"
                            className="download"
                            onClick={() => handleDownloadDocument(document.id)}
                            data-testid={`download-${document.id}`}
                          >
                            Download PDF
                          </CButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!getGeneratedDocumentsLoading &&
                    generatedDocuments.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center"
                          data-testid="empty-generated-docs"
                        >
                          No PDFs generated yet
                        </td>
                      </tr>
                    )}
                  {getGeneratedDocumentsLoading && (
                    <tr>
                      <td colSpan={3} className="text-center">
                        Loading your generated documents...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CCol>
        </CRow>
        <hr className="divider" />
        <CRow className="mb-3">
          <CCol xs={12} innerRef={settlementDocsPopover}>
            <h2 className="f-bold f-quest-navy">
              Settlement docs
              <Popover
                containerParent={settlementDocsPopover.current}
                isOpen={isSettlementDocsPopOverOpen}
                positions={["right", "top"]}
                padding={0}
                content={({ position, childRect, popoverRect }) => (
                  <ArrowContainer
                    position={position}
                    childRect={childRect}
                    popoverRect={popoverRect}
                    arrowColor="#d1faf5"
                    arrowSize={10}
                  >
                    <div className="popover-content">
                      For help on the Settlement process, please refer to the
                      &quot;System guide&quot; under the Resources tab in the
                      side tool bar
                    </div>
                  </ArrowContainer>
                )}
              >
                <span
                  className="popover-info"
                  onMouseEnter={() => setIsSettlementDocsPopOverOpen(true)}
                  onMouseLeave={() => setIsSettlementDocsPopOverOpen(false)}
                  onClick={() =>
                    setIsSettlementDocsPopOverOpen(
                      (previousState) => !previousState
                    )
                  }
                >
                  i
                </span>
              </Popover>
            </h2>
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol xl={9}>
            <DropzoneUploader
              disabled={isApplicationLocked}
              uploadFunction={handleUploadDocuments}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              testIdPrefix="settlement-documents"
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={9}>
            <h3 className="f-bold f-quest-navy  table-title">
              <img src={IconUpload} alt="icon-upload" />
              Uploaded docs
            </h3>
            <div className="quest-responsive-table-container">
              <UploadedFileTable
                readOnly={isApplicationLocked}
                isLoading={getUploadedDocumentsLoading}
                documents={uploadedDocuments}
                downloadFunction={(documentId) =>
                  handleDownloadDocument(documentId)
                }
                deleteFunction={(documentId) =>
                  handleDeleteDocument(
                    documentId,
                    DOCUMENT_PURPOSES.SETTLEMENT_DOCUMENT
                  )
                }
                testIdPrefix="settlement-documents"
              />
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={9}>
            <SubmitButtonContainer
              popOverPositions={["right"]}
              popOverContent={() => {
                if (isInSettlement) {
                  return (
                    <div>
                      This application has been submitted for settlement
                    </div>
                  );
                } else if (isApplicationSettled) {
                  return <div>This application has been settled</div>;
                }
                return (
                  <div>
                    Only approved applications can be submitted for settlement
                  </div>
                );
              }}
              disableSubmit={!isApplicationReadyToSettle}
              onClick={() => handleSubmitSettlement()}
              isSubmitted={isInSettlement || isApplicationSettled}
              btnSubmitText={
                isInSettlement || isApplicationSettled
                  ? "Submitted"
                  : applicationStatus ===
                    APPLICATION_STATUSES.IN_SETTLEMENT_WAITING_FOR_MORE_INFO
                  ? "Re-submit"
                  : submitSettlementLoading
                  ? "Submitting..."
                  : "Submit for Settlement"
              }
            />
          </CCol>
        </CRow>
        <ApprovalConditions />
        {eSignWarningShown && (
          <ModalEsignWarning
            isShown={eSignWarningShown}
            toggler={() => toggleEsignWarningModal(!eSignWarningShown)}
            onConfirm={() => handleGenerateDocuments(true)}
            onCancel={() => toggleEsignWarningModal(false)}
          />
        )}
      </div>
      {generateDocumentsLoading && <GenerateDocumentsLoading />}
      {isApplicationSubmittedForSettlement && (
        <ConfirmationModal
          modalType={MODAL_TYPE.SUCCESS}
          isShown={isApplicationSubmittedForSettlement}
          toggler={() =>
            dispatch(
              setSubmittedForSettlement(!isApplicationSubmittedForSettlement)
            )
          }
          headerText="Well done!"
          bodyText="Application has been submitted for settlement"
          onConfirm={() => handleGoToDashboard()}
          confirmButtonColor={BUTTON_COLORS.PRIMARY}
          confirmButtonText="Return to Dasboard"
          testId="application-settlement-success-modal"
        />
      )}
      {eSignModalShown && (
        <ConfirmationModal
          modalType={MODAL_TYPE.SUCCESS}
          isShown={eSignModalShown}
          toggler={() => dispatch(setEsignSuccessModal(!eSignModalShown))}
          bodyText="Document(s) have been sent to the guarantor(s) for e-signing"
          onConfirm={() => dispatch(setEsignSuccessModal(false))}
          confirmButtonColor={BUTTON_COLORS.PRIMARY}
          confirmButtonText="OK"
          testId="esign-success-modal"
        />
      )}
    </>
  );
};

export default ContractsTab;

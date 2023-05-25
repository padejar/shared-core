import React, { useState, useCallback } from "react";
import { CButton } from "@coreui/react";
import IconClose from "../../common/assets/images/icon-sml-close.svg";
import ConfirmationModal, {
  MODAL_TYPE,
} from "../../common/components/ConfirmationModal";
import { dateFormat } from "../../common/utils/date";
import { QuestDocument } from "../types/QuestDocument";
import "./UploadedFileTable.scss";

type UploadedFileTableProps = {
  className?: string;
  isLoading: boolean;
  documents: QuestDocument[];
  downloadFunction: (documentId: string) => void;
  deleteFunction: (documentId: string) => void;
  readOnly?: boolean;
  testIdPrefix?: string;
};

const UploadedFileTable: React.FunctionComponent<UploadedFileTableProps> = ({
  className,
  isLoading,
  documents,
  deleteFunction,
  downloadFunction,
  readOnly,
  testIdPrefix = "uploaded-file-table",
}: UploadedFileTableProps) => {
  const [
    documentToDelete,
    setDocumentToDelete,
  ] = useState<null | QuestDocument>(null);
  const handleDownload = useCallback(
    (documentId: string) => {
      downloadFunction(documentId);
    },
    [downloadFunction]
  );
  const handleDelete = useCallback(() => {
    if (documentToDelete) {
      deleteFunction(documentToDelete.id);
    }
    setDocumentToDelete(null);
  }, [deleteFunction, documentToDelete]);

  return (
    <>
      <table
        className={`table table-striped uploaded-files ${className ?? ""}`}
        data-testid={`${testIdPrefix}-table`}
      >
        <thead>
          <tr>
            <th>Document name</th>
            <th>Time uploaded</th>
            <th>Download link</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>
              <td data-testid={`${document.id}-originalFileName`}>
                {document.originalFilename}
              </td>
              <td data-testid={`${document.id}-createdAt`}>
                {dateFormat(new Date(document.createdAt), "dd-MM-yy H:mm:ss")}
              </td>
              <td>
                <div className="action-container">
                  <CButton
                    className="download"
                    onClick={() => handleDownload(document.id)}
                    data-testid={`${testIdPrefix}-download-${document.id}`}
                  >
                    Download
                  </CButton>
                  <CButton
                    className="delete-button"
                    onClick={() => setDocumentToDelete(document)}
                    disabled={readOnly}
                    data-testid={`${testIdPrefix}-delete-${document.id}`}
                  >
                    <img src={IconClose} alt="delete-icon" />
                  </CButton>
                </div>
              </td>
            </tr>
          ))}
          {!isLoading && documents.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="text-center"
                data-testid={`${testIdPrefix}-empty`}
              >
                No documents uploaded yet
              </td>
            </tr>
          )}
          {isLoading && (
            <tr>
              <td colSpan={3} className="text-center">
                Loading your uploaded documents...
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ConfirmationModal
        toggler={() => setDocumentToDelete(null)}
        modalType={MODAL_TYPE.WARNING}
        isShown={documentToDelete !== null}
        headerText={
          <span data-testid="filename-to-delete">{`Delete "${documentToDelete?.originalFilename}"`}</span>
        }
        bodyText="Are you sure you want to proceed with this action?"
        onCancel={() => setDocumentToDelete(null)}
        onConfirm={() => handleDelete()}
        confirmButtonText="Proceed"
        testId={`${testIdPrefix}-delete-file-modal`}
      />
    </>
  );
};

export default UploadedFileTable;

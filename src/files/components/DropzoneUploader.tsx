import React, { useCallback, useState } from "react";
import { CButton, CAlert } from "@coreui/react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import NumberFormat from "react-number-format";

import "./DropzoneUploader.scss";
import { supportEmail } from "../../common/constants/app";
import {
  ALLOWED_FILE_SIZE_MEGABYTES,
  ALLOWED_FILE_TYPES,
} from "../../common/constants/validation";
import { formatBytes } from "../../common/utils/number";
import { ERROR_MESSAGES } from "../constants/errorMessage";

const allowedFiles = ALLOWED_FILE_TYPES.map((fileType) =>
  fileType.substring(1)
).join(", ");

type DropzoneUploaderProps = {
  containerClassName?: string;
  isUploading: boolean;
  uploadProgress: number;
  uploadFunction: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
  disabled?: boolean;
  testIdPrefix?: string;
};

const DropzoneUploader: React.FunctionComponent<DropzoneUploaderProps> = ({
  containerClassName,
  isUploading,
  uploadProgress,
  uploadFunction,
  disabled,
  testIdPrefix,
}: DropzoneUploaderProps) => {
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      setRejectedFiles([]);
      uploadFunction(acceptedFiles, fileRejections, event);
    },
    [uploadFunction]
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    setRejectedFiles(fileRejections);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    disabled,
    accept: ALLOWED_FILE_TYPES,
    validator: (file) => {
      if (file.size > ALLOWED_FILE_SIZE_MEGABYTES * 1048576) {
        return {
          message: "File size too large",
          code: "file-too-large",
        };
      }

      return null;
    },
  });

  return (
    <>
      <div
        {...getRootProps({
          className: `dropzone ${containerClassName ? containerClassName : ""}`,
        })}
        data-testid={`${testIdPrefix}-dropzone`}
      >
        <input
          {...getInputProps()}
          disabled={isUploading}
          data-testid={`${testIdPrefix}-input-files`}
        />
        {!isUploading ? (
          <>
            <span className="instruction">Drop files to upload</span>
            <span className="or">or</span>
            <CButton
              type="button"
              className="quest-button secondary select-files mb-3"
              disabled={disabled}
              data-testid={`${testIdPrefix}-select-files`}
            >
              Select files
            </CButton>
          </>
        ) : (
          <span className="upload-progress">
            Uploading... <br />
            <NumberFormat
              value={uploadProgress}
              suffix="%"
              displayType="text"
              decimalScale={2}
              thousandSeparator=","
            />
          </span>
        )}
      </div>
      {rejectedFiles.length > 0 && (
        <div className="rejected-files">
          <CAlert show={true} className="rejected-files-info">
            The files listed below have not been saved. Please ensure the format
            is either {allowedFiles} with a maximum size of 15 MB. Please email{" "}
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a> if you would
            like any further help.
          </CAlert>
          <table className="table rejected-files-table">
            <tbody>
              {rejectedFiles.map((file, index) => (
                <tr key={index}>
                  <td className="validation">
                    {file.errors.map((error) => (
                      <div key={error.code}>{ERROR_MESSAGES[error.code]}</div>
                    ))}
                  </td>
                  <td className="file">
                    {file.file.name} - {formatBytes(file.file.size)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DropzoneUploader;

import React from "react";
import { CButton } from "@coreui/react";
import FileIcon from "../../common/assets/images/file-icon.svg";
import IconClose from "../../common/assets/images/icon-sml-close.svg";
import Loading from "../../common/components/Loading";
import { QuestDocument } from "../types/QuestDocument";

type FileListingProps = {
  className?: string;
  fileList: QuestDocument[];
  onDeleteFile: (id: string) => void;
  isLoading: boolean;
};
const FileListing: React.FunctionComponent<FileListingProps> = ({
  className,
  fileList,
  onDeleteFile,
  isLoading,
}: FileListingProps) => {
  return (
    <div className={className}>
      <ul>
        {fileList.map((file, index) => (
          <li key={index}>
            <img
              src={FileIcon}
              alt={file.originalFilename}
              height="50"
              className="mr-2"
            />
            <span>{file.originalFilename}</span>
            <CButton
              className="btn-remove"
              onClick={() => {
                onDeleteFile(file.id);
              }}
            >
              <img src={IconClose} alt="icon remove partner" />
            </CButton>
          </li>
        ))}
      </ul>
      {isLoading && <Loading text="Getting documents" />}
    </div>
  );
};

export default FileListing;

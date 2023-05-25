import "./GenerateDocumentsLoading.scss";
import React from "react";
import { ReactSVG } from "react-svg";
import loadingIcon from "../../common/assets/images/loading-arrows.svg";

const GenerateDocumentsLoading: React.FunctionComponent = () => {
  return (
    <div className="generate-documents-loading-overlay">
      <div
        className="generate-documents-loading"
        data-testid="generate-documents-loading"
      >
        Generating document(s)
        <ReactSVG className="loading-icon" src={loadingIcon} />
      </div>
    </div>
  );
};

export default GenerateDocumentsLoading;

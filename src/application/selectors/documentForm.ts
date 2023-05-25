import { createSelector } from "reselect";
import { ApplicationState } from "../types/ApplicationState";
import { DocumentFormState } from "../types/DocumentFormState";

export const documentFormSelector = (
  state: ApplicationState
): DocumentFormState => state.application.documentForm;

export const getDocumentListSelector = createSelector(
  documentFormSelector,
  (documentForm) => documentForm.documentList
);

export const getDocumentsLoadingSelector = createSelector(
  documentFormSelector,
  (documentForm) => documentForm.getDocumentsLoading
);

export const getUploadProgressSelector = createSelector(
  documentFormSelector,
  (documentForm) => documentForm.uploadProgress
);

export const getIsUploadingSelector = createSelector(
  documentFormSelector,
  (documentForm) => documentForm.isUploading
);

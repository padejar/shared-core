import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { ApplicationFormActions } from "../actions/types/applicationForm";
import { ApplicationListActions } from "../actions/types/applicationList";
import { ContractsActions } from "../actions/types/contracts";
import { DocumentActions } from "../actions/types/documentForm";

export const useApplicationListDispatch = (): Dispatch<
  ApplicationListActions
> => useDispatch();

export const useApplicationFormDispatch = (): Dispatch<
  ApplicationFormActions
> => useDispatch();

export const useDocumentFormDispatch = (): Dispatch<DocumentActions> =>
  useDispatch();

export const useContractsDispatch = (): Dispatch<ContractsActions> =>
  useDispatch();

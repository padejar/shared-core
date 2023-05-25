import { ApplicationFormState } from "./ApplicationFormState";
import { ApplicationListState } from "./ApplicationListState";
import { ContractsState } from "./ContractsState";
import { DocumentFormState } from "./DocumentFormState";

export interface ApplicationState {
  application: {
    applicationForm: ApplicationFormState;
    applicationList: ApplicationListState;
    documentForm: DocumentFormState;
    contracts: ContractsState;
  };
}

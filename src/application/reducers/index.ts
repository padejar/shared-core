import { combineReducers } from "redux";
import { reducer as applicationFormReducer } from "./applicationForm";
import { reducer as applicationListReducer } from "./applicationList";
import { reducer as contractsReducer } from "./contracts";
import { reducer as documentFormReducer } from "./documentForm";

export default combineReducers({
  applicationList: applicationListReducer,
  applicationForm: applicationFormReducer,
  documentForm: documentFormReducer,
  contracts: contractsReducer,
});

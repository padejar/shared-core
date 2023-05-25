import { combineReducers } from "redux";
import { applicationReducers as application } from "../application";
import { authReducers as auth } from "../auth";
import { errorHandlerReducers as errorHandler } from "../error-handler";
import { reducer as notification } from "../notification";
import { userReducers as user } from "../user";
import { reducer as versionManager } from "../version-manager";

export const rootReducer = combineReducers({
  application,
  errorHandler,
  auth,
  user,
  notification,
  versionManager,
});

import { combineReducers } from "redux";
import { reducer as authentication } from "./authentication";
import { reducer as resetPassword } from "./resetPassword";

export default combineReducers({
  authentication,
  resetPassword,
});

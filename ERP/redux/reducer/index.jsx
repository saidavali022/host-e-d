import { combineReducers } from "redux";
import changeNumber from "./updown";
import globalState from "./globalState";
const rootReducer = combineReducers({
  changeNumber,
  globalState,
});

export default rootReducer;

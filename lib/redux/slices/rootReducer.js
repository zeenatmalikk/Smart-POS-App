import { resetState } from "./resetSlice";
import tableSlice from "./tableSlice";

const { combineReducers } = require("redux");
const { default: userSlice } = require("./userSlice");
const { default: sidePanelSlice } = require("./sidePanelSlice");
const { default: cartSlice } = require("./cartSlice");

const appReducer = combineReducers({
  auth: userSlice,
  sidePanel: sidePanelSlice,
  cart: cartSlice,
  table: tableSlice,
});
const rootReducer = (state, action) => {
  if (action.type === resetState.type) {
    state = {
      auth: undefined,
      sidePanel: undefined,
      cart: undefined,
      table: undefined,
    };
  }
  return appReducer(state, action);
};

export default rootReducer;

const { createSlice } = require("@reduxjs/toolkit");
const initialState = {
  selectedTab: 0,
  subCategory: "",
};
const sidePanelSlice = createSlice({
  name: "sidepanel",
  initialState,
  reducers: {
    setSelectedTab(state, action) {
      return {
        ...state,
        selectedTab: action.payload,
      };
    },
    setSubcategory(state, action) {
      return {
        ...state,
        subCategory: action.payload,
      };
    },
  },
});
export const { setSelectedTab ,setSubcategory} = sidePanelSlice.actions;

export default sidePanelSlice.reducer;

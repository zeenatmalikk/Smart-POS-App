const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  tableDetails: {},
};

const tableSlice = createSlice({
  name: "tableDetails",
  initialState,
  reducers: {
    addTableData(state, action) {
      return {
        ...state,
        tableDetails: action.payload,
      };
    },
  },
});
export const { addTableData } = tableSlice.actions;
export default tableSlice.reducer;

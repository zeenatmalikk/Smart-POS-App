const { createSlice } = require("@reduxjs/toolkit");

const resetSlice = createSlice({
  name: "reset",
  initialState: {},
  reducers: {
    resetState: (state, action) => {
      // This reducer doesn't need to do anything, the action itself will be handled in rootReducer
    },
  },
});

export const { resetState } = resetSlice.actions;

export default resetSlice.reducer;

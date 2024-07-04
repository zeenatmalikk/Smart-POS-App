import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: {},
  profile: {},
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData(state, action) {
      return {
        ...state,
        user: action.payload,
      };
    },
    setProfileData(state, action) {
      return {
        ...state,
        profile: action.payload,
      };
    },
  },
});

export const { setUserData, setProfileData } = userSlice.actions;

export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isCheckingAuth: true,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setuser(state, action) {
      state.user = action.payload;
    },

    removeUser(state) {
      state.user = null;
    },

    setCheckingAuth(state, action) {
      state.isCheckingAuth = action.payload;
    },
  },
});

export const { setuser, removeUser, setCheckingAuth } = UserSlice.actions;

export default UserSlice.reducer;

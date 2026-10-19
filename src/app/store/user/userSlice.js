import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setuser(_state, action) {
      return action.payload;
    },

    removeUser() {
      return null;
    },
  },
});

export const { setuser, removeUser } = UserSlice.actions;

export default UserSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

let initialState = null;

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setuser(state, actions) {
      return actions.payload;
    },

    removeUser() {
      return null;
    },
  },
});

export const { setuser, removeUser, updateCart } = UserSlice.actions;

export default UserSlice.reducer;

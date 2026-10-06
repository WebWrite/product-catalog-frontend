import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  name: "Mohsin",
  email: "mohsin@gmail.com",
  role: "admin",
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setuser(state, actions) {
      return actions.payload;
    },

    removeUser(state, actions) {
      return null;
    },
  },
});

export const { setuser, removeUser } = UserSlice.actions;

export default UserSlice.reducer;

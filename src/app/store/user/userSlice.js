import { createSlice } from "@reduxjs/toolkit";

let initialState = null;

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setuser(state, actions) {
      return actions.payload;
    },
    updateCart(state, action) {
      if (!state) return state;

      return {
        ...state,
        cart: (state.cart ?? 0) + action.payload,
      };
    },

    removeUser() {
      return null;
    },
  },
});

export const { setuser, removeUser, updateCart } = UserSlice.actions;

export default UserSlice.reducer;

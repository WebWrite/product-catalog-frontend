import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./user/userSlice";
import CartReducer from "./cart/cart";

export const store = configureStore({
  reducer: {
    user: UserReducer,
    cart: CartReducer,
  },
});

store.subscribe(() => {
  const items = store.getState().cart.items;

  localStorage.setItem("cart", JSON.stringify(items));
});

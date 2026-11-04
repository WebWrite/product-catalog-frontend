import { createSlice } from "@reduxjs/toolkit";

export const GUEST_CART_KEY = "cart";
export const GUEST_CART_EXPIRY_KEY = "cartExpiresAt";
export const GUEST_CART_TTL = 7 * 24 * 60 * 60 * 1000;

const saved = localStorage.getItem(GUEST_CART_KEY);
const expiresAt = Number(localStorage.getItem(GUEST_CART_EXPIRY_KEY));
const hasExpired = expiresAt > 0 && expiresAt <= Date.now();

if (hasExpired) {
  localStorage.removeItem(GUEST_CART_KEY);
  localStorage.removeItem(GUEST_CART_EXPIRY_KEY);
}

const initialState = {
  items: hasExpired || !saved ? [] : JSON.parse(saved),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const item = action.payload;
      const found = state.items.find(
        (i) => i.productId === item.productId && i.size === item.size,
      );
      if (found) {
        found.quantity = Math.min(found.quantity + item.quantity, 25);
      } else {
        state.items.push({
          ...item,
          quantity: Math.min(item.quantity, 25),
        });
      }
    },

    updateItem(state, action) {
      const { productId, size, quantity } = action.payload;
      const found = state.items.find(
        (i) => i.productId === productId && i.size === size,
      );
      if (found && found.quantity + quantity <= 25) found.quantity += quantity;
    },

    removeItem(state, action) {
      const { productId, size } = action.payload;
      state.items = state.items.filter(
        (i) => !(i.productId === productId && i.size === size),
      );
    },

    setCart(state, action) {
      state.items = action.payload;
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, updateItem, removeItem, setCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

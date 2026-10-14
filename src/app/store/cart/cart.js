import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const saved = localStorage.getItem("cart");
const initialState = {
  items: saved ? JSON.parse(saved) : [],
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
        // found.quantity += item.quantity;
      } else {
        state.items.push(item);
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

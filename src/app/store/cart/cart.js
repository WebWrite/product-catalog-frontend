import { createSlice } from "@reduxjs/toolkit";

const loadSavedCart = () => {
  const saved = localStorage.getItem("cart");

  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      throw new Error("Saved cart must be an array");
    }

    return parsed;
  } catch (error) {
    console.error("Unable to restore saved cart:", error);
    localStorage.removeItem("cart");
    return [];
  }
};

const initialState = {
  items: loadSavedCart(),
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

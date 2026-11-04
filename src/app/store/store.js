import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./user/userSlice";
import CartReducer, {
  clearCart,
  GUEST_CART_EXPIRY_KEY,
  GUEST_CART_KEY,
  GUEST_CART_TTL,
} from "./cart/cart";

export const store = configureStore({
  reducer: {
    user: UserReducer,
    cart: CartReducer,
  },
});

let previousCartItems = store.getState().cart.items;
let expiryTimer;

const removeExpiredCart = () => {
  if (store.getState().cart.items.length > 0) {
    store.dispatch(clearCart());
  } else {
    localStorage.removeItem(GUEST_CART_KEY);
    localStorage.removeItem(GUEST_CART_EXPIRY_KEY);
  }
};

const scheduleCartExpiry = (expiresAt) => {
  window.clearTimeout(expiryTimer);

  const delay = expiresAt - Date.now();
  if (delay <= 0) {
    removeExpiredCart();
    return;
  }

  expiryTimer = window.setTimeout(removeExpiredCart, delay);
};

const storedExpiry = Number(localStorage.getItem(GUEST_CART_EXPIRY_KEY));
if (storedExpiry > Date.now() && previousCartItems.length > 0) {
  scheduleCartExpiry(storedExpiry);
} else if (previousCartItems.length > 0) {
  const expiresAt = Date.now() + GUEST_CART_TTL;
  localStorage.setItem(GUEST_CART_EXPIRY_KEY, String(expiresAt));
  scheduleCartExpiry(expiresAt);
}

store.subscribe(() => {
  const items = store.getState().cart.items;
  if (items === previousCartItems) return;

  previousCartItems = items;

  if (items.length === 0) {
    localStorage.removeItem(GUEST_CART_KEY);
    localStorage.removeItem(GUEST_CART_EXPIRY_KEY);
    window.clearTimeout(expiryTimer);
    return;
  }

  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));

  const expiresAt = Date.now() + GUEST_CART_TTL;
  localStorage.setItem(GUEST_CART_EXPIRY_KEY, String(expiresAt));
  scheduleCartExpiry(expiresAt);
});

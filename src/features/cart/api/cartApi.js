import api from "../../../shared/utils/api";

export const getCart = async () => {
  let res = await api.get("/cart");
  return res.data;
};

export const addToCart = async ({ id, quantity, size }) => {
  let res = await api.post("/cart", { productId: id, quantity, size });
  return res.data;
};

export const editItem = async ({ item, quantity }) => {
  let res = await api.patch(`/cart/items/${item}`, { quantity });
  return res.data;
};

export const deleteCartItem = async ({ item }) => {
  let res = await api.delete(`/cart/items/${item}`);
  return res.data;
};

export const deleteAllCart = async () => {
  let res = await api.delete("/cart");
  return res.data;
};

export const mergeCart = async (items) => {
  let res = await api.post("/cart/merge", { items });
  return res.data;
};

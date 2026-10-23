import api from "../../../shared/utils/api";

export async function getSellerOrders() {
  const res = await api.get("/seller/orders");
  return res.data.data.orders;
}

export async function updateSellerOrderStatus(payload) {
  const res = await api.patch("/seller/orders/item-status", payload);
  return res.data;
}

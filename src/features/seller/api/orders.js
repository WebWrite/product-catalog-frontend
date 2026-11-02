import api from "../../../shared/utils/api";

export async function getSellerOrders(filters) {
  const res = await api.get("/seller/orders", { params: filters });
  return res.data.data.orders;
}

export async function updateSellerOrderStatus(payload) {
  const res = await api.patch("/seller/orders/item-status", payload);
  return res.data;
}

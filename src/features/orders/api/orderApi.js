import api from "../../../shared/utils/api";

export const createCODOrder = async (shippingAddress) => {
  const { data } = await api.post("/orders/cod", {
    shippingAddress,
  });

  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/my-orders");
  return data.data.orders;
};

export const cancelOrderItem = async ({ orderId, itemId }) => {
  const { data } = await api.patch("/orders/cancel-item", {
    orderId,
    itemId,
  });

  return data;
};

export const createStripeCheckout = async (shippingAddress) => {
  const { data } = await api.post("/orders/stripe", {
    shippingAddress,
  });

  return data;
};

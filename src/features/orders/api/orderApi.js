import api from "../../../shared/utils/api";

export const createCODOrder = async ({ shippingAddress, idempotencyKey }) => {
  const response = await api.post(
    "/orders/cod",
    {
      shippingAddress,
    },
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    },
  );

  return {
    ...(typeof response.data === "object" ? response.data : {}),
    httpStatus: response.status,
  };
};

export const getMyOrders = async (filters) => {
  const { data } = await api.get("/orders/my-orders", {
    params: filters,
  });
  return data.data;
};

export const cancelOrderItem = async ({ orderId, itemId }) => {
  const { data } = await api.patch("/orders/cancel-item", {
    orderId,
    itemId,
  });

  return data;
};

export const createStripeCheckout = async ({
  shippingAddress,
  idempotencyKey,
}) => {
  const response = await api.post(
    "/orders/stripe",
    {
      shippingAddress,
    },
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    },
  );

  return {
    ...(typeof response.data === "object" ? response.data : {}),
    httpStatus: response.status,
  };
};

export const retryStripePayment = async (orderId) => {
  const { data } = await api.post("/orders/stripe/retry", { orderId });
  return data.data;
};

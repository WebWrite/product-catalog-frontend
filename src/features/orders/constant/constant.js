export const GetOrderStatus = (order) => {
  const stage = getOrderStage(order);
  return stage === -1 ? ITEM_STATUS.cancelled : ITEM_STATUS[FLOW[stage]];
};

export const getOrderStage = (order) => {
  const active = order.items.filter((i) => i.status !== "cancelled");
  if (active.length === 0) return -1;
  return Math.min(...active.map((i) => Math.max(FLOW.indexOf(i.status), 0)));
};

export const FLOW = ["pending", "confirmed", "delivered"];

export const ITEM_STATUS = {
  pending: { label: "Pending", color: "orange" },
  confirmed: { label: "Confirmed", color: "blue" },
  delivered: { label: "Delivered", color: "green" },
  cancelled: { label: "Cancelled", color: "red" },
};

export const PAYMENT_STATUS = {
  pending: { label: "Payment pending", color: "text-amber-700" },
  completed: { label: "Payment completed", color: "text-emerald-700" },
  failed: { label: "Payment failed", color: "text-red-600" },
};

export const statusTag = (status) =>
  ITEM_STATUS[status] ?? {
    label: status ? status[0].toUpperCase() + status.slice(1) : "Unknown",
    color: "default",
  };

export const sellerName = (item) =>
  item.sellerId?.sellerProfile?.storeName || item.sellerId?.name;

export const shortId = (order) => `#${order._id.slice(-6).toUpperCase()}`;

export const STEPS = ["Order Placed", "Confirmed", "Delivered"];

export const getSellerNextStatus = (
  paymentMethod,
  itemStatus,
  paymentStatus,
) => {
  const method = paymentMethod?.toUpperCase();
  const status = itemStatus?.toLowerCase();
  const payment = paymentStatus?.toLowerCase();

  if (
    (method === "STRIPE" &&
      payment === "completed" &&
      status === "confirmed") ||
    (method === "COD" && status === "pending")
  ) {
    return { to: "delivered", label: "Mark as Delivered" };
  }

  return null;
};

export const canCancelOrderItem = (itemStatus) => itemStatus === "pending";

export const getAdminOrderItemStatuses = (
  paymentMethod,
  itemStatus,
  paymentStatus,
) => {
  const status = itemStatus?.toLowerCase();
  const allowed = [status];
  const method = paymentMethod?.toUpperCase();
  const payment = paymentStatus?.toLowerCase();

  if (
    (method === "COD" && status === "pending") ||
    (method === "STRIPE" && payment === "completed" && status === "confirmed")
  ) {
    allowed.push("delivered", "cancelled");
  }

  return allowed;
};

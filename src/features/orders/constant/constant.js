export const GetOrderStatus = (order) => {
  const stage = getOrderStage(order);
  return stage === -1 ? ITEM_STATUS.cancelled : ITEM_STATUS[FLOW[stage]];
};

export const getOrderStage = (order) => {
  const active = order.items.filter((i) => i.status !== "cancelled");
  if (active.length === 0) return -1;
  return Math.min(...active.map((i) => Math.max(FLOW.indexOf(i.status), 0)));
};

export const FLOW = ["pending", "processing", "shipped", "delivered"];

export const ITEM_STATUS = {
  pending: { label: "Pending", color: "orange" },
  processing: { label: "Processing", color: "blue" },
  shipped: { label: "Shipped", color: "geekblue" },
  delivered: { label: "Delivered", color: "green" },
  cancelled: { label: "Cancelled", color: "red" },
};

export const PAYMENT_STATUS = {
  pending: { label: "Payment pending", color: "text-amber-700" },
  paid: { label: "Paid", color: "text-emerald-700" },
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

export const STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];

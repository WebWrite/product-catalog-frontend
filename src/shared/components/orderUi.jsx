export const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Canceled",
};

export const methodLabels = { STRIPE: "Stripe", COD: "Cash on delivery" };

export const capitalize = (v = "") => v.charAt(0).toUpperCase() + v.slice(1);

export const formatDate = (value) => new Date(value).toLocaleString();

export const getTotals = (order) => {
  const subtotal =
    order.subtotal ??
    order.items.reduce((sum, i) => sum + Number(i.itemTotal || 0), 0);
  const shipping = order.shippingCost;
  const total = order.total ?? subtotal + Number(shipping || 0);
  return { subtotal, shipping, total };
};

const darkPalette = {
  accent: "#8b93ff",
  accentText: "#c7caff",
  muted: "#b4b9d4",
  border: "rgba(129,140,248,0.28)",
  strip: "rgba(99,102,241,0.18)",
  status: {
    pending: {
      background: "rgba(250,173,20,0.18)",
      color: "#ffd666",
      borderColor: "rgba(250,173,20,0.5)",
    },
    confirmed: {
      background: "rgba(129,140,248,0.2)",
      color: "#c7caff",
      borderColor: "rgba(129,140,248,0.55)",
    },
    delivered: {
      background: "rgba(82,196,26,0.18)",
      color: "#95e06c",
      borderColor: "rgba(82,196,26,0.5)",
    },
    cancelled: {
      background: "rgba(255,77,79,0.18)",
      color: "#ff9c9e",
      borderColor: "rgba(255,77,79,0.5)",
    },
  },
};

const lightPalette = {
  accent: "#3730a3",
  accentText: "#312e9e",
  muted: "#3b4160",
  border: "#b4bbe4",
  strip: "#dde0ff",
  cardBg: "#ffffff",
  shadow: "0 2px 8px rgba(67, 56, 202, 0.12)",
  status: {
    pending: {
      background: "#ffefc2",
      color: "#7a4e00",
      borderColor: "#e3b44a",
    },
    confirmed: {
      background: "#dfe1ff",
      color: "#312e9e",
      borderColor: "#a9aff5",
    },
    delivered: {
      background: "#d4f1de",
      color: "#0f5f2f",
      borderColor: "#86cca1",
    },
    cancelled: {
      background: "#fbdcd8",
      color: "#a3200f",
      borderColor: "#eb958b",
    },
  },
};

export const getPalette = (isDark, darkCardBg) =>
  isDark ? { ...darkPalette, cardBg: darkCardBg } : lightPalette;

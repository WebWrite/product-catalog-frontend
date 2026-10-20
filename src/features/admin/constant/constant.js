export const TAX_RATE = 0.08875;
export const SHIPPING = 15;
export const COMMISSION_RATE = 0.12;

export const lineTotal = (i) => i.qty * i.unitPrice;

export const STATUS = {
  shipped: { label: "Shipped", color: "blue" },
  processing: { label: "Processing", color: "orange" },
  refunded: { label: "Refund Closed", color: "red" },
  cancelled: { label: "Cancelled", color: "default" },
};

export const DELIEVERY_STATUS_OPTIONS = [
  { value: "processing", label: "Status: Processing" },
  { value: "shipped", label: "Status: Shipped" },
  { value: "refunded", label: "Status: Refunded" },
  { value: "cancelled", label: "Status: Cancelled" },
];

export const CATEGORIES = [
  "Ceramics & Tableware",
  "Kitchen & Dining",
  "Furniture",
  "Textiles",
  "Furniture & Wood",
  "Art & Crafts",
  "Home Decor",
];

export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending Review" },
  { value: "flagged", label: "Flagged" },
  { value: "suspended", label: "Suspended" },
];

export const STATUS_TAG = {
  active: { label: "Active", color: "green" },
  pending: { label: "Pending Review", color: "orange" },
  flagged: { label: "Flagged", color: "red" },
  suspended: { label: "Suspended", color: "default" },
};

export const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

export const PRICE_MIN = 100;
export const PRICE_MAX = 100000;
export const PAGE_SIZE = 15;

export const CATEGORIES = [
  { value: "Clothing", label: "Fashion & Clothing" },
  { value: "Electronics", label: "Electronic Devices" },
  { value: "Beauty", label: "Beauty & Personal Care" },
  { value: "Furniture", label: "Home & Furniture" },
  { value: "Sports", label: "Sports & Outdoors" },
  { value: "Toys", label: "Toys & Games" },
  { value: "Food", label: "Food & Groceries" },
];

export const PRICE_PRESETS = [
  { label: "< 500", min: PRICE_MIN, max: 500 },
  { label: "500 - 1000", min: 500, max: 1000 },
  { label: "1000 - 3000", min: 1000, max: 3000 },
  { label: "3000+", min: 3000, max: PRICE_MAX },
];

export const DEFAULT_FILTERS = {
  keyword: "",
  category: null,
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  inStock: false,
  sortBy: "low-to-high",
  page: 1,
};

export const getBadge = (p) => {
  if (p.status && p.status !== "active") return "Unavailable";
  if (p.stock === 0) return "Out of Stock";
  if (p.stock > 0 && p.stock <= 5) return "Low Stock";
  return undefined;
};

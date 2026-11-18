import * as yup from "yup";

export const STORE_TYPES = [
  { value: "Clothing", label: "Fashion & Clothing" },
  { value: "Electronics", label: "Electronics" },
  { value: "Beauty", label: "Beauty" },
  { value: "Furniture", label: "Furniture" },
  { value: "Sports", label: "Sports" },
  { value: "Toys", label: "Toys" },
  { value: "Food", label: "Food" },
];

const LEGACY_STORE_TYPES = [
  ["fashion", "Fashion & Apparel"],
  ["beauty", "Beauty & Cosmetics"],
  ["health", "Health & Wellness"],
  ["electronics", "Electronics & Gadgets"],
  ["home-furniture", "Home & Furniture"],
  ["jewelry", "Jewelry & Accessories"],
  ["food-beverages", "Food & Beverages"],
  ["grocery", "Grocery"],
  ["sports-fitness", "Sports & Fitness"],
  ["books-stationery", "Books & Stationery"],
  ["toys-games", "Toys & Games"],
  ["baby-kids", "Baby & Kids"],
  ["automotive", "Automotive"],
  ["pet-supplies", "Pet Supplies"],
  ["shoes-footwear", "Shoes & Footwear"],
  ["bags-luggage", "Bags & Luggage"],
  ["watches", "Watches"],
  ["art-crafts", "Art & Crafts"],
  ["handmade", "Handmade Products"],
  ["digital-products", "Digital Products"],
  ["software-saas", "Software & SaaS"],
  ["services", "Services"],
  ["subscription-box", "Subscription Box"],
  ["wholesale-b2b", "Wholesale & B2B"],
  ["industrial-tools", "Industrial & Tools"],
  ["home-garden", "Home & Garden"],
  ["office-supplies", "Office Supplies"],
  ["travel-outdoor", "Travel & Outdoor"],
  ["luxury-premium", "Luxury & Premium"],
  ["gifts-occasions", "Gifts & Occasions"],
  ["other", "Other"],
].map(([value, label]) => ({ value, label, disabled: true }));

const STORE_TYPE_VALUES = [
  ...STORE_TYPES.map(({ value }) => value),
  ...LEGACY_STORE_TYPES.map(({ value }) => value),
];

export const STORE_OPTIONS = [...STORE_TYPES, ...LEGACY_STORE_TYPES];

export const sellerProfileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Seller name is required"),

  storeName: yup
    .string()
    .trim()
    .min(2, "Store name must be at least 2 characters")
    .max(60, "Store name must not exceed 60 characters")
    .required("Store name is required"),

  storeType: yup
    .string()
    .oneOf(STORE_TYPE_VALUES, "Please select a valid store type")
    .required("Store type is required"),
});

export const sellerPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    )
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Confirm password is required"),
});

export const yupFieldRule = (schema, field, getValues) => ({
  validator: async (_, value) => {
    const values = getValues ? getValues(value) : { [field]: value };
    await schema.validateAt(field, values);
  },
});

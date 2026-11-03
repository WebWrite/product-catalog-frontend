import * as yup from "yup";

export const STORE_TYPES = [
  "Clothing",
  "Electronics",
  "Beauty",
  "Furniture",
  "Sports",
  "Toys",
  "Food",
];

export const STORE_OPTIONS = STORE_TYPES.map((type) => ({
  value: type,
  label: type,
}));

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
    .oneOf(STORE_TYPES, "Please select a valid store type")
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

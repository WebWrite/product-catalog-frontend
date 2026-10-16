
import * as yup from "yup";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
} from "../constants/productConstants";

export const productSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters.")
    .max(200, "Product name cannot exceed 200 characters.")
    .required("Product name is required."),

  category: yup
    .string()
    .oneOf(PRODUCT_CATEGORIES, "Select a valid category.")
    .required("Category is required."),

  description: yup
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(5000, "Description cannot exceed 5000 characters.")
    .required("Description is required."),

  price: yup
    .number()
    .typeError("Price must be a valid number.")
    .min(0.01, "Price must be greater than 0.")
    .max(1_000_000, "Price cannot exceed 1,000,000.")
    .required("Price is required."),

  stock: yup
    .number()
    .typeError("Stock must be a valid number.")
    .integer("Stock must be a whole number.")
    .min(0, "Stock cannot be negative.")
    .max(100_000, "Stock cannot exceed 100,000.")
    .required("Stock is required."),

  sizes: yup
    .array()
    .of(yup.string().oneOf(PRODUCT_SIZES, "Select valid sizes."))
    .max(20, "You cannot select more than 20 sizes.")
    .default([]),

  status: yup
    .string()
    .oneOf(["active", "inactive"], "Select a valid status.")
    .required("Status is required."),
});

export const productFieldRule = (field) => ({
  validator: async (_, value) => {
    try {
      await productSchema.fields[field].validate(value);
    } catch (error) {
      throw new Error(error.message);
    }
  },
});

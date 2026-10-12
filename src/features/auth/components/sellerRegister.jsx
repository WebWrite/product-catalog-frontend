import { useMutation } from "@tanstack/react-query";
import { App, AutoComplete, Button, Checkbox, Form, Input, Select } from "antd";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdArrowForward,
  MdBadge,
  MdOutlineCategory,
  MdOutlineMail,
  MdStorefront,
} from "react-icons/md";
import PasswordStrength from "./passwordStrength";

const PASSWORD_CHECKS = [
  { label: "8+ chars", test: (v) => v.length >= 8 },
  { label: "Upper & Lower", test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v) },
  { label: "1+ Number", test: (v) => /\d/.test(v) },
  { label: "1+ Symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STORE_TYPES = [
  { value: "fashion", label: "Fashion & Apparel" },
  { value: "beauty", label: "Beauty & Cosmetics" },
  { value: "health", label: "Health & Wellness" },
  { value: "electronics", label: "Electronics & Gadgets" },
  { value: "home-furniture", label: "Home & Furniture" },
  { value: "jewelry", label: "Jewelry & Accessories" },
  { value: "food-beverages", label: "Food & Beverages" },
  { value: "grocery", label: "Grocery" },
  { value: "sports-fitness", label: "Sports & Fitness" },
  { value: "books-stationery", label: "Books & Stationery" },
  { value: "toys-games", label: "Toys & Games" },
  { value: "baby-kids", label: "Baby & Kids" },
  { value: "automotive", label: "Automotive" },
  { value: "pet-supplies", label: "Pet Supplies" },
  { value: "shoes-footwear", label: "Shoes & Footwear" },
  { value: "bags-luggage", label: "Bags & Luggage" },
  { value: "watches", label: "Watches" },
  { value: "art-crafts", label: "Art & Crafts" },
  { value: "handmade", label: "Handmade Products" },
  { value: "digital-products", label: "Digital Products" },
  { value: "software-saas", label: "Software & SaaS" },
  { value: "services", label: "Services" },
  { value: "subscription-box", label: "Subscription Box" },
  { value: "wholesale-b2b", label: "Wholesale & B2B" },
  { value: "industrial-tools", label: "Industrial & Tools" },
  { value: "home-garden", label: "Home & Garden" },
  { value: "office-supplies", label: "Office Supplies" },
  { value: "travel-outdoor", label: "Travel & Outdoor" },
  { value: "luxury-premium", label: "Luxury & Premium" },
  { value: "gifts-occasions", label: "Gifts & Occasions" },
  { value: "other", label: "Other" },
];

function SellerRegister() {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const password = Form.useWatch("password", form) ?? "";

  const [autoComplete, setAutoComplete] = useState([]);

  const handleAutoComplete = (value) => {
    if (!value || value.includes("@")) {
      setAutoComplete([]);
      return;
    }
    setAutoComplete(
      ["gmail.com", "yahoo.com", "outlook.com", "github.com"].map((v) => ({
        label: `${value}@${v}`,
        value: `${value}@${v}`,
      })),
    );
  };

  const handleSubmit = async (data) => {
    const Backend_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await axios.post(`${Backend_URL}/auth/register-seller`, {
      name: data.name,
      email: data.email,
      password: data.password,
      storeType: data.storeType,
      storeName: data.storeName,
    });
    return res;
  };

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (_, variables) => {
      notification.success({
        title: "Sign Up successfully",
        description: "Welcome to our platform",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
      form.resetFields();
      navigate("/auth/verify-otp", {
        state: { email: variables.email, comeFrom: "register" },
      });
    },
    onError: (error) => {
      notification.error({
        title: "SignUp Failed",
        description: error.response?.data.message || "Something went wrong",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    },
  });

  const handleFinish = (values) => mutation.mutate(values);

  return (
    <Form
      layout="vertical"
      className="theme-form"
      onFinish={handleFinish}
      form={form}
    >
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <Form.Item
          label="Full Name"
          name="name"
          required={false}
          className="theme-form-label font-semibold"
          rules={[
            { required: true, message: "Name is required" },
            { min: 3, message: "Name must be 3 character long" },
            { max: 50, message: "Name contain only 50 character" },
          ]}
        >
          <Input
            size="large"
            className="font-normal"
            placeholder="Elena Vance"
            prefix={<MdBadge className="text-sm text-slate-500" />}
          />
        </Form.Item>

        <Form.Item
          label="Email Address"
          name="email"
          required={false}
          className="theme-form-label font-semibold"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <AutoComplete
            className="w-full font-normal"
            showSearch={{ onSearch: handleAutoComplete }}
            options={autoComplete}
          >
            <Input
              size="large"
              placeholder="elena.vance@auramarket.design"
              prefix={<MdOutlineMail className="text-sm text-slate-500" />}
            />
          </AutoComplete>
        </Form.Item>

        <Form.Item
          label="Store Name"
          name="storeName"
          required={false}
          className="theme-form-label font-semibold"
          rules={[
            { required: true, message: "Store name is required" },
            { min: 3, message: "Name must be 3 character long" },
            { max: 50, message: "Name contain only 50 character" },
          ]}
        >
          <Input
            size="large"
            className="font-normal"
            placeholder="Vance Ceramics Studio"
            prefix={<MdStorefront className="text-sm text-slate-500" />}
          />
        </Form.Item>

        <Form.Item
          label="Store Type"
          name="storeType"
          required={false}
          className="theme-form-label font-semibold"
          rules={[{ required: true, message: "Type is required" }]}
        >
          <Select
            size="large"
            className="font-normal"
            placeholder="Select an option"
            prefix={<MdOutlineCategory className="text-sm text-slate-500" />}
            showSearch={{ optionFilterProp: "label" }}
            options={STORE_TYPES}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          required={false}
          className="theme-form-label font-semibold"
          rules={[
            { required: true, message: "Password is required" },
            { max: 128, message: "Password must be less than 128 character" },
            {
              validator: (_, value) =>
                !value || PASSWORD_CHECKS.every((c) => c.test(value))
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Password doesn't meet all requirements"),
                    ),
            },
          ]}
        >
          <Input.Password size="large" className="font-normal" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          required={false}
          dependencies={["password"]}
          className="theme-form-label font-semibold"
          rules={[
            { required: true, message: "Confirm Password is required" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The password not match!"));
              },
            }),
          ]}
        >
          <Input.Password size="large" className="font-normal" />
        </Form.Item>
      </div>

      <PasswordStrength password={password} />

      <Form.Item
        name="terms"
        valuePropName="checked"
        className="mb-2!"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error("You must agree to continue")),
          },
        ]}
      >
        <Checkbox className="text-xs!">
          I agree to Aura's{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600"
          >
            Privacy Policy
          </a>
          .
        </Checkbox>
      </Form.Item>

      <Form.Item name="updates" valuePropName="checked" className="mb-6!">
        <Checkbox className="text-xs!">
          Stay updated on seller tips, platform news, and special offers.
        </Checkbox>
      </Form.Item>

      <Form.Item className="mb-4!">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={mutation.isPending}
          className="h-11! gap-2 bg-indigo-700! text-xs! font-semibold! hover:bg-indigo-800!"
        >
          {mutation.isPending ? (
            "Creating account..."
          ) : (
            <>
              Create Account <MdArrowForward className="inline" />
            </>
          )}
        </Button>
      </Form.Item>

      <p className="text-center text-xs">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-semibold text-indigo-600">
          Sign in
        </Link>
      </p>
    </Form>
  );
}

export default SellerRegister;

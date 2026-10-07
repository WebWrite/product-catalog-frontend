import { useMutation } from "@tanstack/react-query";
import { App, AutoComplete, Button, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SellerRegister() {
  const { notification } = App.useApp();
  let navigate = useNavigate();

  const storeTypes = [
    {
      value: "fashion",
      label: "Fashion & Apparel",
      otherField: "fashionStore",
    },
    { value: "beauty", label: "Beauty & Cosmetics", otherField: "beautyStore" },
    { value: "health", label: "Health & Wellness", otherField: "healthStore" },
    {
      value: "electronics",
      label: "Electronics & Gadgets",
      otherField: "electronicsStore",
    },
    {
      value: "home-furniture",
      label: "Home & Furniture",
      otherField: "homeFurnitureStore",
    },
    {
      value: "jewelry",
      label: "Jewelry & Accessories",
      otherField: "jewelryStore",
    },
    {
      value: "food-beverages",
      label: "Food & Beverages",
      otherField: "foodBeveragesStore",
    },
    { value: "grocery", label: "Grocery", otherField: "groceryStore" },
    {
      value: "sports-fitness",
      label: "Sports & Fitness",
      otherField: "sportsFitnessStore",
    },
    {
      value: "books-stationery",
      label: "Books & Stationery",
      otherField: "booksStationeryStore",
    },
    {
      value: "toys-games",
      label: "Toys & Games",
      otherField: "toysGamesStore",
    },
    { value: "baby-kids", label: "Baby & Kids", otherField: "babyKidsStore" },
    { value: "automotive", label: "Automotive", otherField: "automotiveStore" },
    {
      value: "pet-supplies",
      label: "Pet Supplies",
      otherField: "petSuppliesStore",
    },
    {
      value: "shoes-footwear",
      label: "Shoes & Footwear",
      otherField: "shoesFootwearStore",
    },
    {
      value: "bags-luggage",
      label: "Bags & Luggage",
      otherField: "bagsLuggageStore",
    },
    { value: "watches", label: "Watches", otherField: "watchesStore" },
    {
      value: "art-crafts",
      label: "Art & Crafts",
      otherField: "artCraftsStore",
    },
    {
      value: "handmade",
      label: "Handmade Products",
      otherField: "handmadeStore",
    },
    {
      value: "digital-products",
      label: "Digital Products",
      otherField: "digitalProductsStore",
    },
    {
      value: "software-saas",
      label: "Software & SaaS",
      otherField: "softwareSaasStore",
    },
    { value: "services", label: "Services", otherField: "servicesStore" },
    {
      value: "subscription-box",
      label: "Subscription Box",
      otherField: "subscriptionBoxStore",
    },
    {
      value: "wholesale-b2b",
      label: "Wholesale & B2B",
      otherField: "wholesaleB2bStore",
    },
    {
      value: "industrial-tools",
      label: "Industrial & Tools",
      otherField: "industrialToolsStore",
    },
    {
      value: "home-garden",
      label: "Home & Garden",
      otherField: "homeGardenStore",
    },
    {
      value: "office-supplies",
      label: "Office Supplies",
      otherField: "officeSuppliesStore",
    },
    {
      value: "travel-outdoor",
      label: "Travel & Outdoor",
      otherField: "travelOutdoorStore",
    },
    {
      value: "luxury-premium",
      label: "Luxury & Premium",
      otherField: "luxuryPremiumStore",
    },
    {
      value: "gifts-occasions",
      label: "Gifts & Occasions",
      otherField: "giftsOccasionsStore",
    },
    { value: "other", label: "Other", otherField: "otherStore" },
  ];

  let handleFinish = (values) => {
    mutation.mutate(values);
    form.resetFields();
  };

  let handleSubmit = async (data) => {
    const Backend_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await axios.post(`${Backend_URL}/auth/register/seller`, data);
    return res;
  };

  let mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: async () => {
      const { email } = await form.validateFields(["email"]);
      notification.success({
        title: "Sign Up successfully",
        description: "Welcome to our platfrom",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
      navigate("/auth/verify-otp", { state: { email } });
    },
    onError: (error) => {
      notification.error({
        title: "SignUp Failed",
        description: error.message || "Something went wrong",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    },
  });

  const [form] = useForm();
  let [autoComplete, SetAutoComplete] = useState([]);

  let handleAutoComplete = (value) => {
    SetAutoComplete(() => {
      if (!value || value.includes("@")) {
        return;
      }
      return ["gmail.com", "yahoo.com", "outlook.com", "github.com"].map(
        (v) => ({ label: `${value}@${v}`, value: `${value}@${v}` }),
      );
    });
  };
  return (
    <Form
      layout="vertical"
      className="theme-form"
      onFinish={handleFinish}
      form={form}
    >
      <Form.Item
        label="Name"
        name={"name"}
        required={false}
        className="theme-form-label font-semibold"
        rules={[{ required: true, message: "Name is required" }]}
      >
        <Input className="font-normal" type={"text"}></Input>
      </Form.Item>

      <Form.Item
        label="Email"
        name={"email"}
        required={false}
        className="theme-form-label font-semibold"
        rules={[
          { required: true, message: "Email is required" },
          { type: "email", message: "Enter a valid email" },
        ]}
      >
        <AutoComplete
          className="font-normal"
          showSearch={{ onSearch: handleAutoComplete }}
          options={autoComplete}
        ></AutoComplete>
      </Form.Item>
      <Form.Item
        label="Store Name"
        name={"storeName"}
        required={false}
        className="theme-form-label font-semibold"
        rules={[{ required: true, message: "Store name is required" }]}
      >
        <Input className="font-normal" type={"text"}></Input>
      </Form.Item>

      <Form.Item
        label="Store Type"
        name={"storeType"}
        required={false}
        className="theme-form-label font-semibold"
        rules={[{ required: true, message: "Type is required" }]}
      >
        <Select
          placeholder="Select an option"
          showSearch={{
            optionFilterProp: ["label", "otherField"],
          }}
          options={storeTypes}
        />
      </Form.Item>

      <Form.Item
        name={"password"}
        label="Password"
        required={false}
        className="theme-form-label font-semibold"
        rules={[{ required: true, message: "Password is required" }]}
      >
        <Input.Password className="font-normal"></Input.Password>
      </Form.Item>

      <Form.Item
        name={"confirmPassword"}
        label="Confirm Password"
        className="theme-form-label font-semibold"
        required={false}
        dependencies={["password"]}
        rules={[
          { required: true, message: "Confirm Password is required" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") == value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  "The confirm password that you entered do not match!",
                ),
              );
            },
          }),
        ]}
      >
        <Input.Password
          className="font-normal"
          variant="outlined"
        ></Input.Password>
      </Form.Item>

      <Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          className="bg-white! text-black! text-xs! w-full font-semibold! mt-8   "
        >
          {mutation.isPending ? "Signing Up..." : "Sign up"}
        </Button>
      </Form.Item>

      <p className="text-center">
        Already have an account?{" "}
        <Button className="p-0!" type="link">
          <Link to={"/auth/login"}>Sign in</Link>
        </Button>
      </p>
    </Form>
  );
}

export default SellerRegister;

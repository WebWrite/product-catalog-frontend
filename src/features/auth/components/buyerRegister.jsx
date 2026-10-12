import { useMutation } from "@tanstack/react-query";
import { App, AutoComplete, Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowForward, MdBadge, MdOutlineMail } from "react-icons/md";
import PasswordStrength from "./passwordStrength";

const PASSWORD_CHECKS = [
  { label: "8+ chars", test: (v) => v.length >= 8 },
  { label: "Upper & Lower", test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v) },
  { label: "1+ Number", test: (v) => /\d/.test(v) },
  { label: "1+ Symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function BuyerRegister() {
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
    const res = await axios.post(`${Backend_URL}/auth/register-customer`, {
      name: data.name,
      password: data.password,
      email: data.email,
    });
    return res;
  };

  const mutation = useMutation({
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
      form.resetFields();
      navigate("/auth/verify-otp", { state: { email, comeFrom: "register" } });
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
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 mb-2">
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
            className="font-normal"
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
          Stay updated on exclusive launches, new collections, and special
          offers.
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
        Have any account?{" "}
        <Link to="/auth/login" className="font-semibold text-indigo-600">
          Sign in
        </Link>
      </p>
    </Form>
  );
}

export default BuyerRegister;

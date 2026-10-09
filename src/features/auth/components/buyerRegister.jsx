import { useMutation } from "@tanstack/react-query";
import { App, AutoComplete, Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function BuyerRegister() {
  const { notification } = App.useApp();
  let navigate = useNavigate();

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

  let handleFinish = (values) => {
    mutation.mutate(values);
  };

  let handleSubmit = async (data) => {
    const Backend_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await axios.post(`${Backend_URL}/auth/register-customer`, {
      name: data.name,
      password: data.password,
      email: data.email,
    });
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
      form.resetFields();
      navigate("/auth/verify-otp", { state: { email, comeFrom: "register" } });
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

  let [form] = useForm();
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
        name={"password"}
        label="Password"
        required={false}
        className="theme-form-label font-semibold"
        rules={[
          { required: true, message: "Password is required" },
          {
            pattern: /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/,
            message:
              "Password must contain at least one uppercase letter and one special character",
          },
        ]}
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
          disabled={mutation.isPending}
          htmlType="submit"
          className="bg-white! text-black! text-xs! w-full font-semibold! mt-8   "
        >
          {mutation.isPending ? "Signing up...." : "Sign Up"}
        </Button>
      </Form.Item>

      <p className="text-center">
        Have any account?{" "}
        <Button className="p-0!" type="link">
          <Link to={"/auth/login"}>Sign in</Link>
        </Button>
      </p>
    </Form>
  );
}

export default BuyerRegister;

import { App, Button, Divider, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setuser } from "../../../app/store/user/userSlice";
import api, { login } from "../../../shared/utils/api";
import { useMutation } from "@tanstack/react-query";

function Login() {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const { notification } = App.useApp();
  let [form] = useForm();

  let handleFinish = async (values) => {
    mutation.mutate(values);
  };

  let mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data);
      dispatch(setuser(data.data.user));

      if (data.data.user.role == "admin") {
        navigate("/admin/dashboard");
      } else if (data.data.user.role == "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
      console.log(data);

      notification.success({
        title: "Login successfully",
        description: "Welcome back to our platfrom",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
      form.resetFields();
    },
    onError: async (error) => {
      const { email } = await form.validateFields(["email"]);
      console.log(error.response?.status, error.response?.data.message);
      if (
        error.response?.status == 403 &&
        error.response?.data.message == "Verify your email to access resources"
      ) {
        const res = await api.post("/auth/resend-email-otp", { email });
        console.log(res);
        if (res.status !== 200) {
          return;
        }
        notification.success({
          description: `Otp is send to  ${email}`,
          pauseOnHover: true,
          showProgress: true,
          placement: "bottomRight",
        });
        navigate("/auth/verify-otp", {
          state: {
            comeFrom: "register",
            email,
          },
        });
      }
      notification.error({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    },
  });

  const otpMutation = useMutation({
    mutationFn: async (email) => {
      return await api.post("/auth/send-login-otp", { email });
    },

    onSuccess: (res, email) => {
      if (res.status === 200) {
        notification.success({
          description: `OTP sent to ${email}`,
          pauseOnHover: true,
          showProgress: true,
          placement: "bottomRight",
        });

        form.resetFields();

        navigate("/auth/verify-otp", {
          state: {
            comeFrom: "login",
            email,
          },
        });
      }
    },

    onError: (error) => {
      notification.error({
        title: "OTP Request Failed",
        description: error.response?.data?.message || "Failed to send OTP",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    },
  });

  const handleOtp = async () => {
    const { email } = await form.validateFields(["email"]);
    otpMutation.mutate(email);
  };

  return (
    <div className="theme-page min-h-screen">
      <div className="flex justify-center min-h-screen items-center font-sans flex-col">
        <div className="theme-panel min-w-76 sm:min-w-96 p-4 rounded-2xl">
          <h2 className="theme-heading text-sm font-bold">
            Login to your account
          </h2>
          <p className="theme-muted text-xs mt-2 mb-6">
            Enter email below to login your account
          </p>
          <Form
            form={form}
            layout="vertical"
            className="theme-form"
            onFinish={handleFinish}
          >
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
              <Input className="font-normal" type={"email"}></Input>
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

            <Form.Item>
              <Button
                disabled={mutation.isPending}
                htmlType="submit"
                className="bg-white! text-black! text-xs! w-full font-semibold! mt-8   "
              >
                {mutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
            <Divider>Or</Divider>
            <Form.Item>
              <Button
                disabled={mutation.isPending}
                htmlType="button"
                onClick={handleOtp}
                type="dashed"
                className="theme-outline-button! text-xs! w-full font-semibold!"
              >
                Login with OTP
              </Button>
            </Form.Item>

            <p className="text-center">
              Don't have any account?{" "}
              <Button className="p-0!" type="link">
                <Link to={"/auth/register"}> Sign up</Link>
              </Button>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;

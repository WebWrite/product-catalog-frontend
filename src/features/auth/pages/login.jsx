import { App, Button, Divider, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MdArrowForward,
  MdOutlineLock,
  MdOutlineMail,
  MdOutlineMarkEmailRead,
  MdOutlineShield,
  MdVerifiedUser,
  MdViewInAr,
} from "react-icons/md";
import { setuser } from "../../../app/store/user/userSlice";
import api, { login } from "../../../shared/utils/api";
import CustomTag from "../../../shared/components/customTag";
import { clearCart } from "../../../app/store/cart/cart";
import { mergeCart } from "../../cart/api/cartApi";
import { setLoginMarker } from "../../../shared/utils/authStorage";
import { IoHome } from "react-icons/io5";
import ThemeToggle from "../../../shared/components/themeToggle";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  let cart = useSelector((state) => state.cart);
  const { notification } = App.useApp();
  const [form] = Form.useForm();

  const [step, setStep] = useState("email");

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      const loginUser = data.data.user;
      setLoginMarker();

      await queryClient.cancelQueries({ queryKey: ["currentUser"] });
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      if (loginUser.role === "admin" || loginUser.role === "seller") {
        dispatch(setuser(loginUser));
        queryClient.setQueryData(["currentUser"], loginUser);
        navigate(
          loginUser.role === "admin" ? "/admin/dashboard" : "/seller/dashboard",
        );
      } else {
        if (cart?.items?.length >= 1) {
          try {
            const response = await mergeCart(cart.items);
            if (response?.success !== false) dispatch(clearCart());
          } catch (e) {
            console.error("Cart merge failed", e);
          }
        }

        let latestUser = loginUser;
        try {
          const me = await api.get("/user/me");
          latestUser = me.data?.user ?? loginUser;
        } catch (e) {
          console.error("Failed to refresh user", e);
        }

        dispatch(setuser(latestUser));

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["currentUser"],
            refetchType: "all",
          }),
          queryClient.invalidateQueries({
            queryKey: ["cart"],
            refetchType: "all",
          }),
        ]);

        navigate("/");
      }

      notification.success({
        title: "Login successfully",
        description: "Welcome back to our platform",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
      form.resetFields();
    },

    onError: async (error, variables) => {
      const { email } = variables;
      console.log(error.response);
      if (
        error.response?.status === 403 &&
        error.response?.data?.message ===
          "Verify your email to access resources"
      ) {
        const res = await api.post("/auth/resend-email-otp", { email });
        if (res.status !== 200) return;

        notification.success({
          description: `OTP is sent to ${email}`,
          pauseOnHover: true,
          showProgress: true,
          placement: "bottomRight",
        });
        navigate("/auth/verify-otp", {
          state: { comeFrom: "register", email },
        });
        return;
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
    mutationFn: (email) => api.post("/auth/send-login-otp", { email }),
    onSuccess: (res, email) => {
      if (res.status === 200) {
        notification.success({
          description: `OTP sent to ${email}`,
          pauseOnHover: true,
          showProgress: true,
          placement: "bottomRight",
        });
        form.resetFields();
        navigate("/auth/verify-otp", { state: { comeFrom: "login", email } });
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

  const handleFinish = (values) => {
    if (step === "email") {
      setStep("password");
      return;
    }
    mutation.mutate(values);
  };

  const handleOtp = async () => {
    const { email } = await form.validateFields(["email"]);
    otpMutation.mutate(email);
  };

  const handleChangeEmail = () => {
    form.resetFields(["password"]);
    setStep("email");
  };

  const busy = mutation.isPending || otpMutation.isPending;

  return (
    <div className="theme-page relative min-h-screen bg-purple-50">
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <Link
        to={"/"}
        className="fixed top-4 left-0 z-50 flex items-center gap-2 rounded-r-lg! bg-blue-600! p-2 text-white! shadow-lg! transition-colors! hover:bg-blue-700! sm:top-20 sm:-translate-y-1/2 sm:p-3"
      >
        <IoHome size={20} />
      </Link>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10 font-sans">
        <div className="z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl shadow-indigo-100 sm:p-8">
          <Link to={"/"} className="flex items-center justify-center gap-2">
            <MdViewInAr className="text-3xl text-indigo-700" />
            <span className="text-2xl font-bold text-slate-900">Aura</span>
          </Link>

          <p className="mx-auto mt-3 max-w-64 text-center text-[11px] leading-snug text-slate-500">
            Your Marketplace for Quality Products, Trusted Sellers & Everyday
            Essentials
          </p>

          <div className="mt-4 flex justify-center">
            <CustomTag
              className={"py-1! px-2! rounded-2xl!"}
              color="#EAEDFF"
              text="Shopping Privileges: Secure Checkout"
            />
          </div>

          <div className="mt-6 mb-3 flex justify-center">
            <span className="border-b-2 border-indigo-700 pb-1 text-sm font-semibold text-indigo-700">
              Sign In
            </span>
          </div>

          <Form
            form={form}
            layout="vertical"
            className="theme-form mt-6"
            requiredMark={false}
            onFinish={handleFinish}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Email Address
              </span>
              <button
                type="button"
                onClick={handleOtp}
                disabled={busy}
                className="cursor-pointer text-[11px] font-medium text-indigo-600 hover:underline disabled:opacity-50"
              >
                Passwordless OTP
              </button>
            </div>

            <Form.Item
              name="email"
              className="mb-2!"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                size="large"
                type="email"
                disabled={step === "password"}
                placeholder="elena.vance@auramarket.design"
                className="font-normal"
                prefix={<MdOutlineMail className="text-base text-slate-500" />}
                suffix={
                  step === "password" ? (
                    <button
                      type="button"
                      onClick={handleChangeEmail}
                      className="cursor-pointer text-[11px] font-medium text-indigo-600 hover:underline"
                    >
                      Change
                    </button>
                  ) : null
                }
              />
            </Form.Item>

            {step === "email" && (
              <p className="mb-5 pt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                <MdOutlineMarkEmailRead className="text-sm text-indigo-600" />
                We'll send a secure 6-digit verification code. No password
                needed.
              </p>
            )}

            {step === "password" && (
              <Form.Item
                name="password"
                label={
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Password
                  </span>
                }
                className="mt-3"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password
                  autoFocus
                  size="large"
                  placeholder="Enter your password"
                  className="font-normal"
                  prefix={
                    <MdOutlineLock className="text-base text-slate-500" />
                  }
                />
              </Form.Item>
            )}

            <Form.Item className="mb-0!">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                disabled={busy}
                loading={mutation.isPending}
                className="h-11! gap-2 bg-indigo-700! text-xs! font-semibold! hover:bg-indigo-800!"
              >
                {step === "email" ? (
                  <>
                    Continue with Password <MdArrowForward className="inline" />
                  </>
                ) : mutation.isPending ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In <MdArrowForward className="inline" />
                  </>
                )}
              </Button>
            </Form.Item>

            <Divider className="my-5! text-[10px]! tracking-wider text-slate-500!">
              OR CONTINUE WITH
            </Divider>

            <Button
              block
              size="large"
              htmlType="button"
              disabled={busy}
              loading={otpMutation.isPending}
              onClick={handleOtp}
              className="h-10! border-0! bg-indigo-50! text-xs! font-medium! text-indigo-700! hover:bg-indigo-100!"
            >
              {otpMutation.isPending ? "Sending OTP..." : "Passwordless OTP"}
            </Button>

            <p className="mt-5 text-center text-xs text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="font-semibold text-indigo-600"
              >
                Sign up
              </Link>
            </p>
          </Form>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-[10px] text-slate-600">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <MdVerifiedUser className="text-sm" /> 256-bit TLS encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <MdOutlineShield className="text-sm" /> ISO 27001 compliant
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link>Help Center</Link>
            <Link>Privacy Policy</Link>
            <Link>Terms of Service</Link>
            <Link>Artisan Handbook</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

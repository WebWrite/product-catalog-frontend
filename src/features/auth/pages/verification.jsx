import { Button, Input, notification, Typography } from "antd";
import { useEffect, useState } from "react";
import { TfiReload } from "react-icons/tfi";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../shared/utils/api";
import { useDispatch } from "react-redux";
import { setuser } from "../../../app/store/user/userSlice";

const { Title } = Typography;

function Verification() {
  const [resendTimer, setResendTimer] = useState(0);
  let location = useLocation();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  const email = location.state?.email;
  const comeFrom = location.state.comeFrom || "register";
  let [otp, setotp] = useState();

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (!email) {
      navigate(-1);
    }
  }, [email, navigate]);

  let onChange = async (text) => {
    setotp(text);
  };

  let handleSubmit = async () => {
    try {
      if (comeFrom == "login") {
        const res = await api.post("auth/verify-login-otp", {
          email,
          otp,
        });
        console.log(res);
        if (res.status === 201) {
          dispatch(setuser(res.data.user));
          if (res.data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else if (res.data.user.role === "seller") {
            navigate("/seller/dashboard");
          } else {
            navigate("/");
          }
          setotp("");
          notification.success({
            title: "Login successfully",
            description: "Welcome back to our platfrom",
            pauseOnHover: true,
            showProgress: true,
            placement: "bottomRight",
          });
        }
      }
      if (comeFrom == "register") {
        const res = await api.post("auth/verify-email-otp", {
          email,
          otp,
        });
        setotp("");
        console.log(res);
        if (res.status === 201) {
          navigate("/auth/login");
        }
      } else {
        return;
      }
    } catch (error) {
      notification.error({
        description: error.response?.data.message || "Invalid credentials",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      let res;

      if (comeFrom === "register") {
        res = await api.post("/auth/resend-email-otp", { email });
      } else if (comeFrom === "login") {
        res = await api.post("/auth/send-login-otp", { email });
      } else {
        return;
      }

      if (res.status >= 200 && res.status < 300) {
        setResendTimer(30);

        notification.success({
          title: "Code Sent",
          description: "A new verification code has been sent to your email.",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      notification.error({
        title: "Request Failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to resend verification code.",
        placement: "bottomRight",
      });
    }
  };

  return (
    <div className="theme-page min-h-screen">
      <div className="flex justify-center min-h-screen items-center font-sans flex-col">
        <div className="theme-panel min-w-96 p-4 rounded-2xl">
          <h2 className="theme-heading text-sm font-bold">Verify your login</h2>
          <p className="theme-muted text-xs mt-1.5 mb-2">
            Enter the verification code we sent to your
          </p>
          <p className="theme-muted text-xs mb-6">Email address: {email}</p>

          <div className="flex  justify-between items-center">
            <Title level={5}> Verification Code</Title>
            <Button
              icon={<TfiReload />}
              onClick={handleResend}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0
                ? `Resend Code (${resendTimer}s)`
                : "Resend Code"}
            </Button>
          </div>
          <Input.OTP
            value={otp}
            className="mt-4"
            size="large"
            onChange={onChange}
          ></Input.OTP>
          <br></br>
          <Button
            onClick={handleSubmit}
            className="w-full mt-4 bg-neutral-200! text-black! font-semibold!"
          >
            Verify
          </Button>

          <p className="theme-muted mt-4 text-center text-xs">
            Having trouble signing in?{" "}
            <Button type="link" className="p-0!">
              Contact support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Verification;

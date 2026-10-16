import { useEffect, useState } from "react";
import { App, Button, Input } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MdFingerprint,
  MdHourglassTop,
  MdLockOutline,
  MdMarkEmailRead,
  MdOutlineVpnKey,
  MdRefresh,
  MdVerifiedUser,
} from "react-icons/md";
import api from "../../../shared/utils/api";
import { setuser } from "../../../app/store/user/userSlice";

const RESEND_SECONDS = 30;

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function Verification() {
  const { notification } = App.useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email;
  const comeFrom = location.state?.comeFrom || "register";

  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!email) navigate(-1);
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const verifyMutation = useMutation({
    mutationFn: (code) => {
      const url =
        comeFrom === "login"
          ? "auth/verify-login-otp"
          : "auth/verify-email-otp";
      return api.post(url, { email, otp: code });
    },
    onSuccess: (res) => {
      setOtp("");

      if (comeFrom === "login") {
        const user = res.data.user;
        dispatch(setuser(user));
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });

        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "seller") navigate("/seller/dashboard");
        else navigate("/");

        notification.success({
          title: "Login successfully",
          description: "Welcome back to our platform",
          pauseOnHover: true,
          showProgress: true,
          placement: "bottomRight",
        });
        return;
      }

      notification.success({
        title: "Email verified",
        description: "Your account is ready. Please sign in.",
        placement: "bottomRight",
      });
      navigate("/auth/login");
    },
    onError: (error) => {
      setOtp("");
      notification.error({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid code",
        pauseOnHover: true,
        showProgress: true,
        placement: "bottomRight",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => {
      const url =
        comeFrom === "login"
          ? "/auth/send-login-otp"
          : "/auth/resend-email-otp";
      return api.post(url, { email });
    },
    onSuccess: () => {
      setResendTimer(RESEND_SECONDS);
      notification.success({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
        placement: "bottomRight",
      });
    },
    onError: (error) => {
      notification.error({
        title: "Request Failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to resend verification code.",
        placement: "bottomRight",
      });
    },
  });

  const handleChange = (value) => {
    setOtp(value);
    if (value.length === 6 && !verifyMutation.isPending) {
      verifyMutation.mutate(value);
    }
  };

  const handleVerify = () => {
    if (otp.length === 6) verifyMutation.mutate(otp);
  };

  const handleResend = () => {
    if (resendTimer > 0 || resendMutation.isPending) return;
    resendMutation.mutate();
  };

  if (!email) return null;

  const canResend = resendTimer <= 0 && !resendMutation.isPending;

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 to-white">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10 font-sans">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-indigo-100 sm:p-8">
          <div className="flex justify-center">
            <div className="relative flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-700">
              <MdMarkEmailRead />
              <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-purple-500 ring-2 ring-white" />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              <MdLockOutline className="text-xs text-indigo-600" />
              Step 2 of 2: Identity Verification
            </span>
          </div>

          <h1 className="theme-heading m-0 mt-4 text-center text-2xl font-bold">
            Verify Your Email
          </h1>

          <p className="m-0 mt-3 text-center text-xs leading-relaxed text-slate-600">
            We sent a 6-digit verification code to
            <br />
            <span className="font-semibold text-slate-900">{email}</span>.{" "}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer text-indigo-600 hover:underline"
            >
              Edit email
            </button>
          </p>

          <div className="mt-7 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              One-Time Password
            </span>
            <span className="text-[10px] font-semibold text-slate-600">
              Auto-submits on 6th digit
            </span>
          </div>

          <div className="mt-3 flex justify-center">
            <Input.OTP
              autoFocus
              length={6}
              size="large"
              variant="filled"
              value={otp}
              onChange={handleChange}
              disabled={verifyMutation.isPending}
              inputMode="numeric"
              formatter={(str) => str.replace(/\D/g, "")}
              className="w-full justify-between! [&_.ant-otp-input]:h-12! [&_.ant-otp-input]:w-12! [&_.ant-otp-input]:rounded-lg! [&_.ant-otp-input]:bg-indigo-50! [&_.ant-otp-input]:text-center [&_.ant-otp-input]:text-lg! [&_.ant-otp-input]:font-bold!"
            />
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-indigo-50/70 px-4 py-3">
            <span className="flex items-center gap-2 text-[11px] text-slate-600">
              <MdHourglassTop className="text-sm" />
              Resend code in:
              <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 font-mono text-[10px] text-indigo-700">
                {formatTime(resendTimer)}
              </span>
            </span>

            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`flex items-center gap-1 text-[11px] font-medium ${
                canResend
                  ? "cursor-pointer text-indigo-700 hover:underline"
                  : "cursor-not-allowed text-slate-400"
              }`}
            >
              <MdRefresh className="text-sm" />
              {resendMutation.isPending ? "Sending..." : "Resend Code"}
            </button>
          </div>

          <Button
            type="primary"
            size="large"
            block
            onClick={handleVerify}
            loading={verifyMutation.isPending}
            disabled={otp.length !== 6}
            className="mt-5 h-11! gap-2 text-white! bg-indigo-700! text-xs! font-semibold! hover:bg-indigo-800! disabled:opacity-60!"
          >
            {!verifyMutation.isPending && (
              <MdVerifiedUser className="text-base" />
            )}
            {verifyMutation.isPending
              ? "Verifying..."
              : "Verify Code & Access Account"}
          </Button>

          <div className="mt-4 flex gap-2.5 rounded-xl bg-indigo-50/70 px-4 py-3">
            <MdOutlineVpnKey className="mt-0.5 shrink-0 text-sm text-slate-600" />
            <p className="m-0 text-[11px] leading-relaxed text-slate-600">
              Codes expire in{" "}
              <span className="font-bold text-slate-900">5 minutes</span>. For
              your personal security, never forward, dictate, or share this
              security token with anyone, including Aura support engineers.
            </p>
          </div>

          <p className="m-0 mt-5 text-center text-[11px] text-slate-600">
            Didn't receive code? Check spam folder or{" "}
            <Link
              to="/support"
              className="font-semibold text-indigo-600 hover:underline"
            >
              contact support
            </Link>
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-medium text-slate-600">
            <MdFingerprint className="text-sm text-indigo-600" />
            Biometric &amp; Multi-Factor Protection
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-medium text-slate-600">
            <MdLockOutline className="text-sm text-indigo-600" />
            Zero-Knowledge Credential Hashing
          </span>
        </div>
      </div>
    </div>
  );
}

export default Verification;

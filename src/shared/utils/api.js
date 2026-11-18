import axios from "axios";
import { clearLoginMarker, hasLoginMarker } from "./authStorage";
import { router } from "../../app/router/route";
import { notification } from "antd";

const Backend_Url = import.meta.env.VITE_BACKEND_URL || "/api";

const api = axios.create({
  baseURL: Backend_Url,
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      hasLoginMarker() &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRefresh
    ) {
      originalRequest._retry = true;

      const result = await refreshToken();
      if (result.success) {
        return api(originalRequest);
      }

      const authenticationFailed = [401, 403].includes(result.status);
      if (!authenticationFailed) {
        return Promise.reject(error);
      }

      clearLoginMarker();

      if (result.message == "Your account has Inactive by admin") {
        notification.error({
          message: "Account Deactivated",
          description: result.message,
          placement: "bottomRight",
          duration: 4,
          key: "account-inactive",
        });
      }

      router.navigate("/auth/login", { replace: true });
    }

    return Promise.reject(error);
  },
);

export async function refreshToken() {
  try {
    const response = await api.post(
      "/auth/refresh-token",
      {},
      {
        _skipAuthRefresh: true,
      },
    );

    return {
      success: response.data?.success !== false,
      status: response.status,
      message: response.data?.message,
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      message: error.response?.data?.message,
    };
  }
}

export async function login(credentials) {
  const res = await api.post("/auth/login", credentials, {
    _skipAuthRefresh: true,
  });
  return res;
}

export async function logout() {
  return await api.post(
    "/auth/logout",
    {},
    {
      _skipAuthRefresh: true,
    },
  );
}

export async function getMe(signal) {
  const res = await api.get("/user/me", { signal });
  return res.data.user;
}

export default api;

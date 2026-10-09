import axios from "axios";

const Backend_Url = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: Backend_Url,
  withCredentials: true,
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
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRefresh
    ) {
      originalRequest._retry = true;

      try {
        const refreshed = await refreshToken();

        if (refreshed) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
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

    return response.data?.success !== false;
  } catch (error) {
    console.error(
      "Refresh token failed:",
      error.response?.data || error.message,
    );

    return false;
  }
}

export async function login(credentials) {
  return await api.post("/auth/login", credentials, {
    _skipAuthRefresh: true,
  });
}

export async function logout() {
  return await api.post("/auth/logout");
}

export async function getMe() {
  let res = await api.get("/user/me");
  return res.data.user;
}

export default api;

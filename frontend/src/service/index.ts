import { API_ENDPOINT } from "@/components/constants/variable";
import axios from "axios";
import Cookies from "js-cookie";

export const instance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? API_ENDPOINT : "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    config.withCredentials = true;

    const token = Cookies.get("accessToken");
    config.headers = config.headers || {};
    config.headers.Authorization = token ? `Bearer ${token}` : "123123";

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra mã lỗi 401 và trạng thái chưa thử làm mới token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log("Token hết hạn, đang làm mới...");

      try {
        // Gọi endpoint refresh token
        const { data } = await instance.post(
          "/users/refresh-token",
          {},
          { withCredentials: true }
        );

        if (data && data.data && data.data.accessToken) {
          console.log("Làm mới token thành công:", data.data.accessToken);

          // Cập nhật lại access token và gửi lại request gốc
          Cookies.set("accessToken", data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

          return instance(originalRequest);
        } else {
          console.error("Không thể làm mới token.");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Lỗi khi làm mới token:", err);

        // Nếu có lỗi khi làm mới token, logout và quay lại login
        Cookies.remove("user");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("role");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

import axios from "axios";
import nookies from "nookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND,
  withCredentials: true,
});

// Lấy token từ cookie và thêm vào Authorization header
api.interceptors.request.use((config) => {
  const cookies = nookies.get(); // get tất cả cookies
  const token = cookies.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("Request config:", config);

  return config;
});

// Interceptor để kiểm tra lỗi 401 và 403
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const currentUrl = window.location.pathname;
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      currentUrl !== "/login"
    ) {
      nookies.destroy(null, "token", {
        path: "/",
      });
      window.location.href = "/login";
      alert(error.response.data.message || "Có lỗi xảy ra (401 | 403)");
    }
    if (
      error.response &&
      error.response.status === 500 &&
      typeof error.response.data === "object"
    ) {
      alert(error.response.data.message || "Có lỗi xảy ra (500)");
    }
    return Promise.reject(error);
  }
);

export default api;

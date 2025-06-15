import axios from "axios";
import nookies from "nookies";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND,
  withCredentials: true,
});

// Lấy token từ cookie và thêm vào Authorization header
axiosInstance.interceptors.request.use((config) => {
  const cookies = nookies.get(); // get tất cả cookies
  const token = cookies.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status === 500 &&
      typeof error.response.data === "object"
    ) {
      alert(error.response.data.message || "Có lỗi xảy ra (404 | 500)");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

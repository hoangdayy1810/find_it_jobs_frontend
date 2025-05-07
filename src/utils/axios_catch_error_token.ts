import axios from 'axios';
import { destroyCookie } from 'nookies';


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_BACKEND,
    withCredentials: true,
});

// Interceptor để kiểm tra lỗi 401 và 403
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const currentUrl = window.location.pathname;
        if (error.response && (error.response.status === 401 || error.response.status === 403) && currentUrl !== '/login_signin') {
            destroyCookie(null, 'token'); // Xóa token nếu hết hạn hoặc không hợp lệ
            window.location.href = '/login'; // Điều hướng sang trang đăng nhập
        }
        if (error.response && (error.response.status === 500) && typeof error.response.data === 'object') {
            alert(error.response.data.message || "Có lỗi xảy ra (500)");
        }
        return Promise.reject(error);
    }
);

export default api;

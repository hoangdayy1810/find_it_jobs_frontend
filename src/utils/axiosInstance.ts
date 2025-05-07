import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_BACKEND,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 500) && typeof error.response.data === 'object') {
            alert(error.response.data.message || "Có lỗi xảy ra (404 | 500)");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

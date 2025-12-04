import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://api.flyflypig.online";

const apiClient = axios.create({
    baseURL: baseURL, 
    withCredentials: true, 
});

apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config
    },

    error => {
        return Promise.reject(error);
    }
)

export default apiClient;

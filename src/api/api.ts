import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";

type QueueItem = {
    resolve: (value?: AxiosResponse) => void;
    reject: (error: unknown) => void;
};

const API: AxiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}/api/v1/`,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });

    failedQueue = [];
};

API.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: unknown) => Promise.reject(error)
);

API.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<AxiosResponse>((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => {
                            if (!originalRequest.headers) {
                                originalRequest.headers = {} as AxiosRequestHeaders;
                            }
                            originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
                            resolve(API(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                return Promise.reject(error);
            }

            return new Promise<AxiosResponse>((resolve, reject) => {
                axios
                    .post(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/refresh-token`, {
                        refreshToken,
                    })
                    .then(({ data }) => {
                        const tokens = data.data;

                        localStorage.setItem("token", tokens.accessToken);
                        localStorage.setItem("refreshToken", tokens.refreshToken);

                        API.defaults.headers.common["Authorization"] = `Bearer ${tokens.accessToken}`;

                        if (!originalRequest.headers) {
                            originalRequest.headers = {} as AxiosRequestHeaders;
                        }
                        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

                        processQueue(null);
                        resolve(API(originalRequest));
                    })
                    .catch((err: unknown) => {
                        localStorage.clear();
                        processQueue(err);
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default API;

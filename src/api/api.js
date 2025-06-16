import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5110/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Prevent refresh loop on login/signup endpoints
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/sign-up") ||
      originalRequest.url.includes("/auth/refresh-token") // also avoid recursion here
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => {
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

      return new Promise((resolve, reject) => {
        axios
          .post("http://localhost:5110/api/v1/auth/refresh-token", { refreshToken })
          .then(({ data }) => {
            const tokens = data.data;
            localStorage.setItem("token", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);

            API.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

            processQueue();
            resolve(API(originalRequest));
          })
          .catch((err) => {
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

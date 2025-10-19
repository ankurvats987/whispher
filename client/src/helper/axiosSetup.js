import { logoutUser, refreshAccessToken } from "../features/auth/authThunks";
import api from "../service/axiosInstance";

export const setupAxiosInterceptors = (store) => {
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set");
    } else {
      console.log("No token found, skipping Authorization header");
    }

    return config;
  });

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/user/refresh") &&
        !originalRequest.url.includes("/user/login") &&
        !originalRequest.url.includes("/user/register")
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((error) => {
              return Promise.reject(error);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await store.dispatch(refreshAccessToken()).unwrap();
          if (res && res.accessToken) {
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${res.accessToken}`;
            processQueue(null, res.accessToken);
            return api(originalRequest);
          } else {
            throw new Error("No access token received from refresh");
          }
        } catch (error) {
          console.log("Token refresh failed in response interceptor:", error);
          await store.dispatch(logoutUser());
          processQueue(error);
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

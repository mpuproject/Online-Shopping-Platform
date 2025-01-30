import axios from "axios";
import { useUserStore } from "@/stores/user"
import { saveCartToServer } from "@/composables/logout";

let isRefreshing = false;
let failedQueue = [];

// 处理等待队列
export const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 刷新token函数
export const refreshToken = async () => {
  const userStore = useUserStore();
  try {
    const response = await axios.post('/api/user/token-refresh/', {
      refresh: userStore.userInfo.refresh
    });
    userStore.setAccessToken(response.data.access);
    return response.data.access;
  } catch (error) {
    await saveCartToServer('/login');
    throw error;
  }
};

// 处理401错误
export const handle401Error = async (error) => {
  const originalRequest = error.config;

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({resolve, reject});
    }).then(token => {
      originalRequest.headers['Authorization'] = 'Bearer ' + token;
      return axios(originalRequest);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const newToken = await refreshToken();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
    originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
    processQueue(null, newToken);
    return axios(originalRequest);
  } catch (error) {
    processQueue(error, null);
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
};

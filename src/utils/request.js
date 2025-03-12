import axios from "axios";
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'
import { useUserStore } from "@/stores/user"
import { saveCartToServer } from "@/composables/logout"
import router from '@/router/index'

const httpInstance = axios.create({
    baseURL: '/api/',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
})

let isRefreshing = false; // 标记是否正在刷新token
let refreshSubscribers = []; // 存储需要重新发送的请求

// axios request interceptor
httpInstance.interceptors.request.use(config => {
    const userStore = useUserStore()
    const token = userStore.userInfo.access;
    if(token) {
        config.headers.Authorization = `Bearer ${userStore.userInfo.access}`;
    }
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config
}, e => Promise.reject(e))

// axios response interceptor
httpInstance.interceptors.response.use(res => res.data, async e => {
  const userStore = useUserStore();
  const refreshToken = userStore.userInfo.refresh;

  if (e.response.status === 401 && refreshToken) {
    if (!isRefreshing) {
      isRefreshing = true; // 标记正在刷新token
      try {
        const response = await httpInstance.post('/user/token-refresh/', { refresh: refreshToken });
        userStore.setAccessToken(response.access);
        isRefreshing = false; // 刷新完成，取消标记

        // 重新发送之前失败的请求
        refreshSubscribers.forEach(subscriber => subscriber(response.access));
        refreshSubscribers = [];

        // 重新发起当前请求
        e.config.headers.Authorization = `Bearer ${response.access}`;
        return httpInstance(e.config);
      } catch (refreshError) {
        ElMessage.error('Token refresh failed. Please log in again.');
        isRefreshing = false; // 刷新失败，取消标记
        await saveCartToServer('/login');
        return Promise.reject(refreshError);
      }
    } else {
      // 如果正在刷新token，将当前请求加入队列
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((newToken) => {
          if (newToken) {
            e.config.headers.Authorization = `Bearer ${newToken}`;
            resolve(httpInstance(e.config)); // 重新发起请求
          } else {
            reject(e);
          }
        });
      });
    }
  } else if(e.response.status === 404) {
    router.replace({ path: '/404' })
    return Promise.reject(e)
  } else if(e.response.status === 403) {
    router.replace({ path: '/403' })
    return Promise.reject(e)
  } else {
    ElMessage({
      type: 'warning',
      message: e.response.data.msg || 'Network Error',
    });
    if (e.response.status === 401) {
      await saveCartToServer('/login');
    }
    return Promise.reject(e);
  }
});


export default httpInstance

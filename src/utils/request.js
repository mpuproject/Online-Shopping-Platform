import axios from "axios";
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'
import { useUserStore } from "@/stores/user"
import { handle401Error } from "./token";

const httpInstance = axios.create({
    baseURL: '/api/',
    timeout: 5000,
})

// axios request interceptor
httpInstance.interceptors.request.use(config => {
    const userStore = useUserStore()
    const token = userStore.userInfo.access;
    if(token) {
        config.headers.Authorization = `Bearer ${userStore.userInfo.access}`;
    }
    return config
}, e => Promise.reject(e))

  // axios responsive interceptor
httpInstance.interceptors.response.use(res => res.data, async e => {
  // 处理401错误
  if (e.response?.status === 401 && !e.config._retry) {
    return handle401Error(e);
  }

  ElMessage({
      type: 'warning',
      message: e.response.data.msg || 'Network Error',
  })
})

export default httpInstance

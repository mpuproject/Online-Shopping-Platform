import axios from "axios";
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'
import { useUserStore } from "@/stores/user";

const httpInstance = axios.create({
    baseURL: '/api/',
    timeout: 5000,
})

// axios request interceptor
httpInstance.interceptors.request.use(config => {
    const userStore = useUserStore()
    const token = userStore.userInfo.refresh;
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config
}, e => Promise.reject(e))

  // axios responsive interceptor
httpInstance.interceptors.response.use(res => res.data, e => {
    ElMessage({
        type: 'warning',
        message: e.response.data.msg || 'Network Error',
    })
    return Promise.reject(e)
})

export default httpInstance

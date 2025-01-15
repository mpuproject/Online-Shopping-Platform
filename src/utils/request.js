import axios from "axios";
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'


const httpInstance = axios.create({
    baseURL: '/api/',
    timeout: 5000,
})

// axios request interceptor
httpInstance.interceptors.request.use(config => {
    return config
}, e => Promise.reject(e))
  
  // axios responsive interceptor
httpInstance.interceptors.response.use(res => res.data, e => {
    ElMessage({
        type: 'warning',
        message: e.response.data.message,
    })
    return Promise.reject(e)
})

export default httpInstance
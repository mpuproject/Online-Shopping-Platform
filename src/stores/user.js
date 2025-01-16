import { defineStore } from 'pinia'
import {jwtDecode} from 'jwt-decode';
import { ref } from 'vue';
import { loginAPI } from '@/apis/user';

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({})
    const getUserInfo = async ({ username, password }) => {
        const res = await loginAPI({ username, password })
        userInfo.value = res.data
        userInfo.value.username = jwtDecode(res.data.access)['username']
    }
    const clearUserInfo = () => {
        userInfo.value = {}
    }

    return {
        userInfo,
        getUserInfo,
        clearUserInfo
    }
}, {
    persist: true,
})
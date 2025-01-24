import { defineStore } from 'pinia'
import { ref } from 'vue';
import { loginAPI, signupAPI } from '@/apis/user';

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({})

    const getUserInfo = async ({ username, password }) => {
        const res = await loginAPI({ username, password })
        userInfo.value = res.data
        return res.data
    }

    const clearUserInfo = () => {
        userInfo.value = {}
    }

    const register = async ({ username, email, password, confirmPwd }) => {
        const res = await signupAPI({ username, email, password, confirmPwd })
        return res.data
    }

    return {
        userInfo,
        getUserInfo,
        clearUserInfo,
        register
    }
}, {
    persist: true,
})

import { defineStore } from 'pinia'
import { ref } from 'vue';
import { loginAPI, signupAPI } from '@/apis/user';

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({})

    const getUserInfo = async ({ username, password, recaptchaToken }) => {
        const res = await loginAPI({ username, password, recaptchaToken })
        userInfo.value = res.data
        return res.data
    }

    const clearUserInfo = () => {
        userInfo.value = {}
    }

    const register = async ({ username, email, firstName, lastName, password, confirmPwd, recaptchaToken }) => {
        const res = await signupAPI({ username, email, firstName, lastName, password, confirmPwd, recaptchaToken })
        return res.data.user
    }

    const setAccessToken = (newAccess) => {
      userInfo.value.access = newAccess
    }

    return {
        userInfo,
        getUserInfo,
        clearUserInfo,
        register,
        setAccessToken
    }
}, {
    persist: true,
})

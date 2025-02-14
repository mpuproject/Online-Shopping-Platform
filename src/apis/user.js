import request from '@/utils/request'

export const loginAPI = ({ username, password }) => {
    return request({
        url: '/user/login/',
        method: 'POST',
        data: {
            username,
            password
        }
    })
}

export const signupAPI = ({ username, email, firstName, lastName, password, confirmPwd }) => {
    return request({
        url: '/user/register/',
        method: 'POST',
        data: {
            username,
            email,
            firstName,
            lastName,
            password,
            confirmPwd
        }
    })
}

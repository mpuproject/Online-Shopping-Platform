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
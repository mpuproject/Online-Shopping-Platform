import request from '@/utils/request'

export const saveCartAPI = async (data) => {
  return request({
    url: '/cart/save/',
    method: 'POST',
    data
  })
}

import request from '@/utils/request'


export const getDetailAPI = (id) => {
  return request({
    url: `/product/detail/${id}/`,
  })
}

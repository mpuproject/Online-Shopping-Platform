import request from '@/utils/request'


export const getDetailAPI = async (id) => {
  return request({
    url: `/product/detail/${id}/`,
  })
}

export const getImageAPI = async (id) => {
  return request({
    url: `/product/detail/image/${id}/`,
  })
}

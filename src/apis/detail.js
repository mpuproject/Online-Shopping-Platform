import request from '@/utils/request'


export const getDetail = async (id) => {
  return request({
    url: `/product/detail/${id}/`,
  })
}

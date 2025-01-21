import request from '@/utils/request'

export const getCategories = () => {
  return request({
    url: '/category/'
  })
}

export function getCategoryAPI(id) {
  return request({
    url: `/category/${id}`,
  })
}

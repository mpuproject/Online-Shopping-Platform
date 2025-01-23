import request from '@/utils/request'

/**
 * @description 获取导航栏一级分类
 *
 * @returns
 */
export const getCategories = () => {
  return request({
    url: '/category/'
  })
}

/**
 * @description 获取一级分类信息
 *
 * @param {*} id
 * @returns
 */

export function getCategoryAPI(id) {
  return request({
    url: `/category/all/`,
    method: 'POST',
    data: {
      "id": id
    }
  })
}

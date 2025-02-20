import request from '@/utils/request'

/**
 * @description 获取指定可用商品信息
 *
 * @param {*} id
 * @returns
 */
export const getDetailAPI = (id) => {
  return request({
    url: `/product/detail/${id}/`,
  })
}

/**
 * @description 新增商品
 *
 * @param {*} data
 * @returns
 */
export const addProductAPI = async (data) => {
  return request({
    url: `/product/add/`,
    method: 'POST',
    data
  })
}

/**
 * @description 更新商品
 *
 * @param {*} id
 * @param {*} data
 * @returns
 */
export const updateProductAPI = async (id, data) => {
  return request({
    url: `/product/update/${id}/`,
    method: 'PUT',
    data
  })
}

/**
 * 删除商品
 *
 * @param {*} id
 * @returns
 */
export const deleteProductAPI = async (id) => {
  return request({
    url: `/product/delete/${id}`,
    method: 'PATCH',
  })
}

/**
 * @description 获取所有产品信息
 *
 * @param {*} data = {
      page: 1,
      pageSize: 20,
    }

 * @returns
 */
export const getProductAPI = async (data) => {
  return request({
    url: `/product/list/`,
    method: 'GET',
    params: data
  })
}

/**
 * @description 获取所有商品的存货状态
 *
 * @returns
 */

export const getStockStatusAPI = async () => {
  return request({
    url: `/product/stock-count/`,
  })
}

/**
 * @description 修改指定商品
 *
 * @param {*} id
 * @param {*} data
 * @returns
 */
export const editProductAPI = async (id, data) => {
  return request({
    url: `/product/update/${id}/`,
    method: 'PUT',
    data
  })
}

/**
 * @description 管理员界面获取所有商品
 *
 * @param {*} id
 * @returns
 */
export const getAdminProductAPI = async (id) => {
  return request({
    url: `/product/admin/${id}/`,
  })
}

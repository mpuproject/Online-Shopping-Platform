
import request from '@/utils/request'

/**
 * @description 管理员获取所有订单
 *
 * @param {*} params
 * @returns
 */
export const getAdminOrdersAPI = async (params) => {
  return request({
    url: '/order/admin/list/',
    method: 'GET',
    params
  })
}

/**
 * @description 管理员更新相关订单
 *
 * @param {*} data
 * @returns
 */
export const updateOrderStatusAPI = async (data) => {
  return request({
    url: 'order/admin/update/',
    method: 'PUT',
    data
  })
}

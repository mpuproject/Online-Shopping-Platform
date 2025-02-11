import request from '@/utils/request'


/**
 * @description 创建订单
 *
 * @param {*} data
 * @returns
 */
export const createOrderAPI = async (data) => {
  return request({
    url: '/order/create/',
    method: 'POST',
    data
  })
}

/**
 * @description 获取指定订单
 *
 * @param {*} id
 * @returns
 */
export const getOrderByIdAPI = async (id) => {
  return request({
    url: '/order/',
    params: {
      id
    }
  })
}

/**
 * @description 更新订单
 *
 * @param {*} data
 * @returns
 */
export const updateOrderAPI = async (data) => {
  return request({
    url: '/order/update/',
    method: 'PUT',
    data
  })
}

/**
 * @description 获取用户的所有订单
 *
 * @param {*} id
 * @returns
 */
export const getOrderByUserIdAPI = async (userId) => {
  return request({
    url: '/order/list/',
    params: {
      userId
    }
  })
}

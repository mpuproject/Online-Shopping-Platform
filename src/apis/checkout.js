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
 * @param {*} params
 * @returns
 */
export const getOrderByUserIdAPI = async (params) => {
  return request({
    url: '/order/list/',
    method: 'GET',
    params: {
      userId: params.userId,
      itemStatus: params.itemStatus,
      page: params.page,
      page_size: params.pageSize
    }
  })
}

/**
 * @description 更新订单
 *
 * @param {*} data
 * @returns
 */
export const updateOrderItemAPI = (data) => {
  return request({
    url: '/order/item/update/',
    method: 'PUT',
    data: {
      item_id: data.itemId,  // 前端参数itemId对应后端item_id
      item_status: data.itemStatus
    }
  })
}

// /**
//  * @description 获取订单详情
//  * 
//  * @param {*} data
//  * @returns 
//  */
// export const getOrderDetailAPI = (orderId, userId) => {
//   return request({
//     url: `/order/detail/${orderId}/`,  
//     method: 'GET',
//     params: {
//       user_id: userId  // 参数名与后端一致
//     }
//   })
// }
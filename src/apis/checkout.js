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

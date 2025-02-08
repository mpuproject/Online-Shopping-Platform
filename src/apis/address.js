import request from '@/utils/request'

/**
 * @description 获取地址
 *
 * @param {*} id
 * @returns
 */
export const getAddressAPI = async (id) => {
  return request({
    'url': '/address/',
    params: {
      id
    }
  })
}

export const addAddressAPI = async (data) => {
  return request({
    'url': '/address/add/',
    method: 'POST',
    data
  })
}

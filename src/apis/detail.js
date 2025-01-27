import request from '@/utils/request'


export const getDetailAPI = (id) => {
  return request({
    url: `/product/detail/${id}/`,
  })
}

export const addProductAPI = async (data) => {
  return request({
    url: `/product/add/`,
    method: 'POST',
    data
  })
}

export const updateProductAPI = async (id, data) => {
  return request({
    url: `/product/${id}/`,
    method: 'PUT',
    data
  })
}

export const deleteProductAPI = async (id) => {
  return request({
    url: `/product/${id}`,
    method: 'DELETE',
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


import request from '@/utils/request'

// 管理员获取所有订单
export const getAdminOrdersAPI = async (params) => {
  return request({
    url: '/admin/orders/',
    method: 'GET',
    params: {
      page: params.page,
      page_size: params.pageSize
    }
  })
}

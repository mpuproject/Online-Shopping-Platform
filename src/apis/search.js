import request from '@/utils/request'

/**
 * @description 获取二级分类下的产品信息
 *
 * @param {*} data = {
      query: route.query.q, // 从路由中获取搜索关键词
      page: 1,
      pageSize: 10,
      sortField: 'created_time' // 默认按最新排序
    }

 * @returns
 */
export const getSearchResultsAPI = async (data) => {
  return request({
    url: `/product/search/`,
    params: data
  })
}

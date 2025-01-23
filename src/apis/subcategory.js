import request from "@/utils/request";

/**
 * @description 获取二级分类下的导航信息
 *
 * @param {*} id
 * @returns
 */
export const getSubcategoryFilterAPI = (id) => {
  return request({
    url: `/category/sub/filter/${id}/`,
  })
}

/**
 * @description 获取二级分类下的产品信息
 *
 * @param {*} data = {
      subCategoryId: route.params.id,
      page: 1,
      pageSize: 20,
      sortField: 'created_time'
    }

 * @returns
 */
export const getSubcategoryProductAPI = (data) => {
  return request({
    url: `/category/sub/product/`,
    method: 'POST',
    data
  })
}

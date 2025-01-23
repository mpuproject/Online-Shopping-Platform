import request from "@/utils/request";

/**
 * @description: 获取新鲜好物
 * @param {*}
 * @return {*}
 */
export const findNewAPI = () => {
  return request({
    url: '/home/new/'
  })
}

/**
 * @description: 获取人气推荐
 */

export const findHotAPI = () => {
  return request({
    url: '/home/hot/'
  })
}

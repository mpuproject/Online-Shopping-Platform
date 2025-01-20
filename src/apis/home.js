import httpInstance from "@/utils/request";

/**
 * @description: 获取Banner
 */
export const getBannerAPI = () => {
  return httpInstance({
    url: '/home/banner'
  })
}

/**
 * @description: 获取新鲜好物
 * @param {*}
 * @return {*}
 */
export const findNewAPI = () => {
  return httpInstance({
    url: '/home/new/'
  })
}

/**
 * @description: 获取人气推荐
 */

export const findHotAPI = () => {
  return httpInstance({
    url: '/home/hot/'
  })
}

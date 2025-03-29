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

/**
 * @description 获取详细信息
 *
 * @param {*} userId
 * @returns
 */
export const getMessageCountAPI = (userId) => {
  return request({
    url: '/home/message/',
    params: {
      userId
    }
  })
}

/**
 * @description 获取主页随机推荐好物
 *
 * @returns
 */
export const getHomeProductAPI = () => {
  return request({
    url: '/home/products/',
  })
}

/**
 * @description 获取主页横幅推荐
 *
 * @returns
 */
export const getHomeBannerAPI = () =>{
  return request({
    url: '/home/recommend/',
  })
}
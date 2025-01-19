import request from '@utils/request'

function getCategoryAPI(id) {
  return request({
    url: '/category',
    params: {
      id
    }
  })
}
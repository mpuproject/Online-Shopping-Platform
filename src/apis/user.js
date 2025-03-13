import request from '@/utils/request'

export const loginAPI = ({ username, password, recaptchaToken }) => {
    return request({
        url: '/user/login/',
        method: 'POST',
        data: {
            username,
            password,
            recaptchaToken
        }
    })
}

export const signupAPI = ({ username, email, firstName, lastName, password, confirmPwd, recaptchaToken }) => {
  return request({
    url: '/user/register/',
    method: 'POST',
    data: {
      username,
      email,
      firstName,
      lastName,
      password,
      confirmPwd,
      recaptchaToken
    }
  })
}

export const updateUserProfileAPI = (data) => {
  return request({
    url: `/user/${data.id}/`,  
    method: 'PUT',        
    data: {
      username: data.username,
      email: data.email,
      phone: data.phone,    
      profile_picture: data.profile 
    }
  })
}

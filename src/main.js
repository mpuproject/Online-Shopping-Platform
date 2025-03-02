import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/styles/common.scss'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { VueReCaptcha } from 'vue-recaptcha-v3'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// 挂载 recaptcha
app.use(VueReCaptcha, {
  siteKey: '6Lc2P-YqAAAAALYup28qr5ByeSy0qUMCJaZFG27Z',
  loaderOptions: {
    autoHideBadge: true, // 自动隐藏reCAPTCHA徽章
    renderParameters: {
      hl: 'en', // 语言设置
    },
    useRecaptchaNet: true,
    explicitRenderParameters: {
      sitekey: '6Lc2P-YqAAAAALYup28qr5ByeSy0qUMCJaZFG27Z',
      hl: 'en'
    }
  }
})

// 全局挂载 recaptcha 方法
app.config.globalProperties.recaptcha = app.config.globalProperties.$recaptcha

app.mount('#app')

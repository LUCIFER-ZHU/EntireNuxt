/**
 * Vue Toastification 全局插件
 * 提供全局 $toast 实例，用于显示通知消息
 */

import { useToast } from 'vue-toastification'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  // 配置 toast 选项
  const options = {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
  }

  // 安装插件到Vue应用
  nuxtApp.vueApp.use(Toast, options)
  
  // 直接使用composable获取toast实例
  const toast = useToast()
  
  // 返回提供的实例，使其在全局可用
  return {
    provide: {
      toast
    }
  }
})

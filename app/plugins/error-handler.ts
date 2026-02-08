/**
 * Vue 错误处理插件
 * 符合 Nuxt 4 官方最佳实践
 * 
 * 功能：
 * 1. 捕获所有 Vue 组件错误
 * 2. 记录错误日志（开发环境显示详细堆栈）
 * 3. 上报错误到监控服务（生产环境）
 * 4. 防止错误冒泡到顶层
 */

export default defineNuxtPlugin((nuxtApp) => {
  const isDev = process.dev
  
  /**
   * Vue 全局错误处理器
   * 捕获所有未被处理的 Vue 错误
   */
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    const err = error as Error
    
    if (isDev) {
      console.group('❌ [Vue Error Handler]')
      console.error('错误信息:', err)
      console.log('错误组件:', instance?.$options?.name || instance?.$options?.__name || '未知组件')
      console.log('错误生命周期:', info)
      console.log('错误堆栈:', err.stack)
      console.groupEnd()
    } else {
      // 生产环境：记录精简日志
      console.error('[Vue Error]', {
        message: err.message,
        component: instance?.$options?.name || instance?.$options?.__name,
        lifecycle: info,
      })
      
      // TODO: 上报到错误监控服务（如 Sentry, LogRocket 等）
      // reportToErrorService(err, instance, info)
    }
  }

  /**
   * Nuxt vue:error 钩子
   * 基于 Vue 的 onErrorCaptured 生命周期钩子
   * 会在错误冒泡到顶层时触发
   */
  nuxtApp.hook('vue:error', (error, instance, info) => {
    const err = error as Error
    
    if (isDev) {
      console.group('🔴 [Vue Error Hook]')
      console.error('捕获到错误:', err)
      console.log('错误组件:', instance?.$options?.name || instance?.$options?.__name || '未知组件')
      console.log('Vue 错误信息:', info)
      console.log('完整堆栈:', err.stack)
      console.groupEnd()
    } else {
      // 生产环境：记录关键信息
      console.error('[Vue Hook Error]', {
        message: err.message,
        component: instance?.$options?.name || instance?.$options?.__name,
        info,
      })
    }
  })

  /**
   * Nuxt app:error 钩子
   * 捕获应用启动错误
   */
  nuxtApp.hook('app:error', (error) => {
    const err = error as Error
    
    if (isDev) {
      console.group('💥 [App Error Hook]')
      console.error('应用错误:', err)
      console.log('错误堆栈:', err.stack)
      console.groupEnd()
    } else {
      console.error('[App Error]', {
        message: err.message,
        name: err.name,
      })
    }
  })

  /**
   * 处理未捕获的 Promise 拒绝
   * 仅在客户端有效
   */
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      if (isDev) {
        console.group('⚠️ [Unhandled Promise Rejection]')
        console.error('Promise 拒绝:', event.reason)
        console.log('Promise:', event.promise)
        console.groupEnd()
      } else {
        console.error('[Promise Rejection]', {
          reason: event.reason?.message || event.reason,
        })
      }
      
      // 阻止默认的控制台错误输出
      event.preventDefault()
    })
  }

  console.log('✅ 错误处理插件已加载')
})

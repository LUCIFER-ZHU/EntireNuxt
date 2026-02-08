/**
 * Nitro 插件 - SSR 日志监控 + 源码映射支持
 * 符合 Nuxt 4 官方最佳实践
 */
export default defineNitroPlugin((nitroApp) => {
  const isDev = process.env.NODE_ENV !== 'production'
  
  console.log('✅ Nitro SSR Logger 插件已加载')

  // 监听页面渲染
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    if (isDev) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🖥️  [SSR 渲染] URL:', event.path)
      console.log('🖥️  [SSR 渲染] 方法:', event.method)
      console.log('🖥️  [SSR 渲染] 状态码:', response.statusCode)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    }
  })

  // 监听所有请求
  nitroApp.hooks.hook('request', (event) => {
    if (!isDev) return
    
    const path = event.path
    if (
      !path.includes('/_nuxt/') &&
      !path.includes('/__nuxt_') &&
      !path.includes('.js') &&
      !path.includes('.css') &&
      !path.includes('.ico') &&
      !path.includes('hot-update')
    ) {
      console.log('📥 [Nitro 请求]', event.method, event.path)
    }
  })

  // 监听 SSR 错误（官方推荐方式）
  nitroApp.hooks.hook('error', (error, { event }) => {
    // 确保 error 是 Error 类型
    const err = error instanceof Error ? error : new Error(String(error))
    
    if (isDev) {
      console.group('❌ [SSR 错误 - 开发环境]')
      console.error('请求路径:', event?.path)
      console.error('错误名称:', err.name)
      console.error('错误信息:', err.message)
      console.error('错误堆栈:')
      console.error(err.stack)
      console.groupEnd()
    } else {
      // 生产环境也输出完整堆栈（已通过 source-map-support 映射）
      console.group('❌ [SSR 错误 - 生产环境]')
      console.error('请求路径:', event?.path)
      console.error('错误名称:', err.name)
      console.error('错误信息:', err.message)
      console.error('完整错误堆栈:')
      console.error(err.stack) // 输出完整堆栈，source-map-support 会自动映射
      console.groupEnd()
    }
  })
})

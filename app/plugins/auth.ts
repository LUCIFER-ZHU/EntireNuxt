/**
 * 认证初始化插件
 * 在应用启动时从 Cookie 恢复认证状态，确保 SSR 时服务端和客户端状态一致
 */
export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()

  // 在服务端和客户端都初始化认证状态
  // 这样可以确保 SSR 时服务端和客户端的认证状态一致
  authStore.initFromCookie()

  console.log('🔐 Auth Plugin - 认证状态已初始化:', {
    isLoggedIn: authStore.isLoggedIn,
    user: authStore.user,
    isServer: process.server,
    isClient: process.client
  })
})

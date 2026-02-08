/**
 * 认证中间件
 * 用于保护需要登录才能访问的页面
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // 初始化认证状态（从 Cookie）
  if (!authStore.isAuthenticated) {
    authStore.initFromCookie()
  }
  
  console.log('middleware-auth', to);

  // 检查是否已登录
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/account/login',
      query: {
        redirect: to.fullPath,
        reason: 'auth_required'
      }
    })
  }
})

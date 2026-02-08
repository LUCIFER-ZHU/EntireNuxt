import { defineStore } from 'pinia'

export interface User {
  id?: string | number  // 映射自后端的 customerId
  customerId?: string | number  // 后端原始字段
  email?: string
  customerName?: string
  [key: string]: any
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  sessionId: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    sessionId: null,
  }),

  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  persist: {
    pick: ['sessionId'], // 只持久化 sessionId，user 和 isAuthenticated 通过 Cookie 管理
  },

  actions: {
    /**
     * 设置用户信息
     */
    setAuth(user: User) {
      console.log('🔐 setAuth 被调用:', user)
      
      this.user = user
      this.isAuthenticated = true
      
      // 同步到 Cookie（支持 SSR）
      if (process.client || process.server) {
        try {
          const userCookie = useCookie('auth_user', {
            maxAge: 60 * 60 * 24 * 7, // 7天
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
          const authCookie = useCookie('auth_isAuthenticated', {
            maxAge: 60 * 60 * 24 * 7, // 7天
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
          
          userCookie.value = JSON.stringify(user)
          authCookie.value = 'true'
          
          console.log('✅ Cookie 已设置:', {
            userCookie: userCookie.value,
            authCookie: authCookie.value
          })
        } catch (e) {
          console.error('❌ 设置 Cookie 失败:', e)
        }
      }
    },

    /**
     * 更新用户信息
     */
    setUser(user: User) {
      this.user = user
      
      // 同步到 Cookie
      if (process.client || process.server) {
        try {
          const userCookie = useCookie('auth_user', {
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          })
          userCookie.value = JSON.stringify(user)
        } catch (e) {
          console.warn('更新 Cookie 失败:', e)
        }
      }
    },

    /**
     * 设置 Session ID
     * @param sessionId - Session ID
     */
    setSessionId(sessionId: string | null) {
      this.sessionId = sessionId
      // sessionId 会通过 pinia-plugin-persistedstate 自动持久化到 localStorage
    },

    /**
     * 清除认证信息（登出）
     */
    clearAuth() {
      this.user = null
      this.isAuthenticated = false
      this.sessionId = null
      // sessionId 会通过 pinia-plugin-persistedstate 自动清除
      
      // 清除 Cookie
      if (process.client || process.server) {
        try {
          const userCookie = useCookie('auth_user')
          const authCookie = useCookie('auth_isAuthenticated')
          
          userCookie.value = null
          authCookie.value = null
        } catch (e) {
          console.warn('清除 Cookie 失败:', e)
        }
      }
    },
    
    /**
     * 从 Cookie 初始化状态（用于 SSR）
     */
    initFromCookie() {
      if (process.client || process.server) {
        try {
          const userCookie = useCookie('auth_user')
          const authCookie = useCookie('auth_isAuthenticated')
          
          console.log('🔍 从 Cookie 初始化认证状态:', {
            authCookie: authCookie.value,
            authCookieType: typeof authCookie.value,
            userCookie: userCookie.value ? '有数据' : '无数据',
            isServer: process.server,
            isClient: process.client
          })
          
          // Nuxt 的 useCookie 会自动序列化，字符串 'true' 可能被转换为布尔值 true
          // 使用宽松的真值判断来兼容两种情况
          const authValue: any = authCookie.value
          const isAuthenticated = authValue === 'true' || authValue === true
          
          if (isAuthenticated && userCookie.value) {
            this.user = typeof userCookie.value === 'string' 
              ? JSON.parse(userCookie.value) 
              : userCookie.value
            this.isAuthenticated = true
            console.log('✅ 认证状态已恢复:', this.user)
          } else {
            console.log('❌ Cookie 中无有效认证信息', {
              isAuthenticated,
              hasUserCookie: !!userCookie.value
            })
          }
        } catch (e) {
          console.error('从 Cookie 初始化失败:', e)
          this.user = null
          this.isAuthenticated = false
        }
      }
    },

    /**
     * 刷新 access_token
     * 当 access_token 过期时，尝试通过后端刷新接口获取新的 token
     * @returns 刷新是否成功
     */
    async refreshToken(): Promise<boolean> {
      // 只在客户端执行
      if (process.server) {
        return false;
      }

      try {
        // 动态导入 auth API，避免循环依赖
        const { refreshAccessToken } = await import('~/api/auth');
        
        // 尝试刷新 token
        await refreshAccessToken();
        
        // 刷新成功，后端会自动设置新的 HttpOnly cookie
        console.log('✅ Token 刷新成功');
        return true;
      } catch (error: any) {
        // 刷新失败可能的原因：
        // 1. 后端不支持刷新 token 接口（404）
        // 2. refresh token 也过期了（401）
        // 3. 网络错误等其他原因
        console.warn('❌ Token 刷新失败:', error);
        
        // 如果是因为后端不支持刷新接口（404），返回 false 但不报错
        if (error?.response?.status === 404) {
          console.log('💡 后端暂不支持 token 刷新接口，需要用户重新登录');
          return false;
        }
        
        // 其他错误也返回 false
        return false;
      }
    },
  },
})


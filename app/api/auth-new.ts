// ============================================================
// 认证相关 API（新全栈版本）
// 文件路径: app/api/auth-new.ts
// 作用: 与新的全栈后端 API 对接
// ============================================================

// ============================================================
// 1. 类型定义
// 与后端 API 响应类型保持一致
// ============================================================

/**
 * 统一 API 响应结构
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  code: number
  message: string
  data?: T
  error?: {
    code: string
    details?: string
    validationErrors?: Array<{
      field: string
      message: string
    }>
  }
  timestamp: string
  path: string
}

/**
 * 用户信息
 */
export interface User {
  id: string
  email: string
  name: string | null
  avatar: string | null
  phone: string | null
  company: string | null
  role: 'USER' | 'ADMIN' | 'MODERATOR'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED'
  emailVerified: string | null
  createdAt: string
  updatedAt: string
}

/**
 * 登录/注册响应数据
 */
export interface AuthResponse {
  user: User
  accessToken: string
  expiresIn: number
}

/**
 * 注册请求参数
 */
export interface RegisterRequest {
  email: string
  password: string
  name?: string
  turnstileToken?: string
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
  email: string
  password: string
  turnstileToken?: string
}

// ============================================================
// 2. API 基础配置
// ============================================================

/**
 * 获取 API 基础 URL
 * 开发环境使用相对路径（走 Nitro 路由），生产环境使用完整路径
 */
function getBaseUrl(): string {
  // 在服务端渲染时，使用相对路径
  if (process.server) {
    return ''
  }
  // 在客户端，使用当前域名
  return ''
}

/**
 * 获取 Access Token
 * 从内存中读取（不推荐存储在 localStorage，防止 XSS）
 */
let accessToken: string | null = null

/**
 * 设置 Access Token
 */
export function setAccessToken(token: string | null): void {
  accessToken = token
}

/**
 * 获取当前 Access Token
 */
export function getAccessToken(): string | null {
  return accessToken
}

// ============================================================
// 3. 核心请求函数
// ============================================================

/**
 * 发送 API 请求
 *
 * @description
 * 封装 fetch 请求，自动添加认证头和错误处理
 *
 * @param endpoint - API 端点（如 '/api/auth/login'）
 * @param options - fetch 选项
 * @returns Promise<ApiResponse<T>> - API 响应
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl()}${endpoint}`

  // 构建请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  // 添加认证头（如果有 Access Token）
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  // 发送请求
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // 包含 Cookie（用于传递 Refresh Token）
  })

  // 解析响应
  const data: ApiResponse<T> = await response.json()

  // 如果响应不成功，抛出错误
  if (!data.success) {
    const error = new Error(data.message)
    ;(error as any).response = data
    throw error
  }

  return data
}

// ============================================================
// 4. 认证 API
// ============================================================

/**
 * 用户注册
 *
 * @param data - 注册表单数据
 * @returns Promise<AuthResponse> - 注册成功后的用户信息和 Token
 *
 * @example
 * ```typescript
 * try {
 *   const result = await register({
 *     email: 'user@example.com',
 *     password: 'SecurePass123',
 *     name: '张三'
 *   })
 *   console.log('注册成功:', result.user)
 * } catch (error: any) {
 *   console.error('注册失败:', error.message)
 *   // 如果是验证错误，可以获取详细错误信息
 *   if (error.response?.error?.validationErrors) {
 *     console.log('验证错误:', error.response.error.validationErrors)
 *   }
 * }
 * ```
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // 保存 Access Token
  if (response.data?.accessToken) {
    setAccessToken(response.data.accessToken)
  }

  return response.data!
}

/**
 * 用户登录
 *
 * @param data - 登录表单数据
 * @returns Promise<AuthResponse> - 登录成功后的用户信息和 Token
 *
 * @example
 * ```typescript
 * try {
 *   const result = await login({
 *     email: 'user@example.com',
 *     password: 'SecurePass123'
 *   })
 *   console.log('登录成功:', result.user)
 * } catch (error: any) {
 *   console.error('登录失败:', error.message)
 * }
 * ```
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  // 保存 Access Token
  if (response.data?.accessToken) {
    setAccessToken(response.data.accessToken)
  }

  return response.data!
}

/**
 * 刷新 Access Token
 *
 * @description
 * 当 Access Token 过期时，使用 Refresh Token（存储在 HttpOnly Cookie 中）
 * 获取新的 Access Token。
 *
 * @returns Promise<{ accessToken: string; expiresIn: number }> - 新的 Token 信息
 */
export async function refreshToken(): Promise<{ accessToken: string; expiresIn: number }> {
  const response = await apiRequest<{ accessToken: string; expiresIn: number }>('/api/auth/refresh', {
    method: 'POST',
  })

  // 保存新的 Access Token
  if (response.data?.accessToken) {
    setAccessToken(response.data.accessToken)
  }

  return response.data!
}

/**
 * 用户登出
 *
 * @description
 * 撤销当前会话，清除 Cookie 和内存中的 Token。
 */
export async function logout(): Promise<void> {
  try {
    await apiRequest('/api/auth/logout', {
      method: 'POST',
    })
  } finally {
    // 无论请求成功与否，都清除本地 Token
    setAccessToken(null)
  }
}

/**
 * 获取当前用户信息
 *
 * @returns Promise<User> - 当前登录用户信息
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiRequest<User>('/api/auth/me', {
    method: 'GET',
  })

  return response.data!
}

// ============================================================
// 5. 便捷函数
// ============================================================

/**
 * 检查是否已登录
 * @returns boolean - 是否有 Access Token
 */
export function isAuthenticated(): boolean {
  return !!accessToken
}

/**
 * 清除认证状态
 * 用于登出或 Token 无效时
 */
export function clearAuth(): void {
  setAccessToken(null)
}

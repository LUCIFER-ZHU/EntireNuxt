/**
 * 认证相关 API
 * 统一管理所有认证接口调用
 */

import { useCustomFetch } from './request'

/**
 * 发送注册验证码
 * @param email 邮箱地址
 * @param turnstileToken Turnstile 验证 token
 */
export const sendRegisterCode = (email: string, turnstileToken?: string) => {
  return useCustomFetch('/web/customer/sendCode', {
    method: 'POST',
    body: { 
      email,
      ...(turnstileToken && { turnstileToken })
    }
  })
}

/**
 * 用户注册
 * @param data 注册数据
 */
export interface RegisterRequest {
  email: string
  code: string
  password: string
  customerName?: string
  sessionId?: string
}

export const register = (data: RegisterRequest) => {
  return useCustomFetch('/web/customer/register', {
    method: 'POST',
    body: data
  })
}

/**
 * 用户登录
 * @param data 登录数据
 */
export interface LoginRequest {
  email: string
  password: string
  turnstileToken?: string
}

export const login = (data: LoginRequest) => {
  return useCustomFetch('/web/customer/login', {
    method: 'POST',
    body: data
  })
}

/**
 * 发送重置密码验证码
 * @param email 邮箱地址
 * @param turnstileToken Turnstile 验证 token
 */
export const sendResetCode = (email: string, turnstileToken?: string) => {
  return useCustomFetch('/web/customer/sendResetCode', {
    method: 'POST',
    body: { 
      email,
      ...(turnstileToken && { turnstileToken })
    }
  })
}

/**
 * 重置密码
 * @param data 重置密码数据
 */
export interface ResetPasswordRequest {
  email: string
  code: string
  newPassword: string
}

export const resetPassword = (data: ResetPasswordRequest) => {
  return useCustomFetch('/web/customer/resetPassword', {
    method: 'POST',
    body: data
  })
}

/**
 * 用户登出
 * @param data 登出数据（customerId 和 email）
 */
export interface LogoutRequest {
  customerId: string | number
  email: string
}

export const logout = (data: LogoutRequest) => {
  return useCustomFetch('/web/customer/logout', {
    method: 'POST',
    body: data
  })
}

/**
 * 刷新 access_token
 * 当 access_token 过期时，调用此接口刷新 token
 * 后端会返回新的 access_token 并设置到 HttpOnly cookie 中
 * 
 * 注意：如果后端暂不支持此接口，会返回 404，前端会处理这种情况
 */
export const refreshAccessToken = () => {
  return useCustomFetch('/web/customer/refreshToken', {
    method: 'POST',
    // 不需要 body，后端会从 HttpOnly cookie 中读取 refresh_token
    // credentials: 'include' 已经在拦截器中配置，会自动携带 cookie
  })
}


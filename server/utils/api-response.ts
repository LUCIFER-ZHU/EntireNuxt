// ============================================================
// API 响应格式统一工具
// 文件路径: server/utils/api-response.ts
// 作用: 提供统一的 API 响应格式，确保前后端数据交互一致性
// ============================================================

import type { H3Event } from 'h3'
// 从 h3 导入 H3Event 类型（Nitro 底层使用的 HTTP 框架）

// ============================================================
// 1. 响应类型定义
// ============================================================

/**
 * 统一 API 响应结构
 * 所有 API 接口都返回此格式，方便前端统一处理
 */
export interface ApiResponse<T = unknown> {
  /** 操作是否成功 */
  success: boolean

  /** 业务状态码（200=成功，其他=各种错误） */
  code: number

  /** 提示信息（给用户看的） */
  message: string

  /** 响应数据（成功时） */
  data?: T

  /** 错误详情（失败时，用于调试） */
  error?: {
    /** 错误代码（用于程序识别错误类型） */
    code: string
    /** 详细错误信息（开发环境显示） */
    details?: string
    /** 验证错误列表（表单验证失败时使用） */
    validationErrors?: Array<{
      field: string
      message: string
    }>
  }

  /** 分页信息（列表查询时使用） */
  pagination?: {
    /** 当前页码 */
    page: number
    /** 每页数量 */
    pageSize: number
    /** 总记录数 */
    total: number
    /** 总页数 */
    totalPages: number
  }

  /** 请求时间戳 */
  timestamp: string

  /** 请求路径 */
  path: string
}

// ============================================================
// 2. 成功响应函数
// ============================================================

/**
 * 创建成功响应
 *
 * @description
 * 用于 API 处理成功时返回统一格式
 *
 * @param event - H3Event 对象（用于获取请求路径）
 * @param data - 响应数据
 * @param message - 成功提示信息
 * @param code - 业务状态码（默认 200）
 * @returns ApiResponse<T> - 统一响应对象
 *
 * @example
 * ```typescript
 * // 基础用法
 * return createSuccessResponse(event, { id: '123', name: '张三' })
 *
 * // 带自定义消息
 * return createSuccessResponse(event, user, '注册成功')
 *
 * // 列表数据（带分页）
 * return createSuccessResponse(event, users, '获取成功', 200, {
 *   page: 1,
 *   pageSize: 10,
 *   total: 100,
 *   totalPages: 10
 * })
 * ```
 */
export function createSuccessResponse<T>(
  event: H3Event,
  data: T,
  message: string = '操作成功',
  code: number = 200,
  pagination?: ApiResponse<T>['pagination']
): ApiResponse<T> {
  return {
    success: true,
    code,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
    path: event.path,
  }
}

// ============================================================
// 3. 错误响应函数
// ============================================================

/**
 * 创建错误响应
 *
 * @description
 * 用于 API 处理失败时返回统一格式
 * 自动设置 HTTP 状态码
 *
 * @param event - H3Event 对象
 * @param message - 错误提示信息（给用户看的）
 * @param statusCode - HTTP 状态码（默认 400）
 * @param errorCode - 业务错误代码（用于程序识别）
 * @param details - 详细错误信息（调试用）
 * @param validationErrors - 表单验证错误列表
 * @returns ApiResponse<never> - 统一响应对象
 *
 * @example
 * ```typescript
 * // 基础错误
 * return createErrorResponse(event, '参数错误', 400, 'INVALID_PARAMS')
 *
 * // 未授权
 * return createErrorResponse(event, '请先登录', 401, 'UNAUTHORIZED')
 *
 * // 表单验证失败
 * return createErrorResponse(event, '表单验证失败', 400, 'VALIDATION_ERROR', undefined, [
 *   { field: 'email', message: '邮箱格式不正确' },
 *   { field: 'password', message: '密码太短' }
 * ])
 * ```
 */
export function createErrorResponse(
  event: H3Event,
  message: string,
  statusCode: number = 400,
  errorCode: string = 'UNKNOWN_ERROR',
  details?: string,
  validationErrors?: Array<{ field: string; message: string }>
): ApiResponse<never> {
  // 设置 HTTP 状态码
  event.node.res.statusCode = statusCode

  return {
    success: false,
    code: statusCode,
    message,
    error: {
      code: errorCode,
      details: process.env.NODE_ENV === 'development' ? details : undefined,
      // 生产环境不返回详细错误信息（安全考虑）
      validationErrors,
    },
    timestamp: new Date().toISOString(),
    path: event.path,
  }
}

// ============================================================
// 4. 便捷错误响应函数（常用场景）
// ============================================================

/**
 * 400 Bad Request - 参数错误
 */
export function createBadRequestResponse(
  event: H3Event,
  message: string = '请求参数错误',
  errorCode: string = 'BAD_REQUEST',
  validationErrors?: Array<{ field: string; message: string }>
) {
  return createErrorResponse(event, message, 400, errorCode, undefined, validationErrors)
}

/**
 * 401 Unauthorized - 未认证
 */
export function createUnauthorizedResponse(
  event: H3Event,
  message: string = '请先登录'
) {
  return createErrorResponse(event, message, 401, 'UNAUTHORIZED')
}

/**
 * 403 Forbidden - 无权限
 */
export function createForbiddenResponse(
  event: H3Event,
  message: string = '没有权限执行此操作'
) {
  return createErrorResponse(event, message, 403, 'FORBIDDEN')
}

/**
 * 404 Not Found - 资源不存在
 */
export function createNotFoundResponse(
  event: H3Event,
  message: string = '请求的资源不存在',
  resource?: string
) {
  return createErrorResponse(
    event,
    resource ? `${resource}不存在` : message,
    404,
    'NOT_FOUND'
  )
}

/**
 * 409 Conflict - 资源冲突（如重复数据）
 */
export function createConflictResponse(
  event: H3Event,
  message: string = '资源已存在'
) {
  return createErrorResponse(event, message, 409, 'CONFLICT')
}

/**
 * 422 Unprocessable Entity - 业务逻辑错误
 */
export function createUnprocessableResponse(
  event: H3Event,
  message: string,
  errorCode: string = 'BUSINESS_ERROR'
) {
  return createErrorResponse(event, message, 422, errorCode)
}

/**
 * 500 Internal Server Error - 服务器内部错误
 */
export function createInternalErrorResponse(
  event: H3Event,
  message: string = '服务器内部错误',
  details?: string
) {
  return createErrorResponse(
    event,
    message,
    500,
    'INTERNAL_ERROR',
    process.env.NODE_ENV === 'development' ? details : undefined
  )
}

// ============================================================
// 5. 发送响应的便捷函数
// ============================================================

/**
 * 发送成功响应（自动调用）
 *
 * @example
 * ```typescript
 * export default defineEventHandler(async (event) => {
 *   const data = await getData()
 *   return sendSuccess(event, data)
 * })
 * ```
 */
export function sendSuccess<T>(
  event: H3Event,
  data: T,
  message?: string,
  code?: number,
  pagination?: ApiResponse<T>['pagination']
) {
  return createSuccessResponse(event, data, message, code, pagination)
}

/**
 * 发送错误响应（自动调用）
 *
 * @example
 * ```typescript
 * export default defineEventHandler(async (event) => {
 *   if (!isValid) {
 *     return sendError(event, '参数错误', 400)
 *   }
 * })
 * ```
 */
export function sendError(
  event: H3Event,
  message: string,
  statusCode?: number,
  errorCode?: string
) {
  return createErrorResponse(event, message, statusCode, errorCode)
}

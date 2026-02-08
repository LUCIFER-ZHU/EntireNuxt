// ============================================================
// 认证中间件
// 文件路径: server/middleware/auth.ts
// 作用: 验证 JWT Token，保护需要登录的 API 路由
// ============================================================

import type { UserRole } from '@prisma/client'

/**
 * 扩展 H3Event Context 类型
 * 添加 user 属性，方便在 API 路由中获取当前用户
 */
declare module 'h3' {
  interface H3EventContext {
    user?: {
      id: string
      email: string
      role: UserRole
      name: string | null
    }
  }
}

/**
 * 认证中间件
 *
 * @description
 * 验证请求中的 JWT Token，将用户信息附加到 event.context。
 * 只验证 Token 格式和签名，不检查用户是否存在（留给具体接口处理）。
 *
 * 使用方法：
 * 1. 在需要认证的 API 路由中，此中间件会自动运行
 * 2. 通过 event.context.user 获取当前用户信息
 * 3. 如果未认证，event.context.user 为 undefined
 *
 * @example
 * ```typescript
 * export default defineEventHandler(async (event) => {
 *   const user = event.context.user
 *   if (!user) {
 *     return createUnauthorizedResponse(event, '请先登录')
 *   }
 *   // 已认证，可以继续处理
 * })
 * ```
 */
export default defineEventHandler(async (event) => {
  // 只处理 API 路由
  if (!event.path.startsWith('/api/')) {
    return
  }

  // 获取 Authorization 请求头
  const authHeader = getRequestHeader(event, 'authorization')

  if (!authHeader) {
    // 没有提供 Token，不设置 user，让具体接口决定如何处理
    return
  }

  // 提取 Bearer Token
  const token = extractBearerToken(authHeader)

  if (!token) {
    return
  }

  try {
    // 验证 Token
    const payload = await verifyToken(token)

    // 将用户信息附加到 context
    event.context.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    }
  } catch {
    // Token 无效，不设置 user
    // 具体接口可以通过 event.context.user 是否为 undefined 判断是否已认证
  }
})

/**
 * 要求登录的中间件（组合使用）
 *
 * @example
 * ```typescript
 * export default defineEventHandler(async (event) => {
 *   const requireAuthResult = await requireAuth(event)
 *   if (requireAuthResult) return requireAuthResult
 *
 *   // 已认证，继续处理
 *   const user = event.context.user!
 * })
 * ```
 */
export async function requireAuth(event: any) {
  if (!event.context.user) {
    return createUnauthorizedResponse(event, '请先登录')
  }
  return null
}

/**
 * 要求管理员权限的中间件
 */
export async function requireAdmin(event: any) {
  const authResult = await requireAuth(event)
  if (authResult) return authResult

  if (event.context.user?.role !== 'ADMIN') {
    return createForbiddenResponse(event, '需要管理员权限')
  }
  return null
}

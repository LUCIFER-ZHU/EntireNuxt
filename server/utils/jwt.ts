// ============================================================
// JWT (JSON Web Token) 工具
// 文件路径: server/utils/jwt.ts
// 作用: 生成和验证 JWT Token，实现无状态认证
// 技术: 使用 Web Crypto API (Edge Runtime 兼容)
// 文档: https://jwt.io/introduction
// ============================================================

import type { User, UserRole } from '@prisma/client'
// 从 Prisma 导入 User 类型，用于 Token payload 类型定义

// ============================================================
// 1. 类型定义
// ============================================================

/**
 * JWT Token Payload (载荷)
 * 说明: Token 中携带的用户信息，会被 Base64 编码（注意不是加密）
 * 警告: 不要存放敏感信息（如密码），因为 payload 可以被解码查看
 */
export interface TokenPayload {
  // --- 标准 JWT 声明 (Registered Claims) ---
  sub: string        // subject: 用户ID (subject of the JWT)
  iat: number        // issued at: 签发时间 (Unix 时间戳)
  exp: number        // expiration: 过期时间 (Unix 时间戳)
  jti: string        // JWT ID: 唯一标识此 Token，用于撤销

  // --- 自定义声明 (Private Claims) ---
  email: string      // 用户邮箱
  role: UserRole     // 用户角色
  name: string | null // 用户姓名
}

/**
 * Token 生成结果
 */
export interface TokenPair {
  accessToken: string   // 访问令牌（短期有效，用于 API 请求）
  refreshToken: string  // 刷新令牌（长期有效，用于获取新的 accessToken）
  expiresIn: number     // accessToken 有效期（秒）
}

// ============================================================
// 2. 配置常量
// ============================================================

/**
 * 从环境变量获取 JWT 密钥
 * 如果没有设置，使用开发环境默认密钥（⚠️ 生产环境必须设置！）
 */
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production'

/**
 * Access Token 有效期（默认 15 分钟）
 * 格式: 数字 + 单位 (s=秒, m=分钟, h=小时, d=天)
 */
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m'

/**
 * Refresh Token 有效期（默认 7 天）
 */
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

// ============================================================
// 3. 辅助函数
// ============================================================

/**
 * 将时间字符串转换为秒数
 * @param timeStr - 时间字符串，如 "15m", "7d", "2h"
 * @returns number - 秒数
 */
function parseTimeToSeconds(timeStr: string): number {
  const unit = timeStr.slice(-1)  // 获取最后一个字符（单位）
  const value = parseInt(timeStr.slice(0, -1), 10)  // 获取数字部分

  switch (unit) {
    case 's': return value
    case 'm': return value * 60
    case 'h': return value * 60 * 60
    case 'd': return value * 24 * 60 * 60
    default: return 900  // 默认 15 分钟
  }
}

/**
 * 生成唯一 ID
 * 使用 Web Crypto API 生成 UUID
 */
function generateUUID(): string {
  // 使用 crypto.randomUUID() 如果可用（Node.js 14.17+）
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // 降级方案：手动生成
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// ============================================================
// 4. Web Crypto API 辅助函数
// ============================================================

/**
 * 获取 CryptoKey（用于签名和验证）
 * 使用 Web Crypto API，兼容 Edge Runtime
 */
async function getCryptoKey(): Promise<CryptoKey> {
  // 将密钥字符串转换为 ArrayBuffer
  const encoder = new TextEncoder()
  const keyData = encoder.encode(JWT_SECRET)

  // 导入密钥（使用 HMAC-SHA256）
  return await crypto.subtle.importKey(
    'raw',                    // 原始密钥格式
    keyData,                  // 密钥数据
    { name: 'HMAC', hash: 'SHA-256' },  // 算法：HMAC-SHA256
    false,                    // 不可导出
    ['sign', 'verify']        // 用途：签名和验证
  )
}

/**
 * Base64 URL 安全编码
 * JWT 使用 Base64Url 编码（替换 +/ 为 -_，并移除 = 填充）
 */
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Base64 URL 安全解码
 */
function base64UrlDecode(str: string): string {
  // 还原填充
  const padding = '='.repeat((4 - str.length % 4) % 4)
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + padding

  return atob(base64)
}

// ============================================================
// 5. Token 生成函数
// ============================================================

/**
 * 生成 JWT Token 对（Access Token + Refresh Token）
 *
 * @description
 * 为用户生成一对 Token：
 * - Access Token: 短期有效（默认15分钟），用于 API 请求认证
 * - Refresh Token: 长期有效（默认7天），用于在 Access Token 过期后获取新的 Token
 *
 * 双 Token 机制的好处：
 * 1. Access Token 短期有效，降低被盗风险
 * 2. Refresh Token 只用于刷新，不用于 API 请求，进一步降低风险
 * 3. 可以单独撤销 Refresh Token（登出某设备）而不影响其他设备
 *
 * @param user - 用户对象（从数据库查询得到）
 * @returns Promise<TokenPair> - Token 对
 *
 * @example
 * ```typescript
 * const tokens = await generateTokenPair(user)
 * // {
 * //   accessToken: "eyJhbGciOiJIUzI1NiIs...",
 * //   refreshToken: "eyJhbGciOiJIUzI1NiIs...",
 * //   expiresIn: 900
 * // }
 * ```
 */
export async function generateTokenPair(user: User): Promise<TokenPair> {
  const now = Math.floor(Date.now() / 1000)  // 当前时间（Unix 时间戳，秒）
  const accessExp = now + parseTimeToSeconds(ACCESS_TOKEN_EXPIRES_IN)
  const refreshExp = now + parseTimeToSeconds(REFRESH_TOKEN_EXPIRES_IN)

  // 构建 Access Token Payload
  const accessPayload: TokenPayload = {
    sub: user.id,           // 用户ID
    iat: now,               // 签发时间
    exp: accessExp,         // 过期时间
    jti: generateUUID(),    // Token 唯一ID
    email: user.email,      // 用户邮箱
    role: user.role,        // 用户角色
    name: user.name,        // 用户姓名
  }

  // 构建 Refresh Token Payload（更简单，只包含必要信息）
  const refreshPayload = {
    sub: user.id,
    iat: now,
    exp: refreshExp,
    jti: generateUUID(),
    type: 'refresh' as const,  // 标记这是 Refresh Token
  }

  // 生成 Access Token
  const accessToken = await signJWT(accessPayload)

  // 生成 Refresh Token
  const refreshToken = await signJWT(refreshPayload)

  return {
    accessToken,
    refreshToken,
    expiresIn: parseTimeToSeconds(ACCESS_TOKEN_EXPIRES_IN),
  }
}

/**
 * 签名 JWT
 * 使用 HMAC-SHA256 算法
 */
async function signJWT(payload: object): Promise<string> {
  // 构建 Header
  const header = {
    alg: 'HS256',   // 算法：HMAC-SHA256
    typ: 'JWT',     // 类型：JWT
  }

  // 编码 Header 和 Payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))

  // 构建待签名数据
  const data = `${encodedHeader}.${encodedPayload}`

  // 获取 CryptoKey
  const key = await getCryptoKey()

  // 签名
  const encoder = new TextEncoder()
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  )

  // 将签名转换为 Base64Url
  const encodedSignature = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  )

  // 返回完整的 JWT
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}

// ============================================================
// 6. Token 验证函数
// ============================================================

/**
 * 验证 JWT Token
 *
 * @description
 * 验证 Token 的签名和有效期，返回解码后的 payload
 *
 * @param token - JWT Token 字符串
 * @returns Promise<TokenPayload> - 解码后的 payload
 * @throws Error - 验证失败时抛出错误
 *
 * @example
 * ```typescript
 * try {
 *   const payload = await verifyToken(accessToken)
 *   console.log('用户ID:', payload.sub)
 *   console.log('用户角色:', payload.role)
 * } catch (error) {
 *   console.error('Token 无效:', error.message)
 * }
 * ```
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  // 分割 Token
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid token format')
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts

  // 解码 Payload 检查过期时间（在验证签名前，先检查过期时间更高效）
  let payload: TokenPayload
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload))
  } catch {
    throw new Error('Invalid token payload')
  }

  // 检查过期时间
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) {
    throw new Error('Token expired')
  }

  // 验证签名
  const data = `${encodedHeader}.${encodedPayload}`
  const key = await getCryptoKey()

  // 解码签名
  const signatureBytes = Uint8Array.from(
    base64UrlDecode(encodedSignature),
    c => c.charCodeAt(0)
  )

  const encoder = new TextEncoder()
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes,
    encoder.encode(data)
  )

  if (!isValid) {
    throw new Error('Invalid token signature')
  }

  return payload
}

/**
 * 解码 Token（不验证签名）
 * ⚠️ 警告: 仅用于读取 payload，不保证 Token 真实性
 *
 * @param token - JWT Token 字符串
 * @returns TokenPayload | null - 解码后的 payload，失败返回 null
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = JSON.parse(base64UrlDecode(parts[1]))
    return payload
  } catch {
    return null
  }
}

// ============================================================
// 7. Refresh Token 专用函数
// ============================================================

/**
 * 验证 Refresh Token
 * 与 verifyToken 类似，但额外检查 type 字段
 */
export async function verifyRefreshToken(token: string): Promise<{ sub: string; jti: string }> {
  const payload = await verifyToken(token)

  // 检查是否是 Refresh Token
  if ((payload as any).type !== 'refresh') {
    throw new Error('Invalid token type')
  }

  return {
    sub: payload.sub,
    jti: payload.jti,
  }
}

// ============================================================
// 8. 便捷函数
// ============================================================

/**
 * 从请求头中提取 Token
 *
 * @param authHeader - Authorization 请求头值
 * @returns string | null - 提取的 Token，失败返回 null
 *
 * @example
 * ```typescript
 * const token = extractBearerToken(request.headers.get('authorization'))
 * ```
 */
export function extractBearerToken(authHeader: string | null | undefined): string | null {
  if (!authHeader) return null

  // 格式: "Bearer <token>"
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  return match ? match[1] : null
}

/**
 * 检查 Token 是否即将过期
 * 用于提前刷新 Token，避免请求中断
 *
 * @param token - JWT Token
 * @param thresholdSeconds - 提前阈值（默认 5 分钟）
 * @returns boolean - 是否即将过期
 */
export function isTokenExpiringSoon(token: string, thresholdSeconds: number = 300): boolean {
  const payload = decodeToken(token)
  if (!payload || !payload.exp) return true

  const now = Math.floor(Date.now() / 1000)
  return payload.exp - now < thresholdSeconds
}

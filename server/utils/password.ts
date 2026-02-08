// ============================================================
// 密码加密工具
// 文件路径: server/utils/password.ts
// 作用: 提供安全的密码哈希和验证功能
// 技术: 使用 bcrypt 算法，支持自动 salt 生成
// 文档: https://www.npmjs.com/package/bcrypt
// ============================================================

import { hash, compare, genSalt } from 'bcrypt'
// 从 bcrypt 库导入核心函数:
// - hash: 将明文密码转换为哈希值
// - compare: 验证明文密码是否与哈希匹配
// - genSalt: 生成随机 salt（可选，hash 函数内部会自动调用）

// ============================================================
// 1. 配置常量
// ============================================================

/**
 * bcrypt 计算强度（salt rounds）
 *
 * 说明:
 * - 数值越大，安全性越高，但计算时间越长
 * - 数值越小，计算越快，但安全性越低
 * - 推荐值: 10-12（在安全和性能间平衡）
 *
 * 计算时间参考（2024 年普通 CPU）:
 * - rounds=10: ~100ms
 * - rounds=12: ~400ms
 * - rounds=14: ~1.6s
 * - rounds=16: ~6s
 *
 * 为什么选择 12:
 * - 足够安全（暴力破解需要极长时间）
 * - 用户体验可接受（400ms 延迟不明显）
 */
const SALT_ROUNDS = 12

// ============================================================
// 2. 密码哈希函数
// ============================================================

/**
 * 对明文密码进行哈希加密
 *
 * @description
 * 使用 bcrypt 算法将明文密码转换为不可逆的哈希值。
 * 哈希过程自动包含 salt，防止彩虹表攻击。
 *
 * @param plainPassword - 明文密码（用户输入）
 * @returns Promise<string> - 哈希后的密码（存储到数据库）
 *
 * @example
 * ```typescript
 * const hashedPassword = await hashPassword('userPassword123')
 * // 结果: $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G
 * // 格式: $2b$<rounds>$<salt><hash>
 * ```
 *
 * @security
 * - 永远不要存储明文密码
 * - 永远不要传输哈希值到客户端
 * - 哈希是单向的，无法还原为明文
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  // 参数验证
  if (!plainPassword || plainPassword.length < 1) {
    throw new Error('密码不能为空')
  }

  if (plainPassword.length > 128) {
    // 限制最大长度，防止 DoS 攻击（bcrypt 有 72 字节限制，但我们可以更早截断）
    throw new Error('密码过长')
  }

  try {
    // 使用 bcrypt.hash 进行加密
    // 参数1: 明文密码
    // 参数2: salt rounds（计算强度）
    const hashedPassword = await hash(plainPassword, SALT_ROUNDS)

    return hashedPassword
  } catch (error) {
    console.error('密码哈希失败:', error)
    throw new Error('密码加密失败')
  }
}

// ============================================================
// 3. 密码验证函数
// ============================================================

/**
 * 验证明文密码是否与哈希匹配
 *
 * @description
 * 使用 bcrypt.compare 安全地比较明文密码和存储的哈希值。
 * 使用 timing-safe 比较，防止时序攻击。
 *
 * @param plainPassword - 明文密码（用户输入）
 * @param hashedPassword - 哈希密码（从数据库读取）
 * @returns Promise<boolean> - 是否匹配
 *
 * @example
 * ```typescript
 * const isValid = await verifyPassword('userPassword123', storedHash)
 * if (isValid) {
 *   // 登录成功
 * } else {
 *   // 密码错误
 * }
 * ```
 *
 * @security
 * - 使用恒定时间比较，防止时序攻击
 * - 即使密码错误，也执行完整计算流程
 * - 不会泄露哈希的任何信息
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  // 参数验证
  if (!plainPassword || !hashedPassword) {
    return false
  }

  try {
    // bcrypt.compare 会:
    // 1. 从 hashedPassword 中提取 salt
    // 2. 使用相同的 salt 对 plainPassword 进行哈希
    // 3. 比较两个哈希是否相同
    // 4. 使用恒定时间比较，防止时序攻击
    const isMatch = await compare(plainPassword, hashedPassword)

    return isMatch
  } catch (error) {
    console.error('密码验证失败:', error)
    return false
  }
}

// ============================================================
// 4. 密码强度验证（可选功能）
// ============================================================

/**
 * 密码强度验证结果
 */
export interface PasswordStrengthResult {
  isValid: boolean        // 是否通过验证
  score: number          // 强度评分 (0-4)
  message: string        // 提示信息
  suggestions: string[]  // 改进建议
}

/**
 * 验证密码强度
 *
 * @description
 * 检查密码是否符合安全要求，返回详细的验证结果。
 * 客户端和服务端都应该进行验证（客户端用于即时反馈，服务端用于安全）。
 *
 * @param password - 待验证的密码
 * @returns PasswordStrengthResult - 验证结果
 *
 * @example
 * ```typescript
 * const result = validatePasswordStrength('weak')
 * // { isValid: false, score: 0, message: '密码太短', suggestions: ['至少8个字符'] }
 *
 * const result = validatePasswordStrength('StrongPass123!')
 * // { isValid: true, score: 4, message: '密码强度优秀', suggestions: [] }
 * ```
 */
export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const suggestions: string[] = []
  let score = 0

  // 检查长度
  if (password.length < 8) {
    suggestions.push('至少8个字符')
  } else if (password.length >= 12) {
    score += 1
  }

  // 检查是否包含小写字母
  if (!/[a-z]/.test(password)) {
    suggestions.push('包含小写字母')
  } else {
    score += 1
  }

  // 检查是否包含大写字母
  if (!/[A-Z]/.test(password)) {
    suggestions.push('包含大写字母')
  } else {
    score += 1
  }

  // 检查是否包含数字
  if (!/\d/.test(password)) {
    suggestions.push('包含数字')
  } else {
    score += 1
  }

  // 检查是否包含特殊字符
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    suggestions.push('包含特殊字符（如 !@#$%）')
  } else {
    score += 1
  }

  // 计算最终评分（最高4分）
  score = Math.min(score, 4)

  // 判断是否通过验证（至少8位 + 包含3种字符类型）
  const hasMinLength = password.length >= 8
  const hasRequiredTypes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
  ].filter(Boolean).length >= 3

  const isValid = hasMinLength && hasRequiredTypes

  // 生成提示信息
  let message: string
  if (score === 0) message = '密码太弱'
  else if (score === 1) message = '密码较弱'
  else if (score === 2) message = '密码一般'
  else if (score === 3) message = '密码良好'
  else message = '密码强度优秀'

  return {
    isValid,
    score,
    message,
    suggestions,
  }
}

// ============================================================
// 5. 生成随机密码（可选功能）
// ============================================================

/**
 * 生成随机安全密码
 *
 * @description
 * 生成符合安全要求的随机密码，可用于:
 * - 系统自动生成初始密码
 * - 重置密码时生成临时密码
 * - 生成 API 密钥
 *
 * @param length - 密码长度（默认16）
 * @returns string - 随机密码
 *
 * @example
 * ```typescript
 * const password = generateRandomPassword(12)
 * // 结果: "K9#mP2$vL7nQ"
 * ```
 */
export function generateRandomPassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  const allChars = uppercase + lowercase + numbers + symbols

  // 确保包含每种字符类型
  let password = ''
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // 填充剩余长度
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // 打乱字符顺序
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}

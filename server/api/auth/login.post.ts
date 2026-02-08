// ============================================================
// 用户登录 API
// 文件路径: server/api/auth/login.post.ts
// 路由: POST /api/auth/login
// 作用: 验证用户凭据，返回 JWT Token
// ============================================================

import { z } from 'zod'

// ============================================================
// 1. 请求体验证 Schema
// ============================================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, '邮箱不能为空')
    .email('请输入有效的邮箱地址')
    .transform((val) => val.toLowerCase().trim()),

  password: z
    .string()
    .min(1, '密码不能为空'),
    // 登录时不验证密码复杂度，只检查是否为空

  turnstileToken: z
    .string()
    .optional(),
})

type LoginRequest = z.infer<typeof loginSchema>

// ============================================================
// 2. API 处理器
// ============================================================

/**
 * 用户登录接口
 *
 * @description
 * 验证用户邮箱和密码，成功后返回：
 * - Access Token（短期有效，用于 API 请求）
 * - Refresh Token（存储在 HttpOnly Cookie 中）
 *
 * 安全特性：
 * - 密码使用 bcrypt 比对
 * - 登录失败不透露是邮箱不存在还是密码错误
 * - 支持验证码防止暴力破解
 */
export default defineEventHandler(async (event) => {
  try {
    // --------------------------------------------------------
    // 2.1 读取并验证请求体
    // --------------------------------------------------------
    const body = await readBody(event)
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return createBadRequestResponse(
        event,
        '表单验证失败，请检查输入',
        'VALIDATION_ERROR',
        errors
      )
    }

    const data = validationResult.data

    // --------------------------------------------------------
    // 2.2 验证 Turnstile 验证码（可选）
    // --------------------------------------------------------
    if (data.turnstileToken) {
      const config = useRuntimeConfig()
      const secretKey = config.turnstile?.secretKey

      if (secretKey) {
        const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
        const verifyResponse = await $fetch(verifyUrl, {
          method: 'POST',
          body: {
            secret: secretKey,
            response: data.turnstileToken,
          },
        })

        if (!verifyResponse.success) {
          return createBadRequestResponse(
            event,
            '验证码验证失败，请重试',
            'TURNSTILE_ERROR'
          )
        }
      }
    }

    // --------------------------------------------------------
    // 2.3 查找用户
    // --------------------------------------------------------
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    // 注意：为了安全，不要告诉用户是"邮箱不存在"还是"密码错误"
    // 统一返回"邮箱或密码错误"，防止邮箱枚举攻击
    if (!user) {
      return createUnauthorizedResponse(
        event,
        '邮箱或密码错误'
      )
    }

    // --------------------------------------------------------
    // 2.4 检查用户状态
    // --------------------------------------------------------
    if (user.status === 'SUSPENDED') {
      return createForbiddenResponse(
        event,
        '账户已被封禁，请联系管理员'
      )
    }

    if (user.status === 'DELETED') {
      return createUnauthorizedResponse(
        event,
        '邮箱或密码错误'
      )
    }

    // --------------------------------------------------------
    // 2.5 验证密码
    // --------------------------------------------------------
    const isPasswordValid = await verifyPassword(data.password, user.password)

    if (!isPasswordValid) {
      return createUnauthorizedResponse(
        event,
        '邮箱或密码错误'
      )
    }

    // --------------------------------------------------------
    // 2.6 生成 JWT Token 对
    // --------------------------------------------------------
    const tokens = await generateTokenPair(user)

    // --------------------------------------------------------
    // 2.7 创建会话记录
    // --------------------------------------------------------
    const headers = getRequestHeaders(event)
    const ipAddress = event.node.req.socket.remoteAddress || null
    const userAgent = headers['user-agent'] || null

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: await hashPassword(tokens.refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress,
        userAgent,
      },
    })

    // --------------------------------------------------------
    // 2.8 设置 HTTP-only Cookie
    // --------------------------------------------------------
    setCookie(event, 'refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/api/auth',
    })

    // --------------------------------------------------------
    // 2.9 返回用户信息（不包含密码）
    // --------------------------------------------------------
    const { password: _, ...userWithoutPassword } = user

    return createSuccessResponse(
      event,
      {
        user: userWithoutPassword,
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      },
      '登录成功'
    )

  } catch (error) {
    console.error('登录接口错误:', error)
    return createInternalErrorResponse(
      event,
      '登录失败，请稍后重试',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
})

// ============================================================
// 用户注册 API
// 文件路径: server/api/auth/register.post.ts
// 路由: POST /api/auth/register
// 作用: 处理用户注册请求，创建新用户账号
// ============================================================

import { z } from 'zod'
// 导入 Zod 用于运行时数据验证
// Zod 可以在运行时验证数据，弥补 TypeScript 只在编译时检查的类型安全

// ============================================================
// 1. 请求体验证 Schema
// 说明：定义请求体应该包含哪些字段，以及字段规则
// ============================================================

/**
 * 注册请求体验证 Schema
 * 使用 Zod 定义请求体的结构和验证规则
 */
const registerSchema = z.object({
  email: z
    .string()
    .min(1, '邮箱不能为空')
    // 最小长度验证，确保不是空字符串

    .email('请输入有效的邮箱地址')
    // email() 验证邮箱格式（如 user@example.com）

    .max(255, '邮箱长度不能超过255个字符')
    // 最大长度限制，防止数据库溢出攻击

    .transform((val) => val.toLowerCase().trim()),
    // transform: 转换数据，统一转为小写并去除首尾空格
    // 这样可以确保 "User@Example.com" 和 "user@example.com" 被视为同一个邮箱

  password: z
    .string()
    .min(8, '密码至少需要8个字符')
    // 最小长度 8 位，符合安全最佳实践

    .max(100, '密码长度不能超过100个字符')
    // 防止超长密码 DoS 攻击

    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      '密码必须包含至少一个大写字母、一个小写字母和一个数字'
    ),
    // 正则表达式验证密码复杂度：
    // (?=.*[a-z]) - 至少一个小写字母
    // (?=.*[A-Z]) - 至少一个大写字母
    // (?=.*\d)    - 至少一个数字

  name: z
    .string()
    .min(2, '姓名至少需要2个字符')
    .max(50, '姓名长度不能超过50个字符')
    .optional()
    // optional() 表示可选字段，用户可以不提供

    .transform((val) => val?.trim()),
    // 如果有值，去除首尾空格

  turnstileToken: z
    .string()
    .optional(),
    // Turnstile 验证码 Token（可选，用于防止机器人注册）
})

/**
 * 从 Schema 推断 TypeScript 类型
 * 这样前端和后端可以共享同一个类型定义
 */
type RegisterRequest = z.infer<typeof registerSchema>

// ============================================================
// 2. API 处理器
// 说明：Nitro 会自动将文件路径映射为 API 路由
// 文件路径: server/api/auth/register.post.ts
// 对应路由: POST /api/auth/register
// ============================================================

/**
 * 用户注册接口
 *
 * @description
 * 处理用户注册请求，流程如下：
 * 1. 验证请求体格式（使用 Zod）
 * 2. 验证 Turnstile 验证码（如果提供）
 * 3. 检查邮箱是否已存在
 * 4. 加密密码
 * 5. 创建用户记录
 * 6. 生成 JWT Token
 * 7. 创建会话记录
 * 8. 返回用户信息和 Token
 *
 * @security
 * - 密码使用 bcrypt 加密，永不存储明文
 * - 邮箱唯一性检查，防止重复注册
 * - 验证码防止机器人攻击
 */
export default defineEventHandler(async (event) => {
  // defineEventHandler: Nitro 提供的 API 路由定义函数
  // event: 包含请求和响应的上下文对象

  try {
    // --------------------------------------------------------
    // 2.1 读取并验证请求体
    // --------------------------------------------------------

    // readBody: Nitro 提供的工具函数，解析 JSON 请求体
    const body = await readBody(event)

    // 使用 Zod 验证请求体
    const validationResult = registerSchema.safeParse(body)
    // safeParse: 安全解析，不会抛出错误，而是返回结果对象

    if (!validationResult.success) {
      // 验证失败，格式化错误信息
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),  // 错误字段路径（如 "email" 或 "user.name"）
        message: issue.message,        // 错误信息
      }))

      // 返回 400 错误响应
      return createBadRequestResponse(
        event,
        '表单验证失败，请检查输入',
        'VALIDATION_ERROR',
        errors
      )
    }

    // 验证通过，获取格式化后的数据
    const data = validationResult.data

    // --------------------------------------------------------
    // 2.2 验证 Turnstile 验证码（可选）
    // --------------------------------------------------------

    if (data.turnstileToken) {
      // 获取 Turnstile 密钥（从环境变量）
      const config = useRuntimeConfig()
      const secretKey = config.turnstile?.secretKey

      if (secretKey) {
        // 调用 Cloudflare Turnstile 验证 API
        const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

        const verifyResponse: any = await $fetch(verifyUrl, {
          method: 'POST',
          body: {
            secret: secretKey,
            response: data.turnstileToken,
            // remoteip: event.node.req.socket.remoteAddress, // 可选：传递用户 IP
          },
        })

        // 验证失败
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
    // 2.3 检查邮箱是否已存在
    // --------------------------------------------------------

    // 使用 Prisma 查询数据库
    const existingUser = await prisma.user.findUnique({
      // findUnique: 根据唯一字段查询单条记录
      where: { email: data.email },
      // where: 查询条件
    })

    if (existingUser) {
      // 如果用户已存在，返回 409 冲突状态码
      // 注意：为了安全，不应该告诉用户"这个邮箱已注册"
      // 而是返回一个模糊的错误，防止邮箱枚举攻击
      return createConflictResponse(
        event,
        '该邮箱已被注册，请直接登录或找回密码'
      )
    }

    // --------------------------------------------------------
    // 2.4 加密密码
    // --------------------------------------------------------

    // 使用 bcrypt 加密密码（来自 server/utils/password.ts）
    const hashedPassword = await hashPassword(data.password)

    // --------------------------------------------------------
    // 2.5 创建用户记录
    // --------------------------------------------------------

    const user = await prisma.user.create({
      // create: 创建新记录
      data: {
        // data: 要插入的数据
        email: data.email,
        password: hashedPassword,  // 存储哈希值，不是明文！
        name: data.name || null,   // 如果 name 未提供，设为 null
        role: 'USER',              // 默认角色为普通用户
        status: 'ACTIVE',          // 默认状态为激活
      },
      select: {
        // select: 指定返回哪些字段（安全性：不返回密码）
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })

    // --------------------------------------------------------
    // 2.6 生成 JWT Token 对
    // --------------------------------------------------------

    // 生成 Access Token 和 Refresh Token
    const tokens = await generateTokenPair(user as any)

    // --------------------------------------------------------
    // 2.7 创建会话记录
    // --------------------------------------------------------

    // 获取请求信息（用于记录登录设备和 IP）
    const headers = getRequestHeaders(event)
    const ipAddress = event.node.req.socket.remoteAddress || null
    const userAgent = headers['user-agent'] || null

    // 存储 Refresh Token（存储哈希值，不是明文）
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: await hashPassword(tokens.refreshToken),
        // 注意：这里复用 hashPassword 来哈希 refresh token
        // 实际项目中可能需要专门的 token 哈希函数

        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        // 7 天后过期

        ipAddress,
        userAgent,
      },
    })

    // --------------------------------------------------------
    // 2.8 设置 HTTP-only Cookie（存储 Refresh Token）
    // --------------------------------------------------------

    // 设置 refresh token 到 HttpOnly Cookie
    // HttpOnly Cookie 无法被 JavaScript 访问，防止 XSS 攻击
    setCookie(event, 'refresh_token', tokens.refreshToken, {
      httpOnly: true,        // 禁止 JavaScript 访问
      secure: process.env.NODE_ENV === 'production',  // 生产环境使用 HTTPS
      sameSite: 'strict',    // 防止 CSRF 攻击
      maxAge: 7 * 24 * 60 * 60,  // 7 天（秒）
      path: '/api/auth',     // 只在认证路由下发送
    })

    // --------------------------------------------------------
    // 2.9 返回成功响应
    // --------------------------------------------------------

    return createSuccessResponse(
      event,
      {
        user,                    // 用户信息
        accessToken: tokens.accessToken,  // Access Token（前端存储在内存中）
        expiresIn: tokens.expiresIn,      // Token 有效期（秒）
      },
      '注册成功',
      201  // 201 Created: 资源创建成功
    )

  } catch (error) {
    // --------------------------------------------------------
    // 2.10 错误处理
    // --------------------------------------------------------

    console.error('注册接口错误:', error)
    // 记录详细错误到服务端日志（用户看不到）

    // 返回 500 错误响应
    return createInternalErrorResponse(
      event,
      '注册失败，请稍后重试',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
})

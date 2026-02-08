// ============================================================
// Token 刷新 API
// 文件路径: server/api/auth/refresh.post.ts
// 路由: POST /api/auth/refresh
// 作用: 使用 Refresh Token 获取新的 Access Token
// ============================================================

/**
 * Token 刷新接口
 *
 * @description
 * 当 Access Token 过期时，客户端调用此接口获取新的 Token 对。
 * Refresh Token 从 HttpOnly Cookie 中读取，增加安全性。
 *
 * 流程：
 * 1. 从 Cookie 读取 Refresh Token
 * 2. 验证 Refresh Token 的有效性
 * 3. 在数据库中查找对应的会话
 * 4. 验证会话是否过期
 * 5. 生成新的 Token 对
 * 6. 更新会话记录
 * 7. 设置新的 Cookie
 * 8. 返回新的 Access Token
 *
 * 安全特性：
 * - Refresh Token 存储在 HttpOnly Cookie，防止 XSS
 * - 每次刷新都生成新的 Token 对（Token Rotation）
 * - 旧的 Refresh Token 立即失效
 */
export default defineEventHandler(async (event) => {
  try {
    // --------------------------------------------------------
    // 1. 从 Cookie 读取 Refresh Token
    // --------------------------------------------------------
    const refreshToken = getCookie(event, 'refresh_token')

    if (!refreshToken) {
      return createUnauthorizedResponse(
        event,
        '未提供刷新令牌，请重新登录'
      )
    }

    // --------------------------------------------------------
    // 2. 验证 Refresh Token 的有效性
    // --------------------------------------------------------
    let payload: { sub: string; jti: string }
    try {
      payload = await verifyRefreshToken(refreshToken)
    } catch {
      // Token 无效或过期
      // 清除 Cookie
      deleteCookie(event, 'refresh_token', { path: '/api/auth' })
      return createUnauthorizedResponse(
        event,
        '刷新令牌已过期，请重新登录'
      )
    }

    const userId = payload.sub
    const tokenJti = payload.jti

    // --------------------------------------------------------
    // 3. 在数据库中查找对应的会话
    // --------------------------------------------------------
    // 由于 Refresh Token 是哈希存储的，需要遍历用户的所有会话
    // 这在生产环境中可能较慢，可以考虑优化存储方式
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),  // 只查找未过期的会话
        },
      },
    })

    // 查找匹配的会话
    let matchedSession = null
    for (const session of sessions) {
      const isMatch = await verifyPassword(refreshToken, session.refreshToken)
      if (isMatch) {
        matchedSession = session
        break
      }
    }

    if (!matchedSession) {
      // 未找到匹配的会话，可能是 Token 被撤销或伪造
      deleteCookie(event, 'refresh_token', { path: '/api/auth' })
      return createUnauthorizedResponse(
        event,
        '无效的刷新令牌，请重新登录'
      )
    }

    // --------------------------------------------------------
    // 4. 查找用户
    // --------------------------------------------------------
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      deleteCookie(event, 'refresh_token', { path: '/api/auth' })
      return createUnauthorizedResponse(
        event,
        '用户不存在，请重新登录'
      )
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      deleteCookie(event, 'refresh_token', { path: '/api/auth' })
      return createForbiddenResponse(
        event,
        '账户已被封禁，请联系管理员'
      )
    }

    // --------------------------------------------------------
    // 5. 生成新的 Token 对（Token Rotation）
    // --------------------------------------------------------
    // Token Rotation: 每次刷新都生成新的 Token 对
    // 这样可以防止 Refresh Token 被盗后长期使用
    const tokens = await generateTokenPair(user)

    // --------------------------------------------------------
    // 6. 更新会话记录
    // --------------------------------------------------------
    // 删除旧会话，创建新会话
    await prisma.session.delete({
      where: { id: matchedSession.id },
    })

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
    // 7. 设置新的 Cookie
    // --------------------------------------------------------
    setCookie(event, 'refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/api/auth',
    })

    // --------------------------------------------------------
    // 8. 返回新的 Access Token
    // --------------------------------------------------------
    return createSuccessResponse(
      event,
      {
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      },
      '令牌刷新成功'
    )

  } catch (error) {
    console.error('Token 刷新接口错误:', error)
    return createInternalErrorResponse(
      event,
      '刷新失败，请重新登录',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
})

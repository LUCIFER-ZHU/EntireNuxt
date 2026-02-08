// ============================================================
// 用户登出 API
// 文件路径: server/api/auth/logout.post.ts
// 路由: POST /api/auth/logout
// 作用: 撤销当前会话，使用户登出
// ============================================================

/**
 * 用户登出接口
 *
 * @description
 * 撤销当前会话，清除 Cookie，使用户登出。
 * 支持两种模式：
 * 1. 从 Cookie 读取 Refresh Token（Web 应用）
 * 2. 从请求体读取 Refresh Token（移动端/第三方应用）
 *
 * 流程：
 * 1. 获取 Refresh Token
 * 2. 在数据库中查找并删除对应会话
 * 3. 清除 Cookie
 * 4. 返回成功响应
 */
export default defineEventHandler(async (event) => {
  try {
    // --------------------------------------------------------
    // 1. 获取 Refresh Token（优先从 Cookie，其次从请求体）
    // --------------------------------------------------------
    let refreshToken = getCookie(event, 'refresh_token')

    // 如果 Cookie 中没有，尝试从请求体读取
    if (!refreshToken) {
      const body = await readBody(event).catch(() => ({}))
      refreshToken = body.refreshToken
    }

    // --------------------------------------------------------
    // 2. 如果提供了 Token，在数据库中删除对应会话
    // --------------------------------------------------------
    if (refreshToken) {
      try {
        // 解码 Token 获取用户 ID（不需要验证签名，因为我们要删除它）
        const payload = decodeToken(refreshToken)

        if (payload?.sub) {
          // 查找并删除匹配的会话
          const sessions = await prisma.session.findMany({
            where: { userId: payload.sub },
          })

          for (const session of sessions) {
            const isMatch = await verifyPassword(refreshToken, session.refreshToken)
            if (isMatch) {
              await prisma.session.delete({
                where: { id: session.id },
              })
              break
            }
          }
        }
      } catch {
        // Token 无效，忽略错误，继续清除 Cookie
      }
    }

    // --------------------------------------------------------
    // 3. 清除 Cookie
    // --------------------------------------------------------
    deleteCookie(event, 'refresh_token', { path: '/api/auth' })

    // --------------------------------------------------------
    // 4. 返回成功响应
    // --------------------------------------------------------
    return createSuccessResponse(
      event,
      null,
      '登出成功'
    )

  } catch (error) {
    console.error('登出接口错误:', error)
    // 即使出错也返回成功，因为登出是幂等操作
    return createSuccessResponse(
      event,
      null,
      '登出成功'
    )
  }
})

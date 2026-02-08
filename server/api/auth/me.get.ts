// ============================================================
// 获取当前用户信息 API
// 文件路径: server/api/auth/me.get.ts
// 路由: GET /api/auth/me
// 作用: 获取当前登录用户的详细信息
// ============================================================

/**
 * 获取当前用户信息接口
 *
 * @description
 * 返回当前登录用户的详细信息。
 * 需要先通过 Authorization Header 提供有效的 Access Token。
 *
 * 使用认证中间件验证 Token，通过 event.context.user 获取用户信息。
 */
export default defineEventHandler(async (event) => {
  try {
    // --------------------------------------------------------
    // 1. 检查是否已认证
    // --------------------------------------------------------
    const user = event.context.user

    if (!user) {
      return createUnauthorizedResponse(event, '请先登录')
    }

    // --------------------------------------------------------
    // 2. 从数据库获取最新用户信息
    // --------------------------------------------------------
    // 注意：虽然 Token 中有用户信息，但可能已过期（如用户被禁用）
    // 所以应该从数据库获取最新信息
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        phone: true,
        company: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!currentUser) {
      return createUnauthorizedResponse(event, '用户不存在')
    }

    // 检查用户状态
    if (currentUser.status !== 'ACTIVE') {
      return createForbiddenResponse(
        event,
        '账户已被封禁，请联系管理员'
      )
    }

    // --------------------------------------------------------
    // 3. 返回用户信息
    // --------------------------------------------------------
    return createSuccessResponse(
      event,
      currentUser,
      '获取成功'
    )

  } catch (error) {
    console.error('获取用户信息接口错误:', error)
    return createInternalErrorResponse(
      event,
      '获取用户信息失败',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
})

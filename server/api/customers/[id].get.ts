// ============================================================
// 客户详情 API
// 文件路径: server/api/customers/[id].get.ts
// 路由: GET /api/customers/:id
// 作用: 获取单个客户的详细信息
// ============================================================

/**
 * 获取客户详情
 *
 * @description
 * 根据客户 ID 获取详细信息，包括关联的业务员信息
 *
 * @example
 * ```
 * GET /api/customers/550e8400-e29b-41d4-a716-446655440000
 * ```
 */
export default defineEventHandler(async (event) => {
  try {
    // --------------------------------------------------------
    // 1. 获取路由参数
    // --------------------------------------------------------
    const id = getRouterParam(event, 'id')

    if (!id) {
      return createBadRequestResponse(event, '客户ID不能为空')
    }

    // --------------------------------------------------------
    // 2. 查询客户详情
    // --------------------------------------------------------
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        address: true,
        level: true,
        status: true,
        source: true,
        industry: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // --------------------------------------------------------
    // 3. 检查客户是否存在
    // --------------------------------------------------------
    if (!customer) {
      return createNotFoundResponse(event, '客户不存在', '客户')
    }

    // --------------------------------------------------------
    // 4. 返回响应
    // --------------------------------------------------------
    return createSuccessResponse(event, customer, '获取成功')

  } catch (error) {
    console.error('获取客户详情错误:', error)
    return createInternalErrorResponse(
      event,
      '获取客户详情失败',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
})

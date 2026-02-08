// ============================================================
// 客户删除 API
// 文件路径: server/api/customers/[id].delete.ts
// 路由: DELETE /api/customers/:id
// 作用: 删除客户
// ============================================================

/**
 * 删除客户
 *
 * @description
 * 删除指定客户记录
 *
 * @example
 * ```
 * DELETE /api/customers/550e8400-e29b-41d4-a716-446655440000
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
    // 2. 检查客户是否存在
    // --------------------------------------------------------
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!existingCustomer) {
      return createNotFoundResponse(event, '客户不存在', '客户')
    }

    // --------------------------------------------------------
    // 3. 删除客户
    // --------------------------------------------------------
    await prisma.customer.delete({
      where: { id },
    })

    // --------------------------------------------------------
    // 4. 返回响应
    // --------------------------------------------------------
    return createSuccessResponse(
      event,
      { id },
      '客户删除成功'
    )

  } catch (error) {
    console.error('删除客户错误:', error)
    return createInternalErrorResponse(
      event,
      '删除客户失败',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
})

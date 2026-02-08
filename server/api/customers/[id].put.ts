// ============================================================
// 客户更新 API
// 文件路径: server/api/customers/[id].put.ts
// 路由: PUT /api/customers/:id
// 作用: 更新客户信息
// ============================================================

import { z } from 'zod'

// ============================================================
// 1. 请求体验证 Schema
// ============================================================

const updateCustomerSchema = z.object({
  name: z
    .string()
    .min(1, '客户姓名不能为空')
    .max(100, '客户姓名不能超过100个字符')
    .optional(),

  email: z
    .string()
    .email('请输入有效的邮箱地址')
    .max(255, '邮箱不能超过255个字符')
    .optional()
    .nullable(),

  phone: z
    .string()
    .max(20, '电话不能超过20个字符')
    .optional()
    .nullable(),

  company: z
    .string()
    .max(200, '公司名称不能超过200个字符')
    .optional()
    .nullable(),

  address: z
    .string()
    .optional()
    .nullable(),

  level: z
    .enum(['VIP', 'GOLD', 'SILVER', 'BRONZE', 'REGULAR'])
    .optional(),

  status: z
    .enum(['ACTIVE', 'INACTIVE', 'POTENTIAL', 'LOST'])
    .optional(),

  source: z
    .string()
    .max(100, '来源不能超过100个字符')
    .optional()
    .nullable(),

  industry: z
    .string()
    .max(100, '行业不能超过100个字符')
    .optional()
    .nullable(),

  notes: z
    .string()
    .optional()
    .nullable(),

  assignedTo: z
    .string()
    .uuid('业务员ID格式不正确')
    .optional()
    .nullable(),
})

type UpdateCustomerRequest = z.infer<typeof updateCustomerSchema>

// ============================================================
// 2. API 处理器
// ============================================================

/**
 * 更新客户
 *
 * @description
 * 更新指定客户的信息，支持部分更新（只传需要修改的字段）
 *
 * @example
 * ```
 * PUT /api/customers/550e8400-e29b-41d4-a716-446655440000
 * {
 *   "name": "张三（已修改）",
 *   "level": "GOLD"
 * }
 * ```
 */
export default defineEventHandler(async (event) => {
  try {
    // --------------------------------------------------------
    // 2.1 获取路由参数
    // --------------------------------------------------------
    const id = getRouterParam(event, 'id')

    if (!id) {
      return createBadRequestResponse(event, '客户ID不能为空')
    }

    // --------------------------------------------------------
    // 2.2 验证请求体
    // --------------------------------------------------------
    const body = await readBody(event)
    const validationResult = updateCustomerSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))

      return createBadRequestResponse(
        event,
        '表单验证失败',
        'VALIDATION_ERROR',
        errors
      )
    }

    const data = validationResult.data

    // --------------------------------------------------------
    // 2.3 检查客户是否存在
    // --------------------------------------------------------
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!existingCustomer) {
      return createNotFoundResponse(event, '客户不存在', '客户')
    }

    // --------------------------------------------------------
    // 2.4 验证业务员是否存在（如果指定了业务员）
    // --------------------------------------------------------
    if (data.assignedTo) {
      const user = await prisma.user.findUnique({
        where: { id: data.assignedTo },
      })

      if (!user) {
        return createBadRequestResponse(
          event,
          '指定的业务员不存在',
          'INVALID_ASSIGNED_USER'
        )
      }
    }

    // --------------------------------------------------------
    // 2.5 更新客户
    // --------------------------------------------------------
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.company !== undefined && { company: data.company }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.level !== undefined && { level: data.level }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.source !== undefined && { source: data.source }),
        ...(data.industry !== undefined && { industry: data.industry }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.assignedTo !== undefined && { assignedTo: data.assignedTo }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        level: true,
        status: true,
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
    // 2.6 返回响应
    // --------------------------------------------------------
    return createSuccessResponse(
      event,
      customer,
      '客户更新成功'
    )

  } catch (error) {
    console.error('更新客户错误:', error)
    return createInternalErrorResponse(
      event,
      '更新客户失败',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
})

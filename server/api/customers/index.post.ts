// ============================================================
// 客户新增 API
// 文件路径: server/api/customers/index.post.ts
// 路由: POST /api/customers
// 作用: 创建新客户
// ============================================================

import { z } from 'zod'

// ============================================================
// 1. 请求体验证 Schema
// ============================================================

const createCustomerSchema = z.object({
  name: z
    .string()
    .min(1, '客户姓名不能为空')
    .max(100, '客户姓名不能超过100个字符'),

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
    .default('REGULAR'),

  status: z
    .enum(['ACTIVE', 'INACTIVE', 'POTENTIAL', 'LOST'])
    .default('ACTIVE'),

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

type CreateCustomerRequest = z.infer<typeof createCustomerSchema>

// ============================================================
// 2. API 处理器
// ============================================================

/**
 * 创建客户
 *
 * @description
 * 创建新客户记录，支持分配业务员
 *
 * @example
 * ```
 * POST /api/customers
 * {
 *   "name": "张三",
 *   "email": "zhangsan@example.com",
 *   "phone": "13800138000",
 *   "company": "ABC公司",
 *   "level": "VIP",
 *   "status": "ACTIVE"
 * }
 * ```
 */
export default defineEventHandler(async (event) => {
  try {
    // --------------------------------------------------------
    // 2.1 验证请求体
    // --------------------------------------------------------
    const body = await readBody(event)
    const validationResult = createCustomerSchema.safeParse(body)

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
    // 2.2 验证业务员是否存在（如果指定了业务员）
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
    // 2.3 创建客户
    // --------------------------------------------------------
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        address: data.address,
        level: data.level,
        status: data.status,
        source: data.source,
        industry: data.industry,
        notes: data.notes,
        assignedTo: data.assignedTo,
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
    // 2.4 返回响应
    // --------------------------------------------------------
    return createSuccessResponse(
      event,
      customer,
      '客户创建成功',
      201
    )

  } catch (error) {
    console.error('创建客户错误:', error)
    return createInternalErrorResponse(
      event,
      '创建客户失败',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
})

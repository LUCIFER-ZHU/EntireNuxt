// ============================================================
// 客户列表 API
// 文件路径: server/api/customers/index.get.ts
// 路由: GET /api/customers
// 作用: 获取客户列表，支持分页、搜索、筛选
// ============================================================

import { z } from 'zod'

// ============================================================
// 1. 查询参数验证 Schema
// ============================================================

const querySchema = z.object({
  // 分页参数
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val >= 1, '页码必须大于等于1'),

  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val >= 1 && val <= 100, '每页数量必须在1-100之间'),

  // 搜索参数
  keyword: z
    .string()
    .optional()
    .transform((val) => val?.trim()),

  // 筛选参数
  level: z
    .enum(['VIP', 'GOLD', 'SILVER', 'BRONZE', 'REGULAR'])
    .optional(),

  status: z
    .enum(['ACTIVE', 'INACTIVE', 'POTENTIAL', 'LOST'])
    .optional(),

  industry: z
    .string()
    .optional(),

  // 排序参数
  sortBy: z
    .enum(['createdAt', 'name', 'level', 'status'])
    .optional()
    .default('createdAt'),

  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
})

type QueryParams = z.infer<typeof querySchema>

// ============================================================
// 2. API 处理器
// ============================================================

/**
 * 获取客户列表
 *
 * @description
 * 支持功能：
 * - 分页：page, pageSize
 * - 搜索：keyword（搜索姓名、邮箱、电话、公司）
 * - 筛选：level, status, industry
 * - 排序：sortBy, sortOrder
 *
 * @example
 * ```
 * GET /api/customers?page=1&pageSize=10&keyword=张三&level=VIP
 * ```
 */
export default defineEventHandler(async (event) => {
  try {
    // --------------------------------------------------------
    // 2.1 验证查询参数
    // --------------------------------------------------------
    const queryResult = querySchema.safeParse(getQuery(event))

    if (!queryResult.success) {
      const errors = queryResult.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return createBadRequestResponse(
        event,
        '查询参数错误',
        'VALIDATION_ERROR',
        errors
      )
    }

    const params = queryResult.data

    // --------------------------------------------------------
    // 2.2 构建查询条件
    // --------------------------------------------------------
    const where: any = {}

    // 关键词搜索（姓名、邮箱、电话、公司）
    if (params.keyword) {
      where.OR = [
        { name: { contains: params.keyword, mode: 'insensitive' } },
        { email: { contains: params.keyword, mode: 'insensitive' } },
        { phone: { contains: params.keyword } },
        { company: { contains: params.keyword, mode: 'insensitive' } },
      ]
    }

    // 等级筛选
    if (params.level) {
      where.level = params.level
    }

    // 状态筛选
    if (params.status) {
      where.status = params.status
    }

    // 行业筛选
    if (params.industry) {
      where.industry = params.industry
    }

    // --------------------------------------------------------
    // 2.3 构建排序条件
    // --------------------------------------------------------
    const orderBy: any = {}
    orderBy[params.sortBy] = params.sortOrder

    // --------------------------------------------------------
    // 2.4 执行查询
    // --------------------------------------------------------

    // 获取总数
    const total = await prisma.customer.count({ where })

    // 获取分页数据
    const customers = await prisma.customer.findMany({
      where,
      orderBy,
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        level: true,
        status: true,
        source: true,
        industry: true,
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
    // 2.5 返回响应
    // --------------------------------------------------------
    return createSuccessResponse(
      event,
      customers,
      '获取成功',
      200,
      {
        page: params.page,
        pageSize: params.pageSize,
        total,
        totalPages: Math.ceil(total / params.pageSize),
      }
    )

  } catch (error) {
    console.error('获取客户列表错误:', error)
    return createInternalErrorResponse(
      event,
      '获取客户列表失败',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
})

// ============================================================
// 客户管理 API
// 文件路径: app/api/customers.ts
// 作用: 客户相关的 API 封装
// ============================================================

// ============================================================
// 1. 类型定义
// ============================================================

/**
 * 客户等级
 */
export type CustomerLevel = 'VIP' | 'GOLD' | 'SILVER' | 'BRONZE' | 'REGULAR'

/**
 * 客户状态
 */
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'POTENTIAL' | 'LOST'

/**
 * 客户信息
 */
export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  address: string | null
  level: CustomerLevel
  status: CustomerStatus
  source: string | null
  industry: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  assignedUser?: {
    id: string
    name: string | null
    email: string
  } | null
}

/**
 * 分页信息
 */
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/**
 * 客户列表响应
 */
export interface CustomerListResponse {
  customers: Customer[]
  pagination: Pagination
}

/**
 * 客户列表查询参数
 */
export interface CustomerListParams {
  page?: number
  pageSize?: number
  keyword?: string
  level?: CustomerLevel
  status?: CustomerStatus
  industry?: string
  sortBy?: 'createdAt' | 'name' | 'level' | 'status'
  sortOrder?: 'asc' | 'desc'
}

/**
 * 创建客户请求
 */
export interface CreateCustomerRequest {
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  address?: string | null
  level?: CustomerLevel
  status?: CustomerStatus
  source?: string | null
  industry?: string | null
  notes?: string | null
  assignedTo?: string | null
}

/**
 * 更新客户请求
 */
export type UpdateCustomerRequest = Partial<CreateCustomerRequest>

// ============================================================
// 2. API 函数
// ============================================================

/**
 * 获取客户列表
 *
 * @param params - 查询参数
 * @returns Promise<CustomerListResponse> - 客户列表和分页信息
 *
 * @example
 * ```typescript
 * const { customers, pagination } = await getCustomers({
 *   page: 1,
 *   pageSize: 10,
 *   keyword: '张三',
 *   level: 'VIP'
 * })
 * ```
 */
export async function getCustomers(params: CustomerListParams = {}): Promise<CustomerListResponse> {
  // 构建查询字符串
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.set('page', params.page.toString())
  if (params.pageSize) queryParams.set('pageSize', params.pageSize.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.level) queryParams.set('level', params.level)
  if (params.status) queryParams.set('status', params.status)
  if (params.industry) queryParams.set('industry', params.industry)
  if (params.sortBy) queryParams.set('sortBy', params.sortBy)
  if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder)

  const queryString = queryParams.toString()
  const url = `/api/customers${queryString ? `?${queryString}` : ''}`

  const response = await $fetch<{
    success: boolean
    data: Customer[]
    pagination: Pagination
    message: string
  }>(url, {
    method: 'GET',
  })

  if (!response.success) {
    throw new Error(response.message)
  }

  return {
    customers: response.data,
    pagination: response.pagination,
  }
}

/**
 * 获取客户详情
 *
 * @param id - 客户ID
 * @returns Promise<Customer> - 客户详细信息
 *
 * @example
 * ```typescript
 * const customer = await getCustomer('550e8400-e29b-41d4-a716-446655440000')
 * ```
 */
export async function getCustomer(id: string): Promise<Customer> {
  const response = await $fetch<{
    success: boolean
    data: Customer
    message: string
  }>(`/api/customers/${id}`, {
    method: 'GET',
  })

  if (!response.success) {
    throw new Error(response.message)
  }

  return response.data
}

/**
 * 创建客户
 *
 * @param data - 客户数据
 * @returns Promise<Customer> - 创建的客户
 *
 * @example
 * ```typescript
 * const customer = await createCustomer({
 *   name: '张三',
 *   email: 'zhangsan@example.com',
 *   phone: '13800138000',
 *   company: 'ABC公司',
 *   level: 'VIP'
 * })
 * ```
 */
export async function createCustomer(data: CreateCustomerRequest): Promise<Customer> {
  const response = await $fetch<{
    success: boolean
    data: Customer
    message: string
  }>('/api/customers', {
    method: 'POST',
    body: data,
  })

  if (!response.success) {
    throw new Error(response.message)
  }

  return response.data
}

/**
 * 更新客户
 *
 * @param id - 客户ID
 * @param data - 更新数据
 * @returns Promise<Customer> - 更新后的客户
 *
 * @example
 * ```typescript
 * const customer = await updateCustomer('550e8400...', {
 *   name: '张三（已修改）',
 *   level: 'GOLD'
 * })
 * ```
 */
export async function updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer> {
  const response = await $fetch<{
    success: boolean
    data: Customer
    message: string
  }>(`/api/customers/${id}`, {
    method: 'PUT',
    body: data,
  })

  if (!response.success) {
    throw new Error(response.message)
  }

  return response.data
}

/**
 * 删除客户
 *
 * @param id - 客户ID
 * @returns Promise<void>
 *
 * @example
 * ```typescript
 * await deleteCustomer('550e8400-e29b-41d4-a716-446655440000')
 * ```
 */
export async function deleteCustomer(id: string): Promise<void> {
  const response = await $fetch<{
    success: boolean
    message: string
  }>(`/api/customers/${id}`, {
    method: 'DELETE',
  })

  if (!response.success) {
    throw new Error(response.message)
  }
}

// ============================================================
// 3. 辅助函数
// ============================================================

/**
 * 客户等级选项
 */
export const customerLevelOptions = [
  { label: 'VIP', value: 'VIP', color: 'purple' },
  { label: '金牌', value: 'GOLD', color: 'yellow' },
  { label: '银牌', value: 'SILVER', color: 'gray' },
  { label: '铜牌', value: 'BRONZE', color: 'orange' },
  { label: '普通', value: 'REGULAR', color: 'blue' },
]

/**
 * 客户状态选项
 */
export const customerStatusOptions = [
  { label: '活跃', value: 'ACTIVE', color: 'green' },
  { label: 'Inactive', value: 'INACTIVE', color: 'gray' },
  { label: '潜在客户', value: 'POTENTIAL', color: 'blue' },
  { label: '流失', value: 'LOST', color: 'red' },
]

/**
 * 获取等级标签
 */
export function getLevelLabel(level: CustomerLevel): string {
  return customerLevelOptions.find((o) => o.value === level)?.label || level
}

/**
 * 获取状态标签
 */
export function getStatusLabel(status: CustomerStatus): string {
  return customerStatusOptions.find((o) => o.value === status)?.label || status
}

/**
 * 获取等级颜色
 */
export function getLevelColor(level: CustomerLevel): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' {
  const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'> = {
    purple: 'secondary',
    yellow: 'warning',
    gray: 'neutral',
    orange: 'warning',
    blue: 'info',
    green: 'success',
    red: 'error',
  }
  const color = customerLevelOptions.find((o) => o.value === level)?.color || 'gray'
  return colorMap[color] || 'neutral'
}

/**
 * 获取状态颜色
 */
export function getStatusColor(status: CustomerStatus): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' {
  const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'> = {
    green: 'success',
    gray: 'neutral',
    blue: 'info',
    red: 'error',
  }
  const color = customerStatusOptions.find((o) => o.value === status)?.color || 'gray'
  return colorMap[color] || 'neutral'
}

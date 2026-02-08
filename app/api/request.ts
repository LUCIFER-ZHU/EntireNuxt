/**
 * 统一请求工具
 * 封装 $customFetch 和 $customUseFetch，供所有 API 文件使用
 */

export interface ApiResponse<T> {
  success: boolean
  code: number
  message: string
  total: number
  data: T
  rows: T
}

/**
 * 获取自定义 fetch 实例（用于客户端命令式调用）
 * 使用方式：const response = await useCustomFetch('/api/xxx', { method: 'POST' })
 */
export const useCustomFetch = <T>(url: string, options: any = {}) => {
  const { $customFetch } = useNuxtApp()
  return $customFetch<T>(url, options)
}

/**
 * 获取自定义 useFetch 实例（用于 SSR 和响应式数据）
 * 使用方式：const { data, pending, error } = useCustomUseFetch('/api/xxx', { method: 'GET' })
 */
export const useCustomUseFetch = <T>(url: string, options: any = {}) => {
  const { $customUseFetch } = useNuxtApp()
  return $customUseFetch<T>(url, options)
}


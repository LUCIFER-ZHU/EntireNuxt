/**
 * 首页相关 API
 * 统一管理所有首页接口调用
 */

import { useCustomUseFetch, type ApiResponse, useCustomFetch } from './request'

/**
 * 产品类型表
 */
export interface ProductType {
  children?: ProductType[]
  createBy?: string
  createTime?: string
  description?: string
  id: number
  image?: string
  isLeaf?: number
  level?: number
  name?: string
  parentId?: number
  sort?: number
  status?: number
  updateBy?: string
  updateTime?: string
  [property: string]: any
}

/**
 * 国家信息表
 */
export interface CountryInfo {
  /**
   * 国家英文简写
   */
  isoCode?: string
  /**
   * 数量
   */
  num?: number
  /**
   * 国家国旗URL
   */
  icon?: string
  /**
   * 主键ID
   */
  id: number
  [property: string]: any
}

/**
 * 获取产品类型列表（SSR）
 * @returns useFetch 返回值，包含 data, pending, error
 */
export const getProductTypeList = () => {
  return useCustomUseFetch<ApiResponse<ProductType[]>>('/web/homePage/productTypeList', {
    method: 'GET'
  })
}

/**
 * 获取产品类型列表（Promise）
 * @returns Promise
 */
export const fetchProductTypeList = () => {
  return useCustomFetch<ApiResponse<ProductType[]>>('/web/homePage/productTypeList', {
    method: 'GET'
  })
}

/**
 * 获取产品类型树（SSR）
 * @returns useFetch 返回值，包含 data, pending, error
 */
export const getProductTypeTree = () => {
  return useCustomUseFetch<ApiResponse<ProductType[]>>('/web/productPage/tree', {
    method: 'GET'
  })
}


/**
 * 获取国家信息列表（Promise）
 * @returns Promise
 */
export const fetchCountryInfoList = () => {
  return useCustomFetch<ApiResponse<CountryInfo[]>>('/web/homePage/countryInfoList', {
    method: 'GET'
  })
}


/**
 * 个人中心相关 API
 */

import { useCustomFetch } from './request'

/**
 * 获取客户信息
 * @param customerId 客户ID
 */
export const fetchCustomerInfo = (customerId: string | number) => {
  return useCustomFetch(`/web/customer/${customerId}`, {
    method: 'GET'
  })
}


export const updateCustomerInfo = (data: any) => {
  return useCustomFetch('/web/customer', {
    method: 'POST',
    body: data
  })
}

/**
 * 获取收藏列表
 * @param customerId 客户ID
 */
export const fetchCollectionList = (customerId: string | number) => {
  return useCustomFetch('/web/personal/collectionList', {
    method: 'GET',
    params: { customerId }
  })
}

/**
 * 取消收藏
 * @param ids 收藏ID数组
 */
export const cancelCollection = (ids: number[]) => {
  return useCustomFetch('/web/personal/cancelCollection', {
    method: 'POST',
    params: { ids }
  })
}

/**
 * 获取浏览记录
 */
export const fetchBrowseHistory = (customerId: string | number) => {
  return useCustomFetch('/web/personal/browseHistory', {
    method: 'GET',
    params: { customerId }
  })
}

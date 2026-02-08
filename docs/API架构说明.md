# API 架构说明

## 📋 概述

本项目采用分层架构设计，将 API 调用层与视图层分离，提供更好的代码组织和可维护性。

## 🏗️ 架构设计

```
app/
├── api/                    # API 层 - 统一管理所有接口调用
│   └── auth.ts            # 认证相关接口
├── pages/                  # 页面层 - UI 和交互逻辑
│   └── account/
│       ├── login.vue
│       ├── register.vue
│       └── reset.vue
├── stores/                 # 状态层 - 全局状态管理
│   └── auth.ts
└── plugins/                # 插件层 - 全局配置
    └── fetch-interceptor.client.ts
```

## 📁 API 层（app/api/）

### 设计原则

1. **单一职责**：每个文件负责一个功能模块的 API
2. **类型安全**：所有接口都定义 TypeScript 类型
3. **统一封装**：使用 `$customFetch` 统一处理请求
4. **易于测试**：纯函数设计，方便单元测试

### 文件结构

#### `app/api/auth.ts` - 认证模块

```typescript
/**
 * 认证相关 API
 */

// 接口类型定义
export interface LoginRequest { ... }
export interface RegisterRequest { ... }
export interface ResetPasswordRequest { ... }

// API 函数
export const login = (data: LoginRequest) => { ... }
export const register = (data: RegisterRequest) => { ... }
export const sendRegisterCode = (email: string) => { ... }
export const sendResetCode = (email: string) => { ... }
export const resetPassword = (data: ResetPasswordRequest) => { ... }
```

### 使用示例

```vue
<script setup lang="ts">
// 1. 导入需要的 API 函数和类型
import { login, type LoginRequest } from '~/api/auth'

// 2. 调用 API
const handleLogin = async () => {
  const data: LoginRequest = {
    email: 'user@example.com',
    password: 'password123'
  }
  
  try {
    const response = await login(data)
    // 处理响应
  } catch (error) {
    // 处理错误
  }
}
</script>
```

## 🔄 路由管理

### Nuxt 3 原生路由

项目使用 Nuxt 3 的内置路由系统，**不依赖** `vue-router`。

#### 页面跳转

```typescript
// ✅ 正确：使用 navigateTo
await navigateTo('/account/login')

// ✅ 带查询参数
await navigateTo('/products?id=123')

// ✅ 编程式导航
await navigateTo({
  path: '/search',
  query: { q: 'keyword' }
})

// ❌ 错误：不要使用 router.push（vue-router）
// import { useRouter } from 'vue-router'
// const router = useRouter()
// router.push('/account/login')
```

#### navigateTo 的优势

1. **SSR 友好**：在服务端和客户端都能正常工作
2. **自动预加载**：智能预加载目标页面资源
3. **类型安全**：完整的 TypeScript 支持
4. **性能优化**：针对 Nuxt 应用优化

### 路由中间件

在 `app/middleware/` 目录下创建中间件：

```typescript
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.isLoggedIn) {
    return navigateTo('/account/login')
  }
})
```

在页面中使用：

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>
```

## 🔌 插件层

### fetch-interceptor.client.ts

统一配置所有 HTTP 请求：

- 自动添加 `baseURL`
- 请求拦截（添加时间戳、token 等）
- 响应拦截（统一错误处理）

#### 建议增强

1. **自动添加 Token**

```typescript
onRequest({ request, options }) {
  const authStore = useAuthStore()
  
  if (authStore.token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${authStore.token}`
    }
  }
}
```

2. **401 自动登出**

```typescript
onResponseError({ response }) {
  if (response?.status === 401) {
    const authStore = useAuthStore()
    authStore.clearAuth()
    navigateTo('/account/login')
  }
}
```

## 📊 状态管理

### Pinia Store

```typescript
// app/stores/auth.ts
export const useAuthStore = defineStore('auth', {
  state: () => ({ ... }),
  getters: { ... },
  actions: { ... },
  persist: {
    storage: localStorage  // 持久化到本地存储
  }
})
```

### 在组件中使用

```vue
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// 获取状态
const user = authStore.getUser
const isLoggedIn = authStore.isLoggedIn

// 调用 action
await authStore.logout()
</script>
```

## 🎯 最佳实践

### 1. API 函数命名规范

- 使用动词开头：`get`, `create`, `update`, `delete`, `send`
- 语义化命名：`getUserProfile`, `updateUserInfo`
- 保持一致性：同类操作使用相同动词

### 2. 类型定义

```typescript
// ✅ 好的做法：定义完整的类型
export interface CreateOrderRequest {
  productId: number
  quantity: number
  shippingAddress: string
}

export interface CreateOrderResponse {
  orderId: string
  status: 'pending' | 'confirmed'
  totalAmount: number
}

export const createOrder = (data: CreateOrderRequest) => {
  const { $customFetch } = useNuxtApp()
  return $customFetch<CreateOrderResponse>('/api/orders', {
    method: 'POST',
    body: data
  })
}
```

### 3. 错误处理

```typescript
// 在组件中统一处理错误
const toast = useToast()

try {
  await someApiCall()
  toast.add({
    title: 'Success',
    description: 'Operation completed',
    color: 'success'
  })
} catch (error: any) {
  toast.add({
    title: 'Error',
    description: error?.data?.message || 'An error occurred',
    color: 'error'
  })
}
```

### 4. 加载状态

```vue
<script setup lang="ts">
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    await someApiCall()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UButton :loading="loading" @click="handleSubmit">
    Submit
  </UButton>
</template>
```

## 📦 扩展 API 模块

### 创建新模块

例如创建产品模块 `app/api/product.ts`：

```typescript
/**
 * 产品相关 API
 */

/**
 * 统一获取 $customFetch
 * 避免在每个函数中重复获取
 */
const useApi = () => {
  const { $customFetch } = useNuxtApp()
  return $customFetch
}

export interface Product {
  id: number
  name: string
  price: number
  description: string
}

export interface ProductListParams {
  page?: number
  limit?: number
  category?: string
}

// 获取产品列表
export const getProducts = (params?: ProductListParams) => {
  return useApi()<Product[]>('/api/products', {
    method: 'GET',
    query: params
  })
}

// 获取单个产品
export const getProductById = (id: number) => {
  return useApi()<Product>(`/api/products/${id}`, {
    method: 'GET'
  })
}

// 创建产品
export const createProduct = (data: Omit<Product, 'id'>) => {
  return useApi()<Product>('/api/products', {
    method: 'POST',
    body: data
  })
}

// 更新产品
export const updateProduct = (id: number, data: Partial<Product>) => {
  return useApi()<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: data
  })
}

// 删除产品
export const deleteProduct = (id: number) => {
  return useApi()(`/api/products/${id}`, {
    method: 'DELETE'
  })
}
```

### 在页面中使用

```vue
<script setup lang="ts">
import { getProducts, type Product } from '~/api/product'

const products = ref<Product[]>([])
const loading = ref(false)

const fetchProducts = async () => {
  loading.value = true
  try {
    products.value = await getProducts({ limit: 10 })
  } catch (error) {
    console.error('Failed to fetch products', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="product in products" :key="product.id">
        {{ product.name }}
      </div>
    </div>
  </div>
</template>
```

## 🔍 调试技巧

### 1. 查看网络请求

所有请求都会经过 `fetch-interceptor`，可以在拦截器中添加日志：

```typescript
onRequest({ request, options }) {
  console.log('API Request:', {
    url: request,
    method: options.method,
    body: options.body
  })
}

onResponse({ response }) {
  console.log('API Response:', {
    status: response.status,
    data: response._data
  })
}
```

### 2. 使用 Vue DevTools

安装 Vue DevTools 查看：
- Pinia store 状态
- 组件层级和数据
- 路由信息

### 3. TypeScript 类型检查

```bash
# 运行类型检查
npx nuxi typecheck
```

## 📚 相关文档

- [认证系统使用指南](./认证系统使用指南.md)
- [Nuxt 3 路由文档](https://nuxt.com/docs/getting-started/routing)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Nuxt UI 组件库](https://ui.nuxt.com/)

## ✅ 架构优势总结

1. **关注点分离**：API 层、页面层、状态层各司其职
2. **类型安全**：完整的 TypeScript 支持
3. **易于维护**：统一的代码结构和命名规范
4. **可测试性**：纯函数设计，方便单元测试
5. **SSR 友好**：使用 Nuxt 原生功能，完美支持 SSR
6. **性能优化**：智能预加载和代码分割
7. **开发体验**：清晰的代码组织，良好的开发体验


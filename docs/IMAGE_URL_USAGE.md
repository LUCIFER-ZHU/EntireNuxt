# 图片 URL 使用指南

## 概述

项目中有两种类型的图片资源：
1. **前端静态资源**：存放在前端 OSS 路径（`NUXT_PUBLIC_IMAGE_BASE`）
2. **后端返回的图片**：存放在后端 OSS 路径（`NUXT_BACKEND_IMAGE_BASE`）

为了方便管理，我们提供了 `useImageUrl` 组合式函数来统一处理图片 URL 构建。

## 环境变量配置

### `.env.development` / `.env.production`

```env
# 前端静态资源图片基地址
NUXT_PUBLIC_IMAGE_BASE=https://minnuo-test.oss-cn-qingdao.aliyuncs.com/reNew

# 后端返回的图片基地址
NUXT_BACKEND_IMAGE_BASE=https://minnuo-test.oss-cn-qingdao.aliyuncs.com/
```

## API 说明

### `buildImageUrl(path: string)`

用于构建**前端静态资源**的图片 URL。

**使用场景：**
- 前端代码中硬编码的图片路径
- 静态页面资源
- Logo、图标等固定资源

**示例：**
```typescript
const { buildImageUrl } = useImageUrl()

// 输入: 'image/logo.webp'
// 输出: 'https://minnuo-test.oss-cn-qingdao.aliyuncs.com/reNew/image/logo.webp'
const logoUrl = buildImageUrl('image/logo.webp')

// 如果已经是完整URL，直接返回
const fullUrl = buildImageUrl('https://example.com/image.jpg')
// 输出: 'https://example.com/image.jpg'
```

### `buildBackendImageUrl(path: string | null | undefined)`

用于构建**后端返回的图片路径**的完整 URL。

**使用场景：**
- 后端 API 返回的图片路径
- 用户上传的图片
- 产品图片、机器类型图片等动态内容

**特点：**
- 自动处理空值（返回默认图片）
- 自动处理完整 URL
- 自动处理路径斜杠

**示例：**
```typescript
const { buildBackendImageUrl } = useImageUrl()

// 后端返回相对路径
// 输入: 'uploads/machine/abc123.jpg'
// 输出: 'https://minnuo-test.oss-cn-qingdao.aliyuncs.com/uploads/machine/abc123.jpg'
const imageUrl = buildBackendImageUrl('uploads/machine/abc123.jpg')

// 后端返回空值，使用默认图片
// 输入: null 或 undefined
// 输出: 'https://minnuo-test.oss-cn-qingdao.aliyuncs.com/reNew/image/img1.webp'
const defaultUrl = buildBackendImageUrl(null)

// 后端返回完整URL，直接返回
const fullUrl = buildBackendImageUrl('https://cdn.example.com/image.jpg')
// 输出: 'https://cdn.example.com/image.jpg'
```

### 其他 API

```typescript
const { 
  getImageBase,          // 获取前端图片基地址
  getBackendImageBase,   // 获取后端图片基地址
  imageBase,            // 前端图片基地址（响应式）
  backendImageBase      // 后端图片基地址（响应式）
} = useImageUrl()
```

## 实际使用示例

### 示例 1: 前端静态资源

```vue
<template>
  <div>
    <NuxtImg :src="buildImageUrl('image/banner.webp')" alt="Banner" />
  </div>
</template>

<script setup lang="ts">
const { buildImageUrl } = useImageUrl()
</script>
```

### 示例 2: 后端返回的图片列表

```vue
<template>
  <div>
    <div v-for="item in products" :key="item.id">
      <NuxtImg :src="item.imageUrl" :alt="item.name" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '~/types'

const { buildBackendImageUrl } = useImageUrl()

// 假设从 API 获取的数据
const { data: productsData } = await useFetch('/api/products')

// 映射数据，构建完整的图片 URL
const products = computed(() => {
  return productsData.value?.data?.map((item: Product) => ({
    id: item.id,
    name: item.name,
    imageUrl: buildBackendImageUrl(item.image) // 关键：使用 buildBackendImageUrl
  })) || []
})
</script>
```

### 示例 3: IndexNoAuth.vue 中的实际应用

```vue
<template>
  <div class="types-container">
    <div v-for="item in machineTypes" :key="item.id" class="types-item">
      <NuxtImg :src="item.imgSrc" :alt="item.name" class="types-item-img" />
      <div class="types-item-title">{{ item.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getProductTypeList, type ProductType } from '~/api/home'

// 使用图片URL构建工具
const { buildBackendImageUrl } = useImageUrl()

// 获取产品类型数据
const { data: productTypeResponse } = getProductTypeList()

// 映射数据
const machineTypes = computed(() => {
  return productTypeResponse.value?.data
    ?.filter((item: ProductType) => item.id && item.name)
    .map((item: ProductType) => ({
      id: item.id!,
      name: item.name!,
      // 使用 buildBackendImageUrl 构建后端图片URL
      imgSrc: buildBackendImageUrl(item.image)
    })) || []
})
</script>
```

## 最佳实践

### ✅ 正确做法

```typescript
// 1. 后端返回的图片，使用 buildBackendImageUrl
const imageUrl = buildBackendImageUrl(backendData.image)

// 2. 前端静态资源，使用 buildImageUrl
const logoUrl = buildImageUrl('image/logo.webp')

// 3. 在 computed 中统一处理
const items = computed(() => {
  return data.value?.map(item => ({
    ...item,
    imageUrl: buildBackendImageUrl(item.image)
  }))
})
```

### ❌ 错误做法

```typescript
// ❌ 不要手动拼接URL
const imageUrl = 'https://minnuo-test.oss-cn-qingdao.aliyuncs.com/' + item.image

// ❌ 不要混用两种基地址
const imageUrl = buildImageUrl(item.image) // item.image 是后端返回的

// ❌ 不要在模板中拼接
<NuxtImg :src="`${imageBase}/${item.image}`" />
```

## 故障排查

### 问题：图片显示 404

**检查步骤：**

1. **确认使用了正确的方法**
   - 后端图片 → `buildBackendImageUrl()`
   - 前端图片 → `buildImageUrl()`

2. **检查环境变量**
   ```bash
   # 查看当前配置
   console.log('imageBase:', config.public.imageBase)
   console.log('backendImageBase:', config.public.backendImageBase)
   ```

3. **检查后端返回的数据**
   ```typescript
   console.log('原始图片路径:', item.image)
   console.log('构建后的URL:', buildBackendImageUrl(item.image))
   ```

4. **验证 URL 格式**
   - 确保基地址配置正确
   - 确保没有多余的斜杠（已自动处理）
   - 确认路径大小写正确

### 问题：图片路径重复

如果看到类似 `https://...reNew/https://...` 的URL，说明：
- 后端返回的已经是完整URL，但错误地使用了 `buildImageUrl()`
- 应该使用 `buildBackendImageUrl()`，它会自动检测完整URL

## 总结

| 场景 | 使用方法 | 基地址环境变量 |
|------|----------|----------------|
| 前端静态资源 | `buildImageUrl()` | `NUXT_PUBLIC_IMAGE_BASE` |
| 后端返回的图片 | `buildBackendImageUrl()` | `NUXT_BACKEND_IMAGE_BASE` |

记住：**后端的图用 `buildBackendImageUrl`，前端的图用 `buildImageUrl`**！


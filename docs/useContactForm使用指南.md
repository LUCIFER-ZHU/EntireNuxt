# useContactForm 组合函数使用指南

## 概述

`useContactForm` 是一个用于处理产品询盘表单的 Vue 3 组合函数，提供完整的表单状态管理、验证、提交和重置功能。该组合函数可以在多个页面中复用，确保表单逻辑的一致性。

## 功能特性

- ✅ **表单状态管理** - 响应式数据绑定
- ✅ **表单验证** - 内置验证规则和英文错误提示
- ✅ **异步提交** - 使用 customFetch 进行 API 调用
- ✅ **数据结构优化** - 技术参数封装为 JSON 格式
- ✅ **防重复提交** - 提交状态锁定
- ✅ **Toast 通知** - 用户友好的成功/错误提示
- ✅ **Analytics 集成** - 可选的 Google Analytics 事件追踪
- ✅ **灵活验证** - 只有姓名和邮箱必填，其他字段可选

## 基本使用

### 1. 导入和初始化

```vue
<script setup lang="ts">
// 使用联系表单组合函数
const { 
  contactForm,       // 响应式表单数据
  isSubmitting,      // 提交状态
  onContactSubmit,   // 提交处理函数
  resetForm,         // 重置表单
  updateField,       // 更新单个字段
  hasFieldError,     // 检查字段错误
  getFieldError      // 获取错误信息
} = useContactForm()
</script>
```

### 2. 表单绑定

```vue
<template>
  <UForm :state="contactForm" @submit="onContactSubmit">
    <!-- 基本信息字段 -->
    <UFormField name="name" :error="getFieldError('name')">
      <UInput 
        v-model="contactForm.name" 
        placeholder="姓名 *" 
        :class="{ 'error': hasFieldError('name') }"
      />
    </UFormField>
    
    <UFormField name="email" :error="getFieldError('email')">
      <UInput 
        v-model="contactForm.email" 
        placeholder="邮箱 *" 
        type="email"
      />
    </UFormField>
    
    <!-- 技术参数字段 -->
    <UFormField name="coolingCapacity" label="冷却容量 (KW)">
      <UInput 
        v-model.number="contactForm.coolingCapacity" 
        type="number" 
        :min="3" 
        :max="10000"
      />
    </UFormField>
    
    <!-- 选择字段示例 -->
    <div class="button-group">
      <UButton 
        :color="contactForm.coolingMethod === 'air' ? 'primary' : 'neutral'"
        @click="updateField('coolingMethod', 'air')"
      >
        风冷
      </UButton>
      <UButton 
        :color="contactForm.coolingMethod === 'water' ? 'primary' : 'neutral'"
        @click="updateField('coolingMethod', 'water')"
      >
        水冷
      </UButton>
    </div>
    
    <!-- 提交按钮 -->
    <UButton 
      type="submit" 
      :loading="isSubmitting"
      :disabled="isSubmitting"
    >
      {{ isSubmitting ? '提交中...' : '提交询盘' }}
    </UButton>
  </UForm>
</template>
```

## 表单数据结构

```typescript
interface ContactFormData {
  name: string                              // 客户姓名（必填）
  email: string                             // 邮箱地址（必填）
  whatsapp: string                          // WhatsApp号码（可选）
  message: string                           // 留言内容（可选）
  coolingCapacity: number                   // 冷却容量 KW（默认1250，可选）
  waterTempRange: string                    // 水温范围（可选）
  coolingMethod: 'air' | 'water'           // 冷却方式（默认air，可选）
  powerSupply: '220V' | '380V' | '440V'    // 电源规格（默认220V，可选）
}
```

### 数据提交格式说明

提交时，数据会被重新组织：
- `name`, `email`, `whatsapp`, `message` 直接作为字段提交
- `coolingCapacity`, `waterTempRange`, `coolingMethod`, `powerSupply` 会被封装到 `otherFields` 字段中作为 JSON 字符串
- `source` 字段使用当前页面的 URL 地址

## API 配置

### 主要 API 端点

组合函数使用以下 API 端点：

```typescript
// 提交端点（使用 customFetch）
POST /api/contact-inquiry
```

### 请求数据格式

```typescript
{
  name: "John Doe",
  email: "john@example.com",
  whatsapp: "+86 138****1234",
  message: "Need industrial cooling equipment",
  otherFields: "{\"coolingCapacity\":1250,\"waterTempRange\":\"15-25°C\",\"coolingMethod\":\"air\",\"powerSupply\":\"380V\"}",
  // 自动添加的元数据
  submittedAt: "2024-12-21T10:30:00.000Z",
  source: "https://yoursite.com/current-page",  // 当前网页URL
  userAgent: "Mozilla/5.0...",
  timestamp: 1703158200000
}
```

### 响应数据格式

```typescript
// 成功响应
{
  success: true,
  message: "Inquiry submitted successfully! We will contact you within 24 hours.",
  data: {
    inquiryId: "INQ-1703158200000",
    submittedAt: "2024-12-21T10:30:00.000Z"
  }
}

// 失败响应
{
  success: false,
  message: "Submission failed, please try again later."
}
```

## 高级功能

### 1. 自定义验证

```typescript
// 可以扩展验证规则
const customValidation = () => {
  const errors = {}
  
  // 自定义业务逻辑验证
  if (contactForm.value.coolingCapacity > 5000 && !contactForm.value.whatsapp) {
    errors.whatsapp = '大型设备询盘需要提供联系电话'
  }
  
  return errors
}
```

### 2. 分步骤表单

```vue
<script setup lang="ts">
const currentStep = ref(1)
const { contactForm, updateField } = useContactForm()

const nextStep = () => {
  // 验证当前步骤
  if (validateCurrentStep()) {
    currentStep.value++
  }
}
</script>
```

### 3. 数据预填充

```vue
<script setup lang="ts">
const { contactForm, updateField } = useContactForm()

// 从 URL 参数预填充
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('capacity')) {
    updateField('coolingCapacity', Number(urlParams.get('capacity')))
  }
})
</script>
```

## 错误处理

### 验证错误

```vue
<template>
  <!-- 显示字段级错误 -->
  <UFormField name="email" :error="getFieldError('email')">
    <UInput v-model="contactForm.email" />
  </UFormField>
  
  <!-- 显示所有错误 -->
  <div v-if="Object.keys(validationErrors).length > 0" class="error-summary">
    <h4>请修正以下错误：</h4>
    <ul>
      <li v-for="error in Object.values(validationErrors)" :key="error">
        {{ error }}
      </li>
    </ul>
  </div>
</template>
```

### 提交错误

组合函数自动处理以下错误类型：
- 网络超时
- 服务器错误 (5xx)
- 数据格式错误 (422)
- 其他未知错误

## 部署注意事项

1. **API 端点配置**：确保后端提供 `/api/contact-inquiry` 端点
2. **customFetch 插件**：确保项目中已配置 customFetch 插件
3. **Toast 插件**：确保项目中已安装并配置 Toast 通知插件
4. **Analytics**：如需事件追踪，配置 Google Analytics
5. **数据处理**：后端需要处理 `otherFields` JSON 字符串格式的技术参数

## 示例页面

参考 `app/components/ContactFormExample.vue` 查看完整的使用示例。

## 支持的 UI 组件库

- ✅ Nuxt UI (推荐)
- ✅ Element Plus
- ✅ Ant Design Vue
- ✅ 其他支持 v-model 的 Vue 3 组件库

## 性能优化建议

1. **懒加载**：大型表单考虑分步骤懒加载
2. **防抖**：对输入字段添加防抖验证
3. **缓存**：利用浏览器本地存储保存草稿
4. **压缩**：生产环境启用 gzip 压缩

## 常见问题

**Q: 如何自定义验证规则？**
A: 可以扩展 `validateForm` 函数或创建自定义验证函数。

**Q: 为什么只有姓名和邮箱是必填？**
A: 根据业务需求，只有这两个字段是获取客户信息的最基本要求，其他技术参数为可选。

**Q: otherFields 包含哪些数据？**
A: otherFields 包含冷却容量、水温范围、冷却方式、电源规格等技术参数，以 JSON 字符串格式提交。

**Q: 如何集成第三方服务？**
A: 修改 `submitToAPI` 函数，调用相应的第三方 API，确保使用 customFetch。

**Q: 错误信息可以改为中文吗？**
A: 可以，修改 `validateForm` 函数中的错误信息即可。当前版本使用英文以保持国际化。

---

*更新日期：2024-12-21*  
*版本：1.0.0*

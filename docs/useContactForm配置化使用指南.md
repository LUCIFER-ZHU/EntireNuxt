# useContactForm 配置化使用指南

## 🎯 新设计理念

现在 `useContactForm` 支持配置化使用，可以根据不同页面的需求启用不同的额外数据字段。

## 📋 基础使用（无额外数据）

```vue
<template>
  <UForm :state="contactForm" @submit="onContactSubmit">
    <UFormField name="name" :error="getFieldError('name')">
      <UInput v-model="contactForm.name" placeholder="Name" />
    </UFormField>
    
    <UFormField name="email" :error="getFieldError('email')">
      <UInput v-model="contactForm.email" placeholder="Email" type="email" />
    </UFormField>
    
    <UFormField name="whatsapp" :error="getFieldError('whatsapp')">
      <UInput v-model="contactForm.whatsapp" placeholder="WhatsApp" />
    </UFormField>
    
    <UFormField name="message" :error="getFieldError('message')">
      <UTextarea v-model="contactForm.message" placeholder="Message" />
    </UFormField>
    
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>

<script setup lang="ts">
// 基础使用 - 只有基础字段
const { 
  contactForm, 
  onContactSubmit,
  getFieldError 
} = useContactForm()
</script>
```

## 🔧 启用冷却系统数据

```vue
<template>
  <UForm :state="contactForm" @submit="onContactSubmit">
    <!-- 基础字段 -->
    <UFormField name="name" :error="getFieldError('name')">
      <UInput v-model="contactForm.name" placeholder="Name" />
    </UFormField>
    
    <UFormField name="email" :error="getFieldError('email')">
      <UInput v-model="contactForm.email" placeholder="Email" type="email" />
    </UFormField>
    
    <!-- 冷却系统字段 -->
    <div v-if="config.hasCoolingData" class="cooling-section">
      <h3>Cooling System Requirements</h3>
      
      <UFormField name="coolingCapacity" label="Cooling Capacity (KW)">
        <UInputNumber v-model="contactForm.coolingCapacity" :min="3" :max="10000" />
      </UFormField>
      
      <UFormField name="waterTempRange" label="Water Temperature Range">
        <UInput v-model="contactForm.waterTempRange" placeholder="e.g., 15-25°C" />
      </UFormField>
      
      <UFormField name="coolingMethod" label="Cooling Method">
        <div class="button-group">
          <UButton 
            :color="contactForm.coolingMethod === 'air' ? 'primary' : 'neutral'"
            @click="updateField('coolingMethod', 'air')"
          >
            Air-cooled
          </UButton>
          <UButton 
            :color="contactForm.coolingMethod === 'water' ? 'primary' : 'neutral'"
            @click="updateField('coolingMethod', 'water')"
          >
            Water-cooled
          </UButton>
        </div>
      </UFormField>
      
      <UFormField name="powerSupply" label="Power Supply">
        <div class="button-group">
          <UButton 
            :color="contactForm.powerSupply === '220V' ? 'primary' : 'neutral'"
            @click="updateField('powerSupply', '220V')"
          >
            220V
          </UButton>
          <UButton 
            :color="contactForm.powerSupply === '380V' ? 'primary' : 'neutral'"
            @click="updateField('powerSupply', '380V')"
          >
            380V
          </UButton>
          <UButton 
            :color="contactForm.powerSupply === '440V' ? 'primary' : 'neutral'"
            @click="updateField('powerSupply', '440V')"
          >
            440V
          </UButton>
        </div>
      </UFormField>
    </div>
    
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>

<script setup lang="ts">
// 启用冷却系统数据
const { 
  contactForm, 
  config,
  onContactSubmit,
  updateField,
  getFieldError 
} = useContactForm({
  extraData: ['cooling']
})
</script>
```

## 🏭 启用机械环境数据

```vue
<template>
  <UForm :state="contactForm" @submit="onContactSubmit">
    <!-- 基础字段 -->
    <UFormField name="name" :error="getFieldError('name')">
      <UInput v-model="contactForm.name" placeholder="Name" />
    </UFormField>
    
    <UFormField name="email" :error="getFieldError('email')">
      <UInput v-model="contactForm.email" placeholder="Email" type="email" />
    </UFormField>
    
    <!-- 机械环境字段 -->
    <div v-if="config.hasMachineryData" class="machinery-section">
      <h3>Machinery Environment</h3>
      
      <UFormField name="machineType" label="Machine Type">
        <UInput v-model="contactForm.machineType" placeholder="e.g., Injection Molding" />
      </UFormField>
      
      <UFormField name="operatingHours" label="Operating Hours per Day">
        <UInputNumber v-model="contactForm.operatingHours" :min="1" :max="24" />
      </UFormField>
      
      <UFormField name="ambientTemperature" label="Ambient Temperature (°C)">
        <UInputNumber v-model="contactForm.ambientTemperature" :min="-10" :max="50" />
      </UFormField>
      
      <UFormField name="humidity" label="Humidity (%)">
        <UInputNumber v-model="contactForm.humidity" :min="0" :max="100" />
      </UFormField>
    </div>
    
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>

<script setup lang="ts">
// 启用机械环境数据
const { 
  contactForm, 
  config,
  onContactSubmit,
  getFieldError 
} = useContactForm({
  extraData: ['machinery']
})
</script>
```

## 🔀 组合使用多种额外数据

```vue
<script setup lang="ts">
// 同时启用冷却系统和机械环境数据
const { 
  contactForm, 
  config,
  onContactSubmit,
  updateField,
  getFieldError 
} = useContactForm({
  extraData: ['cooling', 'machinery']
})
</script>
```

## 🎨 自定义字段

```vue
<script setup lang="ts">
// 启用冷却系统 + 自定义字段
const { 
  contactForm, 
  config,
  onContactSubmit,
  updateField,
  getFieldError 
} = useContactForm({
  extraData: ['cooling'],
  customFields: {
    projectName: '',
    budget: 0,
    deliveryDate: '',
    specialRequirements: ''
  }
})
</script>
```

## 📊 配置信息

组合函数现在返回 `config` 对象，包含：

```typescript
{
  config: {
    extraData: ['cooling', 'machinery'],        // 启用的额外数据类型
    hasCoolingData: true,                       // 是否有冷却系统数据
    hasMachineryData: true                      // 是否有机械环境数据
  }
}
```

## 🔍 条件渲染示例

```vue
<template>
  <!-- 根据配置动态显示字段 -->
  <div v-if="config.hasCoolingData" class="cooling-fields">
    <!-- 冷却系统相关字段 -->
  </div>
  
  <div v-if="config.hasMachineryData" class="machinery-fields">
    <!-- 机械环境相关字段 -->
  </div>
  
  <!-- 自定义字段 -->
  <div v-if="contactForm.projectName !== undefined" class="custom-fields">
    <UFormField name="projectName" label="Project Name">
      <UInput v-model="contactForm.projectName" />
    </UFormField>
  </div>
</template>
```

## 📝 数据提交格式

### 基础表单（无额外数据）
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "whatsapp": "+1234567890",
  "message": "Basic inquiry",
  "otherFields": "",
  "source": "https://yoursite.com/basic-page"
}
```

### 冷却系统表单
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "whatsapp": "+1234567890",
  "message": "Need cooling system",
  "otherFields": "{\"coolingCapacity\":1250,\"waterTempRange\":\"15-25°C\",\"coolingMethod\":\"air\",\"powerSupply\":\"380V\"}",
  "source": "https://yoursite.com/cooling-page"
}
```

### 机械环境表单
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "whatsapp": "+1234567890",
  "message": "Machinery inquiry",
  "otherFields": "{\"machineType\":\"Injection Molding\",\"operatingHours\":12,\"ambientTemperature\":30,\"humidity\":70}",
  "source": "https://yoursite.com/machinery-page"
}
```

## 🚀 扩展新的额外数据类型

要添加新的额外数据类型，只需：

1. **定义接口**：
```typescript
interface NewExtraData {
  field1: string
  field2: number
}
```

2. **在 generateInitialData 中添加**：
```typescript
if (options.extraData?.includes('newType')) {
  Object.assign(baseData, {
    field1: '',
    field2: 0
  } as NewExtraData)
}
```

3. **在 config 中添加标识**：
```typescript
config: {
  hasNewTypeData: options.extraData?.includes('newType') || false
}
```

## 💡 最佳实践

1. **按需启用**：只启用页面需要的额外数据
2. **条件渲染**：使用 `config` 对象进行条件渲染
3. **类型安全**：利用 TypeScript 接口确保类型安全
4. **扩展性**：预留 `customFields` 接口用于特殊需求

这种设计让您的表单系统更加灵活和可维护！🎉

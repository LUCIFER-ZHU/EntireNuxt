<template>
  <ClientOnly>
    <UModal v-model:open="isOpen" title="Request a Quote"
    description="Fill out the form and we will get back to you within 24 hours.">
      <!-- 内容插槽 -->
      <template #content>
        <div class="p-4 max-w-lg w-full bg-white rounded-lg shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <div class="space-y-1">
              <div class="text-lg font-semibold">Request a Quote</div>
              <div class="text-sm text-gray-500">Fill out the form and we will get back to you within 24 hours.</div>
            </div>
            <UButton icon="i-heroicons-x-mark" variant="ghost" color="neutral" @click="close" />
          </div>

          <UForm :state="contactForm" @submit="handleSubmit" class="space-y-3">
            <UFormField name="name" :error="getFieldError('name')">
              <UInput 
                v-model="contactForm.name" 
                placeholder="Your Name *" 
                size="lg" 
                class="w-full"
              />
            </UFormField>

            <UFormField name="email" :error="getFieldError('email')">
              <UInput 
                v-model="contactForm.email" 
                placeholder="Your Email *" 
                type="email" 
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField name="whatsapp" :error="getFieldError('whatsapp')">
              <UInput 
                v-model="contactForm.whatsapp" 
                placeholder="WhatsApp / Phone (optional)" 
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField name="message" :error="getFieldError('message')">
              <UTextarea 
                v-model="contactForm.message" 
                placeholder="Your Message (optional)" 
                :rows="4"
                class="w-full"
              />
            </UFormField>

            <div class="text-xs text-gray-500 mb-4">
              By submitting this form, you agree to be contacted about your request.
            </div>
          </UForm>

          <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <UButton variant="ghost" color="neutral" @click="close" :disabled="isSubmitting">
              Cancel
            </UButton>
            <UButton color="primary" :loading="isSubmitting" :disabled="isSubmitting" @click="submit">
              {{ isSubmitting ? 'Submitting...' : 'Send Request' }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
    <template #fallback>
      <!-- SSR fallback: 空内容，模态框只在客户端显示 -->
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
/**
 * 询盘表单对话框组件
 * @description 弹出对话框，展示基础四个字段的询盘表单（name、email、whatsapp、message）
 * @emits update:modelValue - 控制对话框显示与隐藏
 */

// 组件对外暴露的属性（v-model）
const props = defineProps<{ modelValue: boolean }>()

// 组件事件
const emit = defineEmits<{
  /**
   * 更新对话框显示状态
   * @param value boolean - 新的显示状态
   */
  (e: 'update:modelValue', value: boolean): void
}>()

// 计算型本地显示状态（同步到父组件）
const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

// 使用基础询盘表单（不启用额外数据）
const {
  contactForm,
  isSubmitting,
  onContactSubmit,
  getFieldError,
  resetForm
} = useContactForm()

/**
 * 关闭对话框
 * @returns {void}
 */
const close = (): void => {
  isOpen.value = false
}

/**
 * 监听对话框状态变化，在打开或关闭时重置表单
 */
watch(isOpen, (newValue) => {
  // 不管是打开还是关闭都重置表单
  resetForm()
  console.log(`表单对话框${newValue ? '打开' : '关闭'}，表单已重置`)
})

/**
 * 提交按钮点击（包装提交逻辑）
 * @returns {Promise<void>} 提交完成
 */
const submit = async (): Promise<void> => {
  await handleSubmit()
}

/**
 * 表单提交处理（在组件中使用 async/await + try/catch）
 * @returns {Promise<void>} 提交完成
 */
const handleSubmit = async (): Promise<void> => {
  try {
    // 调用提交方法，获取返回结果
    const result = await onContactSubmit()
    
    // 只有在提交成功时才关闭弹窗
    if (result && result.success) {
      close()
    }
    // 验证失败或API调用失败时，保持弹窗打开（错误提示由组合函数处理）
  } catch (error) {
    // 兜底错误处理（组合函数已处理 toast）
    console.error('Submit error in dialog:', error)
    // 出错时不关闭弹窗，让用户可以修正问题
  }
}
</script>

<style scoped>
</style>

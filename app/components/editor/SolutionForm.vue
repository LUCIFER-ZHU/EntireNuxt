<template>
  <div class="solution-form-container">
    <!-- 表单标题 -->
    <div class="form-header">
      <h2 class="form-title">Get Hydrogen Compressor Solution</h2>
    </div>

    <!-- 表单容器 -->
    <UCard class="form-card">
      <UForm 
        :state="contactForm" 
        @submit="handleFormSubmit"
        class="solution-form"
      >
        <!-- 第一行：WhatsApp 和 Name -->
        <div class="form-row">
          <!-- WhatsApp 字段组 -->
          <div class="form-group whatsapp-group">
            <label class="form-label">WhatsApp</label>
            <div class="whatsapp-inputs">
              <!-- 国家代码输入框 -->
              <UInput
                v-model="contactForm.countryCode"
                placeholder="+86"
                class="country-input"
                :error="hasFieldError('countryCode')"
                @input="clearFieldError('countryCode')"
              />
              <!-- 电话号码输入 -->
              <UInput
                v-model="contactForm.phoneNumber"
                placeholder="Phone Number"
                class="phone-input"
                :error="hasFieldError('phoneNumber')"
                @input="clearFieldError('phoneNumber')"
              />
            </div>
            <!-- 错误提示 -->
            <div v-if="getFieldError('phoneNumber')" class="error-message">
              {{ getFieldError('phoneNumber') }}
            </div>
          </div>

          <!-- Name 字段 -->
          <div class="form-group">
            <label class="form-label">Name <span class="required-asterisk">*</span></label>
            <UInput
              v-model="contactForm.name"
              placeholder="Your Name"
              :error="hasFieldError('name')"
              @input="clearFieldError('name')"
            />
            <div v-if="getFieldError('name')" class="error-message">
              {{ getFieldError('name') }}
            </div>
          </div>
        </div>

        <!-- 第二行：Email 和 Compressed Medium And Gas Composition -->
        <div class="form-row">
          <!-- Email 字段 (占1/3) -->
          <div class="form-group email-group">
            <label class="form-label">Email <span class="required-asterisk">*</span></label>
            <UInput
              v-model="contactForm.email"
              type="email"
              placeholder="Your Email"
              :error="hasFieldError('email')"
              @input="clearFieldError('email')"
            />
            <div v-if="getFieldError('email')" class="error-message">
              {{ getFieldError('email') }}
            </div>
          </div>

          <!-- Compressed Medium And Gas Composition 字段 (占2/3) -->
          <div class="form-group gas-composition-group">
            <label class="form-label">Compressed Medium And Gas Composition</label>
            <UInput
              v-model="contactForm.gasComposition"
              placeholder="e.g., H2, N2, CO2"
              :error="hasFieldError('gasComposition')"
              @input="clearFieldError('gasComposition')"
            />
            <div v-if="getFieldError('gasComposition')" class="error-message">
              {{ getFieldError('gasComposition') }}
            </div>
          </div>
        </div>

        <!-- 第三行：Inlet Pressure, Outlet Pressure, Voltage -->
        <div class="form-row">
          <!-- Inlet Pressure 字段 -->
          <div class="form-group">
            <label class="form-label">Inlet Pressure (Bar.G)</label>
            <UInput
              v-model="contactForm.inletPressure"
              type="number"
              placeholder="0.0"
              :error="hasFieldError('inletPressure')"
              @input="clearFieldError('inletPressure')"
            />
            <div v-if="getFieldError('inletPressure')" class="error-message">
              {{ getFieldError('inletPressure') }}
            </div>
          </div>

          <!-- Outlet Pressure 字段 -->
          <div class="form-group">
            <label class="form-label">Outlet Pressure (Bar.G)</label>
            <UInput
              v-model="contactForm.outletPressure"
              type="number"
              placeholder="0.0"
              :error="hasFieldError('outletPressure')"
              @input="clearFieldError('outletPressure')"
            />
            <div v-if="getFieldError('outletPressure')" class="error-message">
              {{ getFieldError('outletPressure') }}
            </div>
          </div>

          <!-- Voltage 字段 -->
          <div class="form-group">
            <label class="form-label">Voltage</label>
            <UInput
              v-model="contactForm.voltage"
              placeholder="e.g., 220V, 380V"
              :error="hasFieldError('voltage')"
              @input="clearFieldError('voltage')"
            />
            <div v-if="getFieldError('voltage')" class="error-message">
              {{ getFieldError('voltage') }}
            </div>
          </div>
        </div>

        <!-- 第四行：Flow Rate, Cooling Way, Frequency -->
        <div class="form-row">
          <!-- Flow Rate 字段 -->
          <div class="form-group">
            <label class="form-label">Flow Rate (Nm3/h)</label>
            <UInput
              v-model="contactForm.flowRate"
              type="number"
              placeholder="0"
              :error="hasFieldError('flowRate')"
              @input="clearFieldError('flowRate')"
            />
            <div v-if="getFieldError('flowRate')" class="error-message">
              {{ getFieldError('flowRate') }}
            </div>
          </div>

          <!-- Cooling Way 字段 -->
          <div class="form-group">
            <label class="form-label">Cooling Way</label>
            <UInput
              v-model="contactForm.coolingWay"
              placeholder="e.g., Air-cooled, Water-cooled"
              :error="hasFieldError('coolingWay')"
              @input="clearFieldError('coolingWay')"
            />
            <div v-if="getFieldError('coolingWay')" class="error-message">
              {{ getFieldError('coolingWay') }}
            </div>
          </div>

          <!-- Frequency 字段 -->
          <div class="form-group">
            <label class="form-label">Frequency</label>
            <UInput
              v-model="contactForm.frequency"
              placeholder="e.g., 50Hz, 60Hz"
              :error="hasFieldError('frequency')"
              @input="clearFieldError('frequency')"
            />
            <div v-if="getFieldError('frequency')" class="error-message">
              {{ getFieldError('frequency') }}
            </div>
          </div>
        </div>

        <!-- 第五行：Message 字段（全宽） -->
        <div class="form-row">
          <div class="form-group message-group">
            <label class="form-label">Message</label>
            <UTextarea
              v-model="contactForm.message"
              placeholder="Please provide any additional requirements or questions..."
              :rows="4"
              :error="hasFieldError('message')"
              @input="clearFieldError('message')"
            />
            <div v-if="getFieldError('message')" class="error-message">
              {{ getFieldError('message') }}
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <UButton
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="default-btn"
          >
            GET AN INSTANT QUOTE
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
/**
 * 氢压缩机解决方案表单组件
 * @description 用于收集客户对氢压缩机解决方案的需求信息
 */

// 使用联系表单组合函数，配置氢压缩机相关字段
const {
  contactForm,
  isSubmitting,
  handleFormSubmit,
  clearFieldError,
  getFieldError,
  hasFieldError,
  updateField
} = useContactForm({
  customFields: {
    // WhatsApp 相关字段
    countryCode: '',
    phoneNumber: '',
    // 氢压缩机技术参数
    gasComposition: '',
    inletPressure: '',
    outletPressure: '',
    voltage: '',
    flowRate: '',
    coolingWay: '',
    frequency: ''
  }
})

// 计算完整的 WhatsApp 号码
const fullWhatsApp = computed(() => {
  const countryCode = contactForm.value.countryCode || ''
  const phoneNumber = contactForm.value.phoneNumber || ''
  return countryCode && phoneNumber ? `${countryCode} ${phoneNumber}` : ''
})

// 监听 WhatsApp 字段变化，更新完整的 whatsapp 字段
watch([() => contactForm.value.countryCode, () => contactForm.value.phoneNumber], () => {
  updateField('whatsapp', fullWhatsApp.value)
}, { immediate: true })


// 监听表单字段变化，自动清除验证错误
watch(() => contactForm.value, () => {
  // 当表单数据变化时，清除所有验证错误
  Object.keys(contactForm.value).forEach(field => {
    clearFieldError(field)
  })
}, { deep: true })
</script>

<style scoped lang="scss">
/**
 * 氢压缩机解决方案表单样式
 * @description 响应式表单布局，适配桌面和移动端
 */

.solution-form-container {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  
  .form-header {
    text-align: center;
    margin-bottom: 2rem;
    
    .form-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 0.5rem;
      line-height: 1.2;
      
      @media (min-width: 768px) {
        font-size: 2.25rem;
      }
    }
  }
  
  .form-card {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  }
  
  .solution-form {
    padding: 2rem;
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      
      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
      
      // 消息字段独占一行
      .message-group {
        grid-column: 1 / -1;
      }
      
      // Email 字段占 1/3 行
      .email-group {
        @media (min-width: 768px) {
          grid-column: span 1;
        }
      }
      
      // 气体成分字段占 2/3 行
      .gas-composition-group {
        @media (min-width: 768px) {
          grid-column: span 2;
        }
      }
      
      // WhatsApp 字段组特殊布局
      .whatsapp-group {
        @media (min-width: 768px) {
          grid-column: span 2;
        }
        
        .whatsapp-inputs {
          display: flex;
          gap: 0.5rem;
          
          .country-input {
            flex: 1;
            min-width: 0;
          }
          
          .phone-input {
            flex: 2;
          }
        }
      }
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #000000;
        margin-bottom: 0.25rem;
        
        .required-asterisk {
          color: #ef4444;
          margin-left: 2px;
        }
      }
      
      .error-message {
        font-size: 0.875rem;
        color: #ef4444;
        margin-top: 0.25rem;
      }
    }
    
    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
      

    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .solution-form-container {
    
    .form-header .form-title {
      font-size: 1.5rem;
    }
    
    .solution-form {
      padding: 1rem;
      
      .form-row {
        gap: 1rem;
        margin-bottom: 1rem;
        
        .whatsapp-group .whatsapp-inputs {
          flex-direction: column;
          gap: 0.5rem;
        }
      }
      
    }
  }
}

// 深色模式支持
@media (prefers-color-scheme: dark) {
  .solution-form-container {
    .form-header .form-title {
      color: white;
    }
    
    .form-card {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    }
    
    .solution-form .form-group .form-label {
      color: #d1d5db;
    }
  }
}
</style>

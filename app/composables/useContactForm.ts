/**
 * 联系表单组合函数 - 用于管理询盘表单的状态和逻辑
 * @description 提供表单数据管理、验证、提交和重置功能，可在多个页面中复用
 */

// 声明全局类型（避免 TypeScript 错误）
declare global {
  function gtag(...args: any[]): void
}

/**
 * 额外数据类型定义
 */
type ExtraDataType = 'cooling' | 'machinery' | 'environment' | 'custom'

/**
 * 冷却系统额外数据接口
 */
interface CoolingExtraData {
  coolingCapacity: number
  waterTempRange: string
  coolingMethod: 'Air-cooled' | 'Water-cooled'
  powerSupply: '220V' | '380V' | '440V'
}

/**
 * 机械环境额外数据接口（示例）
 */
interface MachineryExtraData {
  machineType: string
  operatingHours: number
  ambientTemperature: number
  humidity: number
}

/**
 * 联系表单基础数据接口
 */
interface ContactFormBaseData {
  name: string
  email: string
  whatsapp: string
  message: string
}

/**
 * 联系表单完整数据接口（动态扩展）
 */
interface ContactFormData extends ContactFormBaseData {
  // 动态扩展字段
  [key: string]: any
}

/**
 * 组合函数配置选项
 */
interface UseContactFormOptions {
  extraData?: ExtraDataType[]
  customFields?: Record<string, any>
}

/**
 * 表单验证结果接口
 * @interface FormValidationResult
 * @property {boolean} isValid - 验证是否通过
 * @property {Record<string, string>} errors - 错误信息对象，键为字段名，值为错误信息
 */
interface FormValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * 表单提交响应接口
 * @interface FormSubmitResponse
 * @property {boolean} success - 提交是否成功
 * @property {string} message - 响应消息
 * @property {any} data - 响应数据（可选）
 */
interface FormSubmitResponse {
  success: boolean
  message: string
  data?: any
}

/**
 * 联系表单组合函数
 * @function useContactForm
 * @param {UseContactFormOptions} options - 配置选项
 * @returns {Object} 包含表单状态和操作方法的对象
 */
export const useContactForm = (options: UseContactFormOptions = {}) => {
  // 获取环境变量中的后台API地址
  const isDev = process.env.NODE_ENV !== "production"
  const API_BASE_URL = isDev ? 'https://common.minnuo.test' : 'https://common.minnuo.group'
  
  // 获取 Nuxt 应用实例和相关功能
  const { $toast } = useNuxtApp()
  
  /**
   * 根据配置生成初始表单数据
   */
  const generateInitialData = (): ContactFormData => {
    const baseData: ContactFormBaseData = {
      name: '',
      email: '',
      whatsapp: '',
      message: ''
    }
    
    // 根据配置添加额外字段
    if (options.extraData?.includes('cooling')) {
      Object.assign(baseData, {
        coolingCapacity: 1250,
        waterTempRange: '',
        coolingMethod: 'Air-cooled',
        powerSupply: '220V'
      } as CoolingExtraData)
    }
    
    if (options.extraData?.includes('machinery')) {
      Object.assign(baseData, {
        machineType: '',
        operatingHours: 8,
        ambientTemperature: 25,
        humidity: 60
      } as MachineryExtraData)
    }
    
    // 添加自定义字段
    if (options.customFields) {
      Object.assign(baseData, options.customFields)
    }
    
    return baseData as ContactFormData
  }
  
  // 表单初始数据
  const initialFormData = generateInitialData()

  // 响应式表单数据
  const contactForm = ref<ContactFormData>({ ...initialFormData })

  // 表单提交状态
  const isSubmitting = ref(false)

  // 表单验证状态
  const validationErrors = ref<Record<string, string>>({})



  /**
   * 表单验证函数
   * @returns {FormValidationResult} 验证结果对象
   */
  const validateForm = (): FormValidationResult => {
    const errors: Record<string, string> = {}

    // 姓名验证（必填）
    if (!contactForm.value.name.trim()) {
      errors.name = 'Please enter your name'
    }

    // 邮箱验证（必填）
    if (!contactForm.value.email.trim()) {
      errors.email = 'Please enter your email address'
    }

    // 更新验证错误状态
    validationErrors.value = errors

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * 提交表单数据到API接口
   * @param {ContactFormData} formData - 要提交的表单数据
   * @returns {Promise<FormSubmitResponse>} API响应结果
   */
  const submitToAPI = async (formData: ContactFormData): Promise<FormSubmitResponse> => {
    try {
      // 构建其他字段的JSON对象（动态提取非基础字段）
      const baseFields = ['name', 'email', 'whatsapp', 'message']
      const otherFields: Record<string, any> = {}
      
      Object.keys(formData).forEach(key => {
        if (!baseFields.includes(key) && formData[key] !== undefined && formData[key] !== '') {
          otherFields[key] = formData[key]
        }
      })

      // 构建要发送的senderData数据（必要字段）
      const senderData = {
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp || '',
        message: formData.message || '',
      }

      // 构建要发送的表单数据
      const submitData = {
        senderData: senderData,
        sendPage: typeof window !== 'undefined' ? window.location.href : 'unknown',
        sendSite: typeof window !== 'undefined' ? window.location.hostname : 'unknown',        
      }

      if (Object.keys(otherFields).length > 0) {
        // 通过类型断言扩展chooseData属性，避免TS类型报错
        (submitData as Record<string, any>).chooseData = otherFields
      }

      // 使用 Nuxt 自带的 $fetch 进行API调用
      const response = await $fetch<{
        success: boolean
        message?: string
        data?: any
        inquiryId?: string
      }>(`${API_BASE_URL}/inquiry/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: submitData
      })

      // 处理成功响应
      if (response && response.success) {
        return {
          success: true,
          message: 'Inquiry submitted successfully! We will contact you within 24 hours.',
          data: response.data || {
            inquiryId: response.inquiryId || `INQ-${Date.now()}`,
          }
        }
      } else {
        // API返回失败状态
        return {
          success: false,
          message: 'Submission failed, please try again later.'
        }
      }

    } catch (error: any) {
      console.error('API submission error:', error)
      
      // 根据错误类型返回相应信息（英文）
      if (error.name === 'TimeoutError') {
        return {
          success: false,
          message: 'Request timeout, please check your network connection and try again.'
        }
      } else if (error.statusCode === 422) {
        return {
          success: false,
          message: 'Invalid data format, please check and try again.'
        }
      } else if (error.statusCode >= 500) {
        return {
          success: false,
          message: 'Server temporarily unavailable, please try again later.'
        }
      } else {
        return {
          success: false,
          message: 'Submission failed, please try again later or contact customer service.'
        }
      }
    }
  }



  /**
   * 处理表单提交
   * @returns {Promise<FormSubmitResponse | undefined>} 提交结果
   */
  const onContactSubmit = async (): Promise<FormSubmitResponse | undefined> => {
    try {
      // 防止重复提交
      if (isSubmitting.value) {
        console.log('Form submission blocked: already submitting (isSubmitting = true)');
        return
      }

      // 验证表单
      const validation = validateForm()
      if (!validation.isValid) {
        // 显示第一个验证错误
        const firstError = Object.values(validation.errors)[0]
        if (firstError) {
          $toast.error(firstError)
        }
        // 返回验证失败结果
        return { 
          success: false, 
          message: 'Validation failed' 
        }
      }

      // 开始提交
      isSubmitting.value = true

      // API提交
      const response = await submitToAPI(contactForm.value)

      // 处理结果
      if (response.success) {
        // 提交成功
        $toast.success(response.message)
        
        // 重置表单
        resetForm()
        
        // 触发 Google Ads 转化跟踪
        if (typeof window !== 'undefined') {
          try {
            // 优先使用全局封装的转化上报方法（与 app.vue 中保持一致）
            const reporter = (window as any).gtag_report_conversion as undefined | ((url?: string) => boolean)
            if (typeof reporter === 'function') {
              reporter()
            } else if (typeof gtag === 'function') {
              // 回退：直接调用 gtag 事件上报（新账号与事件ID）
              gtag('event', 'conversion', {
                'send_to': 'AW-10801798623/mSIWCPH6iIMYEN-72Z4o',
                'value': 1.0,
                'currency': 'CNY',
                'event_callback': function() {
                  console.log('Conversion tracking successful')
                }
              })
            }
          } catch (e) {
            console.warn('Conversion tracking failed:', e)
          }
        }
        
      } else {
        // 提交失败
        $toast.error(response.message)
        console.error('Form submission failed:', response.message)
      }

      // 返回API响应结果
      return response

    } catch (error) {
      console.error('Unexpected error during form submission:', error)
      $toast.error('Submission error occurred, please try again later or contact customer service')
      
      // 返回错误结果
      return {
        success: false,
        message: 'Unexpected error occurred'
      }
    } finally {
      isSubmitting.value = false
    }
  }

  /**
   * 重置表单数据到初始状态
   * @returns {void}
   */
  const resetForm = (): void => {
    contactForm.value = { ...initialFormData }
    validationErrors.value = {}
  }

  /**
   * 更新单个表单字段（可选方法，支持自动清除验证错误）
   * @param {string} field - 字段名
   * @param {any} value - 新值
   * @returns {void}
   */
  const updateField = (field: string, value: any): void => {
    contactForm.value[field] = value
    
    // 自动清除该字段的验证错误
    if (validationErrors.value[field]) {
      delete validationErrors.value[field]
    }
  }

  /**
   * 清除指定字段的验证错误
   * @param {string} field - 字段名
   * @returns {void}
   */
  const clearFieldError = (field: string): void => {
    if (validationErrors.value[field]) {
      delete validationErrors.value[field]
    }
  }

  /**
   * 获取字段的验证错误信息
   * @param {string} field - 字段名
   * @returns {string | undefined} 错误信息，无错误时返回undefined
   */
  const getFieldError = (field: string): string | undefined => {
    return validationErrors.value[field] || undefined
  }

  /**
   * 检查字段是否有错误
   * @param {string} field - 字段名
   * @returns {boolean} 是否有错误
   */
  const hasFieldError = (field: string): boolean => {
    return !!validationErrors.value[field]
  }

  /**
   * UForm 表单提交处理函数（兼容处理器，专用于 @submit 事件，不返回结果）
   * @param {Event} event - 表单提交事件
   * @returns {Promise<void>} 无返回值的Promise
   */
  const handleFormSubmit = async (event?: Event): Promise<void> => {
    // 阻止默认表单提交行为（如果有）
    if (event) {
      event.preventDefault()
    }
    
    // 在 handleFormSubmit 层面也添加防重复提交检查
    if (isSubmitting.value) {
      return;
    }
    
    // 调用原始的提交方法，忽略返回值
    await onContactSubmit()
    // 不返回任何值，保持与 UForm @submit 处理器类型兼容
  }

  // 返回组合函数的所有功能
  return {
    // 状态 - 支持双向绑定
    contactForm,
    isSubmitting: readonly(isSubmitting),
    validationErrors: readonly(validationErrors),
    
    // 配置信息
    config: {
      extraData: options.extraData || [],
      hasCoolingData: options.extraData?.includes('cooling') || false,
      hasMachineryData: options.extraData?.includes('machinery') || false
    },
    
    // 方法
    onContactSubmit,     // 返回结果的API调用版本
    handleFormSubmit,    // 兼容UForm的@submit事件版本
    resetForm,
    updateField,
    clearFieldError,
    validateForm,
    getFieldError,
    hasFieldError
  }
}

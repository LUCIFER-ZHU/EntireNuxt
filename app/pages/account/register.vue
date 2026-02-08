<template>
  <div class="register-page">
    <div class="form-container">
      <div class="form-card">
        <h2 class="form-title">Sign up</h2>

        <form @submit.prevent="handleRegister" class="register-form">
          <!-- Email -->
          <div class="form-group flex items-center gap-2">
            <div class="input-wrapper flex-1">
              <span class="input-icon">
                <i class="icon mnfont mn-Mail-open"></i>
              </span>
              <UInput id="email" v-model="form.email" type="email" placeholder="mail" :disabled="loading"
                class="form-input" :ui="{ base: 'custom-input' }" />
            </div>
            <div class="send-btn-wrapper" :title="!turnstileToken ? 'Please complete the verification first' : ''">
              <UButton type="button" @click="handleSendCode"
                :disabled="!form.email || countdown > 0 || sendingCode || !turnstileToken" :loading="sendingCode"
                class="send-btn" color="primary">
                {{ countdown > 0 ? `${countdown}s` : 'Send' }}
              </UButton>
            </div>
          </div>

          <!-- Verification Code -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">
                <i class="icon mnfont mn-Comment"></i>
              </span>
              <UInput id="code" v-model="form.code" placeholder="Verification code" :disabled="loading"
                class="form-input" :ui="{ base: 'custom-input' }" />
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">
                <i class="icon mnfont mn-Password"></i>
              </span>
              <UInput id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                placeholder="Password" :disabled="loading" class="form-input" :ui="{ base: 'custom-input' }" />
              <button type="button" class="password-toggle" @click="togglePassword" :disabled="loading">
                <UIcon :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" class="eye-icon" />
              </button>
            </div>
          </div>

          <!-- Agreement Checkboxes -->
          <div class="agreement-section">
            <label class="agreement-item">
              <input type="checkbox" v-model="form.agreeTerms" class="agreement-checkbox" />
              <span class="agreement-text">
                I agree with
                <a href="#" class="agreement-link">Free Membership Agreement</a>,
                <a href="#" class="agreement-link">Terms of Use</a>, and
                <a href="#" class="agreement-link">Privacy Policy</a>.
                I agree to receive more information about Alibaba.com products and services.
              </span>
            </label>

            <label class="agreement-item">
              <input type="checkbox" v-model="form.agreeDataTransfer" class="agreement-checkbox" />
              <span class="agreement-text">
                I have read and agree to:
                <a href="#" class="agreement-link">Cross-border Personal Data Transfer Consent</a>
              </span>
            </label>
          </div>

          <!-- Turnstile 验证 -->
          <div class="form-group turnstile-wrapper">
            <NuxtTurnstile ref="turnstileRef" v-model="turnstileToken" :options="{
              language: 'en'
            }" @error="onTurnstileError" @success="onTurnstileSuccess" @expire="onTurnstileExpire" />
          </div>

          <!-- Submit Button -->
          <UButton type="submit" :disabled="!isFormValid || loading" :loading="loading" class="submit-btn" block
            color="primary">
            Sign up
          </UButton>
        </form>

        <p class="signin-link">
          Or
          <NuxtLink to="/account/login">
            log in to your account
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendRegisterCode, register, type RegisterRequest } from '~/api/auth'
import { useAuthStore } from '~/stores/auth'

const { $toast } = useNuxtApp()
const { buildImageUrl } = useImageUrl()
const authStore = useAuthStore()

definePageMeta({
  layout: 'account'
})

// 表单数据
const form = ref({
  email: '',
  code: '',
  password: '',
  agreeTerms: false,
  agreeDataTransfer: false,
})

// 加载状态
const loading = ref(false)
const sendingCode = ref(false)

// 密码显示/隐藏状态
const showPassword = ref(false)

// 切换密码显示状态
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 倒计时
const countdown = ref(0)
let countdownTimer: NodeJS.Timeout | null = null

// Turnstile 验证
const {
  turnstileToken,
  turnstileRef,
  onTurnstileSuccess,
  onTurnstileError,
  onTurnstileExpire,
  resetTurnstile,
} = useTurnstile()

// 表单验证
const isFormValid = computed(() => {
  return form.value.email &&
    form.value.code &&
    form.value.password &&
    form.value.agreeTerms &&
    form.value.agreeDataTransfer
})


// 发送验证码
const handleSendCode = async () => {
  if (!form.value.email) {
    $toast.error('Please enter your email address')
    return
  }

  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    $toast.error('Please enter a valid email address')
    return
  }

  // 检查 Turnstile 验证是否通过
  if (!turnstileToken.value) {
    $toast.error('Please complete the verification')
    return
  }

  sendingCode.value = true

  try {
    const response: any = await sendRegisterCode(form.value.email, turnstileToken.value)

    // 检查业务状态
    if (!response?.success) {
      $toast.error(response?.message || 'Failed to send verification code')
      // 验证失败时重置 Turnstile
      resetTurnstile()
      return
    }

    // 发送成功
    $toast.success(response?.message || 'Verification code sent to your email')

    // 只有成功才开始90秒倒计时
    countdown.value = 90
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }
    }, 1000)

    // 发送成功后重置 Turnstile，以便下次发送时重新验证
    resetTurnstile()
  } catch (error: any) {
    // HTTP 请求错误或网络错误
    $toast.error(error?.data?.message || error?.message || 'Failed to send verification code')
    // 验证失败时重置 Turnstile
    resetTurnstile()
  } finally {
    sendingCode.value = false
  }
}

// 注册
const handleRegister = async () => {
  if (!isFormValid.value) {
    $toast.error('Please fill in all required fields')
    return
  }

  loading.value = true

  try {
    const requestData: RegisterRequest = {
      email: form.value.email,
      code: form.value.code,
      password: form.value.password,
    }

    // 从 authStore 中获取 sessionId（通过 pinia-plugin-persistedstate 自动从 localStorage 恢复）
    if (authStore.sessionId) {
      requestData.sessionId = authStore.sessionId
    }    

    const response: any = await register(requestData)

    // 检查业务状态
    if (!response?.success) {
      $toast.error(response?.message || 'An error occurred during registration')
      return
    }

    // 注册成功
    $toast.success(response?.message || 'Registration successful! Please login.')

    // 只有成功才跳转到登录页
    setTimeout(() => {
      navigateTo('/account/login')
    }, 1500)
  } catch (error: any) {
    // HTTP 请求错误或网络错误
    $toast.error(error?.data?.message || error?.message || 'An error occurred during registration')
  } finally {
    loading.value = false
  }
}

// 清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

// SEO 元数据
useHead({
  title: 'Register - Create Account',
  meta: [
    {
      name: 'description',
      content: 'Create your account to get started'
    }
  ]
})
</script>

<style scoped lang="scss">
.register-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #D9D9D9;
  background: url($image-base + '/image/img9.webp') left center / 50% 100% no-repeat;
  overflow: hidden;

  @media (max-width: 768px) {
    background: url($image-base + '/image/img9.webp') left center / 100% 100% no-repeat;
  }
}

.form-container {
  position: absolute;
  top: 50%;
  left: 75%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 28vw;
  min-width: 320px;

  @media (max-width: 768px) {
    left: 50%;
  }
}

.form-card {
  background: #FFFFFF;
  border-radius: 1.25vw;
  padding: 1.5625vw 2.1875vw;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 6vw;
    border-radius: 3vw;
  }
}

.form-title {
  font-size: 2.2vw;
  font-weight: 600;
  color: $primary-color;
  margin: 0 0 2.5vw 0;

  @media (max-width: 768px) {
    font-size: 6vw;
    margin-bottom: 5vw;
  }
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.0417vw;

  @media (max-width: 768px) {
    gap: 3vw;
  }
}

.turnstile-wrapper {
  display: flex;
  align-items: center;
  min-height: 65px;
  /* 关键：确保组件阴影和边缘不被裁切 */
  overflow: visible !important;   

  @media (max-width: 768px) {
    justify-content: center;
    min-height: 80px;
  }
}

.form-group {
  width: 100%;
  overflow: auto;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #F9F9FB;
  border-radius: 0.5vw;
  padding: 0.8vw 1vw;
  gap: 0.8vw;

  @media (max-width: 768px) {
    border-radius: 1.5vw;
    padding: 2vw 3vw;
    gap: 2vw;
  }
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  :deep(img) {
    width: 1.7708vw;
    height: 1.7708vw;
    object-fit: contain;

    @media (max-width: 768px) {
      width: 4vw;
      height: 4vw;
    }
  }
}

.form-input {
  flex: 1;

  :deep(input) {
    border: none;
    background: transparent;
    outline: none;
    box-shadow: none;
    font-size: 1vw;
    color: #333333;
    padding: 0;

    &::placeholder {
      color: #8D8D8D;
    }

    &:focus {
      border: none;
      box-shadow: none;
      outline: none;
    }

    @media (max-width: 768px) {
      font-size: 3.5vw;
    }
  }
}

.password-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  color: #8D8D8D;
  transition: color 0.3s ease;

  &:hover:not(:disabled) {
    color: #333333;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .eye-icon {
    width: 1.25vw;
    height: 1.25vw;
    display: block;

    @media (max-width: 768px) {
      width: 4vw;
      height: 4vw;
    }
  }
}

.send-btn-wrapper {
  flex-shrink: 0;
  display: inline-block;
}

:deep(.send-btn) {
  flex-shrink: 0;
  border-radius: .625vw;
  padding: .6771vw 1.5625vw;
  font-size: clamp(10px, 1.25vw, 1.25vw);

  @media (max-width: 768px) {
    padding: 2vw 4vw;
    border-radius: 1.2vw;
    font-size: 3vw;
  }
}

:deep(.submit-btn) {
  padding: .6771vw 1.5625vw;
  border-radius: .625vw;
  font-size: clamp(10px, 1.25vw, 1.25vw);

  @media (max-width: 768px) {
    padding: 2vw 4vw;
    border-radius: 1.2vw;
    font-size: 3vw;
  }
}

.agreement-section {
  display: flex;
  flex-direction: column;
  gap: 0.8vw;
  margin-top: 0.5vw;

  @media (max-width: 768px) {
    gap: 2.5vw;
  }
}

.agreement-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5vw;
  cursor: pointer;
  font-size: 0.75vw;
  color: #666666;
  line-height: 1.5;

  @media (max-width: 768px) {
    gap: 2vw;
    font-size: 2.8vw;
  }
}

.agreement-checkbox {
  margin-top: 0.2vw;
  flex-shrink: 0;
  width: 1vw;
  height: 1vw;
  cursor: pointer;
  accent-color: $primary-color;

  @media (max-width: 768px) {
    width: 3.5vw;
    height: 3.5vw;
    margin-top: 0.5vw;
  }
}

.agreement-text {
  flex: 1;
}

.agreement-link {
  color: #0066CC;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #004C99;
    text-decoration: underline;
  }
}

.signin-link {
  text-align: center;
  font-size: 0.9vw;
  color: #666666;
  margin-top: 2vw;

  a {
    color: #1a1a3d;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #2a2a4d;
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    font-size: 3.2vw;
    margin-top: 4vw;
  }
}
</style>

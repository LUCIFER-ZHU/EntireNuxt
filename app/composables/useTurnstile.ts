/**
 * Turnstile 人机验证组合函数
 * 提供 Turnstile 验证的状态管理和回调处理
 */

export const useTurnstile = () => {
  const { $toast } = useNuxtApp()

  // Turnstile 验证 token
  const turnstileToken = ref<string | undefined>(undefined)
  const turnstileRef = ref<any>(null)

  // Turnstile 验证成功回调
  const onTurnstileSuccess = (token: string) => {
    turnstileToken.value = token
  }

  // Turnstile 验证错误回调
  const onTurnstileError = () => {
    turnstileToken.value = undefined
    $toast.error('Verification failed, please try again')
  }

  // Turnstile 验证过期回调
  const onTurnstileExpire = () => {
    turnstileToken.value = undefined
    // token 过期时不需要提示，用户再次点击发送时会自动重新验证
  }

  // 重置 Turnstile
  const resetTurnstile = () => {
    turnstileToken.value = undefined
    if (turnstileRef.value) {
      turnstileRef.value.reset()
    }
  }

  // 检查是否已通过验证
  const isVerified = computed(() => !!turnstileToken.value)

  return {
    turnstileToken,
    turnstileRef,
    onTurnstileSuccess,
    onTurnstileError,
    onTurnstileExpire,
    resetTurnstile,
    isVerified,
  }
}


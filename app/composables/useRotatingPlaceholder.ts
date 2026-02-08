/**
 * 旋转占位符组合式函数
 * 提供输入框 placeholder 自动切换效果
 */

export interface UseRotatingPlaceholderOptions {
  /**
   * 占位符文本列表
   */
  placeholders: string[]
  /**
   * 切换间隔时间（毫秒），默认 3000ms
   */
  interval?: number
  /**
   * 是否自动开始，默认 true
   */
  autoStart?: boolean
}

/**
 * 旋转占位符组合式函数
 * @param options 配置选项
 * @returns 占位符相关的响应式数据和方法
 */
export const useRotatingPlaceholder = (options: UseRotatingPlaceholderOptions) => {
  const { placeholders, interval = 3000, autoStart = true } = options

  if (!placeholders || placeholders.length === 0) {
    throw new Error('placeholders 数组不能为空')
  }

  // 扩展的占位符列表：在开头和结尾添加重复项以实现无限滚动
  // 格式：[最后一个, ...原列表, 第一个]
  const extendedPlaceholders = [
    placeholders[placeholders.length - 1],
    ...placeholders,
    placeholders[0]
  ]

  // 当前显示的占位符索引（在扩展列表中的索引，从1开始，跳过开头的副本）
  const currentIndex = ref(1)
  
  // 是否正在运行
  const isRunning = ref(false)
  
  // 定时器引用
  let timer: NodeJS.Timeout | null = null

  // 是否禁用过渡动画（用于无缝跳转）
  const disableTransition = ref(false)

  /**
   * 切换到下一个占位符
   */
  const next = () => {
    currentIndex.value++
    
    // 如果到达最后一个（第一个的副本），无缝跳转到真正的第一个
    if (currentIndex.value >= extendedPlaceholders.length - 1) {
      // 等待动画完成（0.5s）后重置位置，无动画
      setTimeout(() => {
        disableTransition.value = true
        currentIndex.value = 1
        // 下一帧恢复动画
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            disableTransition.value = false
          })
        })
      }, 500) // 与 CSS transition 时间一致
    }
  }

  /**
   * 开始自动切换
   */
  const start = () => {
    if (isRunning.value || placeholders.length <= 1) return
    
    isRunning.value = true
    timer = setInterval(() => {
      next()
    }, interval)
  }

  /**
   * 停止自动切换
   */
  const stop = () => {
    isRunning.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  /**
   * 重置到第一个占位符
   */
  const reset = () => {
    currentIndex.value = 1
  }

  /**
   * 获取当前占位符文本
   * 由于索引从1开始（跳过开头的副本），需要映射回原始列表
   */
  const currentPlaceholder = computed(() => {
    // currentIndex 从1开始，所以需要减1来映射到原始列表
    const originalIndex = currentIndex.value - 1
    return placeholders[originalIndex] || placeholders[0] || ''
  })

  /**
   * 获取所有占位符（用于渲染）
   * 返回扩展后的列表，包含首尾的重复项
   */
  const allPlaceholders = extendedPlaceholders

  /**
   * 计算 translateY 值（用于动画）
   * 注意：translateY的百分比是相对于元素自身高度的
   * 由于内层容器高度 = items.length * 外层容器高度
   * 所以移动一个item需要移动：-100% / items.length
   */
  const translateY = computed(() => {
    // 每个item占内层容器高度的 1/extendedPlaceholders.length
    // 所以移动一个item需要移动 -100% / extendedPlaceholders.length
    const itemHeightPercent = 100 / extendedPlaceholders.length
    return -currentIndex.value * itemHeightPercent
  })

  /**
   * 是否禁用过渡动画（用于无缝跳转）
   */
  const shouldDisableTransition = computed(() => disableTransition.value)

  // 如果自动开始，在组件挂载时启动
  if (autoStart && placeholders.length > 1) {
    onMounted(() => {
      start()
    })
  }

  // 组件卸载时清理定时器
  onUnmounted(() => {
    stop()
  })

  return {
    currentIndex,
    currentPlaceholder,
    allPlaceholders,
    translateY,
    shouldDisableTransition,
    isRunning,
    next,
    start,
    stop,
    reset
  }
}


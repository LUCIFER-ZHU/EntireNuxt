/**
 * 设备检测组合函数
 * 封装 @nuxtjs/device 模块，提供统一的设备检测逻辑
 */
export const useDeviceDetection = () => {
  // 使用 @nuxtjs/device 提供的 useDevice 组合函数
  // 它会自动根据 User-Agent (服务端) 或 navigator (客户端) 检测设备
  const device = useDevice()

  // 保持原有 API 兼容性
  const isMobile = computed(() => device.isMobile)
  const isTablet = computed(() => device.isTablet)
  const isDesktop = computed(() => device.isDesktop)
  
  // 屏幕尺寸相关（仅客户端有效）
  const screenWidth = ref(0)
  const screenHeight = ref(0)

  // 更新屏幕尺寸（仅客户端）
  const updateScreenSize = () => {
    if (import.meta.client) {
      screenWidth.value = window.innerWidth
      screenHeight.value = window.innerHeight
    }
  }

  // 组件挂载时监听窗口变化
  onMounted(() => {
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
  })

  onUnmounted(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', updateScreenSize)
    }
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
    // 兼容旧方法
    isMob: () => isMobile.value,
    isTab: () => isTablet.value,
    isPC: () => isDesktop.value,
    getScreenWidth: () => screenWidth.value,
    getScreenHeight: () => screenHeight.value,
  }
}

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">认证状态 Cookie 测试页面</h1>
    
    <div class="mb-6 p-4 bg-gray-100 rounded">
      <h2 class="text-xl font-semibold mb-2">当前认证状态（Store）</h2>
      <div class="space-y-2">
        <p><strong>isLoggedIn:</strong> {{ authStore.isLoggedIn }}</p>
        <p><strong>isAuthenticated:</strong> {{ authStore.isAuthenticated }}</p>
        <p><strong>User:</strong> {{ JSON.stringify(authStore.user, null, 2) }}</p>
      </div>
    </div>
    
    <div class="mb-6 p-4 bg-blue-100 rounded">
      <h2 class="text-xl font-semibold mb-2">Cookie 值</h2>
      <div class="space-y-2">
        <p><strong>auth_isAuthenticated:</strong> {{ authCookie }}</p>
        <p><strong>auth_user:</strong> {{ userCookie }}</p>
      </div>
    </div>
    
    <div class="mb-6 space-x-4">
      <button @click="testSetAuth" class="px-4 py-2 bg-green-500 text-white rounded">
        测试设置认证（模拟登录）
      </button>
      <button @click="testClearAuth" class="px-4 py-2 bg-red-500 text-white rounded">
        测试清除认证（模拟登出）
      </button>
      <button @click="testInitFromCookie" class="px-4 py-2 bg-blue-500 text-white rounded">
        测试从 Cookie 初始化
      </button>
      <button @click="refreshCookieValues" class="px-4 py-2 bg-gray-500 text-white rounded">
        刷新显示
      </button>
    </div>
    
    <div class="p-4 bg-yellow-100 rounded">
      <h2 class="text-xl font-semibold mb-2">操作日志</h2>
      <div class="space-y-1 max-h-96 overflow-y-auto">
        <p v-for="(log, index) in logs" :key="index" class="text-sm font-mono">
          {{ log }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const logs = ref<string[]>([])

const authCookie = ref('')
const userCookie = ref('')

const addLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.unshift(`[${timestamp}] ${message}`)
}

const refreshCookieValues = () => {
  const auth = useCookie('auth_isAuthenticated')
  const user = useCookie('auth_user')
  
  authCookie.value = String(auth.value || 'null')
  userCookie.value = String(user.value || 'null')
  
  addLog(`刷新 Cookie 值: auth=${authCookie.value}, user=${userCookie.value ? '有数据' : '无数据'}`)
}

const testSetAuth = () => {
  const testUser = {
    id: 12345,
    customerId: 12345,
    email: 'test@example.com',
    customerName: '测试用户'
  }
  
  addLog('调用 authStore.setAuth()...')
  authStore.setAuth(testUser)
  addLog(`认证状态已设置: isLoggedIn=${authStore.isLoggedIn}`)
  
  setTimeout(() => {
    refreshCookieValues()
  }, 100)
}

const testClearAuth = () => {
  addLog('调用 authStore.clearAuth()...')
  authStore.clearAuth()
  addLog(`认证状态已清除: isLoggedIn=${authStore.isLoggedIn}`)
  
  setTimeout(() => {
    refreshCookieValues()
  }, 100)
}

const testInitFromCookie = () => {
  addLog('调用 authStore.initFromCookie()...')
  authStore.initFromCookie()
  addLog(`从 Cookie 初始化完成: isLoggedIn=${authStore.isLoggedIn}`)
}

// 页面加载时刷新显示
onMounted(() => {
  refreshCookieValues()
  addLog('测试页面已加载')
})
</script>

<style scoped>
</style>


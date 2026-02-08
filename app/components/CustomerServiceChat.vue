<template>
  <div class="customer-service-chat">
    <!-- 聊天窗口 -->
    <div class="chat-window" :class="{ expanded: isExpanded }">
      <!-- 窗口头部 -->
      <div class="chat-header" @click="toggleChat">
        <div class="chat-title">Customer Service</div>
        <button class="close-btn" @click.stop="toggleChat">
          <span>{{ isExpanded ? '×' : '' }}</span>
        </button>
      </div>

      <!-- 聊天消息区域 -->
      <div v-if="isExpanded" class="chat-messages" ref="chatMessagesRef">
        <!-- 加载状态 -->
        <div v-if="messagesLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <span>Loading messages...</span>
        </div>
        <!-- 消息列表 -->
        <div v-for="message in chatMessages" :key="message.chatId || message.tempId" class="message-item"
          :class="{ 'message-left': message.isEmp, 'message-right': !message.isEmp }">
          <!-- 消息容器 -->
          <div class="message-container">
            <!-- 头像 -->
            <div class="message-avatar">
              <span>{{ message.isEmp ? 'S' : 'Me' }}</span>
            </div>
            <!-- 消息内容 -->
            <div class="message-content">
              <div v-if="message.hasMedia" class="message-image">
                <img :src="getImageUrl(message.chatBody)" alt="Chat Image"
                  style="max-width: 200px; max-height: 200px; border-radius: 4px;" />
                <div v-if="message.chatCaption" class="message-caption">
                  {{ message.chatCaption }}
                </div>
              </div>
              <div v-else class="message-text">
                {{ message.chatBody }}
              </div>
              <div class="message-time">
                {{ formatTime(message.createTime) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div v-if="isExpanded" class="chat-input-area">
        <div class="input-toolbar">
          <ClientOnly>
            <UPopover v-model:open="emojiPopoverOpen">
              <UButton icon="i-heroicons-face-smile" color="neutral" variant="ghost" size="sm"
                :disabled="inputDisabled" />
              <template #content>
                <div class="emoji-picker-container">
                  <Picker :data="emojiIndex" set="twitter" native :style="{ width: '300px' }" @select="handleEmojiSelect" />
                </div>
              </template>
            </UPopover>
          </ClientOnly>
        </div>
        <textarea v-model="inputMessage" rows="3" placeholder="Type a message..."
          :disabled="inputDisabled || !isConnected" @keydown.ctrl.enter="handleSendMessage"
          @keydown.meta.enter="handleSendMessage"></textarea>
        <div class="input-actions">
          <UButton color="primary" :disabled="!inputMessage.trim() || inputDisabled || !isConnected"
            :loading="inputDisabled" @click="handleSendMessage">
            Send
          </UButton>
        </div>
      </div>
    </div>

    <!-- 悬浮按钮 -->
    <div class="chat-toggle-btn" :class="{ hidden: isExpanded }" @click="toggleChat">
      <span>💬</span>
      <!-- 未读消息提示红点 -->
      <span v-if="hasUnreadMessages" class="unread-badge"></span>
    </div>

    <!-- 挂载对话框组件 -->
    <!-- <EditorContactFormDialog v-model="dialogOpen" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import socketClient from '~/composables/socketClient'
import useSocketStore from '~/stores/socket'
import { useAuthStore } from '~/stores/auth'
import { useCustomFetch } from '~/api/request'
// emoji-mart-vue-fast（表情选择器库）
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
// 导入表情数据（支持所有表情）
import data from 'emoji-mart-vue-fast/data/all.json'

// 创建表情索引实例
const emojiIndex = new EmojiIndex(data, {
  // include: ['people', 'smileys']
});

// 聊天状态
const isExpanded = ref(false)
const chatMessagesRef = ref(null)
const chatMessages = ref([])
const messagesLoading = ref(false)
const isInitialLoading = ref(false)
const isLoadingMore = ref(false)
const totalMessages = ref(0)
const inputMessage = ref('')
const inputDisabled = ref(false)
const emojiPopoverOpen = ref(false)
const hasUnreadMessages = ref(false)

// WebSocket 相关
let unsubscribeChat = null
let sessionId = null
const socketStore = useSocketStore()
const isConnected = computed(() => socketStore.isConnected)

// 用户认证状态
const authStore = useAuthStore()
const { $toast } = useNuxtApp()

// 自动滚动相关
const shouldAutoScroll = ref(false)
let heightObserver = null

/**
 * 生成临时消息ID
 * @returns {string} 临时ID字符串
 */
function generateTempId() {
  // 使用浏览器自带的crypto API生成UUID，若不支持则使用兼容方案
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    // 现代浏览器：使用crypto.randomUUID()生成符合RFC4122的UUID
    return `temp_${window.crypto.randomUUID()}`
  } else {
    // 兼容方案：使用时间戳和随机数生成唯一ID
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * 格式化时间
 * @param {string|number} time - 时间戳或时间字符串
 * @returns {string} 格式化后的时间
 */
function formatTime(time) {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

/**
 * 获取完整的图片 URL
 * @param {string} url - 图片 URL
 * @returns {string} 完整的图片 URL
 */
function getImageUrl(url) {
  if (!url) return ''
  // 如果已经是完整 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 否则拼接 baseUrl
  const config = useRuntimeConfig()
  const baseUrl = (config.public.backendImageBase || '').replace(/\/$/, '')
  if (url.startsWith('/')) {
    return baseUrl + url
  }
  return baseUrl + '/' + url
}

/**
 * 选中表情回调
 * @param {Object} emoji - emoji-mart 返回的表情对象
 */
function handleEmojiSelect(emoji) {
  try {
    // emoji.native 为实际字符
    inputMessage.value = `${inputMessage.value || ''}${emoji.native}`
    // 选择表情后关闭弹出框
    emojiPopoverOpen.value = false
  } catch (error) {
    console.error('Failed to handle emoji selection:', error)
  }
}

/**
 * 切换聊天窗口显示状态
 */
function toggleChat() {
  isExpanded.value = !isExpanded.value
  
  // 展开时清除未读消息提示
  if (isExpanded.value) {
    hasUnreadMessages.value = false
  }
  
  // 恢复输入框
  inputDisabled.value = false
  // 展开时，如果 WebSocket 已连接，确保已订阅聊天主题
  if (isExpanded.value && socketStore.isConnected) {
    subscribeChat()
  }
}

/**
 * 创建或获取 Session ID
 * @returns {Promise<string>} Session ID
 */
async function createOrGetSessionId() {
  // 优先使用 authStore 中的 sessionId（通过 pinia-plugin-persistedstate 恢复）
  if (authStore.sessionId) {
    return authStore.sessionId
  }

  // 如果没有存储的 sessionId，则创建新的
  try {
    const customerId = authStore.isLoggedIn && authStore.user
      ? (authStore.user.customerId || authStore.user.id || null)
      : null
    const sessionMode = authStore.isLoggedIn ? 1 : 0

    const response = await useCustomFetch('/web/session/create', {
      method: 'POST',
      body: {
        customerId: customerId ? Number(customerId) : null,
        sessionMode: sessionMode,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 从响应中获取 sessionId（根据实际返回格式调整）
    const newSessionId = response.data
    if (!newSessionId) {
      throw new Error('Failed to get session ID from server')
    }

    // sessionId 一定是字符串类型，直接使用
    authStore.setSessionId(newSessionId)

    return newSessionId
  } catch (error) {
    console.error('Failed to create session:', error)
    throw error
  }
}

/**
 * 连接 WebSocket
 */
async function connectWebSocket() {
  try {
    // 连接 WebSocket（Nuxt 使用 Cookie 认证，不需要传 token）
    const config = useRuntimeConfig()
    await socketClient.connect({
      wsUrl: config.public.wsUrl,
    })
  } catch (error) {
    console.error('WebSocket connection failed:', error)
    $toast.error('Failed to connect to customer service. Please try again later.')
  }
}

/**
 * 订阅聊天主题
 */
async function subscribeChat() {
  // 创建或获取 Session ID
  sessionId = await createOrGetSessionId()

  if (!sessionId) {
    throw new Error('Failed to get session ID')
  }

  // 先取消之前的订阅
  if (unsubscribeChat) {
    unsubscribeChat()
    unsubscribeChat = null
  }

  const topic = `/topic/chat/${sessionId}`

  unsubscribeChat = socketClient.subscribe(topic, (data) => {
    try {
      const response = typeof data === 'string' ? JSON.parse(data) : data

      // 处理统一返回格式
      const { topicType, data: responseData } = response

      if (topicType === 1) {
        // 初始化类型：返回消息对象，包含records数组和total总数
        if (responseData && typeof responseData === 'object') {
          const { records = [], total = 0 } = responseData

          if (Array.isArray(records)) {
            // 按 createTime 排序，最老的在最上面
            const sortedMessages = [...records].sort((a, b) => {
              const timeA = new Date(a.createTime).getTime()
              const timeB = new Date(b.createTime).getTime()
              return timeA - timeB
            })

            // 初始化：替换所有消息
            chatMessages.value = sortedMessages
            messagesLoading.value = false
            isLoadingMore.value = false
            totalMessages.value = total // 保存总消息数

            // 滚动到底部
            nextTick(() => {
              // 启用自动滚动
              shouldAutoScroll.value = true
              // 设置高度监听器，确保内容完全展开后再滚动到底部
              setupHeightObserver()
              scrollToBottom()
              isInitialLoading.value = false
            })
          }
        }
      } else if (topicType === 2) {
        // 新消息类型：单个消息对象
        if (responseData) {
          // 直接添加后端返回的消息（不再处理临时消息）
          chatMessages.value.push(responseData)

          // 如果聊天窗口是收起状态，显示未读消息提示
          if (!isExpanded.value) {
            hasUnreadMessages.value = true
          }

          nextTick(() => {
            // 保持自动滚动状态
            shouldAutoScroll.value = true
            // 滚动到底部
            scrollToBottom()
            // 恢复输入框
            inputDisabled.value = false
          })
        }
      } else if (topicType === 3) {
        // 加载更多类型：返回消息对象，包含records数组和total总数
        if (responseData && typeof responseData === 'object') {
          const { records = [], total = 0 } = responseData

          if (Array.isArray(records)) {
            // 按 createTime 排序，最老的在最上面
            const sortedMessages = [...records].sort((a, b) => {
              const timeA = new Date(a.createTime).getTime()
              const timeB = new Date(b.createTime).getTime()
              return timeA - timeB
            })

            // 加载更多：将新消息插入到顶部
            // 暂时禁用自动滚动，保持用户当前视图位置
            shouldAutoScroll.value = false

            // 保存当前滚动位置
            const oldScrollHeight = chatMessagesRef.value?.scrollHeight || 0
            const oldScrollTop = chatMessagesRef.value?.scrollTop || 0

            chatMessages.value = [...sortedMessages, ...chatMessages.value]
            isLoadingMore.value = false
            totalMessages.value = total // 更新总消息数

            // 恢复滚动位置（保持用户看到的内容不变）
            nextTick(() => {
              if (chatMessagesRef.value) {
                const newScrollHeight = chatMessagesRef.value.scrollHeight
                const heightDiff = newScrollHeight - oldScrollHeight
                chatMessagesRef.value.scrollTop = oldScrollTop + heightDiff
              }
            })
          }
        }
      }
    } catch (error) {
      console.error('处理聊天消息失败:', error)
    }
  })
}

/**
 * 发送文本消息
 */
async function handleSendMessage() {
  if (!inputMessage.value.trim() || !sessionId || inputDisabled.value || !isConnected.value) {
    return
  }

  try {
    const message = inputMessage.value.trim()
    inputMessage.value = ''
    inputDisabled.value = true

    // 通过 WebSocket 发送消息（不添加临时消息，直接等待订阅主题返回）
    socketClient.send('/message/send', {
      sessionId: sessionId,
      message: message,
      hasMedia: false,
      mimeType: '',
      caption: '',
    })
  } catch (error) {
    console.error('Failed to send message:', error)
    $toast.error('Failed to send message. Please try again later.')
    inputDisabled.value = false
  }
}

/**
 * 加载更多历史消息
 */
async function loadMoreChatRecords() {
  if (!sessionId || isLoadingMore.value || isInitialLoading.value) {
    return
  }

  // 获取最上面那条消息的 ID
  const topMessage = chatMessages.value[0]
  if (!topMessage || !topMessage.chatId) {
    isLoadingMore.value = false
    return
  }

  try {
    isLoadingMore.value = true

    // 通过 WebSocket 发送加载更多请求
    socketClient.send('/message/refresh', {
      pointId: topMessage.chatId,
      sessionId: sessionId,
    })

    // 注意：实际的历史消息会通过 WebSocket 主题返回（topicType=3），在 subscribeChat 中处理
    // 如果超时没有返回，重置状态
    setTimeout(() => {
      if (isLoadingMore.value) {
        isLoadingMore.value = false
      }
    }, 5000)
  } catch (error) {
    console.error('Failed to load more messages:', error)
    isLoadingMore.value = false
  }
}

/**
 * 滚动到底部
 */
function scrollToBottom() {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

/**
 * 设置高度变化监听器
 * 使用MutationObserver监听DOM变化，当图片、视频等媒体内容加载导致高度变化时自动滚动到底部
 */
function setupHeightObserver() {
  if (!chatMessagesRef.value || heightObserver) return

  // 创建MutationObserver实例
  heightObserver = new MutationObserver(() => {
    // 检查是否需要自动滚动
    if (!shouldAutoScroll.value) return
    scrollToBottom()
  })

  // 开始观察
  heightObserver.observe(chatMessagesRef.value, {
    childList: true, // 观察子元素的变化
    subtree: true, // 观察所有后代节点
    attributes: true, // 观察属性变化
    attributeFilter: ['src', 'style', 'class'], // 只观察可能影响布局的属性
  })

  // 同时监听图片加载完成事件
  if (process.client) {
    const images = chatMessagesRef.value.querySelectorAll('img')
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', scrollToBottom, { once: true })
        img.addEventListener('error', scrollToBottom, { once: true })
      }
    })
  }
}

/**
 * 清理高度变化监听器
 */
function cleanupHeightObserver() {
  if (heightObserver) {
    heightObserver.disconnect()
    heightObserver = null
  }
}

/**
 * 处理滚动事件
 * 当用户手动滚动离开底部时，禁用自动滚动
 */
function handleScroll() {
  if (!chatMessagesRef.value) return

  const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.value
  // 当用户滚动离开底部100px以上时，禁用自动滚动
  shouldAutoScroll.value = scrollHeight - scrollTop - clientHeight < 100
}

// 上滑加载更多
useInfiniteScroll(
  chatMessagesRef,
  async () => {
    // 跳过首次加载和正在加载的情况
    if (isInitialLoading.value || isLoadingMore.value) {
      return
    }
    // 只有当聊天消息列表不为空时才尝试加载更多
    if (chatMessages.value.length === 0) {
      return
    }
    // 加载更多历史消息
    await loadMoreChatRecords()
  },
  {
    direction: 'top', // 向上滚动触发
    distance: 50, // 距离顶部50px时触发
    interval: 300, // 防抖间隔300ms
    canLoadMore: () => {
      // 判断是否可以加载更多：
      // 1. 不在初始加载状态
      // 2. 不在加载更多状态
      // 3. 聊天消息列表不为空（表示已经有初始数据）
      // 4. 已加载的消息数小于总消息数
      return (
        !isInitialLoading.value &&
        !isLoadingMore.value &&
        chatMessages.value.length > 0 &&
        chatMessages.value.length < totalMessages.value
      )
    },
  }
)

// 监听 authStore.sessionId 的变化，如果已连接 WebSocket，重新订阅主题
watch(
  () => authStore.sessionId,
  (newSessionId) => {
    if (newSessionId && socketStore.isConnected && isExpanded.value) {
      // sessionId 变化且 WebSocket 已连接，更新 sessionId 并重新订阅
      sessionId = newSessionId
      console.log('sessionId 变化，重新订阅主题', sessionId)
      subscribeChat()
    }
  }
)

// 组件挂载时连接 WebSocket 并添加滚动事件监听器
onMounted(async () => {
  // 根据运行时配置决定是否连接 WebSocket
  const config = useRuntimeConfig()  
  if (config.public.enableWs === 'true') {
    // 组件挂载后立即连接 WebSocket
    await connectWebSocket()
  }

  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.addEventListener('scroll', handleScroll)
    }
  })
})

// 组件卸载时清理
onUnmounted(() => {
  if (unsubscribeChat) {
    unsubscribeChat()
    unsubscribeChat = null
  }

  // 清理滚动事件监听器
  if (process.client && chatMessagesRef.value) {
    chatMessagesRef.value.removeEventListener('scroll', handleScroll)
  }

  // 清理高度变化监听器
  cleanupHeightObserver()
})
</script>

<style scoped lang="scss">
.customer-service-chat {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  // 确保圆圈按钮和聊天窗口在同一位置
  .chat-toggle-btn,
  .chat-window {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
}

.chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  z-index: 1000;

  &.expanded {
    height: 500px;
    opacity: 1;
    pointer-events: auto;
  }
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: rgba($primary-color, 0.95);
  color: #fff;
  cursor: pointer;
}

.chat-title {
  font-size: 16px;
  font-weight: 500;
}

.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  span {
    line-height: 1;
  }
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f5f7fa;
  position: relative;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #909399;
  font-size: 14px;

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid $primary-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 12px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.message-item {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;

  &.message-left {
    justify-content: flex-start;
  }

  &.message-right {
    justify-content: flex-end;
  }
}

.message-container {
  display: flex;
  align-items: flex-start;
  max-width: 75%;
  gap: 8px;
}

.message-left .message-container {
  flex-direction: row;
}

.message-right .message-container {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  flex-shrink: 0;
}

.message-right .message-avatar {
  background-color: rgba($primary-color, 0.85);
}

.message-left .message-avatar {
  background-color: rgba(#909399, 0.85);
}

.message-content {
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  gap: 4px;
}

.message-right .message-content {
  align-items: flex-end;
}

.message-left .message-content {
  align-items: flex-start;
}

.message-text {
  padding: 6px 10px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  word-wrap: break-word;
  white-space: pre-line;
  font-size: 13px;
  color: #333;
}

.message-right .message-text {
  background-color: rgba($primary-color, 0.9);
  color: #fff;
}

.message-image {
  position: relative;
  margin-bottom: 4px;
}

.message-caption {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(102, 102, 102, 0.8);
  line-height: 1.4;
}

.message-time {
  font-size: 11px;
  color: #909399;
  padding: 0 2px;
}

.chat-input-area {
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #ebeef5;
}

.input-toolbar {
  margin-bottom: 8px;
}

textarea {
  width: 100%;
  min-height: 60px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;

  &:focus {
    border-color: $primary-color;
  }

  &:disabled {
    background-color: #f5f7fa;
    cursor: not-allowed;
  }
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: $primary-color;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  z-index: 999;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  &.hidden {
    display: none;
  }

  .unread-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ff4444;
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 表情选择器容器 */
.emoji-picker-container {
  padding: 8px;
}
</style>

<style lang="scss">
/* load twitter sheet from own server */
.emoji-type-image.emoji-set-twitter {
  background-image: url('~/assets/img/emoji-sheet.png') !important;
}
</style>

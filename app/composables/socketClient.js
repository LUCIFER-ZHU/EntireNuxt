/**
 * WebSocket 客户端工具函数
 * @description 提供便捷的 WebSocket 操作方法
 */

import useSocketStore from '~/stores/socket'

/**
 * WebSocket 客户端类
 */
class SocketClient {
  /**
   * 获取 Socket Store 实例
   * @private
   * @returns {Object} Socket Store
   */
  _getStore() {
    return useSocketStore()
  }

  /**
   * 初始化 WebSocket 连接
   * @param {Object} config - 配置对象
   * @param {string} [config.wsUrl] - WebSocket 服务器地址（可选，默认从环境变量读取）
   * @param {string} config.userId - 用户ID（必填）
   * @param {string} [config.token] - 认证令牌（可选，Nuxt 使用 Cookie 认证）
   * @returns {Promise<void>}
   */
  async connect({ wsUrl, userId, token }) {
    const store = this._getStore()

    // 设置默认值
    const config = useRuntimeConfig()
    const finalWsUrl = wsUrl || config.public.wsUrl
    const finalToken = token

    return store.connect({
      wsUrl: finalWsUrl,
      userId,
      token: finalToken,
    })
  }

  /**
   * 断开 WebSocket 连接
   * @returns {Promise<void>}
   */
  async disconnect() {
    const store = this._getStore()
    return store.disconnect()
  }

  /**
   * 订阅主题
   * @param {string} topic - 主题地址
   * @param {Function} callback - 消息回调函数
   * @param {Object} [headers={}] - 订阅头信息
   * @returns {Function|null} 取消订阅函数
   */
  subscribe(topic, callback, headers = {}) {
    // 检查是否启用 WebSocket 功能（默认启用，设置为 'false' 时禁用）
    const config = useRuntimeConfig()
    if (config.public.enableWebSocket === 'false') {
      console.warn('⚠️ WebSocket 功能已禁用，订阅操作被忽略')
      return null
    }

    const store = this._getStore()
    return store.subscribe(topic, callback, headers)
  }

  /**
   * 取消订阅
   * @param {string} topic - 主题地址
   */
  unsubscribe(topic) {
    const store = this._getStore()
    return store.unsubscribe(topic)
  }

  /**
   * 发送消息
   * @param {string} destination - 目标地址
   * @param {Object} body - 消息体
   * @param {Object} [headers={}] - 消息头
   */
  send(destination, body, headers = {}) {
    const store = this._getStore()
    return store.send(destination, body, headers)
  }

  /**
   * 检查是否已连接
   * @returns {boolean}
   */
  isConnected() {
    const store = this._getStore()
    return store.isConnected
  }

  /**
   * 获取连接状态
   * @returns {string}
   */
  getStatus() {
    const store = this._getStore()
    return store.status
  }

  /**
   * 获取已订阅的主题列表
   * @returns {Array<string>}
   */
  getSubscribedTopics() {
    const store = this._getStore()
    return store.subscribedTopics
  }
}

// 导出单例实例
const socketClient = new SocketClient()

/**
 * 组合式函数：在 Vue 组件中使用 WebSocket
 * @returns {Object} WebSocket 相关方法和状态
 */
export function useSocket() {
  const store = useSocketStore()

  return {
    // 状态
    isConnected: computed(() => store.isConnected),
    status: computed(() => store.status),
    subscribedTopics: computed(() => store.subscribedTopics),

    // 方法
    connect: store.connect.bind(store),
    disconnect: store.disconnect.bind(store),
    subscribe: store.subscribe.bind(store),
    unsubscribe: store.unsubscribe.bind(store),
    send: store.send.bind(store),
    onConnect: store.onConnect.bind(store),
    onDisconnect: store.onDisconnect.bind(store),
  }
}

export default socketClient

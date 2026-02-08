<template>
  <div class="test-error-page">
    <h1>错误处理测试页面</h1>
    <p class="description">
      此页面用于测试 Nuxt 4 官方推荐的错误处理机制
    </p>

    <!-- 测试按钮组 -->
    <div class="test-section">
      <h2>1. 全局错误测试</h2>
      <p>这些错误会被全局错误页面捕获（error.vue）</p>
      
      <div class="button-group">
        <button @click="throwFatalError" class="btn-danger">
          抛出致命错误 (fatal: true)
        </button>
        
        <button @click="throwAsyncError" class="btn-danger">
          抛出异步错误
        </button>
        
        <button @click="throw404Error" class="btn-warning">
          抛出 404 错误
        </button>
      </div>
    </div>

    <!-- 组件错误边界测试 -->
    <div class="test-section">
      <h2>2. 组件错误边界测试</h2>
      <p>这些错误会被 NuxtErrorBoundary 捕获，不会影响整个页面</p>
      
      <NuxtErrorBoundary @error="onComponentError">
        <!-- 正常内容 -->
        <div v-if="!showErrorComponent" class="success-content">
          <p>✅ 组件正常工作中</p>
          <button @click="triggerComponentError" class="btn-danger">
            触发组件错误
          </button>
        </div>

        <!-- 会抛出错误的组件 -->
        <ErrorComponent v-else />

        <!-- 错误插槽 -->
        <template #error="{ error, clearError }">
          <div class="error-boundary-display">
            <h3>⚠️ 组件错误已被捕获</h3>
            <p><strong>错误信息:</strong> {{ error.message }}</p>
            
            <div v-if="isDev" class="stack-trace">
              <details>
                <summary>错误堆栈（开发环境）</summary>
                <pre><code>{{ error.stack }}</code></pre>
              </details>
            </div>
            
            <button @click="handleClearError(clearError)" class="btn-success">
              清除错误并重试
            </button>
          </div>
        </template>
      </NuxtErrorBoundary>
    </div>

    <!-- Promise 错误测试 -->
    <div class="test-section">
      <h2>3. Promise 错误测试</h2>
      <p>未捕获的 Promise 拒绝会被错误处理插件捕获</p>
      
      <div class="button-group">
        <button @click="throwUnhandledPromiseRejection" class="btn-warning">
          抛出未处理的 Promise 拒绝
        </button>
      </div>
    </div>

    <!-- SSR 错误测试 -->
    <div class="test-section">
      <h2>4. SSR 错误测试</h2>
      <p>服务端渲染错误会在终端显示源码位置</p>
      
      <div class="button-group">
        <button @click="navigateToSSRError" class="btn-danger">
          导航到 SSR 错误页面
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 错误处理测试页面
 * 演示 Nuxt 4 官方推荐的各种错误处理方式
 * 
 * 参考文档: https://nuxt.com/docs/4.x/getting-started/error-handling
 */

definePageMeta({
  layout: 'default',
})

const isDev = process.dev
const showErrorComponent = ref(false)

// 1. 抛出致命错误（会触发全局错误页面）
const throwFatalError = () => {
  throw createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message: '这是一个致命错误测试',
    fatal: true,
  })
}

// 2. 抛出异步错误
const throwAsyncError = async () => {
  await new Promise(resolve => setTimeout(resolve, 100))
  throw createError({
    statusCode: 500,
    message: '这是一个异步错误测试',
    fatal: true,
  })
}

// 3. 抛出 404 错误
const throw404Error = () => {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    message: '请求的资源不存在',
    fatal: true,
  })
}

// 4. 触发组件错误（被 NuxtErrorBoundary 捕获）
const triggerComponentError = () => {
  showErrorComponent.value = true
}

// 5. 组件错误处理回调
const onComponentError = (error: Error) => {
  console.log('📦 组件错误已被 NuxtErrorBoundary 捕获:', error.message)
}

// 6. 清除组件错误
const handleClearError = (clearError: () => void) => {
  showErrorComponent.value = false
  clearError()
}

// 7. 未处理的 Promise 拒绝
const throwUnhandledPromiseRejection = () => {
  Promise.reject(new Error('未处理的 Promise 拒绝测试'))
}

// 8. 导航到 SSR 错误页面
const navigateToSSRError = async () => {
  // 创建一个会在 SSR 时出错的场景
  await navigateTo('/non-existent-page')
}

// 定义一个会抛出错误的组件
const ErrorComponent = defineComponent({
  name: 'ErrorComponent',
  setup() {
    // 立即抛出错误
    throw new Error('这是一个组件渲染错误测试')
    return {}
  },
  render() {
    return h('div', '不应该看到这个')
  },
})
</script>

<style scoped lang="scss">
.test-error-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .description {
    color: #666;
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }

  .test-section {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h2 {
      color: #333;
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
    }

    p {
      color: #666;
      margin: 0 0 1.5rem;
    }
  }

  .button-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.25rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &.btn-danger {
        background: #dc3545;
        color: white;

        &:hover {
          background: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
        }
      }

      &.btn-warning {
        background: #ffc107;
        color: #212529;

        &:hover {
          background: #e0a800;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
        }
      }

      &.btn-success {
        background: #28a745;
        color: white;

        &:hover {
          background: #218838;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
        }
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  .success-content {
    padding: 1.5rem;
    background: #d4edda;
    border: 2px solid #c3e6cb;
    border-radius: 0.5rem;

    p {
      margin: 0 0 1rem;
      color: #155724;
      font-weight: 600;
    }
  }

  .error-boundary-display {
    padding: 2rem;
    background: #fff3cd;
    border: 2px solid #ffc107;
    border-radius: 0.5rem;

    h3 {
      color: #856404;
      margin: 0 0 1rem;
    }

    p {
      color: #856404;
      margin: 0 0 1rem;
    }

    .stack-trace {
      margin: 1rem 0;

      details {
        background: white;
        padding: 1rem;
        border-radius: 0.25rem;

        summary {
          cursor: pointer;
          font-weight: 600;
          color: #856404;
          user-select: none;
        }

        pre {
          margin-top: 1rem;
          overflow-x: auto;

          code {
            font-size: 0.875rem;
            line-height: 1.5;
            color: #333;
          }
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import type { NuxtError } from '#app'

/**
 * 全局错误页面
 * 处理应用级别的致命错误
 * 符合 Nuxt 4 官方最佳实践
 */
/* eslint-disable vue/require-default-prop */
const props = defineProps({
  error: Object as () => NuxtError,
})

const isDev = process.dev
const router = useRouter()

// 清除错误并返回首页
const handleError = () => clearError({ redirect: '/' })

// 返回上一页
const goBack = () => router.back()

// 格式化错误堆栈，显示源码位置
const formatStack = (stack?: string) => {
  if (!stack) return null
  return stack.split('\n').slice(0, 10).join('\n')
  return null
}

// 获取错误详细信息
const errorDetails = computed(() => {
  const err = props.error
  if (!err) return null
  
  return {
    statusCode: err.statusCode || 500,
    statusMessage: err.statusMessage || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    stack: err.stack,
    url: (err as any).url,
    data: (err as any).data,
  }
})
</script>

<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-header">
        <h1 class="error-code">{{ errorDetails?.statusCode }}</h1>
        <h2 class="error-title">{{ errorDetails?.statusMessage }}</h2>
      </div>

      <div class="error-body">
        <p class="error-message">{{ errorDetails?.message }}</p>
        
        <!-- 开发环境显示详细错误信息 -->
        <div v-if="errorDetails" class="error-debug">
          <details class="error-details">
            <div v-if="errorDetails.url" class="error-info">
              <strong>请求 URL:</strong>
              <code>{{ errorDetails.url }}</code>
            </div>
            
            <div v-if="errorDetails.stack" class="error-stack">
              <strong>错误堆栈（含源码位置）:</strong>
              <pre><code>{{ errorDetails.stack }}</code></pre>
            </div>
            
            <div v-if="errorDetails.data" class="error-data">
              <strong>附加数据:</strong>
              <pre><code>{{ JSON.stringify(errorDetails.data, null, 2) }}</code></pre>
            </div>
          </details>
        </div>

        <div class="error-actions">
          <button @click="handleError" class="btn-primary">
            返回首页
          </button>
          <button @click="goBack" class="btn-secondary">
            返回上一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-container {
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.error-header {
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 2rem;
}

.error-code {
  font-size: 6rem;
  font-weight: 900;
  color: #667eea;
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: 1.5rem;
  color: #333;
  margin: 1rem 0 0;
  font-weight: 600;
}

.error-body {
  text-align: center;
}

.error-message {
  font-size: 1.125rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-debug {
  margin: 2rem 0;
  text-align: left;
}

.error-details {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;

  summary {
    font-weight: 600;
    color: #495057;
    padding: 0.5rem;
    user-select: none;
    
    &:hover {
      color: #667eea;
    }
  }
}

.error-info,
.error-stack,
.error-data {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.25rem;
  
  strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  code {
    color: #e83e8c;
    background: #f8f9fa;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
  
  pre {
    margin: 0;
    overflow-x: auto;
    
    code {
      display: block;
      padding: 1rem;
      color: #333;
      white-space: pre;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
    }
  }
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  button {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.btn-primary {
      background: #667eea;
      color: white;
      
      &:hover {
        background: #5568d3;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
    }
    
    &.btn-secondary {
      background: #e9ecef;
      color: #495057;
      
      &:hover {
        background: #dee2e6;
        transform: translateY(-2px);
      }
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

@media (max-width: 768px) {
  .error-container {
    padding: 2rem;
  }
  
  .error-code {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: 1.25rem;
  }
  
  .error-actions {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
}
</style>

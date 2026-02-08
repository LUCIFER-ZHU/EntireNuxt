<template>
  <div class="infinite-scroll-products" :class="{ 'is-mobile': isMobile }">
    <h2 class="section-title">High-quality machine tool products</h2>

    <!-- 骨架屏：首次加载时显示 -->
    <div v-if="pending && products.length === 0" class="products-grid">
      <div v-for="i in skeletonCount" :key="`skeleton-${i}`" class="product-card skeleton-card">
        <!-- 商品图片骨架 -->
        <USkeleton class="skeleton-image" />

        <!-- 商品信息骨架 -->
        <div class="product-info">
          <USkeleton class="skeleton-name" />
          <USkeleton class="skeleton-button" />
        </div>
      </div>
    </div>

    <!-- 实际商品列表 -->
    <div v-else class="products-grid">
      <ReNewProductCard v-for="(product, index) in products" :key="product.id || index" :product="product"
        @chat-now="handleChatNow" />
    </div>

    <!-- 加载更多时的骨架屏（底部） -->
    <div v-if="pending && products.length > 0" class="products-grid loading-more-skeleton">
      <div v-for="i in Math.min(skeletonCount, 5)" :key="`loading-skeleton-${i}`" class="product-card skeleton-card">
        <USkeleton class="skeleton-image" />
        <div class="product-info">
          <USkeleton class="skeleton-name" />
          <USkeleton class="skeleton-button" />
        </div>
      </div>
    </div>

    <!-- 没有更多数据提示 -->
    <div v-if="!hasMore && products.length > 0" class="no-more-indicator">
      No more products
    </div>

    <!-- 无限滚动触发元素（只在还有更多数据时显示） -->
    <div v-if="hasMore" ref="loadMoreTrigger" class="load-more-trigger"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { getProductInfoListSSR } from '~/api/product'

// 获取图片URL管理
const { buildBackendImageUrl } = useImageUrl()

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

// 分页参数（响应式）
const pageNum = ref(1)
const pageSize = ref(10)

// 使用 SSR 获取产品列表
const { data: productData, pending, error } = await getProductInfoListSSR(pageNum, pageSize)

// 处理错误
if (error.value) {
  console.error('Failed to load products:', error.value)
}

// 商品列表
const products = ref<Record<string, any>[]>([])

// 骨架屏数量（根据页面大小动态计算）
const skeletonCount = computed(() => pageSize.value)

// 是否还有更多数据
const hasMore = computed(() => {
  if (!productData.value) return true

  // 如果返回了 total，根据 total 和已加载的记录数判断
  if (productData.value.total !== undefined && productData.value.total !== null) {
    return products.value.length < productData.value.total
  }

  // 如果没有 total，降级使用当前返回的数据条数判断
  const currentProducts = productData.value.rows || []
  return currentProducts.length >= pageSize.value
})

// 监听产品数据变化，更新商品列表
watch(productData, (newData) => {
  if (newData?.rows && newData.rows.length > 0) {
    if (pageNum.value === 1) {
      // 第一页，重置列表
      products.value = [...newData.rows]
    } else {
      // 后续页，追加到列表
      products.value.push(...newData.rows)
    }
  } else if (newData && pageNum.value > 1) {
    // 如果没有数据且不是第一页，说明没有更多数据了
    // hasMore 会通过 computed 自动更新
  }
}, { immediate: true })

// 加载更多触发元素
const loadMoreTrigger = ref<HTMLElement | null>(null)

// 加载更多商品数据
const loadMoreProducts = async () => {
  if (pending.value || !hasMore.value) {
    return
  }

  // 增加页码，useFetch 会自动重新请求
  pageNum.value++
}

// 使用 IntersectionObserver 监听加载触发元素
useIntersectionObserver(
  loadMoreTrigger,
  (entries) => {
    const entry = entries[0]
    // 当元素进入视口且还有更多数据且不在加载中时，加载更多
    if (entry?.isIntersecting && hasMore.value && !pending.value) {
      loadMoreProducts()
    }
  },
  {
    // 提前100px触发加载
    rootMargin: '100px'
  }
)

const emit = defineEmits<{
  openDialog: []
}>()

const handleChatNow = () => {
  emit('openDialog')
}

// 组件挂载时，如果 SSR 数据还没加载完成，会在挂载后自动加载
</script>

<style scoped lang="scss">
.infinite-scroll-products {
  padding: 4.1667vw 12.0833vw;
  background: #F9F9F9;

  .section-title {
    font-size: clamp(24px, 2.5vw, 48px);
    font-weight: 700;
    color: #000000;
    text-align: center;
    margin-bottom: 3.125vw;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1.25vw;

    @media (max-width: 1400px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .loading-indicator,
  .no-more-indicator {
    text-align: center;
    padding: 2.0833vw;
    font-size: clamp(14px, 1.0417vw, 20px);
    color: #6B7280;
  }

  .load-more-trigger {
    height: 1px;
    width: 100%;
    visibility: hidden;
  }

  .skeleton-card {
    cursor: default;
    pointer-events: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  .skeleton-image {
    width: 100%;
    height: 9.375vw;
    border-radius: 0.625vw;
  }

  .skeleton-name {
    width: 100%;
    height: 3.2292vw;
    margin: 1.0417vw 0;
    border-radius: 0.3125vw;
  }

  .skeleton-button {
    width: 100%;
    height: 2.6042vw;
    border-radius: 0.3125vw;
  }

  .loading-more-skeleton {
    margin-top: 1.25vw;
  }

  /* ------------------------------------Mobile样式----------------------------*/
  &.is-mobile {
    padding: 10.6667vw 5.3333vw;

    .section-title {
      margin-bottom: 8.5333vw;
      font-size: clamp(12px, 4.2667vw, 32px);
    }

    .products-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 4.2667vw;
    }

    .loading-indicator,
    .no-more-indicator {
      padding: 5.3333vw;
      font-size: clamp(12px, 3.2vw, 16px);
    }

    .skeleton-image {
      height: 53.3333vw;
      border-radius: 2.6667vw;
    }

    .skeleton-name {
      height: 12.8vw;
      margin: 2.6667vw 0;
      border-radius: 1.6vw;
      margin-bottom: 4.2667vw;
    }

    .skeleton-button {
      height: 10.6667vw;
      border-radius: 1.6vw;
    }

    .loading-more-skeleton {
      margin-top: 4.2667vw;
    }
  }
}
</style>

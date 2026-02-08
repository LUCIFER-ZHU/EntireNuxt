<template>
  <div class="new-arrival-products" :class="{ 'is-mobile': isMobile }">
    <h2 class="section-title">High-quality machine tool products</h2>

    <!-- 骨架屏：加载时显示 -->
    <div v-if="pending" class="products-grid">
      <div v-for="i in 5" :key="`skeleton-${i}`" class="product-card skeleton-card">
        <USkeleton class="skeleton-image" />
        <div class="product-info">
          <USkeleton class="skeleton-name" />
          <USkeleton class="skeleton-button" />
        </div>
      </div>
    </div>

    <!-- 实际商品列表 -->
    <div v-else class="products-grid">
      <ReNewProductCard v-for="(product, index) in displayProducts" :key="product.id || index" :product="product"
        @chat-now="handleChatNow" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getNewProductInfoListSSR } from '~/api/product'

const { isMobile } = useDeviceDetection()

const pageNum = ref(1)
const pageSize = ref(5)

const { data: productData, pending, error } = await getNewProductInfoListSSR(pageNum, pageSize) 

if (error.value) {
  console.error('Failed to load new arrival products:', error.value)
}

const displayProducts = computed(() => {
  if (!productData.value?.data) return []
  return productData.value.data.slice(0, 5)
})

const emit = defineEmits<{
  openDialog: []
}>()

const handleChatNow = () => {
  emit('openDialog')
}
</script>

<style scoped lang="scss">
.new-arrival-products {
  padding: 4.1667vw 12.0833vw;
  background: #F9F9F9;
  width: 100%;

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
  }
}
</style>

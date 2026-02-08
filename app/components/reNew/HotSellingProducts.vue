<template>
  <div class="hot-selling-products" :class="{ 'is-mobile': isMobile }">
    <div class="container">
      <div class="left-section">
        <h2 class="section-title">Hot-selling product</h2>

        <ul class="feature-list">
          <li class="feature-item">
            <div class="feature-icon">
              <NuxtImg densities="1" :src="buildImageUrl('/image/icon/1.webp')" alt="Unbeatable Prices" class="icon" />
            </div>
            <span class="feature-text">Unbeatable Prices</span>
          </li>
          <li class="feature-item">
            <div class="feature-icon">
              <NuxtImg densities="1" :src="buildImageUrl('/image/icon/2.webp')" alt="Looks and Feels Like New" class="icon" />
            </div>
            <span class="feature-text">Looks and Feels Like New</span>
          </li>
          <li class="feature-item">
            <div class="feature-icon">
              <NuxtImg densities="1" :src="buildImageUrl('/image/icon/3.webp')" alt="Peace of Mind Guaranteed" class="icon" />
            </div>
            <span class="feature-text">Peace of Mind Guaranteed</span>
          </li>
        </ul>
      </div>

      <div class="right-section" data-aos="fade-left">
        <div class="products-grid">
          <ReNewProductCard v-for="(product, index) in displayProducts" :key="product.id || index" :product="product"
            @chat-now="handleChatNow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getProductInfoListSSR } from '~/api/product'

const { buildImageUrl } = useImageUrl()
const { isMobile } = useDeviceDetection()

const pageNum = ref(1)
const pageSize = ref(4)

const { data: productData, pending, error } = await getProductInfoListSSR(pageNum, pageSize)

if (error.value) {
  console.error('Failed to load hot selling products:', error.value)
}

const displayProducts = computed(() => {
  if (!productData.value?.rows) return []
  return productData.value.rows.slice(0, 4)
})

const emit = defineEmits<{
  openDialog: []
}>()

const handleChatNow = () => {
  emit('openDialog')
}
</script>

<style scoped lang="scss">
.hot-selling-products {
  background: url($image-base + '/image/img12.webp')  center / cover no-repeat;
  padding: 1.4583vw 8.5417vw;
  width: 100%;

  .container {
    display: grid;
    grid-template-columns: 1fr 2.5fr;
    gap: 4.3229vw;
    align-items: center;
  }

  .left-section {
    color: #FFFFFF;

    .section-title {
      font-size: clamp(28px, 1.875vw, 36px);
      font-weight: 700;
      margin-bottom: 2.6042vw;
    }

    .feature-list {
      list-style: none;
      padding: 0;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 1.0417vw;
        margin-bottom: 2.0833vw;

        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-text {
          font-size: clamp(12px, .9375vw, 18px);
          font-weight: 500;
        }
      }
    }
  }

  .right-section {
    .products-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.0417vw;

      :deep(.product-card) {
        background: rgba(53, 58, 90, 1);

        &:hover {
          box-shadow: 0 0.4167vw 1.25vw rgba(0, 0, 0, 0.3);
        }
      }

      :deep(.product-info) {
        color: #FFFFFF;
      }

      :deep(.product-stock) {
        color: #FFFFFF;
      }
    }
  }

  /* ------------------------------------Mobile样式----------------------------*/
  &.is-mobile {
    padding: 10.6667vw 5.3333vw;

    .container {
      display: flex;
      flex-direction: column;
      gap: 8.5333vw;
    }

    .section-title {
      margin-bottom: 8.5333vw;
      font-size: clamp(12px, 4.2667vw, 32px);
    }

    .products-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 4.2667vw;
    }
  }
}
</style>
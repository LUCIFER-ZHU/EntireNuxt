<template>
  <div class="product-card" @click="handleCardClick">
    <div class="product-image">
      <NuxtImg v-if="getProductImage(product).hasImage" :src="getProductImage(product).url"
        :alt="product.productName || 'Product image'" loading="lazy" densities="1" class="product-img" />
      <div v-else class="product-image-placeholder">
        <ClientOnly>
          <UIcon name="i-heroicons-cube" class="product-icon-fallback" />
        </ClientOnly>
      </div>
    </div>

    <div class="product-info">
      <h3 class="product-name" :title="product.productName">{{ product.productName || 'Product Name' }}</h3>
      <div class="product-op-time">
        <span>Operating Time {{ product.processingTime || '---' }}h</span>
      </div>
      <div class="product-line">
        <div class="product-stock">Stock: {{ product.virtualInventory || product.inventory || '---' }}</div>
        <div class="product-country">
          <NuxtImg v-if="product.iconUrl" :src="buildBackendImageUrl(product.iconUrl)" alt="product-country"
            loading="lazy" densities="1" class="country-flag" />
          <ClientOnly v-else>
            <UIcon name="i-heroicons-globe-alt" class="country-icon-placeholder" />
          </ClientOnly>
          <span>{{ product.isoCode || '---' }}</span>
        </div>
      </div>
      <div class="product-footer">
        <button class="chat-button" @click.stop="handleChatNow">
          Chat Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { buildBackendImageUrl } = useImageUrl()

const props = defineProps<{
  product: Record<string, any>
}>()

const emit = defineEmits<{
  chatNow: []
}>()

const getProductImage = (product: Record<string, any>): { url: string; hasImage: boolean } => {
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0]
    if (firstImage?.url) {
      return {
        url: buildBackendImageUrl(firstImage.url),
        hasImage: true
      }
    }
  }
  if (product.image) {
    return {
      url: buildBackendImageUrl(product.image),
      hasImage: true
    }
  }
  return {
    url: buildBackendImageUrl(null),
    hasImage: false
  }
}

const handleCardClick = () => {
  if (props.product?.seoPath) {
    navigateTo(`/product/${props.product.seoPath}`)
  } else {
    const { $toast } = useNuxtApp()
    $toast.error('Product seoPath not found!')
  }
}

const handleChatNow = () => {
  emit('chatNow')
}
</script>

<style scoped lang="scss">
.product-card {
  background: #FFFFFF;
  border-radius: 0.625vw;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 1.25vw;

  &:hover {
    transform: translateY(-0.2083vw);
    box-shadow: 0 0.4167vw 1.25vw rgba(0, 0, 0, 0.1);
  }
}

.product-image {
  width: 100%;
  height: 9.375vw;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .product-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F3F4F6;

    .product-icon-fallback {
      font-size: 3.125vw;
      color: #9CA3AF;
    }
  }
}

.product-info {
  padding: 0;
  color: #000000;
}

.product-name {
  font-size: clamp(14px, 1.0417vw, 20px);
  font-weight: 500;
  margin: 1.0417vw 0 0.5208vw 0;
  min-height: 3.2292vw;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-op-time {
  font-weight: bold;
  font-size: clamp(12px, .9375vw, 18px);
  margin: 0 0 0.5208vw 0;
}

.product-line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2.0833vw;

  .product-stock,
  .product-country {
    font-size: clamp(12px, .8333vw, 16px);
    display: flex;
    align-items: center;
  }

  .product-stock {
    color: #8D8D8D;
  }

  .product-country {
    gap: 0.5208vw;

    .country-flag {
      width: 1.4063vw;
      height: .9375vw;
      object-fit: cover;
    }
  }
}

.product-footer {
  margin-top: 1.0417vw;
}

.chat-button {
  @include chat-btn;
}

/* ------------------------------------Mobile样式----------------------------*/
@media (max-width: 768px) {
  .product-card {
    border-radius: 2.6667vw;
    padding: 4.2667vw;

    &:hover {
      transform: translateY(-1.0667vw);
      box-shadow: 0 2.1333vw 5.3333vw rgba(0, 0, 0, 0.1);
    }
  }

  .product-image {
    height: 53.3333vw;

    .product-image-placeholder {
      .product-icon-fallback {
        font-size: 17.0667vw;
      }
    }
  }

  .product-name {
    margin: 2.6667vw 0;
    min-height: 8vw;
    font-size: clamp(12px, 3.2vw, 16px);
    margin-bottom: 2.6667vw;
  }

  .product-line {
    .product-country {
      gap: 1.5208vw;

      .country-flag {
        width: 5.4063vw;
        height: 2.7375vw;
        object-fit: contain;
      }
    }
  }

  .product-footer {
    margin-top: 4.2667vw;
  }
}
</style>
<template>
  <div class="brand-marquee-wrapper" :class="{ 'is-mobile': isMobile }">
    <div class="brand-marquee-header">
      <h2 class="brand-title">Featured Brands</h2>
      <a href="/products" class="view-all-link">View all</a>
    </div>
    <div class="brand-marquee-container">
      <div v-if="pending" class="brand-marquee-loading">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
        <span>加载中...</span>
      </div>
      <UMarquee v-else-if="brands.length > 0" :pause-on-hover="true" :overlay="false" :ui="{ root: '[--duration:60s] [--gap:--spacing(3)]' }" class="brand-marquee">
        <div v-for="brand in brands" :key="brand.brandId || brand.id" class="brand-item" @click="handleBrandClick(brand)">
          <div class="brand-logo-wrapper">
            <NuxtImg v-if="brand.logoUrl" :src="buildBackendImageUrl(brand.logoUrl)"
              :alt="brand.brandName || brand.name" class="brand-logo-img" loading="lazy" />
            <div v-else class="brand-logo-placeholder">
              <UIcon name="i-heroicons-cube" class="brand-placeholder-icon" />
            </div>
          </div>
        </div>
      </UMarquee>
      <div v-else class="brand-marquee-empty">
        <span>No brand currently available</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getBrandList } from '~/api/product'

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

// 获取图片URL管理
const { buildBackendImageUrl } = useImageUrl()

const { data: brandRes, pending } = await getBrandList()

const brands = computed(() => {
  return (brandRes.value?.data as any[]) || []
})

/**
 * 处理品牌点击事件
 * @param brand - 品牌对象
 */
const handleBrandClick = (brand: any) => {
  const brandId = brand.brandId || brand.id
  if (!brandId) {
    console.warn('Brand ID not found:', brand)
    return
  }

  // 使用 navigateTo 跳转到 products 页面，带上品牌ID作为过滤参数
  navigateTo({
    path: '/products',
    query: {
      brandIdList: String(brandId)
    }
  })
}
</script>

<style scoped lang="scss">
.brand-marquee-wrapper {
  width: 100%;
  background-color: #f2f2f2;
  padding: 4vw 0;
}

.brand-marquee-header {
  margin: 0 auto 2.25vw;
  padding: 0 18.75vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-title {
  font-size: clamp(20px, 1.6667vw, 32px);
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.view-all-link {
  font-size: clamp(14px, 0.9375vw, 16px);
  color: #666666;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: $primary-color;
  }
}

.brand-marquee-container {
  margin: 0 auto;
  padding: 0 18.75vw;
}

.brand-marquee-loading,
.brand-marquee-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.6667vw;
  color: #6c757d;
  font-size: clamp(14px, 1.0417vw, 16px);
}

.animate-spin {
  width: 1.0417vw;
  height: 1.0417vw;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.brand-marquee {
  overflow: hidden;
}

.brand-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 7.2917vw;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-0.0521vw);

    .brand-logo-wrapper {
      box-shadow: 0 0.4167vw 1.25vw rgba(0, 0, 0, 0.12);
    }
  }
}

.brand-logo-wrapper {
  width: 8.25vw;
  height: 8.25vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 0.4167vw;
  overflow: hidden;
  box-shadow: 0 0.1042vw 0.4167vw rgba(0, 0, 0, 0.05);
}

.brand-logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  padding: 0.4167vw;
}

.brand-logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.brand-placeholder-icon {
  width: 1.6667vw;
  height: 1.6667vw;
  color: #adb5bd;
}

.brand-name {
  font-size: clamp(12px, 0.9375vw, 14px);
  color: #495057;
  text-align: center;
  font-weight: 500;
  max-width: 7.2917vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ------------------------------------Mobile样式----------------------------*/
.is-mobile {
  .brand-marquee-wrapper {
    padding: 5.3333vw 0;
  }

  .brand-marquee-header {
    padding: 0 4.2667vw;
    margin-bottom: 4.2667vw;
  }

  .brand-title {
    font-size: clamp(16px, 3.7333vw, 20px);
  }

  .view-all-link {
    font-size: clamp(12px, 2.6667vw, 14px);
  }

  .brand-marquee-container {
    padding: 0 4.2667vw;
  }

  .brand-item {
    padding: 0 2.6667vw;
    min-width: 21.3333vw;
  }

  .brand-logo-wrapper {
    width: 21.3333vw;
    height: 21.3333vw;
  }

  .brand-placeholder-icon {
    width: 5.3333vw;
    height: 5.3333vw;
  }
}
</style>

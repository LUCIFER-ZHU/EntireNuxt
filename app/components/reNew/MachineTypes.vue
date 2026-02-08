<template>
  <div class="types" :class="{ 'is-mobile': isMobile }">
    <h2 class="types-main-title">Discover your next business opportunity</h2>
    <div class="types-header">
      <h3 class="types-title">Machine Type</h3>
    </div>
    <div class="types-container">
      <div v-for="item in machineTypes" :key="item.id" class="types-item" @click="handleMachineTypeClick(item.id)">
        <NuxtImg :src="item.imgSrc" :alt="item.name" class="types-item-img" />
        <div class="types-item-title">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ReNewMachineTypes">
import { getProductTypeList, type ProductType } from '~/api/home'
import { navigateTo } from 'nuxt/app'

// 使用图片URL构建工具
const { buildBackendImageUrl } = useImageUrl()

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

// 使用 SSR 获取产品类型数据
const { data: productTypeResponse, pending, error } = getProductTypeList()

// 将后端数据映射为前端需要的格式
const machineTypes = computed(() => {
  const response = productTypeResponse.value
  if (!response?.data || !Array.isArray(response.data)) {
    return []
  }

  return response.data
    .filter((item: ProductType) => item.id && item.name) // 过滤掉无效数据
    .slice(0, 8) // 只取前8个
    .map((item: ProductType) => ({
      id: item.id!,
      name: item.name!,
      imgSrc: buildBackendImageUrl(item.image), // 使用后端图片URL构建方法
      hasImage: !!item.image // 标记是否有图片
    }))
})

/**
 * 处理机器类型点击事件
 * @param itemId 机器类型ID
 */
const handleMachineTypeClick = (itemId: number): void => {
  navigateTo({
    path: '/products',
    query: { searchIds: [itemId.toString()] }
  })
}
</script>

<style scoped lang="scss">
.types {
  background: #F9F9F9;
  padding: 3.2292vw 18.75vw;

  .types-main-title {
    font-size: clamp(28px, 2.5vw, 48px);
    font-weight: 700;
    color: #000;
    margin-bottom: 1.4583vw;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.0833vw;
  }

  &-title {
    font-size: clamp(20px, 1.6667vw, 32px);
    font-weight: 700;
    color: #000000;
    margin: 0;
  }

  &-more {
    font-size: clamp(16px, 1.6667vw, 32px);
    color: #000000;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      color: $primary-color;
      transform: translateX(0.2083vw);
    }
  }

  .types-container {
    display: grid;
    gap: 1.25vw;
    grid-template-columns: repeat(4, 1fr);


    .types-item {
        padding: 1.25vw;
        background-color: #fff;
        border-radius: .625vw;

        @include hover-lift-effect;

        .types-item-img {
          width: 100%;
          height: 12.5vw;
          object-fit: cover;
        }

        .types-item-image-placeholder {
          width: 100%;
          height: 12.5vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
          border-radius: .3125vw;
        }

        .types-item-icon-fallback {
          width: 3.125vw;
          height: 3.125vw;
          color: #999;
        }

        .types-item-title {
          font-size: clamp(16px, 1.0417vw, 20px);
          font-weight: bold;
          color: #000000;
          margin-top: .7813vw;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;        
        }
      }
  }
}

.is-mobile {
  .types {
    padding: 10.4vw 5.3333vw 6.4vw;

    .types-main-title {
      font-size: clamp(16px, 4.2667vw, 32px);
      text-align: center;
    }

    .types-title {
      font-size: clamp(16px, 4vw, 30px);
      text-align: center;
    }

    .types-header{
      justify-content: center;
    }

    .types-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 3.2vw;

      .types-item {
        padding: 4.2667vw;

        .types-item-title {
          font-size: clamp(10px, 2.6667vw, 20px);
        }

        .types-item-img {
          height: 20vw;
        }

        .types-item-image-placeholder {
          height: 20vw;
        }

        .types-item-icon-fallback {
          width: 8vw;
          height: 8vw;
        }
      }
    }
  }
}
</style>

<template>
  <div class="discover-opportunity" :class="{ 'is-mobile': isMobile }">
    <h2 class="discover-main-title">Discover your next business opportunity</h2>
    <div class="discover-container">
      <div class="discover-left">
        <div class="discover-section-header">
          <h3 class="discover-section-title">Country of Origin</h3>
          <button class="discover-more" @click="handleNavigateToProducts">more ></button>
        </div>
        <div class="country-list" data-aos="fade-right">
          <div v-for="country in countries" :key="country.id" class="country-item">
            <div class="country-icon">
              <NuxtImg :src="country.icon" :alt="country.isoCode" class="country-flag-img" />
              <div class="country-info">
                <div class="country-name">{{ country.isoCode }}</div>
                <div class="country-stock">Stock: {{ country.num }}</div>
              </div>
            </div>
            <button class="country-search-btn" @click="handleCountrySearch(country.id)">Search</button>
          </div>
        </div>
      </div>
      <div class="discover-right">
        <div class="discover-section-header">
          <h3 class="discover-section-title">Machine Type</h3>
          <button class="discover-more" @click="handleNavigateToProducts">more ></button>
        </div>
        <div class="machine-types-container">
          <div v-for="item in machineTypes" :key="item.id" class="machine-types-item"
            @click="handleMachineTypeClick(item.id)">
            <div v-if="item.image" class="machine-types-item-img">
              <NuxtImg :src="buildBackendImageUrl(item.image)" :alt="item.name" class="machine-types-img" />
            </div>
            <div v-else class="machine-types-item-img-placeholder">
              <ClientOnly>
                <UIcon name="i-heroicons-cube" class="machine-types-item-icon" />
              </ClientOnly>
            </div>
            <div class="machine-types-item-title">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ReNewDiscoverOpportunity">
import { fetchCountryInfoList, fetchProductTypeList, type CountryInfo, type ProductType } from '~/api/home'

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

// 使用图片URL构建工具
const { buildBackendImageUrl } = useImageUrl()

/**
 * 跳转到产品页面
 */
const handleNavigateToProducts = () => {
  navigateTo('/products')
}

/**
 * 处理国家搜索按钮点击事件
 * @param countryId 国家ID
 */
const handleCountrySearch = (countryId: number): void => {
  navigateTo({
    path: '/products',
    query: { countryIdList: [countryId.toString()] }
  })
}

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

// 异步获取所有数据
const { data: pageData } = await useAsyncData(
  'discover-opportunity-data',
  async () => {
    try {
      const [countryResult, productTypeResult] = await Promise.allSettled([
        fetchCountryInfoList(),
        fetchProductTypeList()
      ])

      const countryResponse = countryResult.status === 'fulfilled' ? countryResult.value : null
      const productTypeResponse = productTypeResult.status === 'fulfilled' ? productTypeResult.value : null

      const countriesData = countryResponse?.data && Array.isArray(countryResponse.data)
        ? countryResponse.data.filter((item: CountryInfo) => item.id && item.isoCode).slice(0, 3)
        : []

      const machineTypesData = productTypeResponse?.data && Array.isArray(productTypeResponse.data)
        ? productTypeResponse.data.filter((item: ProductType) => item.id && item.name).slice(0, 8)
        : []

      return { countries: countriesData, machineTypes: machineTypesData }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      return { countries: [], machineTypes: [] }
    }
  }
)

const countries = computed(() => pageData.value?.countries || [])
const machineTypes = computed(() => pageData.value?.machineTypes || [])
</script>

<style scoped lang="scss">
.discover-opportunity {
  padding: 5.5208vw 13.5417vw 6.25vw;

  .discover-main-title {
    font-size: clamp(24px, 1.6667vw, 36px);
    font-weight: 700;
    color: #000000;
    text-align: center;
    margin-bottom: 3.125vw;
  }

  .discover-container {
    display: grid;
    grid-template-columns: 1fr 2.5fr;
    gap: .8333vw;

    .discover-left,
    .discover-right {
      background-color: #ffffff;
      border-radius: 0.625vw;
      padding: 1.5625vw;
    }
  }

  .discover-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5625vw;

    .discover-section-title {
      font-size: clamp(12px, .9375vw, 18px);
      font-weight: 700;
      color: #000000;
      margin: 0;
    }

    .discover-more {
      font-size: clamp(14px, 1.0417vw, 20px);
      color: #000000;
      text-decoration: none;
      font-weight: 500;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: color 0.3s ease;

      &:hover {
        color: $primary-color;
      }
    }
  }

  .country-list {
    display: flex;
    flex-direction: column;
    gap: 1.0417vw;

    .country-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5625vw 1.25vw;
      background: #f0f0f0;
      border-radius: 0.625vw;

      .country-icon {
        display: flex;
        align-items: center;
        gap: 0.7813vw;

        .country-flag-img {
          width: clamp(20px, 1.5625vw, 28px);
          height: clamp(20px, 1.5625vw, 28px);
        }

        .country-info {
          .country-name {
            font-size: clamp(12px, .7292vw, 14px);
            font-weight: 700;
            color: #000000;
          }

          .country-stock {
            font-size: clamp(10px, .625vw, 12px);
            color: #8D8D8D;
          }
        }
      }

      .country-search-btn {
        padding: .4167vw .625vw;
        background: #FFFFFF;
        border: 1px solid #000000;
        font-size: clamp(10px, .625vw, 12px);
        cursor: pointer;
        border-radius: 1.4583vw;
        transition: all 0.3s ease;

        &:hover {
          background: $primary-color;
          color: #FFFFFF;
        }
      }
    }
  }

  .machine-types-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.0417vw;

    .machine-types-item {
      text-align: center;
      cursor: pointer;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 0.8;
      }

      .machine-types-item-img {
        width: 100%;
        height: 6.25vw;
        margin-bottom: 0.7813vw;

        .machine-types-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.3125vw;
        }
      }

      .machine-types-item-img-placeholder {
        width: 100%;
        height: 6.25vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        border-radius: 0.3125vw;
        margin-bottom: 0.7813vw;

        .machine-types-item-icon {
          width: 3.125vw;
          height: 3.125vw;
          color: #999;
        }
      }

      .machine-types-item-title {
        font-size: clamp(12px, .8333vw, 16px);
        font-weight: 400;
        color: #000000;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.is-mobile {
  .discover-opportunity {
    padding: 10.4vw 5.3333vw 6.4vw;
    background-color: #f9f9f9;

    .discover-main-title {
      font-size: clamp(16px, 4.2667vw, 32px);
    }

    .discover-container {
      grid-template-columns: 1fr;
      gap: 6.4vw;

      .discover-left,
      .discover-right {
        background-color: #ffffff;
        border-radius: 2.6667vw;
        padding: 5.3333vw;
      }
    }

    .discover-section-header {
      .discover-section-title {
        font-size: clamp(16px, 4vw, 30px);
      }

      .discover-more {
        font-size: clamp(12px, 3.2vw, 20px);
        color: #000000;
        text-decoration: none;
        font-weight: 500;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        transition: color 0.3s ease;

        &:hover {
          color: #666666;
        }
      }
    }

    .country-list {
      gap: 3.2vw;

      .country-item {
        padding: 4.2667vw;
        background: #f0f0f0;
        border-radius: 2.6667vw;

        .country-icon {
          gap: 2.6667vw;

          .country-flag-img {
            width: clamp(24px, 6.4vw, 40px);
            height: clamp(24px, 6.4vw, 40px);
            border-radius: 0;
          }

          .country-info {
            .country-name {
              font-size: clamp(14px, 3.7333vw, 24px);
            }

            .country-stock {
              font-size: clamp(10px, 2.6667vw, 16px);
            }
          }
        }

        .country-search-btn {
          padding: 2.1333vw 4.2667vw;
          font-size: clamp(10px, 2.6667vw, 16px);
          transition: all 0.3s ease;

          &:hover {
            background: #000000;
            color: #FFFFFF;
          }
        }
      }
    }

    .machine-types-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 3.2vw;

      .machine-types-item {
        background: #f0f0f0;
        border-radius: 2.6667vw;
        padding: 4.2667vw;
        cursor: pointer;
        transition: opacity 0.3s ease;

        &:hover {
          opacity: 0.8;
        }

        .machine-types-item-img {
          height: 20vw;
        }

        .machine-types-item-img-placeholder {
          height: 20vw;
          background: #f0f0f0;

          .machine-types-item-icon {
            width: 8vw;
            height: 8vw;
          }
        }

        .machine-types-item-title {
          font-size: clamp(12px, 3.2vw, 20px);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
<template>
  <div class="products-page" :class="{ 'is-mobile': isMobile }">
    <!-- Header -->
    <ReNewAppHeader />
    <!-- 挂载对话框组件 -->
    <EditorContactFormDialog v-model="dialogOpen" />
    <!-- 使用新的头部组件 -->
    <div class="products-page-container">
      <div class="products-layout">
        <!-- 左侧导航栏 -->
        <aside class="sidebar">
          <!-- 国家筛选 -->
          <div class="filter-section">
            <h3 class="filter-title">Country of Origin</h3>
            <div class="country-list">
              <div v-if="countries.length === 0" class="country-empty">
                No related countries
              </div>
              <div v-for="country in countries" v-else :key="country?.id" class="country-item"
                :class="{ active: isCountrySelected(country?.id) }"
                @click="handleCountryClick(country?.id)">
                <div class="country-icon">
                  <NuxtImg v-if="country?.icon" :src="buildBackendImageUrl(country.icon)" :alt="country?.isoCode || country?.chineseName" class="country-icon-img" />
                  <ClientOnly v-else>
                    <UIcon name="i-heroicons-globe-alt" class="country-icon-placeholder" />
                  </ClientOnly>
                </div>
                <div class="country-name">{{ country?.isoCode }}</div>
              </div>
            </div>
          </div>

          <!-- 品牌筛选 -->
          <div class="filter-section">
            <h3 class="filter-title">Brand</h3>
            <div class="brand-list">
              <div v-if="brands.length === 0" class="brand-empty">
                No related brands
              </div>
              <div v-for="brand in brands" v-else :key="brand?.brandId" class="brand-item"
                :class="{ active: isBrandSelected(brand?.brandId) }"
                @click="handleBrandClick(brand?.brandId)">
                <div class="brand-logo">
                  <NuxtImg v-if="brand?.logoUrl" :src="buildBackendImageUrl(brand.logoUrl)" :alt="brand?.brandName || brand?.name" class="brand-logo-img" />
                  <ClientOnly v-else>
                    <UIcon name="i-heroicons-building-storefront" class="brand-logo-placeholder" />
                  </ClientOnly>
                </div>
                <div class="brand-name">{{ brand?.brandName || brand?.name }}</div>
              </div>
            </div>
          </div>

          <!-- 产品类型手风琴 -->
          <div v-if="!isMobile" class="filter-section">
            <h3 class="filter-title">Product Type</h3>
            <EditorProductTypeAccordion />
          </div>

          <!-- Operating Hours 筛选 -->
          <div class="filter-section">
            <h3 class="filter-title">Operating Hours</h3>
            <div class="operating-hours-list">
              <div v-for="option in operatingHoursOptions" :key="option.value" class="operating-hours-item"
                :class="{ active: selectedOperatingHours === option.value }"
                @click="handleOperatingHoursClick(option.value)">
                <div class="operating-hours-label">{{ option.label }}</div>
              </div>
            </div>
          </div>
        </aside>

        <!-- 右侧商品列表 -->
        <main class="products-main">
          <!-- 宣传区块 -->
          <div class="promo-banner">
            <NuxtImg :src="buildImageUrl('image/img13.webp')" alt="Promo Banner" class="promo-banner-bg" />
            <div class="promo-banner-content">
              <h2 class="promo-banner-title">Find Reliable Used Machines</h2>
              <p class="promo-banner-subtitle">Ready for Work</p>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="pending" class="loading-state">
            <div class="loading-spinner">Loading...</div>
          </div>

          <!-- 商品网格 -->
          <div v-else-if="products && products.length > 0" class="products-grid">
            <ReNewProductCard v-for="product in products" :key="product.productId" :product="product"
              @chat-now="handleChatNow(product)" />
          </div>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <div class="empty-icon">📦</div>
            <p class="empty-text">No products available</p>
          </div>

          <!-- 分页器 -->
          <div v-if="products && products.length > 0 && totalPages > 1" class="pagination-container">
            <UPagination v-model:page="pageNumber" :total="total" :items-per-page="pageSize" :max="7"
              @update:page="handlePageChange" />
          </div>
        </main>
      </div>
    </div>
    <!-- Footer -->
    <ReNewAppFooter />
  </div>
</template>

<script setup lang="ts">
import { fetchProductList, fetchSearchInfoList, type SearchInfoDto } from '~/api/product'

// 控制对话框显示
const dialogOpen = ref(false)

// 获取图片URL管理
const { buildImageUrl, buildBackendImageUrl } = useImageUrl();

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

// 获取路由查询参数
const route = useRoute()
const router = useRouter()

// 查询参数
const searchIds = computed(() => {
  const ids = route.query.searchIds
  if (!ids) return []
  if (Array.isArray(ids)) {
    return ids.map(id => Number(id)).filter(id => !isNaN(id))
  }
  return [Number(ids)].filter(id => !isNaN(id))
})

// 品牌ID列表（多选）
const selectedBrandIdList = computed({
  get: () => {
    const brandIdList = route.query.brandIdList
    if (!brandIdList) return []
    if (Array.isArray(brandIdList)) {
      // 数组形式：?brandIdList=id1&brandIdList=id2
      return brandIdList.map(id => String(id)).filter(Boolean)
    }
    // 兼容字符串形式（旧链接或手动输入的URL）
    return String(brandIdList).split(',').map(id => id.trim()).filter(Boolean)
  },
  set: (value: string[]) => {
    // 这个 setter 不会直接使用，我们通过路由更新来设置
  }
})

// 国家ID列表（多选）
const selectedCountryIdList = computed({
  get: () => {
    const countryIdList = route.query.countryIdList
    if (!countryIdList) return []
    if (Array.isArray(countryIdList)) {
      // 数组形式：?countryIdList=id1&countryIdList=id2
      return countryIdList.map(id => String(id)).filter(Boolean)
    }
    // 兼容字符串形式（旧链接或手动输入的URL）
    return String(countryIdList).split(',').map(id => id.trim()).filter(Boolean)
  },
  set: (value: string[]) => {
    // 这个 setter 不会直接使用，我们通过路由更新来设置
  }
})

const searchInfo = computed(() => route.query.searchInfo as string)

// Operating Hours（单选）
const selectedOperatingHours = computed({
  get: () => {
    const operatingHours = route.query.operatingHours
    return operatingHours ? Number(operatingHours) : undefined
  },
  set: (value: number | undefined) => {
    // 这个 setter 不会直接使用，我们通过路由更新来设置
  }
})

// Operating Hours 选项列表
const operatingHoursOptions = [
  { value: 100, label: '＜100h' },
  { value: 500, label: '＜500h' },
  { value: 1500, label: '＜1500h' },
  { value: 10000, label: '＜10000h' }
]

// 分页参数
const pageNumber = ref(Number(route.query.pageNum) || 1)
const pageSize = ref(12)
const isPageChanging = ref(false) // 标志：是否正在处理分页变化

// 统一的数据获取函数
const { data: pageData, status, refresh } = await useAsyncData(
  'products-page-data',
  async () => {
    try {
      const [searchInfoResult, productResult] = await Promise.allSettled([
        fetchSearchInfoList(searchIds.value.length > 0 ? searchIds.value : undefined),
        fetchProductList({
          brandIdList: selectedBrandIdList.value.length > 0 ? selectedBrandIdList.value : undefined,
          countryList: selectedCountryIdList.value.length > 0 ? selectedCountryIdList.value : undefined,
          processingTime: selectedOperatingHours.value,
          searchIds: searchIds.value.length > 0 ? searchIds.value : undefined,
          searchInfo: searchInfo.value,
          pageSize: pageSize.value,
          pageNum: pageNumber.value
        })
      ])

      let searchInfoDataValue: SearchInfoDto | null = null
      const productDataValue: any = { rows: [], total: 0 }

      // 处理搜索信息数据
      if (searchInfoResult.status === 'fulfilled') {
        const result = searchInfoResult.value as any
        if (result?.data) {
          searchInfoDataValue = result.data
        }
      } else {
        console.error('获取搜索信息失败:', searchInfoResult.reason)
      }

      // 处理商品列表数据
      if (productResult.status === 'fulfilled') {
        
        const result = productResult.value as any
        
        if (result?.rows) {
          productDataValue.rows = result.rows
        }
        if (result?.total) {
          productDataValue.total = result.total
        }
      } else {
        console.error('获取商品列表失败:', productResult.reason)
      }

      return {
        searchInfo: searchInfoDataValue,
        products: productDataValue
      }
    } catch (error) {
      console.error('数据获取失败:', error)
      return {
        searchInfo: null,
        products: { rows: [], total: 0 }
      }
    }
  },
  {
    watch: [
      pageNumber,
      searchIds,
      selectedBrandIdList,
      selectedCountryIdList,
      selectedOperatingHours,
      searchInfo,
      pageSize
    ]
  }
)

const pending = computed(() => status.value === 'pending')

// 计算属性
const brands = computed(() => {
  const brandList = pageData.value?.searchInfo?.brandInfoList || []
  // 过滤掉 null、undefined 或无效的品牌项
  return Array.isArray(brandList) ? brandList.filter(brand => brand && typeof brand === 'object') : []
})
const countries = computed(() => {
  const countryList = pageData.value?.searchInfo?.dictCountryList || []
  return Array.isArray(countryList) ? countryList.filter(country => country && typeof country === 'object') : []
})
const products = computed(() => {
  const pData = pageData.value?.products
  if (!pData || typeof pData !== 'object') return []
  return Array.isArray(pData.rows) ? pData.rows : []
})
const total = computed(() => {
  const pData = pageData.value?.products
  if (!pData || typeof pData !== 'object') return 0
  return Number(pData.total) || 0
})
const totalPages = computed(() => {
  const totalValue = total.value
  if (totalValue === 0 || !pageSize.value) return 0
  return Math.ceil(totalValue / pageSize.value)
})

// 判断品牌是否被选中
const isBrandSelected = (brandId?: string) => {
  if (!brandId) return false
  return selectedBrandIdList.value.includes(String(brandId))
}

// 判断国家是否被选中
const isCountrySelected = (countryId?: number) => {
  if (!countryId) return false
  return selectedCountryIdList.value.includes(String(countryId))
}

// 品牌点击事件（支持多选）
const handleBrandClick = (brandId?: string) => {
  if (!brandId) return

  const brandIdStr = String(brandId)
  const currentList = [...selectedBrandIdList.value]
  const index = currentList.indexOf(brandIdStr)

  if (index > -1) {
    // 已选中，取消选择
    currentList.splice(index, 1)
  } else {
    // 未选中，添加到选择
    currentList.push(brandIdStr)
  }

  // 重置页码为1
  pageNumber.value = 1

  // 更新路由（使用数组形式）
  navigateTo({
    path: '/products',
    query: {
      ...route.query,
      brandIdList: currentList.length > 0 ? currentList : undefined,
      pageNum: 1
    }
  })
}

// 国家点击事件（支持多选）
const handleCountryClick = (countryId?: number) => {
  if (!countryId) return

  const countryIdStr = String(countryId)
  const currentList = [...selectedCountryIdList.value]
  const index = currentList.indexOf(countryIdStr)

  if (index > -1) {
    // 已选中，取消选择
    currentList.splice(index, 1)
  } else {
    // 未选中，添加到选择
    currentList.push(countryIdStr)
  }

  // 重置页码为1
  pageNumber.value = 1

  // 更新路由（使用数组形式）
  navigateTo({
    path: '/products',
    query: {
      ...route.query,
      countryIdList: currentList.length > 0 ? currentList : undefined,
      pageNum: 1
    }
  })
}

// Operating Hours 点击事件（单选）
const handleOperatingHoursClick = (value: number) => {
  // 如果点击的是已选中的值，则取消选择
  const newValue = selectedOperatingHours.value === value ? undefined : value

  // 重置页码为1
  pageNumber.value = 1

  // 更新路由
  navigateTo({
    path: '/products',
    query: {
      ...route.query,
      operatingHours: newValue,
      pageNum: 1
    }
  })
}


// 处理 Chat Now 点击事件
const handleChatNow = (product: any) => {
  console.log('Chat Now 点击，产品:', product)
  dialogOpen.value = true
}

// 分页变化处理
const handlePageChange = async (page: number) => {
  console.log('handlePageChange 被调用，页码:', page)
  isPageChanging.value = true
  pageNumber.value = page
  // 更新路由
  await navigateTo({
    path: '/products',
    query: {
      ...route.query,
      pageNum: pageNumber.value
    }
  })
  isPageChanging.value = false
}

// 监听 pageNumber 变化（备用方案）
watch(pageNumber, async (newPage, oldPage) => {
  // 如果正在处理分页变化，跳过（避免重复调用）
  if (isPageChanging.value) {
    return
  }

  // 如果页码没有变化，跳过
  if (newPage === oldPage) {
    return
  }

  console.log('pageNumber 变化，从', oldPage, '到', newPage)
  // 更新路由
  await navigateTo({
    path: '/products',
    query: {
      ...route.query,
      pageNum: newPage
    }
  })
})

// 监听路由变化，刷新数据
watch(() => route.query, async (newQuery, oldQuery) => {
  // 如果正在处理分页变化，跳过（避免重复调用）
  if (isPageChanging.value) {
    return
  }

  // 避免初始加载时重复调用
  if (oldQuery && JSON.stringify(newQuery) === JSON.stringify(oldQuery)) {
    return
  }

  // brandIdList 和 countryIdList 会在 computed 中自动更新，不需要手动设置
  const newPageNumber = Number(route.query.pageNum) || 1
  if (pageNumber.value !== newPageNumber) {
    pageNumber.value = newPageNumber
  }
}, { deep: true })
</script>

<style scoped lang="scss">
.products-page {
  background-color: #F9F9F9;
}

.products-page-container {
  padding: 1.25vw 8.3333vw 0;
  width: 100%;
}

.products-layout {
  display: flex;
  gap: 1.5625vw; // 30px at 1920px
}

/* 左侧导航栏 */
.sidebar {
  width: 21.875vw;
  flex-shrink: 0;
}

.filter-section {
  background: #F4F4F4;
  border-radius: .625vw
}

.filter-title {
  font-weight: bold;
  font-size: clamp(12px, 1.0417vw, 20px);
  color: #000000;
  padding: 1.0417vw 2.0833vw ;
}

.brand-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 18.75vw;
  overflow-y: auto;

  @include custom-scrollbar;
}

.brand-item {
  display: flex;
  align-items: center;
  gap: 0.625vw; // 12px at 1920px
  padding: 0.625vw 4.1667vw;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  border: none;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  &.active {
    background: rgba(7, 28, 99, 0.2);

    .brand-name {
      color: #EF751E;
      font-weight: bold;
    }
  }
}

.brand-logo {
  width: 2.25vw;
  height: 1.25vw; // 24px at 1920px
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .brand-logo-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .brand-logo-placeholder {
    font-size: 1.25vw;
    color: #9CA3AF;
  }
}

.brand-name {
  font-size: clamp(12px, .8333vw, 16px);
  color: #000;
  font-weight: 400;
  transition: color 0.2s;
}

.brand-empty {
  padding: 0.8333vw 2.0833vw;
  font-size: clamp(12px, .8333vw, 16px);
  color: #999;
  text-align: center;
}

.country-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 18.75vw;
  overflow-y: auto;

  @include custom-scrollbar;
}

.country-item {
  display: flex;
  align-items: center;
  gap: 0.625vw;
  padding: 0.625vw 4.1667vw;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  border: none;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  &.active {
    background: rgba(7, 28, 99, 0.2);

    .country-name {
      color: #EF751E;
      font-weight: bold;
    }
  }
}

.country-icon {
  width: 2.25vw;
  height: 1.25vw;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .country-icon-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .country-icon-placeholder {
    font-size: 1.25vw;
    color: #9CA3AF;
  }
}

.country-name {
  font-size: clamp(12px, .8333vw, 16px);
  color: #000;
  font-weight: 400;
  transition: color 0.2s;
}

.country-empty {
  padding: 0.8333vw 2.0833vw;
  font-size: clamp(12px, .8333vw, 16px);
  color: #999;
  text-align: center;
}

.operating-hours-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.operating-hours-item {
  display: flex;
  align-items: center;
  padding: 0.625vw 4.1667vw;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  border: none;
  text-align: left;
  width: 100%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }

  &.active {
    background: rgba(7, 28, 99, 0.2);

    .operating-hours-label {
      color: #EF751E;
      font-weight: bold;
    }
  }
}

.operating-hours-label {
  font-size: clamp(12px, .8333vw, 16px);
  color: #000;
  font-weight: 400;
  transition: color 0.2s;
}

/* 右侧商品列表 */
.products-main {
  flex: 1;
  min-width: 0;
}

.promo-banner {
  position: relative;
  width: 100%;
  height: 21.4583vw; // 250px at 1920px
  border-radius: 0.4167vw; // 8px at 1920px
  overflow: hidden;
  margin-bottom: 1.5625vw; // 30px at 1920px
}

.promo-banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promo-banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2.0833vw; // 40px at 1920px
}

.promo-banner-title {
  font-size: clamp(20px, 1.6667vw, 32px);
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 0.5208vw; // 10px at 1920px
  text-align: center;
}

.promo-banner-subtitle {
  font-size: clamp(30px, 3.9063vw, 75px);
  font-weight: bold;
  color: #FFFFFF;
  text-align: center;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20.8333vw; // 400px at 1920px
}

.loading-spinner {
  font-size: clamp(14px, 3.75vw, 18px);
  color: #666;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25vw; // 24px at 1920px
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 20.8333vw; // 400px at 1920px
  color: #999;
}

.empty-icon {
  font-size: clamp(48px, 13.3333vw, 64px);
  margin-bottom: 0.8333vw; // 16px at 1920px
}

.empty-text {
  font-size: clamp(14px, 3.3333vw, 16px);
}

/* 分页器 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.0833vw; // 40px at 1920px
  padding: 1.0417vw 0; // 20px at 1920px
}

/* ------------------------------------Mobile样式----------------------------*/
.is-mobile {
  .products-page-container {
    padding: 20px 16px 0;
  }

  .products-layout {
    flex-direction: column;
    gap: 16px;
  }

  .sidebar {
    width: 100%;
  }

  .filter-section {
    border-radius: 12px;
  }

  .filter-title {
    font-size: clamp(14px, 3.3333vw, 18px);
    padding: 16px 20px 8px;
  }

  .brand-item {
    gap: 8px;
    padding: 12px 20px;
  }

  .brand-logo {
    width: 24px;
    height: 24px;

    .brand-logo-placeholder {
      font-size: 24px;
      color: #9CA3AF;
    }
  }

  .brand-name {
    font-size: clamp(12px, 2.6667vw, 14px);
  }

  .brand-empty {
    padding: 12px 20px;
    font-size: clamp(12px, 2.6667vw, 14px);
  }

  .brand-list {
    max-height: 240px;
    overflow-y: auto;
  }

  .country-item {
    gap: 8px;
    padding: 12px 20px;
  }

  .country-icon {
    width: 24px;
    height: 24px;

    .country-icon-placeholder {
      font-size: 24px;
      color: #9CA3AF;
    }
  }

  .country-name {
    font-size: clamp(12px, 2.6667vw, 14px);
  }

  .country-empty {
    padding: 12px 20px;
    font-size: clamp(12px, 2.6667vw, 14px);
  }

  .country-list {
    max-height: 240px;
    overflow-y: auto;
  }

  .operating-hours-item {
    padding: 12px 20px;
  }

  .operating-hours-label {
    font-size: clamp(12px, 2.6667vw, 14px);
  }

  .products-main {
    width: 100%;
  }

  .promo-banner {
    height: 200px;
    border-radius: 12px;
    margin-bottom: 16px;
  }

  .promo-banner-content {
    padding: 24px 20px;
  }

  .promo-banner-title {
    font-size: clamp(18px, 4.8vw, 24px);
    margin-bottom: 8px;
  }

  .promo-banner-subtitle {
    font-size: clamp(12px, 3.2vw, 14px);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .product-info {
    padding: 12px 0 0;
    gap: 8px;
  }

  .product-name {
    font-size: clamp(12px, 2.6667vw, 14px);
    min-height: auto;
  }

  .product-intro {
    font-size: clamp(11px, 2.3333vw, 12px);
    min-height: auto;
  }

  .loading-state {
    min-height: 200px;
  }

  .empty-state {
    min-height: 200px;
  }

  .empty-icon {
    font-size: clamp(48px, 13.3333vw, 64px);
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: clamp(14px, 3.3333vw, 16px);
  }

  .pagination-container {
    margin-top: 24px;
    padding: 16px 0;
  }
}
</style>

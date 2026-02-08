<template>
  <div class="product-detail-page" :class="{ 'is-mobile': isMobile }">
    <!-- Header -->
    <ReNewAppHeader />
    <!-- 挂载对话框组件 -->
    <EditorContactFormDialog v-model="dialogOpen" />
    <div class="product-detail-container">
      <!-- 加载状态：仅在加载中且无数据时显示 -->
      <div v-if="pending && !productInfo" class="loading-state">
        <div class="loading-spinner">Loading...</div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="!pending && !productInfo" class="error-state">
        <div class="error-icon">❌</div>
        <p class="error-text">Product not found or unavailable</p>
      </div>

      <!-- 商品详情内容：只要有数据就显示 -->
      <div v-if="productInfo" class="product-detail-content">
        <!-- PC端：左右布局容器 -->
        <div class="product-main-layout desktop-only">
          <!-- 左侧：轮播图区域和相似产品 -->
          <div class="product-left">
            <!-- 产品标题 -->
            <div class="product-header">
              <UBreadcrumb v-if="breadcrumbItems.length > 0" :items="breadcrumbItems" class="mb-4" />
              <h1 class="product-title">{{ productInfo?.productName }}</h1>
            </div>
            <!-- 轮播图和缩略图区域 -->
            <div class="product-gallery-with-thumbnails">
              <!-- 缩略图列表（左侧垂直排列） -->
              <div v-if="carouselImages.length > 1" class="thumbnail-list-wrapper">
                <button v-if="canScrollUp" class="scroll-btn scroll-up" @click="scrollThumbnails('up')">
                  <UIcon name="i-heroicons-chevron-up-solid" class="size-[1.5vw] bg-white" />
                </button>
                <div ref="thumbnailListRef" class="thumbnail-list-vertical" @wheel="handleWheelScroll">
                  <div v-for="(item, index) in carouselImages" :key="index" class="thumbnail-item"
                    :class="{ active: currentSlide === index }" @click="selectSlide(index)">
                    <template v-if="item.type === 'video'">
                      <video :src="buildBackendImageUrl(item.url)" class="thumbnail-image" muted />
                      <div class="video-play-icon">▶</div>
                    </template>
                    <NuxtImg v-else :src="buildBackendImageUrl(item.url)" alt="Thumbnail" class="thumbnail-image" />
                  </div>
                </div>
                <button v-if="canScrollDown" class="scroll-btn scroll-down" @click="scrollThumbnails('down')">
                  <UIcon name="i-heroicons-chevron-down-solid" class="size-[1.5vw] bg-white" />
                </button>
              </div>

              <!-- 轮播图（右侧） -->
              <div class="carousel-wrapper">
                <ClientOnly>
                  <UCarousel v-if="carouselImages.length > 0" ref="carouselRef" v-slot="{ item }"
                    :items="carouselImages" :ui="{
                      item: 'basis-full'
                    }" :autoplay="{ delay: 3000, stopOnMouseEnter: true, stopOnInteraction: false }" loop
                    class="product-carousel" @select="onSlideChange">
                    <template v-if="item.type === 'video'">
                      <video :src="buildBackendImageUrl(item.url)" class="carousel-image" controls autoplay muted
                        loop />
                    </template>
                    <NuxtImg v-else :src="buildBackendImageUrl(item.url)" alt="Product Image" class="carousel-image" />
                  </UCarousel>
                  <template #fallback>
                    <div class="carousel-loading">
                      <div class="loading-spinner">Loading carousel...</div>
                    </div>
                  </template>
                </ClientOnly>
                <div v-if="carouselImages.length === 0" class="no-image">
                  <span>No Image Available</span>
                </div>
              </div>
            </div>

            <div class="product-highlight">
              <div class="product-highlight-title">Product Highlight</div>
              <div class="product-highlight-content">{{ productInfo?.productIntro }}</div>
            </div>

            <!-- 商品描述（PC端在左侧区域） -->
            <div class="product-description">
              <h2 class="section-title">Product Description</h2>
              <div class="description-content">
                <div v-if="productInfo?.richText1" v-html="productInfo.richText1" class="description-text"></div>
                <div v-if="productInfo?.richText2" v-html="productInfo.richText2" class="description-text"></div>
              </div>
            </div>

            <!-- 相似产品（在商品描述下方） -->
            <div v-if="similarProducts && similarProducts.length > 0" class="similar-products">
              <h2 class="section-title">Similar Products of This Type</h2>
              <div class="similar-products-grid">
                <ReNewProductCard v-for="product in similarProducts.slice(0, 3)" :key="product.productId"
                  :product="product" @chat-now="handleChatNow(product)" />
              </div>
            </div>
          </div>

          <!-- 右侧：商品属性 -->
          <div class="product-right">
            <div ref="attributesRef" class="product-attributes" :class="{ 'sticky-active': isSticky }">
              <!-- 价格 -->
              <div class="product-price">
                <span class="price-value">${{ productInfo?.productPrice || '****' }}</span>
              </div>

              <!-- 库存 -->
              <div class="attribute-stock-row">
                <UIcon name="i-heroicons-cube" class="attribute-icon" />
                <span class="attribute-label">Stock:</span>
                <span class="attribute-value">{{ productInfo.virtualInventory || productInfo.inventory || '****'
                }}</span>
              </div>

              <!-- 商品属性列表 -->
              <div class="attributes-list">
                <div class="attribute-list-row">
                  <div class="attribute-item">
                    <span class="attr-label">Brand</span>
                    <span class="attr-value" :title="productInfo?.brandName || '---'">{{ productInfo?.brandName ||
                      '---'
                    }}</span>
                  </div>
                  <div class="attribute-item">
                    <span class="attr-label">Model</span>
                    <span class="attr-value" :title="productInfo?.productModel || '---'">{{ productInfo?.productModel
                      || '---'
                    }}</span>
                  </div>
                  <div class="attribute-item">
                    <span class="attr-label">Origin</span>
                    <span class="attr-value" :title="productInfo?.isoCode || '---'">{{ productInfo?.isoCode ||
                      '---'
                    }}</span>
                  </div>                  
                  <div class="attribute-item">
                    <span class="attr-label">Processing Time</span>
                    <span class="attr-value" :title="productInfo?.processingTime || '---'">{{
                      productInfo?.processingTime ||
                      '---' }}h</span>
                  </div>                  
                </div>

                <!-- 动态遍历参数数组，每行4列 -->
                <div v-for="(row, rowIndex) in parametersRows" :key="rowIndex" class="attribute-list-row">
                  <div v-for="param in row" :key="param.key" class="attribute-item">
                    <span class="attr-label">{{ param.key }}</span>
                    <span class="attr-value" :title="param.value">{{ param.value }}</span>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="action-buttons">
                <button class="action-btn" @click="handleAddToCollection">
                  Add to Favorites
                </button>
                <button class="action-btn action-end" @click="handleSendInquiry">
                  Send Inquiry
                </button>
              </div>

              <!-- 已收藏的用户信息 -->
              <div v-if="collectionList.length > 0" class="favorite-users">
                <div class="favorite-header">
                  <UIcon name="i-heroicons-heart-solid" class="heart-icon" />
                  <span class="favorite-title">{{ collectionList.length }} people favorited this</span>
                </div>
                <div class="favorite-avatars">
                  <!-- 显示前4个用户 -->
                  <ClientOnly>
                    <div v-for="(user, index) in collectionList.slice(0, 4)" :key="user.id" class="avatar-item"
                      :style="{ zIndex: 10 - Number(index) }" :title="user.nickName">
                      <NuxtImg :src="buildBackendImageUrl(user.avatar)" :alt="user.nickName" class="avatar-image" />
                    </div>
                  </ClientOnly>
                  <!-- 如果超过4个，显示 +N -->
                  <div v-if="collectionList.length > 4" class="avatar-more">
                    +{{ collectionList.length - 4 }}
                  </div>
                </div>
              </div>

              <!-- Customization options -->
              <div class="customization-section">
                <h3 class="section-title">Customization options</h3>
                <ul class="customization-list">
                  <li>Customized packaging (Min. order: 1 piece)</li>
                  <li>Customized Logo (Min. order: 1 piece)</li>
                </ul>
              </div>

              <!-- Supplier's customization ability -->
              <div class="customization-section">
                <h3 class="section-title">Supplier's customization ability</h3>
                <ul class="customization-list">
                  <li>Minor customization</li>
                  <li>Drawing-based customization</li>
                  <li>Sample-based customization</li>
                  <li>Full customization</li>
                </ul>
              </div>

              <!-- Shipping -->
              <div class="shipping-section">
                <h3 class="section-title">Shipping</h3>
                <p class="shipping-info">Or, chat with the product supplier for more shipping options.</p>
              </div>

              <!-- parameters information -->
              <div class="border-section">
                <div class="section-row">
                  <span class="row-label">Item subtotal (0 variations 0 items)</span>
                  <span class="row-value">$---</span>
                </div>
                <div class="section-row">
                  <span class="row-label">Shipping total</span>
                  <span class="row-value">$---</span>
                </div>
                <!-- 遍历parameters2数组 -->
                <div v-for="param in productInfo?.parameters2 || []" :key="param.key" class="section-row">
                  <span class="row-label">{{ param.key }}</span>
                  <span class="row-value">{{ param.value }}</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="action-buttons">
                <button class="action-btn" @click="handleAddToCollection">
                  Add to Favorites
                </button>
                <button class="action-btn action-end" @click="handleSendInquiry">
                  Send Inquiry
                </button>
              </div>

              <!-- Protections for this product -->
              <div class="customization-section">
                <h3 class="section-title">Protections for this product</h3>
                <ul class="customization-list">
                  <li>Minor customization</li>
                  <li>Drawing-based customization</li>
                  <li>Sample-based customization</li>
                  <li>Full customization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 移动端：垂直布局 -->
        <div class="mobile-layout mobile-only">
          <!-- 产品标题 -->
          <div class="product-header">
            <UBreadcrumb v-if="breadcrumbItems.length > 0" :items="breadcrumbItems" class="mb-4" :ui="{
        linkLabel: 'text-[10px]',
      }"/>
            <h1 class="product-title">{{ productInfo?.productName }}</h1>
          </div>
          <!-- 轮播图区域 -->
          <div class="product-gallery-section">
            <div class="carousel-wrapper">
              <ClientOnly>
                <UCarousel v-if="carouselImages.length > 0" ref="carouselRef" v-slot="{ item }" :items="carouselImages"
                  :ui="{
                    item: 'basis-full'
                  }" :autoplay="{ delay: 3000, stopOnMouseEnter: true, stopOnInteraction: false }" loop
                  class="product-carousel" @select="onSlideChange">
                  <template v-if="item.type === 'video'">
                    <video :src="buildBackendImageUrl(item.url)" class="carousel-image" controls autoplay muted loop />
                  </template>
                  <NuxtImg v-else :src="buildBackendImageUrl(item.url)" alt="Product Image" class="carousel-image" />
                </UCarousel>
                <template #fallback>
                  <div class="carousel-loading">
                    <div class="loading-spinner">Loading carousel...</div>
                  </div>
                </template>
              </ClientOnly>
              <div v-if="carouselImages.length === 0" class="no-image">
                <span>No Image Available</span>
              </div>
            </div>

            <!-- 缩略图列表 -->
            <div v-if="carouselImages.length > 1" class="thumbnail-list">
              <div v-for="(item, index) in carouselImages" :key="index" class="thumbnail-item"
                :class="{ active: currentSlide === index }" @click="selectSlide(index)">
                <template v-if="item.type === 'video'">
                  <video :src="buildBackendImageUrl(item.url)" class="thumbnail-image" muted />
                  <div class="video-play-icon">▶</div>
                </template>
                <NuxtImg v-else :src="buildBackendImageUrl(item.url)" alt="Thumbnail" class="thumbnail-image" />
              </div>
            </div>
          </div>

          <!-- 商品属性 -->
          <div class="product-attributes">
            <!-- 价格 -->
            <div class="product-price">
              <span class="price-value">${{ productInfo?.productPrice || '****' }}</span>
            </div>

            <!-- 库存 -->
            <div class="attribute-stock-row">
              <UIcon name="i-heroicons-cube" class="attribute-icon" />
              <span class="attribute-label">Stock:</span>
              <span class="attribute-value">{{ productInfo.virtualInventory || productInfo.inventory || '****' }}</span>
            </div>

            <!-- 商品属性列表 -->
            <div class="attributes-list">
              <div v-if="productInfo?.brandId" class="attribute-item">
                <span class="attr-label">Machine Tool Brand</span>
                <span class="attr-value">{{ productInfo.brandName }}</span>
              </div>
              <div v-if="productInfo?.productModel" class="attribute-item">
                <span class="attr-label">Machine Tool Model</span>
                <span class="attr-value">{{ productInfo.productModel }}</span>
              </div>
              <!-- 遍历parameters数组 -->
              <div v-for="param in productInfo?.parameters || []" :key="param.key" class="attribute-item">
                <span class="attr-label">{{ param.key }}</span>
                <span class="attr-value">{{ param.value }}</span>
              </div>
              <!-- 遍历parameters2数组 -->
              <div v-for="param in productInfo?.parameters2 || []" :key="param.key" class="attribute-item">
                <span class="attr-label">{{ param.key }}</span>
                <span class="attr-value">{{ param.value }}</span>
              </div>
            </div>

              <!-- 已收藏的用户信息 -->
            <div v-if="collectionList.length > 0" class="favorite-users">
              <div class="favorite-header">
                <UIcon name="i-heroicons-heart-solid" class="heart-icon" />
                <span class="favorite-title">{{ collectionList.length }} people favorited this</span>
              </div>
              <div class="favorite-avatars">
                <!-- 显示前4个用户 -->
                <ClientOnly>
                  <div v-for="(user, index) in collectionList.slice(0, 4)" :key="user.id" class="avatar-item"
                    :style="{ zIndex: 10 - Number(index) }" :title="user.nickName">
                    <NuxtImg :src="buildBackendImageUrl(user.avatar)" :alt="user.nickName" class="avatar-image" />
                  </div>
                </ClientOnly>
                <!-- 如果超过4个，显示 +N -->
                <div v-if="collectionList.length > 4" class="avatar-more">
                  +{{ collectionList.length - 4 }}
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button class="action-btn" @click="handleAddToCollection">
                Add to Favorites
              </button>
              <button class="action-btn action-end chat-button" @click.stop="handleChatNow(productInfo)">
                Chat Now
              </button>
            </div>
          </div>

          <!-- 商品描述（移动端） -->
          <div class="product-description">
            <h2 class="section-title">Product Description</h2>
            <div class="description-content">
              <div v-if="productInfo?.richText1" v-html="productInfo.richText1" class="description-text"></div>
              <div v-if="productInfo?.richText2" v-html="productInfo.richText2" class="description-text"></div>
            </div>
          </div>

          <!-- 相似产品（移动端） -->
          <div v-if="similarProducts && similarProducts.length > 0" class="similar-products">
            <h2 class="section-title">Similar Products of This Type</h2>
            <div class="similar-products-grid">
              <ReNewProductCard v-for="product in similarProducts.slice(0, 3)" :key="product.productId"
                :product="product" @chat-now="handleChatNow(product)" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <ReNewAppFooter />
  </div>
</template>

<script setup lang="ts">
import { addToCollection, fetchProductInfo, fetchSimilarProducts, fetchCollectionList, fetchBreadcrumbsList } from '~/api/product'

// 控制对话框显示
const dialogOpen = ref(false)

// 轮播图引用和当前索引
const carouselRef = ref()
const currentSlide = ref(0)
const isManualScrolling = ref(false) // 标记是否正在手动切换

// 缩略图滚动相关
const thumbnailListRef = ref<HTMLElement | null>(null)
const canScrollUp = ref(false)
const canScrollDown = ref(true)

// Sticky 相关
const attributesRef = ref<HTMLElement | null>(null)
const isSticky = ref(false)
const attributesHeight = ref(0)
const attributesTop = ref(0)

// 获取图片URL管理
const { buildBackendImageUrl } = useImageUrl()

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

const { $toast } = useNuxtApp()

// 获取路由参数
const route = useRoute()
const productSlug = computed(() => route.params.slug as string)

// 【核心：使用 useAsyncData 包装多个 Promise】
const { data: asyncData, status, error: asyncError, refresh } = await useAsyncData(
  `product-detail-${productSlug.value}`,
  async () => {
    const [productRes, similarRes, collectionRes, breadcrumbsRes] = await Promise.allSettled([
      fetchProductInfo(productSlug.value),
      fetchSimilarProducts(productSlug.value),
      fetchCollectionList(productSlug.value),
      fetchBreadcrumbsList(productSlug.value)
    ])

    return {
      product: productRes.status === 'fulfilled' ? (productRes.value as any)?.data : null,
      similar: similarRes.status === 'fulfilled' ? (similarRes.value as any)?.data : [],
      collection: collectionRes.status === 'fulfilled' ? (collectionRes.value as any)?.data : [],
      breadcrumbs: breadcrumbsRes.status === 'fulfilled' ? (breadcrumbsRes.value as any)?.data : []
    }
  }, {
  // 监听 slug 变化，如果路由变了，会自动重新获取数据
  watch: [productSlug]
}
)

const productInfo = computed(() => asyncData.value?.product)
const similarProducts = computed(() => asyncData.value?.similar || [])
const collectionList = computed(() => asyncData.value?.collection || [])
const breadcrumbItems = computed(() => {
  const list = asyncData.value?.breadcrumbs || []
  return list.map((item: string) => ({
    label: item,
    to: {
      path: '/products',
      query: {
        searchInfo: item
      }
    }
  }))
})
const pending = computed(() => status.value === 'pending')

// 监听数据变化，重新初始化轮播图
watch(productInfo, async (newVal) => {
  if (newVal) {
    await nextTick()
    currentSlide.value = 0
  }
})

/**
 * 从参数数组中获取指定 key 的值
 * @param parameters 参数数组
 * @param key 要查找的 key
 * @returns 对应的 value，如果未找到则返回 null
 */
const getParameterValue = (parameters: any[] | undefined, key: string): string | null => {
  if (!parameters || !Array.isArray(parameters)) return null
  const param = parameters.find(p => p && p.key === key)
  return param?.value || null
}

/**
 * 将参数数组按每行4列分组
 * @returns 分组后的二维数组
 */
const parametersRows = computed(() => {
  const parameters = productInfo.value?.parameters || []
  if (!Array.isArray(parameters) || parameters.length === 0) return []

  const rows: any[][] = []
  const columnsPerRow = 4

  for (let i = 0; i < parameters.length; i += columnsPerRow) {
    rows.push(parameters.slice(i, i + columnsPerRow))
  }

  return rows
})



// 轮播图图片列表（包含视频）
const carouselImages = computed(() => {
  if (!productInfo.value) return []

  const items: Array<{ type: 'video' | 'image', url: string }> = []

  // 如果有视频，添加到第一个位置
  if (productInfo.value.productVideo) {
    items.push({
      type: 'video',
      url: productInfo.value.productVideo
    })
  }

  // 优先使用 images 数组
  if (productInfo.value.images && Array.isArray(productInfo.value.images)) {
    const sortedImages = [...productInfo.value.images]
      .sort((a, b) => (a.sort || 0) - (b.sort || 0))
      .map(img => img.url)
      .filter(Boolean)

    sortedImages.forEach(url => {
      items.push({ type: 'image', url })
    })

    if (items.length > 0) return items
  }

  return items
})


// 轮播图变化事件
const onSlideChange = (index: number) => {
  // 只在非手动切换时更新状态
  if (!isManualScrolling.value) {
    currentSlide.value = index
  }
  isManualScrolling.value = false
}

// 选择轮播图（点击缩略图时调用）
const selectSlide = (index: number) => {
  // 标记为手动切换，防止 @select 事件覆盖
  isManualScrolling.value = true
  currentSlide.value = index

  // emblaApi 是一个 ref，需要使用 .value 访问
  nextTick(() => {
    const api = carouselRef.value?.emblaApi?.value || carouselRef.value?.emblaApi
    if (api && typeof api.scrollTo === 'function') {
      api.scrollTo(index)
    }
  })
}

/**
 * 滚动缩略图列表
 * @param direction 滚动方向 'up' 或 'down'
 */
const scrollThumbnails = (direction: 'up' | 'down') => {
  if (!thumbnailListRef.value) return

  const scrollAmount = 200 // 每次滚动的像素距离
  if (direction === 'up') {
    thumbnailListRef.value.scrollBy({ top: -scrollAmount })
  } else {
    thumbnailListRef.value.scrollBy({ top: scrollAmount })
  }
}

/**
 * 处理缩略图列表的鼠标滚轮事件
 * @param event 滚轮事件
 */
const handleWheelScroll = (event: WheelEvent) => {
  if (!thumbnailListRef.value) return

  event.preventDefault()
  const scrollAmount = 100 // 滚轮每次滚动的像素距离
  thumbnailListRef.value.scrollBy({ top: event.deltaY > 0 ? scrollAmount : -scrollAmount })
}

/**
 * 更新滚动按钮状态
 */
const updateScrollButtons = () => {
  if (!thumbnailListRef.value) return

  const { scrollTop, scrollHeight, clientHeight } = thumbnailListRef.value
  // 当滚动到顶部时，隐藏向上按钮
  canScrollUp.value = scrollTop > 0
  // 当滚动到底部时，隐藏向下按钮
  canScrollDown.value = scrollTop + clientHeight < scrollHeight - 1 // 减1px作为容错
}

// 添加收藏
const handleAddToCollection = async () => {
  try {
    const result = await addToCollection(productSlug.value) as any
    $toast.success(result?.message || 'Added to favorites successfully!')
    console.log('添加收藏成功:', result)
  } catch (error) {
    console.error('添加收藏失败:', error)
    $toast.error('Failed to add to favorites')
  }
}

// 发送询盘
const handleSendInquiry = () => {
  dialogOpen.value = true
}

// 监听路由参数变化
// watch(() => route.params.slug, async (newSlug) => {
//   if (newSlug) {
//     await fetchAllData()
//   }
// })

// 处理 Chat Now 点击事件
const handleChatNow = (product: any) => {
  console.log('Chat Now 点击，产品:', product)
  dialogOpen.value = true
}

// 监听滚动，实现 sticky 效果（仅PC端）
onMounted(() => {
  // 移动端不需要sticky效果
  if (isMobile.value) return

  // 初始化 attributesRef 的高度和位置
  if (attributesRef.value) {
    attributesHeight.value = attributesRef.value.offsetHeight
    attributesTop.value = attributesRef.value.offsetTop
  }

  const handleScroll = () => {
    if (!attributesRef.value) return

    const scrollY = window.scrollY

    // 当滚动距离大于 attributesRef 的高度加上距离顶部的高度时启用 sticky
    if (scrollY >= attributesHeight.value + attributesTop.value) {
      isSticky.value = true
    } else {
      isSticky.value = false
    }
  }

  window.addEventListener('scroll', handleScroll)

  // 监听缩略图列表滚动事件，更新按钮状态
  if (thumbnailListRef.value) {
    thumbnailListRef.value.addEventListener('scroll', updateScrollButtons)
    // 初始化按钮状态
    updateScrollButtons()
  }

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (thumbnailListRef.value) {
      thumbnailListRef.value.removeEventListener('scroll', updateScrollButtons)
    }
  })
})

</script>

<style scoped lang="scss">
.product-detail-page {
  background-color: #F9F9F9;
  min-height: 100vh;
}

.product-detail-container {
  padding: 2.0833vw 8.3333vw;
  max-width: 100%;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 31.25vw; // 600px at 1920px
}

.loading-spinner {
  font-size: clamp(16px, 1.25vw, 24px);
  color: #666;
}

.product-detail-content {
  padding: 2.0833vw;
}

.product-header {
  margin-bottom: 2.0833vw;
}

.product-title {
  font-size: clamp(14px, 1.5625vw, 30px);
  font-weight: bold;
  color: #000;
}

/* PC端：左右布局 */
.product-main-layout {
  display: flex;
  margin-bottom: 2.0833vw;
  align-items: flex-start;
}

.product-left {
  width: 60%;
  flex-shrink: 0;
}

.product-right {
  width: 40%;
  flex-shrink: 0;
  padding-left: 2vw;
  position: relative;
  align-self: stretch;
  display: flex;
  flex-direction: column;
}

/* 轮播图和缩略图区域（PC端：缩略图在左侧，轮播图在右侧） */
.product-gallery-with-thumbnails {
  display: flex;
  gap: 1.0417vw;
  margin-bottom: 2.0833vw;
  align-items: flex-start;
}

/* 缩略图列表容器 */
.thumbnail-list-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  height: 30vw; // 5张图片的高度
}

/* 滚动按钮 */
.scroll-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2vw;
  height: 2vw;
  background: $primary-color;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  position: absolute;
  z-index: 10;

  &:hover {
    background: rgba($primary-color, 0.9);
  }

  .ui-icon {
    font-size: clamp(12px, 1.0417vw, 20px);
    color: #fff;
  }
}

.scroll-up {
  top: -1vw;
}

.scroll-down {
  bottom: -1vw;
}

/* 缩略图列表（垂直排列） */
.thumbnail-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.625vw;
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;

  /* 隐藏滚动条 */
  &::-webkit-scrollbar {
    display: none;
  }

  /* 隐藏滚动条 - Firefox */
  scrollbar-width: none;

  /* 隐藏滚动条 - IE/Edge */
  -ms-overflow-style: none;
}

.thumbnail-item {
  width: 6.25vw;
  height: 5.4688vw;
  flex-shrink: 0;
  border-radius: 0.4167vw;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.3s;
  position: relative;

  &:hover,
  &.active {
    border-color: #071C63;
  }
}

.thumbnail-list-vertical .thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 轮播图区域 */
.product-gallery-section {
  display: flex;
  flex-direction: column;
  gap: 1.0417vw;
}

.carousel-wrapper {
  flex: 1;
  min-width: 0;
  background: #F5F5F5;
  border-radius: 0.625vw;
  overflow: hidden;
  position: relative;
}

.carousel-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: clamp(14px, 1.0417vw, 20px);
}

.product-carousel {
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  cursor: pointer;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: clamp(14px, 1.0417vw, 20px);
}

.product-highlight {
  background: linear-gradient(90deg, #FFCFB2 0%, #FFF4EE 100%);
  border-radius: 12px 12px 12px 12px;
  padding: 1.1979vw 2.5vw;
  margin: .5208vw 0;

  .product-highlight-title {
    font-weight: bold;
    font-size: clamp(14px, 1.25vw, 24px);
    color: #000000;
    margin-bottom: .5208vw;
  }

  .product-highlight-content {
    font-size: clamp(14px, .8333vw, 16px);
    color: #000000;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 移动端缩略图列表（横向排列） */
.thumbnail-list {
  display: flex;
  flex-direction: row;
  gap: 0.625vw;
  flex-shrink: 0;
  overflow-x: auto;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: clamp(16px, 1.5625vw, 30px);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

/* 商品属性 */
.product-attributes {
  width: 100%;
  background: #FFFFFF;
  border-radius: .625vw;
  padding: 1.25vw;
  transition: all 0.3s ease;

  &.sticky-active {
    position: sticky;
    top: 5.0833vw;
    align-self: flex-start;
    max-height: calc(100vh - 5.0833vw - 2.0833vw);
    overflow-y: auto;
    animation: fadeDown 0.3s ease;

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 0.5208vw;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 0.2604vw;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 0.2604vw;

      &:hover {
        background: #555;
      }
    }
  }
}

.product-price {
  margin-bottom: 1.5625vw;
  display: flex;
  align-items: baseline;
  gap: 0.2083vw;
}

.price-value {
  font-size: clamp(24px, 1.6667vw, 32px);
  color: #000;
  font-weight: bold;
}

.stock-row {
  display: flex;
  align-items: center;
  gap: 0.5208vw;
  background: #F8F8F8;
  border-radius: .625vw;
  padding: .5729vw .7813vw;
}

.attribute-icon {
  font-size: clamp(16px, 1.6667vw, 32px);
  color: #666;
}

.attribute-label {
  font-size: clamp(14px, 1.0417vw, 20px);
  color: #666;
}

.attribute-value {
  font-size: clamp(14px, 1.0417vw, 20px);
  color: #000;
  font-weight: 500;
}

.attributes-list {
  margin-top: 2.0833vw;
  margin-bottom: 2.0833vw;
}

.attribute-stock-row {
  /* 库存属性行样式 */
  display: flex;
  align-items: center;
  gap: 0.5208vw;
  margin-bottom: 1.0417vw;
  background: #F8F8F8;
  border-radius: .625vw;
  padding: .5208vw 1.3542vw;
}

/* 商品属性列表行样式 */
.attribute-list-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5625vw;
  margin-bottom: 1.0417vw;
  background: transparent;
  padding: 0;
}

.attribute-item {
  display: flex;
  flex-direction: column;
  gap: 0.5208vw;
  align-items: flex-start;
}

.attr-label {
  font-size: clamp(12px, 0.8333vw, 16px);
  color: #000;
  font-weight: normal;
}

.attr-value {
  font-size: clamp(12px, 0.8333vw, 16px);
  color: #8D8D8D;
  font-weight: 400;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

/* Customization sections */
.customization-section {
  margin-top: 1.3021vw;
  margin-bottom: 1.3021vw;
}

.customization-section .section-title {
  font-size: clamp(16px, 1.0417vw, 20px);
  font-weight: bold;
  color: #000;
  margin-bottom: 1.0417vw;
}

.customization-list {
  list-style-type: disc;
  padding-left: 1.5625vw;
  color: #000;
}

.customization-list li {
  font-size: clamp(10px, .7292vw, 14px);
  margin-bottom: 0.5208vw;
}

/* Shipping section */
.shipping-section {
  margin-top: 2.6042vw;
  margin-bottom: 2.0833vw;
}

.shipping-section .section-title {
  font-size: clamp(16px, 1.0417vw, 20px);
  font-weight: bold;
  color: #000;
  margin-bottom: 1.0417vw;
}

.shipping-info {
  font-size: clamp(10px, .7292vw, 14px);
  color: #000;
}

/* Price section */
.border-section {
  margin-top: 1.3021vw;
  margin-bottom: 1.3021vw;
  padding: 1.3021vw 0;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.section-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.0417vw;


  .row-label {
    font-size: clamp(10px, .7292vw, 14px);
    color: #000;
  }

  .row-value {
    font-size: clamp(12px, .8333vw, 16px);
    color: #000;
    font-weight: bold;
  }

}

.section-row:last-child {
  margin-bottom: 0;
}


.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1.0417vw;
  margin-top: 2.0833vw;
}

.action-btn {
  @include chat-btn;
}

.action-end {
  background-color: $primary-color !important;
  color: #fff !important;

  &:hover {
    background: #FFFFFF !important;
    color: #000 !important;
  }
}

/* 同类商品 */
.similar-products {
  width: 100%;
  margin-top: 2.0833vw;
}

.section-title {
  font-size: clamp(18px, 1.5625vw, 30px);
  font-weight: bold;
  color: #000;
  margin-bottom: 1.5625vw;
}

.similar-products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.0417vw;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 31.25vw;
  color: #999;
}

.error-icon {
  font-size: clamp(48px, 13.3333vw, 64px);
  margin-bottom: 1.0417vw;
}

.error-text {
  font-size: clamp(14px, 1.0417vw, 20px);
}

.chat-button {
  @include chat-btn;
}

/* 收藏用户列表 */
.favorite-users {
  margin: 1.5625vw 0;
  padding: 1.0417vw;
  background: #F8F8F8;
  border-radius: 0.625vw;
}

.favorite-header {
  display: flex;
  align-items: center;
  gap: 0.4167vw;
  margin-bottom: 0.7813vw;
}

.heart-icon {
  font-size: clamp(14px, 0.9375vw, 18px);
  color: #ff6b6b;
}

.favorite-title {
  font-size: clamp(12px, .8333vw, 16px);
  color: #000;
  font-weight: 500;
}

.favorite-avatars {
  display: flex;
  align-items: center;
  gap: 0.2083vw;
}

.avatar-item {
  position: relative;
  width: 2.0833vw; // 40px at 1920px
  height: 2.0833vw;
  border-radius: 50%;
  border: 2px solid #fff;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:not(:first-child) {
    margin-left: -0.625vw;
  }

  &:hover {
    transform: translateY(-0.2083vw) scale(1.1);
    z-index: 100 !important;
  }
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.0833vw;
  height: 2.0833vw;
  border-radius: 50%;
  background: #e5e5e5;
  border: 2px solid #fff;
  font-size: clamp(10px, 0.625vw, 12px);
  font-weight: 600;
  color: #666;
  margin-left: -0.625vw;
}


.product-description {
  margin-top: 2.0833vw;
  width: 100%;

  .description-content {
    padding: 1.0417vw;
    background: #fff;
    border-radius: .625vw;
    word-break: break-word;

    :deep(table) {
      border: 1px solid #ededed !important;
      border-collapse: collapse !important;

      th,
      td {
        padding: 8px 12px;
        border-left: none !important;
        border-top: none !important;
        border-right: none !important;
        border-bottom: 1px solid #ededed !important;
        /* 每行只有下边框 */
      }

      td:nth-child(odd),
      th:nth-child(odd) {
        background-color: #f8f8f8;
      }
    }
  }
}

@keyframes fadeDown {
  from {
    opacity: 0.8;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ------------------------------------Mobile样式----------------------------*/
.is-mobile {
  .product-detail-container {
    padding: 20px 16px;
  }

  .product-detail-content {
    padding: 0;
  }

  .product-header {
    margin-bottom: 16px;
  }

  .product-title {
    font-size: clamp(18px, 4.2667vw, 24px);
  }

  .product-gallery-section {
    margin-bottom: 16px;
    gap: 12px;
  }

  .product-attributes {
    width: 100%;
    max-width: 100%;
    margin-bottom: 16px;
  }

  .product-description {
    width: 100%;
    max-width: 100%;
  }

  .carousel-wrapper {
    border-radius: 12px;
  }

  .carousel-image {
    aspect-ratio: 1;
  }

  .thumbnail-list {
    gap: 8px;
  }

  .thumbnail-item {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .product-attributes {
    max-width: 100%;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
  }

  .product-price {
    margin-bottom: 16px;
  }

  .price-value {
    font-size: clamp(20px, 4.8vw, 28px);
  }

  .attribute-stock-row {
    border-radius: 12px;
    padding: 12px 16px;
    gap: 8px;
  }

  .attribute-icon {
    font-size: clamp(18px, 4.2667vw, 24px);
  }

  .attribute-label {
    font-size: clamp(12px, 2.6667vw, 14px);
  }

  .attribute-value {
    font-size: clamp(12px, 2.6667vw, 14px);
  }

  .attributes-list {
    gap: 12px;
    margin-top: 16px;
    margin-bottom: 16px;
  }

  .attribute-item {
    gap: 12px;
    padding: 12px 0;
  }

  .attr-label {
    font-size: clamp(12px, 2.6667vw, 14px);
    min-width: auto;
  }

  .attr-value {
    font-size: clamp(12px, 2.6667vw, 14px);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }

  .action-buttons {
    gap: 12px;
    margin-top: 16px;
    flex-direction: column;
  }

  .action-btn {
    width: 100% !important;
  }

  .favorite-users {
    margin: 16px 0;
    padding: 12px;
    border-radius: 12px;
  }

  .favorite-header {
    gap: 8px;
    margin-bottom: 12px;
  }

  .heart-icon {
    font-size: clamp(14px, 3.2vw, 18px);
  }

  .favorite-title {
    font-size: clamp(12px, 2.6667vw, 14px);
  }

  .avatar-item {
    width: 32px;
    height: 32px;

    &:not(:first-child) {
      margin-left: -8px;
    }

    &:hover {
      transform: translateY(-2px) scale(1.1);
    }
  }

  .avatar-more {
    width: 32px;
    height: 32px;
    margin-left: -8px;
    font-size: clamp(10px, 2.1333vw, 11px);
  }

  .similar-products {
    margin-bottom: 16px;
  }

  .section-title {
    font-size: clamp(16px, 3.4667vw, 20px);
    margin-bottom: 12px;
  }

  .similar-products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .product-description {
    margin-top: 16px;
    max-width: 100%;

    .description-content {
      padding: 16px;
      border-radius: 12px;

      :deep(table) {
        border: 1px solid #ccc;
        border-collapse: collapse;

        th,
        td {
          padding: 8px 12px;
          border-bottom: 1px solid #e5e7eb;
          /* 每行只有下边框 */
        }

        /* 最后一行不需要下边框（可选） */
        tr:last-child th,
        tr:last-child td {
          border-bottom: none;
        }

        td:nth-child(odd),
        th:nth-child(odd) {
          background-color: #f8f8f8;
        }
      }
    }
  }

  .loading-state {
    min-height: 200px;
  }

  .error-state {
    min-height: 200px;
  }

  .error-icon {
    font-size: clamp(48px, 10.6667vw, 64px);
    margin-bottom: 12px;
  }

  .error-text {
    font-size: clamp(12px, 2.6667vw, 14px);
  }
}
</style>

<template>
  <div class="types-carousel-container">
    <!-- 主轮播图 -->
    <UCarousel
      ref="mainCarousel"
      v-slot="{ item, index }"
      :items="imageItems"
      loop
      @select="onSlideSelect"
    >
      <div class="relative">
        <!-- 主图片 -->
        <NuxtImg
          :src="item.url"
          :alt="item.alt || `产品图片 ${index + 1}`"
          densities="1"
          loading="lazy"
          format="webp"
          class="main-image"
        />
        
        <!-- 图片遮罩层（可选） -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <!-- 图片标题（如果有） -->
        <div 
          v-if="item.title" 
          class="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <h3 class="text-lg font-semibold mb-1">{{ item.title }}</h3>
          <p v-if="item.description" class="text-sm text-white/90">{{ item.description }}</p>
        </div>
      </div>
    </UCarousel>

    <!-- 缩略图导航（可选） -->
    <div v-if="showThumbnails && imageItems.length > 1" class="mt-4">
      <div class="btns flex gap-2 justify-center overflow-x-auto pb-2">
        <button
          v-for="(item, index) in imageItems"
          :key="index"
          @click="goToSlide(index)"
          :class="[
            'btn flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200',
            currentSlideIndex === index 
              ? 'ring-primary' 
              : 'border-gray-300 hover:border-gray-400'
          ]"
        >
          <NuxtImg
            :src="item.url"
            :alt="item.alt || `缩略图 ${index + 1}`"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 产品类型轮播图组件
 * 支持图片数组传入，使用 NuxtImg 进行图片优化
 * @component TypesCarousel
 */

interface ImageItem {
  /** 图片URL地址 */
  url: string
  /** 图片替代文本 */
  alt?: string
  /** 图片标题 */
  title?: string
  /** 图片描述 */
  description?: string
}

interface Props {
  /** 图片数据数组 */
  images: string[] | ImageItem[]
  /** 是否显示缩略图导航 */
  showThumbnails?: boolean
  /** 轮播图宽度 */
  width?: string
  /** 轮播图高度 */
  height?: string
  /** 是否自动播放 */
  autoplay?: boolean
  /** 自动播放间隔时间（毫秒） */
  autoplayDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  showThumbnails: true,
  width: '100%',
  height: 'auto',
  autoplay: false,
  autoplayDelay: 3000
})

// 轮播图引用
const mainCarousel = ref()

// 当前选中的幻灯片索引
const currentSlideIndex = ref(0)

// 自动播放定时器
let autoplayTimer: NodeJS.Timeout | null = null

/**
 * 处理图片数据，统一格式
 * @returns 标准化的图片项数组
 */
const imageItems = computed((): ImageItem[] => {
  return props.images.map((image, index) => {
    if (typeof image === 'string') {
      return {
        url: image,
        alt: `产品图片 ${index + 1}`
      }
    }
    return {
      url: image.url,
      alt: image.alt || `产品图片 ${index + 1}`,
      title: image.title,
      description: image.description
    }
  })
})

/**
 * 幻灯片选择事件处理
 * @param selectedIndex - 选中的幻灯片索引
 */
const onSlideSelect = (selectedIndex: number) => {
  currentSlideIndex.value = selectedIndex
}

/**
 * 跳转到指定幻灯片
 * @param index - 目标幻灯片索引
 */
const goToSlide = (index: number) => {
  if (mainCarousel.value?.emblaApi) {
    mainCarousel.value.emblaApi.scrollTo(index)
  }
}

/**
 * 开始自动播放
 */
const startAutoplay = () => {
  if (!props.autoplay || imageItems.value.length <= 1) return
  
  autoplayTimer = setInterval(() => {
    if (mainCarousel.value?.emblaApi) {
      const currentIndex = mainCarousel.value.emblaApi.selectedScrollSnap()
      const nextIndex = (currentIndex + 1) % imageItems.value.length
      mainCarousel.value.emblaApi.scrollTo(nextIndex)
    }
  }, props.autoplayDelay)
}

/**
 * 停止自动播放
 */
const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

// 监听自动播放状态变化
watch(() => props.autoplay, (newVal) => {
  if (newVal) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
})

// 组件挂载时开始自动播放
onMounted(() => {
  if (props.autoplay) {
    startAutoplay()
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopAutoplay()
})

// 鼠标悬停时暂停自动播放
const onMouseEnter = () => {
  if (props.autoplay) {
    stopAutoplay()
  }
}

const onMouseLeave = () => {
  if (props.autoplay) {
    startAutoplay()
  }
}
</script>

<style scoped lang="scss">
.types-carousel-container {
  position: relative;
  width: v-bind(width);
  height: v-bind(height);
  display: inline-block;
  max-width: 100%;
}

/* 轮播图包装器样式 */
:deep(.carousel-root) {
  width: 100%;
  height: 100%;
}

/* 轮播图视口样式 */
:deep(.carousel-viewport) {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 轮播图容器样式 */
:deep(.carousel-container) {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 100%;
}

/* 轮播图项目样式 */
:deep(.carousel-item) {
  min-width: 0;
  flex-shrink: 0;
  flex-basis: 100%;
  padding-left: 1rem;
  height: 100%;
}

/* 主图片样式 */
.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
}

/* 箭头按钮样式 */
:deep(.carousel-prev),
:deep(.carousel-next) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

:deep(.carousel-prev) {
  left: 1rem;
}

:deep(.carousel-next) {
  right: 1rem;
}

/* 圆点指示器样式 */
:deep(.carousel-dots) {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1.75rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

:deep(.carousel-dot) {
  cursor: pointer;
  width: 0.75rem;
  height: 0.75rem;
  background-color: #d1d5db;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #9ca3af;
  }
  
  &[data-state="active"] {
    background-color: #3b82f6;
  }
}

/* 缩略图滚动条样式 */
.types-carousel-container::-webkit-scrollbar {
  height: 4px;
}

.types-carousel-container::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 9999px;
}

.types-carousel-container::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
  
  &:hover {
    background-color: #9ca3af;
  }
}
</style>

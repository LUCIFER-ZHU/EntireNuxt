<template>
  <div class="video-box">
    <!-- 视频封面区域 -->
    <div class="relative group cursor-pointer overflow-hidden rounded-[.625vw]"
      :style="{ width: props.width, height: props.height }">
      <!-- 封面图片 -->
      <NuxtImg densities="1" :src="coverImage" alt="cover"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />

      <!-- 播放按钮（无遮罩层） -->
      <div class="absolute inset-0 flex items-center justify-center">
        <!-- 播放按钮 -->
        <div class="play-button-wrapper" @click="openVideoModal">
          <div class="play-button-custom flex items-center justify-center">
            <NuxtImg densities="1" :src="buildImageUrl('/image/needful/video-btn.webp')" alt="play" :style="{ width: props.iconSize, height: props.iconSize }"/>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频模态框 -->
    <ClientOnly>
      <UModal v-model:open="isModalOpen" class="video-modal max-w-[70vw] h-[70vh] overflow-visible" title="Video Modal"
        description="Video Modal">
        <template #content>
          <div class="video-modal-content">
            <!-- 关闭按钮 -->
            <UButton color="neutral" variant="ghost"
              class="close-button absolute top-[-2.6042vw] right-[-2.6042vw] rounded-full" @click="closeVideoModal">
              <UIcon name="i-heroicons:x-circle" size="25" class="text-[#092991]" />
            </UButton>

            <video v-if="isModalOpen" ref="videoRef" :src="videoUrl" class="w-full h-full rounded-lg" controls autoplay
              preload="metadata" @loadstart="handleVideoLoadStart" @loadeddata="handleVideoLoadedData"
              @error="handleVideoError">
              Your browser does not support video playback.
            </video>
          </div>
        </template>
      </UModal>
      <template #fallback>
        <!-- SSR fallback: 空内容，模态框只在客户端显示 -->
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
/**
 * VideoBox 视频播放组件
 * 
 * 功能：
 * - 展示视频封面图片和播放按钮
 * - 点击播放按钮在模态框中播放视频
 * - 支持错误处理和响应式设计
 * 
 * @component VideoBox
 * @example
 * <VideoBox
 *   video-url="/videos/sample.mp4"
 *   cover-image="/images/video-cover.jpg"
 *   width="17.5521vw"
 *   height="9.2708vw"
 * />
 */


// 导入图片URL构建函数
const { buildImageUrl } = useImageUrl();

// 使用全局的 $toast (由 vue-toastification 插件提供)
const { $toast } = useNuxtApp();

// 组件属性接口定义
interface VideoBoxProps {
  /** 视频文件URL地址（必填） */
  videoUrl: string;
  /** 视频封面图片URL地址（必填） */
  coverImage: string;
  /** 视频宽度（可选） */
  width?: string;
  /** 视频高度（可选） */
  height?: string;
  /** 图标大小（可选） */
  iconSize?: string;
}

// 定义组件属性和默认值
const props = withDefaults(defineProps<VideoBoxProps>(), {
  width: '17.5521vw',
  height: '9.2708vw',
  iconSize: '3.6458vw'
});

// 组件状态管理
const isModalOpen = ref(false); // 模态框开启状态
const videoRef = ref<HTMLVideoElement>(); // 视频元素引用

/**
 * 打开视频模态框
 * 
 * @function openVideoModal
 * @returns {void}
 */
const openVideoModal = (): void => {
  isModalOpen.value = true;
};

/**
 * 关闭视频模态框
 * 
 * @function closeVideoModal
 * @returns {void}
 */
const closeVideoModal = (): void => {
  isModalOpen.value = false;
};

/**
 * 处理视频开始加载事件
 * 
 * @function handleVideoLoadStart
 * @returns {void}
 */
const handleVideoLoadStart = (): void => {
  console.log('视频开始加载');
};

/**
 * 处理视频数据加载完成事件
 * 
 * @function handleVideoLoadedData
 * @returns {void}
 */
const handleVideoLoadedData = (): void => {
  console.log('视频加载完成');
};

/**
 * 处理视频加载错误事件
 * 
 * @function handleVideoError
 * @param {Event} event - 错误事件对象
 * @returns {void}
 */
const handleVideoError = (event: Event): void => {
  const target = event.target as HTMLVideoElement;
  const error = target.error;
  console.error('视频播放错误:', error);

  try {
    if ($toast) {
      $toast.error('Video playback failed');
    } else {
      console.warn('Toast not available, showing error message:', 'Video playback failed');
    }
  } catch (error) {
    console.error('Error showing toast:', error);
  }
};

// 监听模态框关闭事件，确保视频停止播放
watch(isModalOpen, (newValue) => {
  if (!newValue && videoRef.value) {
    videoRef.value.pause();
    videoRef.value.currentTime = 0; // 重置播放进度
  }
});

// 组件卸载时清理资源
onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause();
  }
});
</script>

<style scoped>
/**
 * 组件样式定义
 * 使用 Scoped CSS 确保样式只作用于当前组件
 */

.video-box {
  width: 100%;
  max-width: 100%;
}

/* 播放按钮容器 */
.play-button-wrapper {
  position: relative;
  display: inline-block;
}

/* 播放按钮自定义样式 */
.play-button-custom {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
}

/* 播放按钮悬停效果 */
.play-button-wrapper:hover .play-button-custom {
  animation: pulse-ripple 1.5s infinite;
}

/* 播放按钮悬停时外圈效果 */
.play-button-wrapper:hover .play-button-custom::before {
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  box-shadow: 0 0 0 0 rgba(9, 41, 145, 0.4);
}

/* 播放按钮点击效果 */
.play-button-wrapper:active .play-button-custom {
  transform: scale(0.95);
}

/* 波纹放大动画 */
@keyframes pulse-ripple {
  0% {
    transform: scale(1.1);
    box-shadow: 0 0 0 0 rgba(9, 41, 145, 0.6);
  }

  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 12px rgba(9, 41, 145, 0);
  }

  100% {
    transform: scale(1.1);
    box-shadow: 0 0 0 0 rgba(9, 41, 145, 0);
  }
}

.video-modal-content {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: visible;
}

.video-modal-content video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 关闭按钮样式 */
.close-button {
  transition: all 0.2s ease;
}

.close-button:hover {
  transform: scale(1.1);
}
</style>

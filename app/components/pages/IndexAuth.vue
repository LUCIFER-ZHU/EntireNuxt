<template>
  <div class="index-auth" :class="{ 'is-mobile': isMobile }">
    <!-- 移动端 Banner Section -->
    <template v-if="isMobile">
      <!-- 顶部背景图片区域 -->
      <div class="mobile-banner-image"></div>
    </template>

    <!-- Banner Section -->
    <div class="banner">
      <!-- Header -->
      <ReNewAppHeader />
      <div class="banner-content">
        <h1 class="title">Find great deals on quality used machine tools here.</h1>

        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-wrapper">
            <i class="icon mnfont mn-search lg:text-[1.25vw]!"></i>
            <div class="search-input-wrapper">
              <input v-model="searchKeyword" type="text" class="search-input" placeholder="" @keyup.enter="handleSearch"
                @focus="handleInputFocus" @blur="handleInputBlur" />
              <div v-if="!searchKeyword" class="rotating-placeholder-container"
                :class="{ 'no-transition': rotatingPlaceholder.shouldDisableTransition.value }"
                :style="{ transform: `translateY(${rotatingPlaceholder.translateY.value}%)` }">
                <div v-for="(placeholder, index) in rotatingPlaceholder.allPlaceholders" :key="index"
                  class="rotating-placeholder-item">
                  {{ placeholder }}
                </div>
              </div>
            </div>
            <button class="search-button" @click="handleSearch">
              search
            </button>
          </div>
        </div>

        <!-- Keyword Suggestions -->
        <div class="keyword-suggestions">
          <span class="suggestions-label">Keyword Suggestions</span>
          <button class="keyword-btn" @click="handleKeywordClick('Boring Machine')">
            Boring Machine
          </button>
          <button class="keyword-btn" @click="handleKeywordClick('CNC Lathe')">
            CNC Lathe
          </button>
        </div>
      </div>
    </div>

    <!-- New Arrival Products -->
    <ReNewArrivalProducts @open-dialog="dialogOpen = true" />    

    <!-- Hot Selling Products -->
    <ReNewHotSellingProducts @open-dialog="dialogOpen = true" />

    <!-- discover -->
    <ReNewDiscoverOpportunity />

    <!-- marquee -->
    <ReNewBrandMarquee />

    <!-- products -->
    <ReNewInfiniteScrollProducts @open-dialog="dialogOpen = true" />

    <!-- From Inspection to Delivery -->
    <ReNewFromInspectiontoDelivery />

    <!-- Empowering Manufacturers -->
    <ReNewEmpoweringManufacturers @talk-to-experts="dialogOpen = true" />

    <!-- Footer -->
    <ReNewAppFooter />

    <!-- 挂载对话框组件 -->
    <EditorContactFormDialog v-model="dialogOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

// 控制对话框显示
const dialogOpen = ref(false)

const searchKeyword = ref('')

// 使用旋转占位符 composable
const rotatingPlaceholder = useRotatingPlaceholder({
  placeholders: [
    'Boring Machine',
    'CNC Lathe',
    'Milling Machine',
    'Grinding Machine'
  ],
  interval: 3000,
  autoStart: true
})

// 监听输入框内容变化，有内容时停止切换
watch(searchKeyword, (newVal) => {
  if (newVal.trim()) {
    rotatingPlaceholder.stop()
  } else {
    rotatingPlaceholder.start()
  }
})

// 处理输入框获得焦点
const handleInputFocus = () => {
  rotatingPlaceholder.stop()
}

// 处理输入框失去焦点
const handleInputBlur = () => {
  if (!searchKeyword.value.trim()) {
    rotatingPlaceholder.start()
  }
}

// 处理搜索
const handleSearch = () => {
  const { $toast } = useNuxtApp()

  if (!searchKeyword.value.trim()) {
    $toast.error('Please enter a search keyword')
    return
  }

  console.log('搜索关键词:', searchKeyword.value)
  // 跳转到 products 页面，传入 searchInfo
  navigateTo({
    path: '/products',
    query: {
      searchInfo: searchKeyword.value.trim()
    }
  })
}

// 处理关键词点击
const handleKeywordClick = (keyword: string) => {
  searchKeyword.value = keyword
  console.log('选择关键词:', keyword)
}
</script>

<style scoped lang="scss">
.index-auth {
  // 首页头部固定
  :deep(.new-header){
    position: fixed;
    background-color: transparent;
    border-bottom: 1px solid transparent;
    width: 100vw;

    // 首页初始状态：统一设置白色字体
    .header-container {
      color: #ffffff;
    }

    // 滚动后恢复默认样式（白色背景+primary字体）
    &.is-scrolled {
      background-color: #ffffff;
      border-bottom: 1px solid #e5e7eb;

      // 恢复默认 primary 颜色（继承自 AppHeader 的默认样式）
      .header-container {
        color: $primary-color;
      }
    }
  }

  // Banner Section
  .banner {
    position: relative;
    width: 100%;
    height: 31.25vw;
    min-height: 400px;
    background: $primary-color url($image-base + '/image/img10.webp') center/cover no-repeat;
    overflow: hidden;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    .banner-content {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      z-index: 2;
      width: 100%;
      margin: 0 auto;
      padding: 0 16.6667vw;
      text-align: left;

      .title {
        font-size: clamp(28px, 2.5vw, 48px);
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 2.8125vw;
        line-height: 1.2;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        text-align: left;
      }

      // 搜索容器
      .search-container {
        margin-bottom: 2.4479vw;

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: 50px;
          padding: 0.2083vw 0.2083vw 0.2083vw 1.0417vw;
          box-shadow: 0 0.4167vw 1.25vw rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 0.625vw 1.6667vw rgba(0, 0, 0, 0.2);
          }

          &:focus-within {
            box-shadow: 0 0.625vw 1.6667vw rgba(0, 0, 0, 0.25);
          }

          .search-icon {
            font-size: clamp(20px, 1.25vw, 24px);
            color: #94a3b8;
            margin-right: 0.625vw;
            flex-shrink: 0;
          }

          .search-input-wrapper {
            position: relative;
            flex: 1;
            min-width: 0;
            display: flex;
            align-items: center;
            overflow: hidden;
          }

          .search-input {
            flex: 1;
            border: none;
            outline: none;
            font-size: clamp(14px, 0.8333vw, 16px);
            color: #1e293b;
            background: transparent;
            padding: 0.625vw 0.8333vw;
            min-width: 0;

            &::placeholder {
              color: #94a3b8;
            }
          }

          .rotating-placeholder-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            transition: transform 0.5s ease;
            height: auto;

            &.no-transition {
              transition: none;
            }
          }

          .rotating-placeholder-item {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            padding: 0.625vw 0.8333vw;
            font-size: clamp(14px, 0.8333vw, 16px);
            color: #94a3b8;
            white-space: nowrap;
            height: 100%;
            box-sizing: border-box;
          }

          .search-button {
            @include default-btn;
          }
        }
      }

      // 关键词建议
      .keyword-suggestions {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 0.625vw;
        flex-wrap: wrap;

        .suggestions-label {
          color: #fff;
          font-size: clamp(12px, 1.25vw, 24px);
          font-weight: bold;
          margin-right: 1.6667vw;
        }

        .keyword-btn {
          padding: 0.4167vw 1.0417vw;
          color: #ffffff;
          border: 2px solid rgba(255, 255, 255);
          border-radius: 1.0417vw;
          font-size: clamp(12px, 1.0417vw, 20px);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          background: transparent;

          &:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 0.2083vw 0.625vw rgba(0, 0, 0, 0.2);
          }

          &:active {
            transform: translateY(0);
          }
        }
      }
    }
  }


  /* ------------------------------------Mobile样式----------------------------*/
  // 移动端顶部背景图片
  .mobile-banner-image {
    width: 100%;
    height: 15vw;
    background: url($image-base + '/image/img4.webp') center/cover no-repeat;
  }

  &.is-mobile {
    .banner {
      min-height: 300px;

      .banner-content {
        padding-left: 5vw;
        padding-right: 5vw;

        .title {
          font-size: clamp(10px, 4.2667vw, 32px);
          margin-bottom: 2.9333vw;
        }

        .search-container {
          margin-bottom: 4.2667vw;
          max-width: 100%;

          .search-wrapper {
            padding: 4px 4px 4px 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

            &:hover {
              box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
            }

            &:focus-within {
              box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
            }

            .search-icon {
              margin-right: 8px;
            }

            .search-input-wrapper {
              .search-input {
                padding: 0px 12px;
              }

              .rotating-placeholder-item {
                padding: 0px 12px;
                font-size: clamp(14px, 3.7333vw, 16px);
              }
            }
          }
        }

        .keyword-suggestions {
          display: block;

          .suggestions-label {
            margin-bottom: 2.9333vw;
            display: block;
          }

          .keyword-btn {
            padding: 2vw 4.2667vw;
            border-radius: 8.4vw;
            margin-right: 1vw;
          }
        }
      }
    }
  }

}
</style>
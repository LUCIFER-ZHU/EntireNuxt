<template>
  <div class="index-no-auth" :class="{ 'is-mobile': isMobile }">
    <!-- PC端 Banner Section -->
    <div v-if="!isMobile" class="banner">
      <!-- Header -->
      <ReNewAppHeader />
      <div class="banner-content">
        <h1 class="title">Precision Renewed. Value Redefined</h1>
        <p class="sub-title">The Leading Global Marketplace for Pre-Owned CNC Machines</p>

        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-wrapper">
            <i class="icon mnfont mn-search lg:text-[1.25vw]!"></i>
            <div class="search-input-wrapper">
              <input 
                v-model="searchKeyword" 
                type="text" 
                class="search-input" 
                placeholder=""
                @keyup.enter="handleSearch"
                @focus="handleInputFocus"
                @blur="handleInputBlur"
              />
              <div 
                v-if="!searchKeyword" 
                class="rotating-placeholder-container"
                :class="{ 'no-transition': rotatingPlaceholder.shouldDisableTransition.value }"
                :style="{ transform: `translateY(${rotatingPlaceholder.translateY.value}%)` }"
              >
                <div 
                  v-for="(placeholder, index) in rotatingPlaceholder.allPlaceholders" 
                  :key="index"
                  class="rotating-placeholder-item"
                >
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

    <!-- 移动端 Banner Section -->
    <template v-if="isMobile">
      <!-- AppHeader -->
      <ReNewAppHeader />
      <!-- 顶部背景图片区域 -->
      <div class="mobile-banner-image"></div>

      <!-- 搜索内容区域（深蓝色背景） -->
      <div class="mobile-banner-content">
        <h1 class="mobile-title">Precision Renewed. Value Redefined</h1>

        <!-- Search Bar -->
        <div class="mobile-search-container">
          <div class="mobile-search-wrapper">
            <i class="icon mnfont mn-search"></i>
            <div class="mobile-search-input-wrapper">
              <input 
                v-model="searchKeyword" 
                type="text" 
                class="mobile-search-input" 
                placeholder=""
                @keyup.enter="handleSearch"
                @focus="handleInputFocus"
                @blur="handleInputBlur"
              />
              <div 
                v-if="!searchKeyword" 
                class="rotating-placeholder-container"
                :class="{ 'no-transition': rotatingPlaceholder.shouldDisableTransition.value }"
                :style="{ transform: `translateY(${rotatingPlaceholder.translateY.value}%)` }"
              >
                <div 
                  v-for="(placeholder, index) in rotatingPlaceholder.allPlaceholders" 
                  :key="index"
                  class="rotating-placeholder-item"
                >
                  {{ placeholder }}
                </div>
              </div>
            </div>
            <button class="mobile-search-button" @click="handleSearch">
              search
            </button>
          </div>
        </div>

        <!-- Keyword Suggestions -->
        <div class="mobile-keyword-suggestions">
          <span class="mobile-suggestions-label">Keyword Suggestions</span>
          <div class="mobile-keyword-buttons">
            <button class="mobile-keyword-btn" @click="handleKeywordClick('Boring Machine')">
              Boring Machine
            </button>
            <button class="mobile-keyword-btn" @click="handleKeywordClick('CNC Lathe')">
              CNC Lathe
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- advantage -->
    <div class="advantage">
      <div class="advantage-content">
        <div class="advantage-item">
          <div class="advantage-item-icon">
            <i class="icon mnfont mn-label"></i>
          </div>
          <div class="advantage-item-title">
            Authenticity
          </div>
          <div class="advantage-item-text">
            Every machine we offer comes with complete original documentation and inspection records.
            <br><br>
            We maintain full transparency through certified testing procedures and third-party precision reports.
          </div>
        </div>
        <div class="advantage-item">
          <div class="advantage-item-icon">
            <i class="icon mnfont mn-cycle"></i>
          </div>
          <div class="advantage-item-title">
            Rebirth
          </div>
          <div class="advantage-item-text">
            We believe a used machine tool is not "old" — it's reborn.
            <br><br>
            Each unit undergoes professional refurbishment, stability testing, and re-certification before delivery.
          </div>
        </div>
        <div class="advantage-item">
          <div class="advantage-item-icon">
            <i class="icon mnfont mn-chart-histogram"></i>
          </div>
          <div class="advantage-item-title">
            Value
          </div>
          <div class="advantage-item-text">
            Achieve world-class performance at a rational investment.
            <br><br>
            We provide performance comparison reports against new machines to prove real return on value.
          </div>
        </div>
        <div class="advantage-item">
          <div class="advantage-item-icon">
            <i class="icon mnfont mn-cross-ring-two"></i>
          </div>
          <div class="advantage-item-title">
            Sustainability
          </div>
          <div class="advantage-item-text">
            Reducing waste while keeping manufacturing efficient and green.
            <br><br>
            Through reuse and re-manufacturing, we make precision equipment part of a sustainable industrial future.
          </div>
        </div>
      </div>
    </div>

    <!-- nums -->
    <div class="nums">
      <div class="nums-title">Give precision machines a second life</div>
      <div class="nums-sub-title">— and your business a smarter start.</div>
      <div class="grid-4">
        <div class="grid-item">
          <div class="grid-item-title">
            <CountUp :end-val="1200" :duration="2.5" :options="{
              enableScrollSpy: true,
              scrollSpyOnce: true,
              suffix: '+'
            }" />
          </div>
          <div class="grid-item-text">Certified Machines<br>in Stock</div>
        </div>
        <div class="grid-item">
          <div class="grid-item-title">
            <CountUp :end-val="20" :duration="2.5" :options="{
              enableScrollSpy: true,
              scrollSpyOnce: true,
              suffix: '+'
            }" />
          </div>
          <div class="grid-item-text">Professional<br>Inspection Engineers</div>
        </div>
        <div class="grid-item">
          <div class="grid-item-title">
            <CountUp :end-val="60" :duration="2.5" :options="{
              enableScrollSpy: true,
              scrollSpyOnce: true,
              suffix: '+'
            }" />
          </div>
          <div class="grid-item-text">Global Brands<br>Covered</div>
        </div>
        <div class="grid-item">
          <div class="grid-item-title">
            <CountUp :end-val="35" :duration="2.5" :options="{
              enableScrollSpy: true,
              scrollSpyOnce: true,
              suffix: '+'
            }" />
          </div>
          <div class="grid-item-text">Clients in<br>Countries</div>
        </div>
      </div>
    </div>

    <!-- types -->
    <ReNewMachineTypes />

    <!-- From Inspection to Delivery -->
    <ReNewFromInspectiontoDelivery />

    <!-- marquee -->
    <ReNewBrandMarquee />    

    <!-- ready -->
    <div class="ready">
      <div class="title">Ready to get started?</div>
      <div class="sub-title">Let our experts help you find the right CNC machine for your next project.</div>
      <div class="btn text-center">
        <UButton class="default-btn" label="Sign in" @click="handleSignIn" />
      </div>
    </div>

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
import CountUp from 'vue-countup-v3'

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

const searchKeyword = ref('')

// 控制对话框显示
const dialogOpen = ref(false)

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

const handleSignIn = () => {
  navigateTo('/account/login')
}

// 处理机器类型搜索
const handleMachineSearch = (machine: any) => {
  console.log('搜索机器类型:', machine.name)
  // TODO: 实现机器类型搜索逻辑
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

:deep(.default-btn) {
  @include default-btn;
  @include button-hover-effect(-0.1042vw, 1.05, 0.98);
}


.index-no-auth {
  // 首页头部固定  
  :deep(.new-header){
    position: fixed;
    background-color: transparent;
    border-bottom: 1px solid transparent;

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
    overflow: hidden;
    background: $primary-color url($image-base + '/image/img10.webp') center/cover no-repeat;

    &-content {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      z-index: 2;
      width: 100%;
      margin: 0 auto;
      padding-left: 8.3333vw; // 左侧间距
      padding-right: 4vw;
      text-align: left;
    }

    .title {
      font-size: clamp(28px, 2.0833vw, 40px);
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 0.8333vw;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .sub-title {
      font-size: clamp(14px, 1.0417vw, 20px);
      color: #e2e8f0;
      margin-bottom: 2.4479vw;
      font-weight: 400;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    // 搜索容器
    .search-container {
      margin-bottom: 2.4479vw;
      max-width: 46.875vw; // 约900px at 1920px

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
        font-size: clamp(12px, .8333vw, 16px);
        font-weight: bold;
        margin-right: 1.6667vw;
      }

      .keyword-btn {
        padding: 0.4167vw 1.0417vw;
        color: #ffffff;
        border: 2px solid rgba(255, 255, 255);
        border-radius: 3.2813vw;
        font-size: clamp(12px, .7292vw, 14px);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);

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

  // Advantage Section
  .advantage {
    background: #071C63;
    padding: 2.7604vw 18.5938vw;

    &-content {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25vw;
      margin: 0 auto;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    &-item {
      padding: 1.25vw;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 0.625vw;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-0.4167vw);
        background: rgba(255, 255, 255, 0.2);
      }

      &-icon {
        width: 3.6458vw;
        height: 3.6458vw;
        margin-bottom: 1.25vw;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.0833vw;
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
        border-radius: .625vw;

        i {
          font-size: inherit;
        }
      }

      &-title {
        font-size: clamp(16px, 1.0417vw, 20px);
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 1.0417vw;
      }

      &-text {
        font-size: clamp(12px, 0.8333vw, 16px);
        color: rgba(255, 255, 255, 0.85);

        br {
          .is-mobile & {
            display: none;
          }
        }
      }
    }
  }

  // Nums Section
  .nums {
    background: #FFFFFF;
    padding: 4.1667vw 8.3333vw;
    text-align: center;

    &-title {
      font-size: clamp(24px, 2.5vw, 48px);
      font-weight: 700;
      color: #000000;
      margin-bottom: 1.0417vw;
      line-height: 1.2;
    }

    &-sub-title {
      font-size: clamp(14px, 1.0417vw, 20px);
      color: #333333;
      margin-bottom: 3.125vw;
      font-weight: 400;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2.0833vw;
      max-width: 1200px;
      margin: 0 auto;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }

      .grid-item {
        padding: 2.0833vw 1.0417vw;
        transition: all 0.3s ease;

        &-title {
          font-size: clamp(32px, 2.5vw, 48px);
          font-weight: 700;
          color: #EF751E;
          margin-bottom: 0.625vw;
        }

        &-text {
          font-size: clamp(14px, 1.0417vw, 20px);
          color: #333333;
          font-weight: 500;
        }
      }
    }
  }

  // Ready Section
  .ready {
    padding: 7.7604vw 0;
    background: #fff;

    .title {
      font-size: clamp(16px, 1.875vw, 36px);
      font-weight: 700;
      color: #000000;
      margin-bottom: 1.0417vw;
      text-align: center;
    }

    .sub-title {
      font-size: clamp(14px, .8333vw, 16px);
      color: #333333;
      margin-bottom: 2.1875vw;
      text-align: center;
    }

    .btn {
      text-align: center;

      :deep(button){
        background: $primary-color;
        padding: .5208vw 2.6042vw;
      }
    }
  }

  /* ------------------------------------Mobile样式----------------------------*/  
  // 移动端顶部背景图片
  .mobile-banner-image {
    position: relative;
    width: 100%;
    height: 50vw;
    min-height: 200px;
    background: url($image-base + '/image/img4.webp') center/cover no-repeat;
  }

  // 移动端搜索内容区域（深蓝色背景）
  .mobile-banner-content {
    background: #071C63;
    padding: 6.2667vw 4.2vw 0;

    .mobile-title {
      font-size: clamp(10px, 4.2667vw, 32px);
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      margin-bottom: 4.2667vw;
    }
  }

  // 移动端搜索容器
  .mobile-search-container {
    margin-bottom: 4.2667vw;
    max-width: 100%;

    .mobile-search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 13.3333vw;
      padding: 1.6vw 1.6vw 1.6vw 4.2667vw;
      box-shadow: 0 2.1333vw 5.3333vw rgba(0, 0, 0, 0.15);

      .icon {
        font-size: clamp(16px, 4.2667vw, 20px);
        color: #94a3b8;
        margin-right: 2.1333vw;
        flex-shrink: 0;
      }

      .mobile-search-input-wrapper {
        position: relative;
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        overflow: hidden;
      }

      .mobile-search-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: clamp(14px, 3.7333vw, 16px);
        color: #1e293b;
        background: transparent;
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
        padding: 0;
        font-size: clamp(14px, 3.7333vw, 16px);
        color: #94a3b8;
        white-space: nowrap;
        height: 100%;
        box-sizing: border-box;
      }

      .mobile-search-button {
        @include default-btn;

        & {
          font-size: clamp(12px, 3.2vw, 14px);
          padding: 2.6667vw 4.2667vw;
          white-space: nowrap;
        }
      }
    }
  }

  // 移动端关键词建议
  .mobile-keyword-suggestions {
    display: flex;
    flex-direction: column;
    gap: 5.1333vw;

    .mobile-suggestions-label {
      color: #fff;
      font-size: clamp(12px, 3.2vw, 14px);
      font-weight: bold;
      width: 100%;
    }

    .mobile-keyword-buttons {
      display: flex;
      gap: 2.1333vw;
      flex-wrap: wrap;
    }

    .mobile-keyword-btn {
      padding: 2.1333vw 4.2667vw;
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255);
      border-radius: 5.3333vw;
      font-size: clamp(12px, 3.2vw, 14px);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      background: transparent;

      &:active {
        background: rgba(255, 255, 255, 0.25);
        transform: scale(0.98);
      }
    }
  }

  &.is-mobile {
    .advantage {
      padding: 5.3333vw 4.2667vw;

      &-content {
        grid-template-columns: repeat(2, 1fr);
        gap: 2.6667vw;
      }

      &-item {
        padding: 4.2667vw;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 1.6vw;
        border: 1px solid rgba(255, 255, 255, 0.1);

        &:active {
          transform: translateY(-0.5333vw);
        }

        &-icon {
          width: 10.6667vw;
          height: 10.6667vw;
          margin-bottom: 3.2vw;
          font-size: 5.3333vw;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1.0667vw;
        }

        &-title {
          font-size: clamp(16px, 4.2667vw, 18px);
          color: #ffffff;
          margin-bottom: 2.1333vw;
        }

        &-text {
          font-size: clamp(12px, 3.2vw, 14px);
          color: rgba(255, 255, 255, 0.85);
        }
      }
    }

    .nums {
      padding: 4.1333vw 9.8667vw;

      .nums-title{
        font-size: clamp(10px, 4.2667vw, 32px);
      }

      .nums-sub-title{
        font-size: clamp(10px, 2.6667vw, 20px);
        color: #8D8D8D;        
      }

      .grid-4{
        .grid-item-title{
          font-size: clamp(10px, 6.4vw, 48px);
        }

        .grid-item-text{
          font-size: clamp(10px, 2.6667vw, 20px);
          color: #8D8D8D;
        }
      }
    }

    .ready{
      padding: 7.7604vw 4vw;
      background: #f9f9fb;
    }
  }


}
</style>
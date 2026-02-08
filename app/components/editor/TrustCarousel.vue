<template>
  <div class="trust-carousel">
    <div class="title">Trusted by 100+ Clients Across Industries</div>

    <!-- 轮播图主体 -->
    <div class="carousel-container">
      <UCarousel ref="carouselRef" :items="slides" :dots="isMob()" :ui="{
        item: 'basis-full',
      }" @select="onSlideSelect">
        <template #default="{ item }">
          <div v-if="item.number === 1" class="slide-content slide-content-1">
            <NuxtImg densities="1" :src="buildImageUrl('image/banner3.webp')" alt="Indonesia Power Company"
              class="w-[31.1458vw] h-[23.3854vw]" loading="lazy"/>
            <div class="content">
              <div class="title">Indonesia Power Company</div>
              <div class="sub-title">– Cooling + Heat Recovery Solution</div>
              <div class="grid3">
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon10.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Location: </div>
                    <div class="text">Border region near Xinjiang, China</div>
                  </div>
                </div>
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon11.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Solution: </div>
                    <div class="text">MINNUO screw chiller + heat recovery chiller</div>
                  </div>
                </div>
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon12.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Application:  </div>
                    <div class="text">Year-round equipment cooling & hot water generation</div>
                  </div>
                </div>
              </div>
              <div class="grid2">
                <div class="grid2-item">
                  <div class="title">
                    Highlights:
                  </div>
                  <div class="text">
                    Stable 24/7 equipment cooling<br>
                    Recovered waste heat for industrial hot water<br>
                    Lower upfront cost than traditional chiller + boiler system<br>
                    Energy-saving & low maintenance
                  </div>
                </div>
                <div class="grid2-item">
                  <div class="title">
                    Client Feedback:
                  </div>
                  <div class="text">
                    MINNUO helped us build a stable and energy-efficient cooling system. The heat recovery function
                    works perfectly.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.number === 2" class="slide-content slide-content-2">
            <NuxtImg densities="1" :src="buildImageUrl('image/banner4.webp')" alt="Tajikistan"
              class="w-[31.1458vw] h-[23.3854vw]" loading="lazy"/>
            <div class="content">
              <div class="title">Tajikistan</div>
              <div class="sub-title">– Salmon Farming Heating Project</div>
              <div class="grid3">
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon10.webp')" alt="icon"  class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Location: </div>
                    <div class="text">Border region near Xinjiang, China</div>
                  </div>
                </div>
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon11.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Solution: </div>
                    <div class="text">Ultra-low temperature air source heat pump system by MINNUO</div>
                  </div>
                </div>
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon12.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Application:  </div>
                    <div class="text">Constant-temperature aquaculture & heating for salmon farming</div>
                  </div>
                </div>
              </div>
              <div class="grid2">
                <div class="grid2-item">
                  <div class="title">
                    Highlights:
                  </div>
                  <div class="text">
                    Two independent heating systems for precise water temperature control<br>
                    Integrated heat recovery from wastewater for energy reuse<br>
                    Significantly reduced operating costs compared to traditional heating<br>
                    Environmentally friendly & compliant with sustainability policies<br>
                    Boosted corporate image and fulfilled social responsibility as a green showcase project
                  </div>
                </div>
                <div class="grid2-item">
                  <div class="title">
                    Client Feedback:
                  </div>
                  <div class="text">
                    MINNUO helped us build a stable and energy-efficient cooling system. The heat recovery function
                    works perfectly.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.number === 3" class="slide-content slide-content-3">
            <NuxtImg densities="1" :src="buildImageUrl('image/banner5.webp')" alt="South America"
              class="w-[31.1458vw] h-[23.3854vw]" loading="lazy"/>
            <div class="content">
              <div class="title">South America</div>
              <div class="sub-title">– Pacific White Shrimp Aquaculture Cooling Project</div>
              <div class="grid3">
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon10.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Location: </div>
                    <div class="text">South America</div>
                  </div>
                </div>
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon11.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Solution: </div>
                    <div class="text">H.Stars water source heat pump system (by MINNUO Group)</div>
                  </div>
                </div>
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon12.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Application:  </div>
                    <div class="text">Temperature-controlled seawater shrimp farming</div>
                  </div>
                </div>
              </div>
              <div class="grid2">
                <div class="grid2-item">
                  <div class="title">
                    Highlights:
                  </div>
                  <div class="text">
                    21,000㎡ ecological shrimp farming facility<br>
                    Water source heat pumps tailored to local environment for stable seawater temperature<br>
                    Low energy consumption through optimized use of on-site water resources<br>
                    Intelligent temperature control, 24/7 heating & automated filtration system<br>
                    Upgraded from 1 to 3 farming cycles per year<br>
                    Production increased to ~17 kg/sqm per cycle, up to 50 kg/sqm per year
                  </div>
                </div>
                <div class="grid2-item">
                  <div class="title">
                    Client Feedback:
                  </div>
                  <div class="text">
                    With MINNUO's water source heat pump system, we tripled our shrimp farming cycles and improved yield
                    with lower operating costs.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.number === 4" class="slide-content slide-content-4">
            <NuxtImg densities="1" :src="buildImageUrl('image/banner6.webp')" alt="Switzerland"
              class="w-[31.1458vw] h-[23.3854vw]" loading="lazy"/>
            <div class="content">
              <div class="title">Switzerland</div>
              <div class="sub-title">– Dettwiler Production Line Cooling Project</div>
              <div class="grid3">
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon10.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Location: </div>
                    <div class="text">Switzerland</div>
                  </div>
                </div>
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon11.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Solution: </div>
                    <div class="text">MINNUO flooded-type screw chiller unit</div>
                  </div>
                </div>
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon12.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Application:  </div>
                    <div class="text">Industrial production line cooling</div>
                  </div>
                </div>
              </div>
              <div class="grid2">
                <div class="grid2-item">
                  <div class="title">
                    Highlights:
                  </div>
                  <div class="text">
                    Efficient cooling solution for Dettwiler’s sealing technology production line<br>
                    Adopted flooded screw chiller with significantly higher cooling efficiency than traditional
                    models<br>
                    Improved energy savings and reduced environmental impact<br>
                    Fully met the client’s continuous production cooling requirements
                  </div>
                </div>
                <div class="grid2-item">
                  <div class="title">
                    Client Feedback:
                  </div>
                  <div class="text">
                    MINNUO’s flooded screw chiller delivered both performance and energy savings — a smart upgrade for
                    our production line.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.number === 5" class="slide-content slide-content-5">
            <NuxtImg densities="1" :src="buildImageUrl('image/banner7.webp')" alt="Argentina"
              class="w-[31.1458vw] h-[23.3854vw]" loading="lazy"/>
            <div class="content">
              <div class="title">Argentina</div>
              <div class="sub-title">– Brewery Cooling & Refrigeration Project</div>
              <div class="grid3">
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon10.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Location: </div>
                    <div class="text">Argentina</div>
                  </div>
                </div>
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon11.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Solution: </div>
                    <div class="text">Screw chiller, heat recovery chiller, and cooling tower system by MINNUO</div>
                  </div>
                </div>
                <div class="grid3-item">
                  <NuxtImg densities="1" :src="buildImageUrl('image/icon12.webp')" alt="icon" class="w-[1.6667vw]" loading="lazy"/>
                  <div class="item">
                    <div class="title">Application:  </div>
                    <div class="text">Beer production cooling & refrigeration</div>
                  </div>
                </div>
              </div>
              <div class="grid2">
                <div class="grid2-item">
                  <div class="title">
                    Highlights:
                  </div>
                  <div class="text">
                    Complete cooling system designed for brewery process, cleanroom, and central air conditioning<br>
                    Integrated solution including production cooling + HVAC for clean environment<br>
                    High-efficiency operation with reduced energy consumption and operating costs<br>
                    Supports stable temperature for brewing, bottling, and fermentation processes
                  </div>
                </div>
                <div class="grid2-item">
                  <div class="title">
                    Client Feedback:
                  </div>
                  <div class="text">
                    MINNUO’s turnkey cooling solution helps us maintain consistent beer quality while saving on energy
                    bills.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UCarousel>
    </div>

    <!-- 底部控制按钮 -->
    <div class="carousel-controls">
      <div class="control-buttons">
        <UButton :disabled="currentSlide === 0" variant="outline" @click="goToPrevious"
          class="control-btn rounded-[50%] border-1 flex justify-center items-center hover:bg-[#092991] hover:text-white disabled:bg-[#fff] disabled:text-[#092991]">
          <UIcon name="i-heroicons-chevron-left" class="size-[2.0833vw]" />
        </UButton>

        <div class="slide-counter">
          {{ currentSlide + 1 }} / {{ slides.length }}
        </div>

        <UButton :disabled="currentSlide === slides.length - 1" variant="outline" trailing @click="goToNext"
          class="control-btn rounded-[50%] border-1 flex justify-center items-center hover:bg-[#092991] hover:text-white disabled:bg-[#fff] disabled:text-[#092991]">
          <UIcon name="i-heroicons-chevron-right" class="size-[2.0833vw]" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 使用设备检测组合函数
const { isMob } = useDeviceDetection()

// 导入图片URL构建函数
const { buildImageUrl } = useImageUrl();
/**
 * TrustCarousel 组件 - 使用UCarousel的轮播图组件
 * 支持自定义每个slide内容，展示1234四个数字，支持点击切换
 */

/**
 * 轮播图组件引用
 */
const carouselRef = ref();

/**
 * 当前活跃的轮播项索引
 * @type {Ref<number>}
 */
const currentSlide = ref(0);

/**
 * 轮播图数据项
 * @type {Array<Object>} 包含number字段的轮播项数据
 */
const slides = ref([
  { number: 1 },
  { number: 2 },
  { number: 3 },
  { number: 4 },
  { number: 5 },
]);

/**
 * 处理轮播图选择事件
 * @param {number} selectedIndex - 选中的索引
 */
const onSlideSelect = (selectedIndex: number) => {
  try {
    currentSlide.value = selectedIndex;
  } catch (error) {
    console.error('Error handling slide selection:', error);
  }
};

/**
 * 切换到上一张轮播图
 */
const goToPrevious = () => {
  try {
    if (carouselRef.value?.emblaApi) {
      carouselRef.value.emblaApi.scrollPrev();
    }
  } catch (error) {
    console.error('Error navigating to previous slide:', error);
  }
};

/**
 * 切换到下一张轮播图
 */
const goToNext = () => {
  try {
    if (carouselRef.value?.emblaApi) {
      carouselRef.value.emblaApi.scrollNext();
    }
  } catch (error) {
    console.error('Error navigating to next slide:', error);
  }
};

/**
 * 直接跳转到指定轮播图
 * @param {number} index - 目标轮播图索引
 */
const goToSlide = (index: number) => {
  try {
    if (index >= 0 && index < slides.value.length && carouselRef.value?.emblaApi) {
      carouselRef.value.emblaApi.scrollTo(index);
    }
  } catch (error) {
    console.error('Error navigating to slide:', error);
  }
};

// 对外暴露方法（可选）
defineExpose({
  goToPrevious,
  goToNext,
  goToSlide,
  currentSlide,
  carouselRef
});
</script>

<style lang="scss" scoped>
.trust-carousel {
  width: 100%;
  background: #f9f9fb;
  padding: 0 4.1667vw;
  display: flex;
  flex-direction: column;
  align-items: center;

  >.title {
    font-weight: bold;
    font-size: 2.5vw;
    color: #000000;
    line-height: 3.75vw;
    text-align: center;
    margin-bottom: 2.5vw;
    width: 40.7813vw;
  }

  .carousel-container {
    width: 100%;
    margin-bottom: 1.5625vw;

    // UCarousel slide内容样式
    :deep(.slide-content) {
      width: 100%;
      height: 28.3854vw;
      background: #ffffff;
      border-radius: 0.625vw;
      display: flex;
      align-items: center;
      padding: 2.6042vw 2.9167vw 2.3958vw;      

      .slide-number {
        font-size: 5vw;
        font-weight: bold;
        color: #092991;
      }

      img {
        flex-shrink: 0;
      }

      .content {
        padding-left: 3.3333vw;

        .title {
          font-weight: bold;
          font-size: 1.875vw;
          color: #000000;
          margin-bottom: .8854vw;
        }

        .sub-title {
          font-weight: 400;
          font-size: .8333vw;
          color: rgba(0, 0, 0, 0.6);
          margin-bottom: 1.9271vw;
        }

        .grid3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: .8854vw;
          margin-bottom: 1.3542vw;
          width: 90%;

          .grid3-item {
            display: flex;
            align-items: flex-start;
            gap: .8333vw;

            .item {
              .title {
                font-weight: bold;
                font-size: .8333vw;
                color: #000000;
                margin-bottom: .8854vw;
              }

              .text {
                font-weight: 400;
                font-size: .625vw;
                color: rgba(0, 0, 0, 0.6);
                line-height: 1.25vw;
              }
            }
          }
        }

        .grid2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: .8854vw;

          .grid2-item {
            background: #F9F9FB;
            border-radius: .625vw .625vw .625vw .625vw;
            padding: 1.0417vw 1.1458vw;

            .title {
              font-weight: bold;
              font-size: .8333vw;
              color: #000000;
            }

            .text {
              font-weight: 400;
              font-size: .625vw;
              color: rgba(0, 0, 0, 0.6);
              line-height: 1.25vw
            }
          }
        }

      }

      &.slide-content-3 {
        .grid2 {
          grid-template-columns: 28.75vw 1fr;
        }
      }
      &.slide-content-5 {
        .grid2 {
          grid-template-columns: 32.4479vw 1fr;
        }
      }

    }


  }

  // 轮播控制按钮样式
  .carousel-controls {
    display: flex;
    justify-content: center;
    padding: 1.25vw 0;

    .control-buttons {
      display: flex;
      align-items: center;
      gap: 1.25vw;

      .slide-counter {
        font-weight: 400;
        font-size: 1.4583vw;
        color: #000000;
        padding: 0 1.25vw;
      }

      :deep(.control-btn) {
        width: 4.6875vw;
        height: 4.6875vw;
      }
    }
  }  
}
// 移动端---------------------------------------------------------------------
// 响应式设计
@media (max-width: 768px) {
  .trust-carousel{
    >.title{
      display: none;
    }

    .carousel-container{
      .slide-content{
        height: auto;
        flex-direction: column;

        >img{
          width: 79.7333vw;
          height: 59.8667vw;
        }

        .content{
          .title{
            font-size: 4.8vw;
          }

          .sub-title{
            font-size: 2.4vw;
          }

          .grid3{
            width: 100%;
            grid-template-columns: repeat(2, 1fr);
            gap: 5.3333vw;

            .grid3-item{
              >img{
                width: 4.2667vw;
              }

              .item{
                .title{
                  font-size: 2.6667vw;
                }
                .text{
                  font-size: 2.4vw;
                  line-height: 3.2vw;
                }
              }
            }
          }


          .grid2{
            grid-template-columns: repeat(1, 1fr);
            gap: 2.2667vw;
            .grid2-item{
              padding: 4.5333vw 4vw;
              background: rgba(16,75,212,0.04);

              .title{
                font-size: 2.6667vw;    
                margin-bottom: 3.3333vw;            
              }

              .text{
                font-size: 2.4vw;
                line-height: 3.2vw;
              }
            }
          }
        }
      }
    }

    .carousel-controls{
      display: none;
    }
  }
}
</style>

<template>
  <div class="empowering-manufacturers" :class="{ 'is-mobile': isMobile }">
    <div class="title">Empowering Manufacturers Through<br>Smarter, Safer Choices.</div>
    <div class="sub-title">
      At UESD ULTRA, we help factories around the world start production with confidence — through <br>
      certified used machine tools, transparent inspection, and reliable service.<br>
      Join us to access verified equipment, real expertise, and a smarter way to invest in manufacturing.
    </div>
    <div class="imgs">
      <div class="left">
        <NuxtImg densities="1" :src="buildImageUrl('image/img5.webp')" alt="img" loading="lazy" />
      </div>
      <div class="right">
        <NuxtImg densities="1" :src="buildImageUrl('image/img6.webp')" alt="img" loading="lazy" />
        <div class="right-bottom" @click="handleTalkToOurExperts">
          Talk to Our Experts
          <div class="right-bottom-icon">
            <NuxtImg densities="1" :src="buildImageUrl('image/img7.webp')" alt="img" loading="lazy" />
          </div>
        </div>
      </div>
    </div> 
  </div>
</template>

<script setup lang="ts">
// 组件逻辑（如需要的话可以在这里添加）
// 使用图片URL管理composable
const { buildImageUrl } = useImageUrl();

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

// 定义emit
const emit = defineEmits<{
  talkToExperts: []
}>()

// 处理点击事件
const handleTalkToOurExperts = () => {
  emit('talkToExperts')
}
</script>

<style scoped lang="scss">
.empowering-manufacturers {
  padding: 4.5833vw 12.5521vw 4.2708vw;
  background: #F9F9F9;

  .title {
    text-align: center;
    font-weight: bold;
    font-size: clamp(20px, 2.5vw, 48px);
    color: #000000;
    margin-bottom: 1.3542vw;
  }

  .sub-title {
    text-align: center;
    font-weight: 400;
    font-size: clamp(16px, 1.0417vw, 20px);
    color: #8D8D8D;
    margin-bottom: 3.5417vw;
  }

  .imgs {
    display: flex;
    align-items: stretch;
    gap: 1.25vw;

    .left {
      flex: 1;
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.25vw;
      height: 100%;

      .right-bottom {
        font-weight: bold;
        font-size: clamp(28px, 2.5vw, 48px);
        color: #000000;
        padding: 4.5313vw 2.7604vw;
        background: #FFFFFF;
        border-radius: 1.25vw;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        cursor: pointer;

        @include hover-lift-effect;
      }
    }

  }

  /* ------------------------------------Mobile样式----------------------------*/
  &.is-mobile {
    padding: 4.5833vw 0 14.2188vw;

    .title {
      padding: 0 8.5333vw 4.9333vw;
      font-size: clamp(12px, 4.2667vw, 32px);
    }

    .sub-title {
      padding: 0 8.5333vw 11.7333vw;
      font-size: clamp(10px, 2.6667vw, 20px);
    }

    .imgs {
      flex-direction: column;
      gap: 0;
    }
  }
}

</style>

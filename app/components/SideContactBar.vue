<template>
  <div class="side-contact-bar">
    <!-- Email Contact -->
    <div class="contact-item email-item" @mouseenter="showEmailDetails = true" @mouseleave="showEmailDetails = false">
      <UButton variant="solid" color="primary" size="lg" @click="handleEmailClick" class="contact-btn">
        <template #leading>
          <NuxtImg densities="1" :src="buildImageUrl('/image/needful/email1.png')" alt="email icon"
            class="contact-icon" />
        </template>
        Email
      </UButton>
      
      <!-- Email Details Popup -->
      <div v-show="showEmailDetails" class="email-details">
        <div class="detail-item">
          <div class="detail-info">
            <UIcon name="i-heroicons:envelope-16-solid" class="detail-icon" />
            <span>engineer@minnuo.com</span>
          </div>
          <div class="detail-description">
            Send us an email
          </div>
        </div>
      </div>
    </div>

    <!-- WhatsApp Contact -->
    <div class="contact-item whatsapp-item" @mouseenter="showWhatsAppDetails = true"
      @mouseleave="showWhatsAppDetails = false">
      <UButton variant="solid" color="primary" size="lg" @click="handleWhatsAppClick" class="contact-btn">
        <template #leading>
          <NuxtImg densities="1" :src="buildImageUrl('/image/needful/kefu2.png')" alt="WhatsApp icon"
            class="contact-icon" />
        </template>
        WhatsApp
      </UButton>

      <!-- WhatsApp Details Popup -->
      <div v-show="showWhatsAppDetails" class="whatsapp-details">
        <div class="detail-item">
          <a href="#" @click="handleWhatsAppClick" class="detail-link">
            <UIcon name="i-heroicons:phone-arrow-up-right-16-solid" />
            <span>sales1: +86 15366749631</span>
          </a>
          <NuxtImg densities="1" src="https://mncnc-com.oss-us-east-1.aliyuncs.com/image85/static/img/whatsappusa.webp"
            alt="WhatsApp QR Code" class="qr-code" />
        </div>
      </div>
    </div>

    <!-- Back to Top -->
    <div class="contact-item backtop-item">
      <UButton variant="solid" color="primary" size="lg" @click="scrollToTop" class="contact-btn">
        <template #leading>
          <NuxtImg densities="1" :src="buildImageUrl('/image/needful/backtop1.png')"
            alt="back to top icon" class="contact-icon" />
        </template>
        Backtop
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 导入图片URL构建函数
const { buildImageUrl } = useImageUrl();

// Email详情显示状态
const showEmailDetails = ref(false);

// WhatsApp详情显示状态
const showWhatsAppDetails = ref(false);

// Email点击处理
const handleEmailClick = () => {
  window.location.href = 'mailto:engineer@minnuo.com'
}

// WhatsApp点击处理
const handleWhatsAppClick = () => {
  const message = 'Hello I am interested in your diaphragm compressors.'
  const encodedMessage = encodeURIComponent(message)
  navigateTo(`https://wa.me/8615366749631?text=${encodedMessage}`, {
    external: true,
    open: {
      target: '_blank'
    }
  })
}

// 回到顶部功能
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动事件，控制回到顶部按钮显示
const isVisible = ref(false)

onMounted(() => {
  const handleScroll = () => {
    isVisible.value = window.scrollY > 300
  }

  window.addEventListener('scroll', handleScroll)

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style lang="scss" scoped>
.side-contact-bar {
  position: fixed;
  right: .2604vw;
  top: 60%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5208vw;
}

.contact-item {
  width: 100%;
  position: relative;
}

:deep(.contact-btn) {
  padding: 0.625vw 0.4167vw;
  width: 6.25vw;
  height: 3.125vw;
  font-size: 0.7292vw;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2083vw;
  box-shadow: 0 0.2083vw 0.625vw rgba(9, 41, 145, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-0.2083vw);
    box-shadow: 0 0.4167vw 1.25vw rgba(9, 41, 145, 0.4);
  }

  .contact-icon {
    width: 1.25vw;
    height: 1.25vw;
    object-fit: contain;
  }
}

.email-item {
  &:hover .email-details {
    opacity: 1;
    visibility: visible;
  }
}

.whatsapp-item {
  &:hover .whatsapp-details {
    opacity: 1;
    visibility: visible;
  }
}

.email-details {
  position: absolute;
  right: 100%;
  top: 0;
  background: #fff;
  border-radius: 0.4167vw;
  box-shadow: 0 0.2083vw 1.25vw rgba(0, 0, 0, 0.15);
  padding: 0.8333vw;
  min-width: 12.5vw;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  border-left: 0.2083vw solid #092991;
}

.whatsapp-details {
  position: absolute;
  right: 100%;
  top: 0;
  background: #fff;
  border-radius: 0.4167vw;
  box-shadow: 0 0.2083vw 1.25vw rgba(0, 0, 0, 0.15);
  padding: 0.8333vw;
  min-width: 12.5vw;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  border-left: 0.2083vw solid #092991;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.625vw;
}

.detail-info {
  display: flex;
  align-items: center;
  gap: 0.4167vw;
  color: #000;
  font-size: 0.7292vw;
  margin-bottom: 0.4167vw;
  
  .detail-icon {
    width: 0.8333vw;
    height: 0.8333vw;
    color: #092991;
  }
}

.detail-description {
  color: rgba(0, 0, 0, 0.6);
  font-size: .625vw;
  line-height: 0.7292vw;
}

.detail-link {
  display: flex;
  align-items: center;
  gap: 0.4167vw;
  color: #000;
  text-decoration: none;
  font-size: 0.625vw;
  cursor: pointer;
  
  &:hover {
    color: #092991;
  }
  
  .detail-icon {
    width: 0.8333vw;
    height: 0.8333vw;
  }
}

.qr-code {
  width: 10.4167vw;
  object-fit: contain;
}

// 移动端---------------------------------------------------------------------
// 响应式设计
@media (max-width: 768px) {
  .side-contact-bar {
    right: 2vw;
    gap: 1vw;
    top: 80%;
  }

  .email-item, .whatsapp-item{
    display: none;
  }

  :deep(.contact-btn) {
    width: 12vw;
    height: 12vw;
    font-size: 2.6667vw;
    .contact-icon {
      width: 2.5vw;
      height: 2.5vw;
    }
  }

  .whatsapp-details {
    min-width: 25vw;
    padding: 2vw;
  }

  .detail-link {
    font-size: 1.2vw;

    .detail-icon {
      width: 1.5vw;
      height: 1.5vw;
    }
  }

  .qr-code {
    width: 20vw;
    height: 20vw;
  }
}




</style>

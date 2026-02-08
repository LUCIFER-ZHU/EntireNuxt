<template>
  <div class="default-layout">
    <!-- <AppHeader /> -->
    <main class="main-content">
      <slot />
    </main>
    <!-- <AppFooter /> -->
    <!-- 侧边栏联系组件 -->
    <!-- <SideContactBar /> -->
    <!-- 客服聊天组件 -->
    <CustomerServiceChat />
  </div>
</template>

<script setup lang="ts">
// 客服聊天组件
import CustomerServiceChat from '../components/CustomerServiceChat.vue'
/**
 * 默认布局组件
 * 包含页面头部、主要内容和底部
 */
</script>

<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style> 
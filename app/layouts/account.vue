<template>
  <div class="default-layout">
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
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
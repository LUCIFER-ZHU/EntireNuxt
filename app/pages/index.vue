<template>
  <div class="index-page">
    <!-- 添加 key 确保组件正确切换 -->
    <PagesIndexNoAuth v-if="!authStore.isLoggedIn" key="no-auth" />
    <PagesIndexAuth v-else key="auth" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
// 不要依赖 Nuxt 的自动扫描，直接导入可以确保 CSS 被合并到主包或提前加载
import PagesIndexAuth from '~/components/pages/IndexAuth.vue'
import PagesIndexNoAuth from '~/components/pages/IndexNoAuth.vue'
/**
 * 首页组件
 * 根据用户登录状态显示不同的首页内容
 */

const { $toast } = useNuxtApp()
const authStore = useAuthStore()

// 获取运行时配置
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl

// 构建图片 URL
const { buildImageUrl } = useImageUrl()

// SEO 元数据
useHead({
  title: 'Precision Renewed. Value Redefined - The Leading Global Marketplace for Pre-Owned CNC Machines',
  meta: [
    {
      name: 'description',
      content: 'Discover quality used CNC machines, machine tools, and industrial equipment. The leading global marketplace for pre-owned CNC machines including boring machines, CNC lathes, milling machines, and grinding machines. Authentic machines with complete documentation and professional refurbishment.'
    },
    {
      name: 'keywords',
      content: 'CNC machines, used machine tools, pre-owned CNC machines, boring machine, CNC lathe, milling machine, grinding machine, industrial equipment, secondhand machinery, machine tool marketplace'
    },
    {
      name: 'author',
      content: 'MINNUO Group'
    },
  ],
})

</script>

<style lang="scss" scoped>
// 全局样式可以在这里定义
</style>

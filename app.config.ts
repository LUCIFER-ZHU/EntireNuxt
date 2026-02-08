import { defineAppConfig } from "nuxt/app";

/**
 * Nuxt UI 全局配置文件
 * 定义UI组件库的默认设置和主题
 */
export default defineAppConfig({
  ui: {
    // 主题颜色配置
    colors: {
      primary: 'blue',
      secondary: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      success: 'green',
      neutral: 'gray'
    },
    // 按钮组件配置
    button: {
      // 确保按钮使用正确的标签渲染
      default: {
        // 当没有to属性时，渲染为button标签
        color: 'primary',
        variant: 'solid',
        size: 'md',
      }
    },
    // 容器组件配置
    container: {
      // 容器基本样式
      base: 'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8'
    }
  }
})
## 项目规则
- UI组件库：@nuxt/ui ^4.1.0，默认使用
- 图片：@nuxt/image 1.11.0，img统一用 NuxtImg
- 布局：集成 @nuxtjs/device；大块显示/隐藏用 CSS/Tailwind 媒体查询；isMobile 仅用于交互逻辑与 ClientOnly 初始化；窗口缩放无需刷新也应正确响应
- 路由：禁止 router.push，统一使用 navigateTo
- 响应式：字体用 clamp(min, vw, max)；移动端 padding/margin/gap/border-radius 用 vw
- SCSS：使用 @include 后的额外样式必须用 &{} 包裹
- 移动端布局：useDeviceDetection 获取 isMobile，模板加 :class="{ 'is-mobile': isMobile }"；局部使用 v-if，仅在结构完全不同时；优先用 CSS（grid、flex）复用内容
- 样式组织：PC 样式在前，Mobile 样式在后；以“/* ------------------------------------Mobile样式----------------------------*/”分割；Mobile 使用 .is-mobile 或 .mobile-xxx 类

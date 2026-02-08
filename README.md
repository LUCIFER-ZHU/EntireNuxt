# Nuxt4 Webpage

基于 **Nuxt 4** + **Vue 3** 构建的现代化工业设备二手交易平台前端项目。本项目集成了完整的 UI 体系、响应式适配方案、用户认证流程以及高性能的图片与网络请求处理机制。

## 📚 目录

- [项目简介](#-项目简介)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [环境配置](#-环境配置)
- [目录结构](#-目录结构)
- [开发规范](#-开发规范)
- [核心功能](#-核心功能)

## 📖 项目简介

这是一个专注于二手工业设备（如冷水机等）展示与交易的 Web 应用。项目采用服务端渲染 (SSR) 与客户端交互相结合的架构，确保了良好的 SEO 表现和用户体验。

**主要特性：**
- **深度响应式设计**：一套代码适配 PC 与 Mobile 端，精准的布局控制。
- **完善的认证体系**：包含登录、注册、密码重置及个人中心。
- **高性能**：集成图片优化、懒加载及服务端渲染优化。
- **工程化规范**：统一的代码风格、Lint 规则及 Git 提交规范。

## 🛠️ 技术栈

- **核心框架**: [Nuxt 4](https://nuxt.com) (Beta/Nightly) + Vue 3 (Composition API)
- **UI 组件库**: [@nuxt/ui](https://ui.nuxt.com) (v4.1.0+)
- **状态管理**: [Pinia](https://pinia.vuejs.org) + `pinia-plugin-persistedstate` (持久化)
- **CSS 工具**: SCSS, PostCSS, Tailwind CSS (via Nuxt UI)
- **设备检测**: `@nuxtjs/device`
- **图片优化**: `@nuxt/image`
- **安全验证**: Cloudflare Turnstile (`@nuxtjs/turnstile`)
- **网络请求**: 自定义 `$fetch` 拦截器封装
- **通知提示**: `vue-toastification`
- **WebSocket**: `@stomp/stompjs` + `sockjs-client`

## 🚀 快速开始

### 前置要求
- **Node.js**: ≥ 18.0.0
- **包管理器**: 推荐使用 [pnpm](https://pnpm.io/)

### 安装依赖

```bash
pnpm install
```

### 开发命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 (使用 `.env.development`) |
| `pnpm dev2` | 启动开发服务器 (使用 `.env.development2`，通常用于备用环境) |
| `pnpm build` | 生产环境构建 (执行 `scripts/build.js`) |
| `pnpm lint` | 运行 ESLint 检查代码 |
| `pnpm lint:fix` | 自动修复 ESLint 问题 |
| `pnpm preview` | 预览生产构建产物 |

启动开发服务后，访问：`http://localhost:3000`

## ⚙️ 环境配置

项目使用 `.env` 文件进行环境变量管理。请确保根目录下存在相应的配置文件。

### 核心环境变量说明

| 变量名 | 说明 | 示例 |
| --- | --- | --- |
| `NUXT_PUBLIC_API_BASE` | 后端 API 接口基地址 | `https://api.example.com` |
| `NUXT_PUBLIC_IMAGE_BASE` | 前端展示用的图片 CDN 基地址 | `https://cdn.example.com` |
| `NUXT_BACKEND_IMAGE_BASE`| 后端存储用的图片基地址 | `http://backend-storage` |
| `NUXT_PUBLIC_WS_URL` | WebSocket 连接地址 | `wss://api.example.com/ws` |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile 站点 Key | `0x4AAAA...` |
| `ENABLE_SOURCEMAP` | 是否开启 SourceMap | `true` / `false` |

## 📂 目录结构

项目采用 Nuxt 4 推荐的目录结构，主要源码位于 `app/` 目录下。

```text
root/
├── .trae/rules/       # 项目开发规则与规范文档
├── app/               # 应用源码主目录
│   ├── api/           # API 接口定义模块
│   ├── assets/        # 静态资源 (SCSS, Images, Fonts)
│   ├── components/    # Vue 组件
│   │   ├── editor/    # 编辑器相关组件
│   │   ├── reNew/     # 核心业务组件
│   │   └── ...
│   ├── composables/   # 组合式函数 (Hooks)
│   ├── layouts/       # 页面布局 (Default, Account)
│   ├── middleware/    # 路由中间件 (Auth)
│   ├── pages/         # 页面路由
│   ├── plugins/       # Nuxt 插件 (Fetch拦截器, Toast等)
│   ├── stores/        # Pinia 状态仓库
│   ├── app.vue        # 应用根组件
│   └── error.vue      # 错误处理页面
├── docs/              # 项目详细文档
├── public/            # 公共静态文件 (favicon 等)
├── server/            # 服务端 API/中间件
├── scripts/           # 构建脚本
├── nuxt.config.ts     # Nuxt 配置文件
└── package.json       # 项目依赖配置
```

## 📏 开发规范

为了保证代码质量和维护性，请严格遵守以下开发规范。

### 1. 核心原则
- **Composition API**: 统一使用 `<script setup lang="ts">`。
- **TypeScript**: 定义清晰的接口 (Interface)，尽量避免 `any` (虽然 Lint 规则较宽松，但建议保持严谨)。
- **注释**: 导出的函数和复杂逻辑必须包含 JSDoc 注释。

### 2. 路由与导航
- **禁止使用** `router.push`。
- **必须使用** `navigateTo()` 进行页面跳转。
  ```ts
  // ✅ Correct
  await navigateTo('/product/123');
  
  // ❌ Incorrect
  router.push('/product/123');
  ```

### 3. 响应式与布局适配
- **字体大小**: 使用 `clamp()` 函数实现平滑缩放。
  ```scss
  font-size: clamp(14px, 2vw, 18px);
  ```
- **移动端单位**: 移动端的 `padding`, `margin`, `gap`, `border-radius` 统一使用 `vw` 单位。
- **设备检测**: 在 `script` 中使用 `useDeviceDetection`。
  ```ts
  const { isMobile } = useDeviceDetection();
  ```
- **模板适配**:
  - 在根元素或关键容器添加 `:class="{ 'is-mobile': isMobile }"`。
  - **优先使用 CSS** (Flex/Grid) 处理布局差异。
  - 仅在结构完全不同时使用 `v-if`。

### 4. 样式组织 (SCSS)
- **顺序**: PC 样式在前，Mobile 样式在后。
- **分隔符**: 必须使用标准注释分隔。
  ```scss
  .my-component {
    // PC Styles
    width: 100%;
  
    /* ------------------------------------Mobile样式----------------------------*/
    &.is-mobile {
      width: 100vw;
    }
  }
  ```
- **嵌套规则**: `@include` 后的额外样式必须用 `&{}` 包裹。

### 5. 网络请求与错误处理
- **API 调用**: 必须使用封装好的 `$customFetch` 或 `$customUseFetch`。
- **错误捕获**: 使用 `try/catch` 包裹异步请求。
- **用户提示**: 发生错误时，使用 `$toast` 显示友好的错误信息。

## 🧩 核心功能

### 认证模块
- 支持 JWT 认证流程。
- 包含 `auth` 中间件进行路由保护。
- `stores/auth.ts` 管理用户登录状态。

### 表单系统
- 封装 `useContactForm` 组合函数，处理表单验证、提交逻辑。
- 支持配置化的表单生成。

### 视觉交互
- **AOS 动画**: 页面滚动元素渐入效果。
- **数字滚动**: 集成 `vue-countup-v3`。
- **图片懒加载**: 利用 `@nuxt/image` 实现。

---

> 文档最后更新时间: 2026-01-19

# Cookie 同意插件使用指南

## 概述

本项目使用 `vanilla-cookieconsent` 库实现 Cookie 同意提示功能，符合 GDPR 等隐私法规要求。插件会在页面右下角显示 Cookie 同意弹窗。

## 文件说明

- **插件文件**: `app/plugins/cookieconsent.client.ts`
- **按钮组件**: `app/components/CookieSettingsButton.vue`
- **依赖库**: `vanilla-cookieconsent@3.1.0`

## 功能特性

### 1. Cookie 分类

插件提供了三种 Cookie 类型：

- **必要 Cookie (necessary)**: 默认启用，用户无法禁用，用于网站基本功能
- **分析 Cookie (analytics)**: 用户可选，用于统计和分析网站使用情况
- **营销 Cookie (marketing)**: 用户可选，用于广告投放和营销活动

### 2. UI 配置

- **位置**: 右下角（`bottom right`）
- **样式**: 盒子布局（`box inline`）
- **语言**: 中文
- **主题**: 可在插件中自定义颜色和样式

### 3. 自动功能

- Cookie 过期时间：365 天
- 自动清理 Google Analytics Cookie（当用户拒绝分析 Cookie 时）
- 响应式设计，适配移动端和桌面端

## 使用方法

### 基础使用

插件会自动在页面加载时初始化，无需额外配置。首次访问网站的用户会看到 Cookie 同意弹窗。

### 在页面中添加 Cookie 设置按钮

如果需要让用户在稍后重新打开 Cookie 偏好设置，可以使用以下方法：

#### 方法 1: 使用自定义组件（推荐）

```vue
<template>
    <div>
        <!-- 显示图标和文字 -->
        <CookieSettingsButton :show-text="true" />
        
        <!-- 仅显示图标 -->
        <CookieSettingsButton />
    </div>
</template>
```

#### 方法 2: 使用 data-cc 属性

在任何按钮或链接上添加 `data-cc="show-preferencesModal"` 属性：

```vue
<template>
    <button type="button" data-cc="show-preferencesModal">
        管理 Cookie 偏好
    </button>
    
    <!-- 或者使用链接 -->
    <a href="#" data-cc="show-preferencesModal">
        Cookie 设置
    </a>
</template>
```

### 在代码中使用 CookieConsent API

插件会将 `CookieConsent` 实例注入到应用中，可以通过以下方式访问：

```vue
<script setup lang="ts">
const { $cookieConsent } = useNuxtApp();

// 显示偏好设置模态框
const showPreferences = () => {
    $cookieConsent.showPreferences();
};

// 获取当前同意状态
const checkConsent = () => {
    const consent = $cookieConsent.getUserPreferences();
    console.log('用户同意状态:', consent);
    
    // 检查特定类别是否被接受
    if (consent.acceptedCategories.includes('analytics')) {
        // 加载分析脚本
        console.log('用户已同意分析 Cookie');
    }
};

// 接受所有 Cookie
const acceptAll = () => {
    $cookieConsent.acceptCategory('all');
};

// 拒绝所有非必要 Cookie
const rejectAll = () => {
    $cookieConsent.acceptCategory('necessary');
};
</script>
```

### 根据同意状态加载脚本

```vue
<script setup lang="ts">
const { $cookieConsent } = useNuxtApp();

onMounted(() => {
    // 获取用户同意
    const consent = $cookieConsent.getUserPreferences();
    
    // 如果用户同意了分析 Cookie，加载 Google Analytics
    if (consent.acceptedCategories.includes('analytics')) {
        loadGoogleAnalytics();
    }
    
    // 如果用户同意了营销 Cookie，加载广告脚本
    if (consent.acceptedCategories.includes('marketing')) {
        loadMarketingScripts();
    }
});

const loadGoogleAnalytics = () => {
    // 加载 GA 脚本
    console.log('加载 Google Analytics');
};

const loadMarketingScripts = () => {
    // 加载营销脚本
    console.log('加载营销脚本');
};
</script>
```

## 自定义配置

### 修改 Cookie 类别

编辑 `app/plugins/cookieconsent.client.ts` 中的 `categories` 配置：

```typescript
categories: {
    necessary: {
        enabled: true,
        readOnly: true,
    },
    analytics: {
        autoClear: {
            cookies: [
                { name: /^_ga/ },
                { name: '_gid' },
            ],
        },
    },
    marketing: {},
    // 添加自定义类别
    preferences: {
        autoClear: {
            cookies: [
                { name: 'user_theme' },
                { name: 'user_language' },
            ],
        },
    },
},
```

### 修改文案

在 `language.translations.zh` 中修改中文文案：

```typescript
language: {
    default: 'zh',
    translations: {
        zh: {
            consentModal: {
                title: "自定义标题",
                description: "自定义描述文字...",
                acceptAllBtn: "同意",
                acceptNecessaryBtn: "拒绝",
                showPreferencesBtn: "设置",
            },
            // ...
        },
    },
},
```

### 修改位置和样式

在 `guiOptions` 中调整 UI 配置：

```typescript
guiOptions: {
    consentModal: {
        layout: 'box inline',
        position: 'bottom right', // 可选: 'top left', 'top center', 'top right', 'middle left', 'middle center', 'middle right', 'bottom left', 'bottom center', 'bottom right'
        equalWeightButtons: true,
        flipButtons: false,
    },
},
```

### 添加回调函数

```typescript
// 首次同意时触发
onFirstConsent: ({ cookie }) => {
    console.log('用户首次同意 Cookie:', cookie);
    // 发送到分析服务
},

// 每次同意时触发
onConsent: ({ cookie }) => {
    console.log('用户同意 Cookie:', cookie);
},

// 设置更改时触发
onChange: ({ changedCategories, changedServices }) => {
    console.log('Cookie 设置已更改:', changedCategories);
    // 重新加载或卸载相关脚本
},
```

## 常见应用场景

### 在页脚添加 Cookie 设置链接

```vue
<!-- app/components/AppFooter.vue -->
<template>
    <footer>
        <nav>
            <a href="/privacy-policy">隐私政策</a>
            <a href="#" data-cc="show-preferencesModal">Cookie 设置</a>
        </nav>
    </footer>
</template>
```

### 在侧边栏添加 Cookie 按钮

```vue
<!-- app/components/SideContactBar.vue -->
<template>
    <div class="side-bar">
        <!-- 其他按钮 -->
        <CookieSettingsButton />
    </div>
</template>
```

### 在用户账户设置页面

```vue
<!-- app/pages/account/settings.vue -->
<template>
    <div class="settings-page">
        <section>
            <h3>隐私设置</h3>
            <button type="button" data-cc="show-preferencesModal" class="btn">
                管理 Cookie 偏好
            </button>
        </section>
    </div>
</template>
```

## 测试

### 使用测试页面（推荐）

**开发环境**访问 `/dev/test-cookie` 测试页面，可以：
- 测试所有 Cookie Consent API
- 查看当前同意状态
- 快速接受/拒绝/重置 Cookie
- 查看集成示例代码

**注意**：测试页面仅在开发环境可用，生产环境自动排除

### 测试同意弹窗

1. 清除浏览器 Cookie
2. 刷新页面
3. 应该看到右下角出现 Cookie 同意弹窗

### 测试偏好设置

1. 点击"管理偏好设置"按钮
2. 应该看到偏好设置模态框
3. 切换不同的 Cookie 类别
4. 保存设置

### 测试 Cookie 持久化

1. 同意或拒绝 Cookie
2. 刷新页面
3. 不应该再次看到同意弹窗（说明设置已保存）

## 注意事项

1. **GDPR 合规**: 确保在用户同意之前不加载任何非必要的跟踪脚本
2. **Cookie 清理**: 当用户拒绝某个类别时，相关的 Cookie 会自动清除
3. **样式自定义**: 可以通过 CSS 变量或覆盖样式来自定义外观
4. **多语言**: 如需支持英文，可在 `translations` 中添加 `en` 配置

## 相关资源

- [vanilla-cookieconsent 官方文档](https://cookieconsent.orestbida.com/)
- [配置参考](https://cookieconsent.orestbida.com/reference/configuration-reference.html)
- [API 参考](https://cookieconsent.orestbida.com/reference/api-reference.html)

## 故障排查

### 弹窗不显示

- 检查浏览器控制台是否有错误
- 确认 Cookie 未被保存（清除 `minnuo_cookie_consent` cookie）
- 检查插件是否正确加载

### 样式问题

- 确认 CSS 文件已正确导入
- 检查是否有其他样式冲突
- 尝试调整 z-index

### Cookie 未被清除

- 检查 `autoClear` 配置是否正确
- 确认 Cookie 名称匹配（支持正则表达式）


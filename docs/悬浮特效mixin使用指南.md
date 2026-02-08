# 悬浮特效Mixin使用指南

## 概述
为了方便在多个组件中复用悬浮特效，我们创建了三个可配置的SCSS mixin，让您能够轻松地为任何元素添加现代化的悬浮动画效果。

## 可用的Mixin

### 1. `hover-lift-effect` - 基础悬浮效果
最简单的悬浮效果，包含向上移动、缩放和阴影。

**参数：**
- `$lift-distance`: 向上移动距离（默认：-0.5vw）
- `$scale`: 缩放比例（默认：1.02）
- `$shadow-color`: 阴影颜色（默认：rgba(0, 0, 0, 0.15)）

**使用示例：**
```scss
.my-card {
  @include hover-lift-effect();
  
  // 自定义参数
  &.large {
    @include hover-lift-effect(-1vw, 1.05, rgba(0, 0, 0, 0.2));
  }
}
```

### 2. `hover-glow-effect` - 发光边框悬浮效果
带有发光边框的高级悬浮效果，适合产品卡片等需要突出显示的元素。

**参数：**
- `$lift-distance`: 向上移动距离（默认：-0.5vw）
- `$scale`: 缩放比例（默认：1.02）
- `$glow-color`: 主发光颜色（默认：#092991）
- `$secondary-color`: 次要发光颜色（默认：#3B82F6）

**使用示例：**
```scss
.product-card {
  @include hover-glow-effect();
  
  // 自定义颜色
  &.premium {
    @include hover-glow-effect(-0.8vw, 1.03, #FF6B35, #F7931E);
  }
}
```

### 3. `button-hover-effect` - 按钮悬浮效果
专门为按钮设计的悬浮效果，包含点击波纹动画。

**参数：**
- `$hover-lift`: 悬浮时向上移动距离（默认：-2px）
- `$hover-scale`: 悬浮时缩放比例（默认：1.05）
- `$active-scale`: 点击时缩放比例（默认：0.98）

**使用示例：**
```scss
.my-button {
  @include button-hover-effect();
  
  // 自定义按钮效果
  &.large-button {
    @include button-hover-effect(-3px, 1.08, 0.95);
  }
}
```

### 4. `title-hover-effect` - 文字标题悬浮动画
简洁优雅的文字标题悬浮效果，只包含轻微放大动画，无下划线干扰。

**特点：**
- 完美兼容 `text-align: center` 的居中对齐
- 简洁的悬浮放大效果，不会影响布局
- 无下划线，避免视觉干扰
- 性能优秀，只使用transform属性

**参数：**
- `$scale`: 悬浮时缩放比例（默认：1.02）
- `$duration`: 动画持续时间（默认：0.3s）

**使用示例：**
```scss
.page-title {
  @include title-hover-effect();
  
  // 自定义标题效果
  &.main-title {
    @include title-hover-effect(1.03, 0.4s);
  }
  
  // 简洁版本
  &.simple-title {
    @include title-hover-effect(1.01, 0.2s);
  }
}
```

## 实际应用示例

### 在Vue组件中使用

```vue
<template>
  <div class="page-section">
    <h2 class="section-title">Estimated chiller system Cost</h2>
    <div class="feature-grid">
      <div class="feature-card" v-for="feature in features" :key="feature.id">
        <h3 class="card-title">{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center; // 居中对齐
  margin-bottom: 2rem;
  
  // 使用标题悬浮动画效果 - 简洁的放大效果
  @include title-hover-effect(1.03, 0.4s);
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  // 简洁的标题效果
  @include title-hover-effect(1.01, 0.2s);
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  
  // 使用发光边框悬浮效果
  @include hover-glow-effect(-8px, 1.03, #4F46E5, #7C3AED);
  
  // 悬浮时子元素动画
  &:hover {
    .card-title {
      color: #4F46E5;
    }
  }
}
</style>
```

### 在多个元素上应用不同效果

```scss
// 卡片容器
.card-container {
  @include hover-lift-effect(-4px, 1.02);
}

// 特殊卡片
.special-card {
  @include hover-glow-effect(-6px, 1.04, #10B981, #059669);
}

// 按钮
.action-button {
  @include button-hover-effect(-2px, 1.05, 0.98);
}
```

## 自定义和扩展

### 添加额外的悬浮效果
```scss
.custom-hover {
  @include hover-lift-effect();
  
  // 添加额外的自定义效果
  &:hover {
    .icon {
      transform: rotate(10deg);
    }
    
    .text {
      color: #FF6B35;
    }
  }
}
```

### 组合多个mixin
```scss
.super-card {
  @include hover-lift-effect(-8px, 1.05);
  
  // 添加发光效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(45deg, #FF6B35, #F7931E);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
}
```

## 性能优化建议

1. **使用transform和opacity**：这些属性不会触发重排，性能最佳
2. **避免过度动画**：保持动画时长在0.3-0.5秒之间
3. **合理使用will-change**：对于复杂动画，可以添加`will-change: transform`
4. **测试移动设备**：确保在移动设备上动画流畅

## 浏览器兼容性

- 现代浏览器：完全支持
- IE11+：基础支持（可能需要polyfill）
- 移动浏览器：完全支持

## 注意事项

1. 确保使用mixin的元素有足够的空间进行变换
2. 发光效果在深色背景上效果更佳
3. 波纹效果需要`overflow: hidden`才能正确显示
4. 自定义参数时注意单位一致性（px vs vw）

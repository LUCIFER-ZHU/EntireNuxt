<template>
  <header ref="headerRef" class="new-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="header-container">
      <!-- 移动端汉堡菜单按钮 -->
      <button v-if="isMobile" class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
        <UIcon name="i-heroicons-bars-3" class="hamburger-icon" />
      </button>

      <!-- Logo 区域 -->
      <div class="logo">
        <i class="icon mnfont mn-logo logo-text"></i>
      </div>

      <!-- 桌面端导航菜单 -->
      <nav v-if="!isMobile" class="nav-menu">
        <div v-for="item in navItems" :key="item.id" class="nav-item-wrapper" @mouseenter="handleNavItemEnter(item.id)"
          @mouseleave="handleNavItemLeave">
          <NuxtLink :to="item.link" class="nav-link" :class="{ 'is-active': isActive(item.link) }">
            {{ item.label }}
          </NuxtLink>

          <!-- Product 下拉面板 -->
          <Teleport to="body">
            <Transition name="dropdown-fade">
              <div v-show="item.id === 'product' && activeDropdown === 'product' && productTypes.length > 0"
                class="product-dropdown" :style="dropdownStyle" @mouseenter="handleDropdownEnter"
                @mouseleave="handleDropdownLeave">
                <div class="dropdown-content">
                  <!-- 左侧：第一层级分类 -->
                  <div class="category-sidebar">
                    <div v-for="category in productTypes" :key="category.id" class="category-sidebar-item"
                      :class="{ 'is-active': selectedCategory?.id === category.id }" :title="category.name"
                      @click="selectCategory(category)">
                      <NuxtImg v-if="category.image" :src="getCategoryImageUrl(category.image)" :alt="category.name"
                        class="category-icon" />
                      <ClientOnly>
                        <UIcon v-if="!category.image" name="i-heroicons-cube" class="category-icon-fallback" />
                      </ClientOnly>
                      <span class="category-name">{{ category.name }}</span>
                    </div>
                  </div>

                  <!-- 右侧：第二层级分类 -->
                  <div class="category-content">
                    <div v-if="selectedCategory && selectedCategory.children && selectedCategory.children.length > 0"
                      class="subcategories-grid">
                      <NuxtLink v-for="subcategory in selectedCategory.children" :key="subcategory.id"
                        :title="subcategory.name" :to="{
                          path: '/products',
                          query: { searchIds: [subcategory.id] }
                        }" class="subcategory-item" @click="handleSubcategoryClick">
                        <NuxtImg v-if="subcategory.image" :src="getCategoryImageUrl(subcategory.image)"
                          :alt="subcategory.name" class="subcategory-image" />
                        <div v-else class="subcategory-image-placeholder">
                          <ClientOnly>
                            <UIcon name="i-heroicons-cube" class="subcategory-icon-fallback" />
                          </ClientOnly>
                        </div>
                        <span class="subcategory-name">{{ subcategory.name }}</span>
                      </NuxtLink>
                    </div>
                    <div v-else class="empty-subcategories">
                      <span>No subcategories are available at present</span>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
        </div>
      </nav>

      <!-- 移动端导航菜单抽屉 -->
      <Transition name="mobile-menu-slide">
        <div v-if="isMobile && mobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
          <div class="mobile-menu-drawer" @click.stop>
            <div class="mobile-menu-header">
              <span class="mobile-menu-title">Menu</span>
              <button class="mobile-menu-close" @click="closeMobileMenu" aria-label="Close menu">
                <UIcon name="i-heroicons-x-mark" class="close-icon" />
              </button>
            </div>
            <nav class="mobile-nav-menu">
              <div v-for="item in navItems" :key="item.id" class="mobile-nav-item-wrapper">
                <NuxtLink v-if="item.id !== 'product'" :to="item.link" class="mobile-nav-link"
                  :class="{ 'is-active': isActive(item.link) }" @click="handleMobileNavClick($event, item)">
                  {{ item.label }}
                </NuxtLink>
                <button v-else class="mobile-nav-link mobile-nav-link-with-icon"
                  :class="{ 'is-active': isActive(item.link), 'is-expanded': mobileProductMenuOpen }"
                  @click="handleMobileNavClick($event, item)">
                  <span>{{ item.label }}</span>
                  <UIcon name="i-heroicons-chevron-down" class="mobile-nav-arrow"
                    :class="{ 'is-expanded': mobileProductMenuOpen }" />
                </button>

                <!-- Products 子菜单 - 下拉树 -->
                <Transition name="mobile-dropdown-fade">
                  <div v-show="item.id === 'product' && mobileProductMenuOpen && productTypes.length > 0"
                    class="mobile-product-dropdown" @click.stop>
                    <div class="mobile-category-tree">
                      <div v-for="category in productTypes" :key="category.id" class="mobile-category-tree-item">
                        <!-- 一级分类 -->
                        <div class="mobile-category-row"
                          :class="{ 'is-expanded': expandedCategories.includes(category.id as string | number) }"
                          @click="toggleCategory(category)">
                          <div class="mobile-category-content">
                            <NuxtImg v-if="category.image" :src="getCategoryImageUrl(category.image)"
                              :alt="category.name" class="mobile-category-image" />
                            <div v-else class="mobile-category-image-placeholder">
                              <ClientOnly>
                                <UIcon name="i-heroicons-cube" class="mobile-category-icon-fallback" />
                              </ClientOnly>
                            </div>
                            <span class="mobile-category-text">{{ category.name }}</span>
                          </div>
                          <UIcon v-if="category.children && category.children.length > 0"
                            name="i-heroicons-chevron-down" class="mobile-category-arrow"
                            :class="{ 'is-expanded': expandedCategories.includes(category.id as string | number) }" />
                        </div>

                        <!-- 子分类列表 -->
                        <Transition name="mobile-children-fade">
                          <div
                            v-if="expandedCategories.includes(category.id as string | number) && category.children && category.children.length > 0"
                            class="mobile-category-children">
                            <NuxtLink v-for="subcategory in category.children" :key="subcategory.id" :to="{
                              path: '/products',
                              query: { searchIds: [subcategory.id] }
                            }" class="mobile-subcategory-row" @click="handleMobileSubcategoryClick">
                              <NuxtImg v-if="subcategory.image" :src="getCategoryImageUrl(subcategory.image)"
                                :alt="subcategory.name" class="mobile-subcategory-image" />
                              <div v-else class="mobile-subcategory-image-placeholder">
                                <ClientOnly>
                                  <UIcon name="i-heroicons-cube" class="mobile-subcategory-icon-fallback" />
                                </ClientOnly>
                              </div>
                              <span class="mobile-subcategory-text">{{ subcategory.name }}</span>
                            </NuxtLink>
                          </div>
                        </Transition>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </nav>
          </div>
        </div>
      </Transition>

      <!-- 用户图标 -->
      <div class="user-icon">
        <div class="user-link">
          <i class="icon mnfont mn-Message"></i>
        </div>
        <div class="user-link">
          <i class="icon mnfont mn-list"></i>
        </div>
        <ClientOnly>
          <UPopover :mode="isMobile ? 'click' : 'hover'" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }">
            <div class="user-link" :class="{ 'logged-in': authStore.isLoggedIn }"
              @click="!isMobile && !authStore.isLoggedIn && handleLogin()">
              <i class="icon mnfont mn-people"></i>
              <span class="icon-text">{{ authStore.isLoggedIn ? 'Hi' : 'Sign in' }}</span>
            </div>

            <template #content>
              <div class="user-menu">
                <!-- 未登录状态 -->
                <div v-if="!authStore.isLoggedIn" class="menu-item" @click="handleLogin">
                  <UIcon name="i-heroicons-user-circle" class="menu-icon" />
                  <span>Sign in</span>
                </div>

                <!-- 已登录状态 -->
                <template v-else>
                  <div class="menu-item user-email">
                    <span>{{ authStore.user?.email || 'Email' }}</span>
                  </div>
                  <div class="menu-divider"></div>
                  <div class="menu-item" @click="handleProfile">
                    <UIcon name="i-heroicons-user" class="menu-icon" />
                    <span>Personal Center</span>
                  </div>
                  <div class="menu-item" @click="handleLogout">
                    <UIcon name="i-heroicons-arrow-right-on-rectangle" class="menu-icon" />
                    <span>Log out</span>
                  </div>
                </template>
              </div>
            </template>
          </UPopover>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { logout } from '~/api/auth'
import { getProductTypeTree, type ProductType } from '~/api/home'

/**
 * 重新设计的应用头部组件
 * 提供简洁的导航和用户入口
 */

const route = useRoute();
const authStore = useAuthStore();
const { $toast } = useNuxtApp();

// 获取图片URL管理
const { buildBackendImageUrl } = useImageUrl();

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

// 滚动状态
const isScrolled = ref(false)

// 监听滚动事件
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  isScrolled.value = scrollTop > 0
}

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 初始化检查
  handleScroll()
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (leaveTimer) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }
})

// 移动端菜单状态
const mobileMenuOpen = ref(false)
const mobileProductMenuOpen = ref(false)
const expandedCategories = ref<(string | number)[]>([]) // 展开的分类ID列表

// 下拉面板状态
const activeDropdown = ref<string | null>(null);
let leaveTimer: NodeJS.Timeout | null = null;

// Header 引用
const headerRef = ref<HTMLElement | null>(null);

// 计算下拉面板样式
const dropdownStyle = computed(() => {
  if (process.server || !headerRef.value) {
    return {
      top: '0px',
      left: '0px',
      width: '100vw'
    };
  }

  const headerRect = headerRef.value.getBoundingClientRect();
  return {
    top: `${headerRect.bottom - 0.2}px`,
    left: '0px',
    width: '100vw'
  };
});

// 获取产品类型树数据（SSR）
const { data: productTreeData } = await getProductTypeTree();
const productTypes = computed(() => {
  if (!productTreeData.value?.data) return [];
  return productTreeData.value.data;
});

// 选中的分类
const selectedCategory = ref<ProductType | null>(null);

/**
 * 导航菜单项
 */
const navItems = ref([
  {
    id: 'home',
    label: 'Home',
    link: '/'
  },
  {
    id: 'product',
    label: 'Product',
    link: '/products'
  }
]);

/**
 * 判断导航项是否激活
 */
const isActive = (link: string) => {
  if (link === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(link);
};

/**
 * 处理登录跳转
 */
const handleLogin = () => {
  navigateTo({
    path: '/account/login',
    query: {
      redirect: route.fullPath
    }
  });
};

/**
 * 切换移动端菜单
 */
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (!mobileMenuOpen.value) {
    mobileProductMenuOpen.value = false
    selectedCategory.value = null
  }
}

/**
 * 关闭移动端菜单
 */
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  mobileProductMenuOpen.value = false
  expandedCategories.value = []
  selectedCategory.value = null
}

/**
 * 处理移动端导航项点击
 */
const handleMobileNavClick = (event: Event, item: { id: string; link: string }) => {
  if (item.id === 'product') {
    // 阻止默认导航，切换产品菜单展开/收起
    event.preventDefault()
    event.stopPropagation()
    mobileProductMenuOpen.value = !mobileProductMenuOpen.value
    // 如果关闭菜单，清空展开的分类
    if (!mobileProductMenuOpen.value) {
      expandedCategories.value = []
    }
  } else {
    // 其他导航项直接关闭菜单
    closeMobileMenu()
  }
}

/**
 * 切换分类展开/收起
 */
const toggleCategory = (category: ProductType) => {
  const categoryId = category.id as string | number
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    // 收起
    expandedCategories.value.splice(index, 1)
  } else {
    // 展开
    expandedCategories.value.push(categoryId)
  }
}

/**
 * 处理移动端子分类点击
 */
const handleMobileSubcategoryClick = () => {
  closeMobileMenu()
}

/**
 * 处理导航项鼠标进入（桌面端）
 */
const handleNavItemEnter = (itemId: string) => {
  if (isMobile.value) return // 移动端不处理 hover

  if (leaveTimer) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }

  if (itemId === 'product') {
    activeDropdown.value = 'product';
    // 默认选中第一个分类
    if (productTypes.value.length > 0) {
      const firstCategory = productTypes.value[0];
      if (firstCategory) {
        if (!selectedCategory.value) {
          selectedCategory.value = firstCategory;
        } else {
          // 如果已有选中分类但不在列表中，重新选中第一个
          const exists = productTypes.value.some(cat => cat.id === selectedCategory.value?.id);
          if (!exists) {
            selectedCategory.value = firstCategory;
          }
        }
      }
    }
  }
};

/**
 * 处理导航项鼠标离开（桌面端）
 */
const handleNavItemLeave = () => {
  if (isMobile.value) return // 移动端不处理 hover

  leaveTimer = setTimeout(() => {
    activeDropdown.value = null;
  }, 150);
};

/**
 * 处理下拉面板鼠标进入
 */
const handleDropdownEnter = () => {
  if (leaveTimer) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }
};

/**
 * 处理下拉面板鼠标离开
 */
const handleDropdownLeave = () => {
  leaveTimer = setTimeout(() => {
    activeDropdown.value = null;
  }, 150);
};

/**
 * 选择分类
 */
const selectCategory = (category: ProductType) => {
  selectedCategory.value = category;
};

/**
 * 构建分类图片URL
 */
const getCategoryImageUrl = (imageUrl: string | undefined | null): string => {
  return buildBackendImageUrl(imageUrl || null);
};

/**
 * 处理子分类点击
 */
const handleSubcategoryClick = () => {
  activeDropdown.value = null;
};

/**
 * 处理个人中心跳转
 */
const handleProfile = () => {
  navigateTo('/account/profile');
};

/**
 * 处理退出登录
 */
const handleLogout = async () => {
  if (!authStore.user?.customerId || !authStore.user?.email) {
    $toast.error('用户信息不完整，无法退出登录');
    authStore.clearAuth();
    window.location.reload();
    return;
  }

  try {
    // 调用后端登出接口
    const response: any = await logout({
      customerId: authStore.user.customerId,
      email: authStore.user.email
    });

    // 检查业务状态
    if (!response?.success) {
      $toast.error(response?.message || '退出登录失败');
      return;
    }

    // 退出成功 - 清除本地状态
    authStore.clearAuth();
    $toast.success(response?.message || '退出登录成功');

    // 刷新页面
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  } catch (error: any) {
    // 即使接口失败，也清除本地状态
    authStore.clearAuth();
    $toast.error(error?.data?.message || error?.message || '退出登录失败');

    // 刷新页面
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
};

/**
 * 监听窗口大小变化，关闭移动端菜单
 */
watch(isMobile, (newVal) => {
  if (!newVal) {
    // 切换到桌面端时关闭移动端菜单
    mobileMenuOpen.value = false
    mobileProductMenuOpen.value = false
    expandedCategories.value = []
    selectedCategory.value = null
  }
})


</script>

<style lang="scss" scoped>
/* ------------------------------------PC样式----------------------------*/

.new-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.3s ease, border-bottom-color 0.3s ease;

  &.is-scrolled {
    background-color: #ffffff;
    border-bottom: 1px solid #e5e7eb;
  }
}

.header-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  padding: 0 9.375vw;
  height: 3.125vw;
  color: $primary-color; // 统一设置默认字体颜色，子元素继承
}

/* Logo 样式 */
.logo {
  display: flex;
  align-items: center;

  .logo-text {
    font-size: clamp(16px, 1.25vw, 24px);
    font-weight: 700;
    // color 继承自 .header-container
    letter-spacing: 0.05em;
    transition: color 0.3s ease;
  }
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.6667vw;
  margin-left: 4.5313vw;
  margin-right: auto;
  position: relative;
  height: 100%;
}

.nav-item-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-link {
  position: relative;
  font-size: clamp(12px, 0.8333vw, 16px);
  font-weight: 500;
  // color 继承自 .header-container
  text-decoration: none;
  padding: 0.4167vw 0;
  cursor: pointer;
  transition: color 0.3s ease;
  display: block;

  // 底部下划线效果
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.1563vw;
    background-color: currentColor; // 使用当前文字颜色
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s ease, background-color 0.3s ease;
    pointer-events: none;
    /* 让下划线不拦截鼠标事件，避免触发 mouseleave */
  }

  // 悬浮效果
  &:hover {
    opacity: 0.8;

    &::after {
      transform: scaleX(1);
    }
  }

  // 激活状态
  &.is-active {
    &::after {
      transform: scaleX(1);
    }
  }
}

/* Product 下拉面板 */
.product-dropdown {
  position: fixed;
  left: 0;
  width: 100vw;
  background-color: #ffffff;
  border-radius: 0.4167vw;
  box-shadow: 0 0.5208vw 1.5625vw rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  z-index: 100;
  overflow: hidden;
  padding-top: 0.2vw;
  will-change: opacity, transform;
}

/* PC端下拉菜单过渡动画 */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: 
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
  transform-origin: top center;
}

.dropdown-content {
  display: flex;
  height: 40vw;
  max-height: 80vh;
  padding: 1vw 6vw;
}

/* 左侧分类栏 */
.category-sidebar {
  width: 15.5vw;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  background-color: #fff;

  &::-webkit-scrollbar {
    width: 0.4167vw;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 0.2083vw;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.category-sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.625vw;
  padding: 0.8333vw 1.0417vw;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 0.2083vw solid transparent;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: #f0f0f0;
    font-weight: bold;
  }

  &.is-active {
    background-color: #f0f0f0;
    border-left-color: #000000;
    font-weight: bold;

    .category-name {
      color: #000000;
    }
  }

  .category-icon {
    width: 1.5625vw;
    height: 1.5625vw;
    object-fit: cover;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .category-icon-fallback {
    width: 1.5625vw;
    height: 1.5625vw;
    color: #666666;
    flex-shrink: 0;
  }

  .category-name {
    font-size: clamp(12px, 0.8333vw, 16px);
    color: #333333;
    white-space: nowrap;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 右侧内容区域 */
.category-content {
  flex: 1;
  padding: 1.6667vw;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.4167vw;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 0.2083vw;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.subcategories-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.4167vw;
  margin-top: 0.8333vw;
}

.subcategory-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5208vw;
  padding: 0.8333vw;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 0.4167vw;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  &:hover {
    background-color: #f7f8fa;
    transform: translateY(-0.2083vw);

    .subcategory-name {
      color: $primary-color;
    }
  }

  .subcategory-image {
    width: 4.1667vw;
    height: 4.1667vw;
    object-fit: cover;
    border-radius: 50%;
    background-color: #f5f5f5;
  }

  .subcategory-image-placeholder {
    width: 4.1667vw;
    height: 4.1667vw;
    border-radius: 50%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;

    .subcategory-icon-fallback {
      width: 2.0833vw;
      height: 2.0833vw;
      color: #999999;
    }
  }

  .subcategory-name {
    font-size: clamp(11px, 0.7292vw, 14px);
    color: #333333;
    text-align: center;
    transition: color 0.3s ease;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    box-sizing: border-box;
    min-width: 0;
  }
}

.empty-subcategories {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999999;
  font-size: clamp(12px, 0.8333vw, 16px);
}

/* 用户图标 */
.user-icon {
  display: flex;
  align-items: center;
  gap: 1.0417vw;

  .user-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      .icon {
        transform: scale(1.1);
      }

      .icon-text {
        transform: scale(1.1);
      }
    }
  }

  .icon {
    font-size: clamp(20px, 1.6667vw, 32px);
    // color 继承自 .header-container
    transition: all 0.3s ease;
  }

  .icon-text {
    font-size: clamp(12px, 0.8333vw, 16px);
    // color 继承自 .header-container
    transition: all 0.3s ease;
    margin-left: .4167vw;
  }
}

/* 用户菜单样式 */
.user-menu {
  min-width: 15.625vw;
  background: #ffffff;
  border-radius: 0.4167vw;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.625vw;
  padding: 0.625vw 0.8333vw;
  font-size: clamp(11px, 0.7292vw, 14px);
  color: #1a1a1a;
  cursor: pointer;
  border-radius: 0.3125vw;
  transition: all 0.3s ease;

  &:hover:not(.user-email) {
    background-color: #f3f4f6;
    color: $primary-color;
  }

  &.user-email {
    color: #666666;
    cursor: default;
    font-weight: 500;
  }

  .menu-icon {
    font-size: clamp(14px, 1.0417vw, 20px);
    flex-shrink: 0;
  }
}

.menu-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 0.4167vw 0;
}

/* ------------------------------------Mobile样式----------------------------*/

/* 移动端汉堡菜单按钮 */
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
  // color 继承自 .header-container
  transition: color 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  .hamburger-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}

/* 移动端菜单遮罩层 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  backdrop-filter: blur(2px);
}

/* 移动端菜单抽屉 */
.mobile-menu-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffff;
}

.mobile-menu-title {
  font-size: clamp(14px, 3vw, 18px);
  font-weight: 600;
  color: #1a1a1a;
}

.mobile-menu-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6b7280;
  transition: color 0.3s ease;

  &:hover {
    color: #1a1a1a;
  }

  .close-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

/* 移动端导航菜单 */
.mobile-nav-menu {
  flex: 1;
  overflow-y: auto;
  overflow-x: visible;
  padding: 0.5rem 0;
  position: relative;
  z-index: 1;
}

.mobile-nav-item-wrapper {
  position: relative;
  overflow: visible;
}

.mobile-nav-link {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.875rem 1.25rem;
  font-size: clamp(14px, 2.6667vw, 16px);
  font-weight: 500;
  color: #1a1a1a;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #f9fafb;
    color: $primary-color;
  }

  &.is-active {
    color: $primary-color;
    background-color: #f0f7ff;
    border-left-color: $primary-color;
  }

  &.mobile-nav-link-with-icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &.is-expanded {
    background-color: #f0f7ff;
  }
}

.mobile-nav-arrow {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  flex-shrink: 0;
  transition: transform 0.3s ease;

  &.is-expanded {
    transform: rotate(180deg);
  }
}

/* 移动端产品下拉菜单 */
.mobile-product-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 100%;
  max-height: 60vh;
  background-color: #ffffff;
  overflow-y: auto;
  z-index: 10000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #e5e7eb;
}

/* 移动端下拉菜单过渡动画 */
.mobile-dropdown-fade-enter-active,
.mobile-dropdown-fade-leave-active {
  transition: 
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-dropdown-fade-enter-from,
.mobile-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-category-tree {
  padding: 0;
}

.mobile-category-tree-item {
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.mobile-category-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f9fafb;
  }

  &.is-expanded {
    background-color: #f0f7ff;
  }
}

.mobile-category-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.mobile-category-image {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

.mobile-category-image-placeholder {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mobile-category-icon-fallback {
  width: 1.5rem;
  height: 1.5rem;
  color: #9ca3af;
}

.mobile-category-text {
  font-size: clamp(14px, 2.5vw, 15px);
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-category-arrow {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  flex-shrink: 0;
  transition: transform 0.3s ease;

  &.is-expanded {
    transform: rotate(180deg);
  }
}

/* 子分类列表 */
.mobile-category-children {
  background-color: #f9fafb;
  padding-left: 1.25rem;
}

.mobile-subcategory-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f3f4f6;
  }
}

.mobile-subcategory-image {
  width: 2rem;
  height: 2rem;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

.mobile-subcategory-image-placeholder {
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mobile-subcategory-icon-fallback {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.mobile-subcategory-text {
  font-size: clamp(12px, 2.3333vw, 14px);
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 移动端菜单动画 */
.mobile-menu-slide-enter-active,
.mobile-menu-slide-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-slide-enter-from {
  opacity: 0;
}

.mobile-menu-slide-leave-to {
  opacity: 0;
}

.mobile-menu-drawer {
  transition: transform 0.3s ease;
}

.mobile-menu-slide-enter-from .mobile-menu-drawer {
  transform: translateX(-100%);
}

.mobile-menu-slide-leave-to .mobile-menu-drawer {
  transform: translateX(-100%);
}

/* 子分类展开动画 */
.mobile-children-fade-enter-active,
.mobile-children-fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.mobile-children-fade-enter-from {
  opacity: 0;
  max-height: 0;
}

.mobile-children-fade-leave-to {
  opacity: 0;
  max-height: 0;
}

/* 响应式设计 - 移动端共用元素样式调整 */
@media (max-width: 768px) {

  /* 移动端汉堡菜单按钮显示 */
  .mobile-menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 头部容器移动端调整 */
  .header-container {
    padding: 0 16px;
    height: 56px;
    justify-content: space-between;
  }

  /* Logo 移动端调整 */
  .logo {
    flex: 1;
    justify-content: flex-start;

    .logo-text {
      font-size: clamp(16px, 4.2667vw, 20px);
    }
  }

  /* 用户图标移动端调整 */
  .user-icon {
    .icon {
      font-size: clamp(20px, 4.6667vw, 28px);
    }

    .icon-text {
      font-size: clamp(14px, 3vw, 18px);
    }
  }

  /* 用户菜单移动端调整 */
  .user-menu {
    min-width: 40vw;
  }

  .menu-item {
    gap: 1.6667vw;
    padding: 1.6667vw 2.2222vw;
    font-size: clamp(12px, 2vw, 16px);
    border-radius: 0.8333vw;

    .menu-icon {
      font-size: clamp(16px, 2.7778vw, 20px);
    }
  }

  .menu-divider {
    margin: 1.1111vw 0;
  }
}
</style>

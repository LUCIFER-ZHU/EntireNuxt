<template>
  <div class="product-type-accordion-container">
    <UAccordion
      v-model="accordionModel"
      type="multiple"
      :collapsible="true"
      :items="accordionItems"
      class="custom-accordion"
      :ui="{
        header: 'ui-accordion-item-header',
      }"
    >
      <!-- 内容插槽 -->
      <template #content="{ item }">
        <div class="subcategories-list">
          <div
            v-for="subcategory in item.subcategories"
            :key="subcategory.id"
            :title="subcategory.name"
            class="subcategory-item"
            :class="{ active: isSubcategoryActive(subcategory.id) }"
            @click="handleSubcategoryClick(subcategory.id)"
          >
            <div class="subcategory-name">{{ subcategory.name }}</div>
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getProductTypeTree } from '~/api/home';

/**
 * 产品类型手风琴组件
 * 用于展示产品类型树结构，支持展开/折叠和路由跳转
 */

// 路由相关
const router = useRouter();
const route = useRoute();

// 手风琴模型，用于控制展开/折叠状态
const accordionModel = ref<string[]>([]);

// 从路由中获取激活的searchIds
const activeSearchIds = computed(() => {
  const searchIds = route.query.searchIds;
  if (!searchIds) return [];
  if (typeof searchIds === 'string') return [searchIds];
  return searchIds as string[];
});

// 获取产品类型树数据（SSR）
const { data: productTreeData } = await getProductTypeTree()

// 产品类型列表
const productTypes = computed(() => {
  if (!productTreeData.value?.data) return [];
  return productTreeData.value.data;
});

// 转换产品类型数据为手风琴项
const accordionItems = computed(() => {
  return productTypes.value
    .filter((category) => category && typeof category.id === 'number') // 确保id有效
    .map((category) => ({
      value: String(category.id), // 确保value始终是有效的字符串
      typeId: String(category.id),
      label: category.name || '',
      subcategories: category.children || [],
    }));
});

/**
 * 检查子分类是否处于激活状态
 * @param subcategoryId 子分类ID
 * @returns 是否激活
 */
const isSubcategoryActive = (subcategoryId?: number | string): boolean => {
  if (!subcategoryId) return false;
  return activeSearchIds.value.includes(subcategoryId.toString());
};

/**
 * 处理子分类点击事件
 * @param subcategoryId 子分类ID
 */
const handleSubcategoryClick = (subcategoryId?: number | string): void => {
  if (!subcategoryId) return;
  navigateTo({
    path: '/products',
    query: { searchIds: [subcategoryId.toString()] }
  })  
};

/**
 * 初始化手风琴模型，根据激活的子分类展开相应的父分类
 */
const initAccordionModel = (): void => {
  const activeCategories: string[] = [];
  
  // 遍历所有激活的子分类，找到它们的父分类并添加到模型中
  accordionItems.value.forEach(item => {
    const hasActiveSubcategory = item.subcategories.some(subcategory => 
      isSubcategoryActive(subcategory.id)
    );
    
    if (hasActiveSubcategory && typeof item.value === 'string') {
      activeCategories.push(item.value);
    }
  });
  
  accordionModel.value = activeCategories;
};

// 初始化手风琴模型
initAccordionModel();

// 监听路由变化，更新手风琴状态
watch(
  () => route.query.searchIds,
  () => {
    initAccordionModel();
  },
  { deep: true }
);
</script>

<style scoped>
.product-type-accordion-container {
  width: 100%;
  padding: 0 0 1.5625vw;
}

.custom-accordion {
  border: none;
  background: transparent;
}

/* 手风琴头部样式 */
:deep(.ui-accordion-item-header) {
  display: flex;
  align-items: center;
  padding: 0 4.1667vw;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  border: none;
  text-align: left;
  width: 100%;
  min-width: 0; /* 确保内容不会溢出 */

  button {
    font-size: clamp(12px, .8333vw, 16px);
    color: #000;
    font-weight: 400;
  }
}

:deep(.ui-accordion-item-header:hover) {
  background-color: rgba(0, 0, 0, 0.02);
}

.header-content {
  font-weight: 400;
  color: #000;
  flex: 1;
  min-width: 0; /* 确保内容不会溢出 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 手风琴内容区域 */
:deep(.ui-accordion-item-content) {
  padding: 0;
  border: none;
}

.subcategories-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.subcategory-item {
  display: flex;
  align-items: center;
  padding: 0.625vw 4.1667vw 0.625vw 5.1667vw;
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  border: none;
  text-align: left;
  width: 100%;
  font-size: clamp(10px, .7292vw, 14px);
  color: #000;
  font-weight: 400;
}

.subcategory-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.subcategory-item.active {
  background: rgba(7, 28, 99, 0.2);
  color: #EF751E;
  font-weight: bold;
}

.subcategory-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

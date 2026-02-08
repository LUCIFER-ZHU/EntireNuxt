<template>
  <div class="profile-page" :class="{ 'is-mobile': isMobile }">
    <ReNewAppHeader />
    <div class="profile-container">
      <!-- 左侧列 -->
      <div class="left-column">
        <!-- 个人信息 -->
        <div class="profile-card">
          <div class="avatar-section">
            <ReNewAvatarSelector v-model="avatarValue" :editable="isEditing" :size="56"
              :user-email="customerInfo?.email || ''" />
            <div class="user-info">
              <template v-if="!isEditing">
                <h3 class="user-name">{{ customerInfo?.nickName }}</h3>
              </template>
              <UInput v-else v-model="editForm.nickName" placeholder="Enter Name" class="user-name-input" />
              <p class="user-email">{{ customerInfo?.email }}</p>
            </div>

            <!-- 按钮组 -->
            <div class="action-buttons" v-if="!isEditing">
              <button class="action-btn" @click="handleResetPassword">
                Reset Password
              </button>
              <button class="action-btn dark" @click="startEdit">
                Edit Profile
              </button>
            </div>
          </div>

          <div class="detail-info">
            <div class="info-item">
              <i class="icon mnfont mn-local"></i>
              <span class="label">Address:</span>
              <template v-if="!isEditing">
                <span class="value">{{ customerInfo?.address || '---' }}</span>
              </template>
              <UInput v-else v-model="editForm.address" placeholder="Enter address" class="edit-input" />
            </div>

            <div class="info-item">
              <i class="icon mnfont mn-iphone"></i>
              <span class="label">Phone:</span>
              <template v-if="!isEditing">
                <span class="value">{{ customerInfo?.telephone || '---' }}</span>
              </template>
              <div v-else class="phone-input-group">
                <UInput v-model="editForm.telephone" placeholder="Enter phone number" class="phone-input" />
              </div>
            </div>

            <div class="info-item">
              <i class="icon mnfont mn-Building-three"></i>
              <span class="label">Company Name:</span>
              <template v-if="!isEditing">
                <span class="value">{{ customerInfo?.companyName || '---' }}</span>
              </template>
              <UInput v-else v-model="editForm.companyName" placeholder="Enter company name" class="edit-input" />
            </div>
          </div>

          <!-- 编辑模式下的操作按钮 -->
          <div v-if="isEditing" class="edit-actions">
            <button class="edit-action-btn" @click="cancelEdit">
              Cancel
            </button>
            <button class="edit-action-btn primary" @click="confirmEdit" :disabled="updateLoading">
              {{ updateLoading ? 'Saving...' : 'Confirm' }}
            </button>
          </div>
        </div>

        <!-- 收藏列表 -->
        <div class="collection-card">
          <h3 class="section-title">Save & history</h3>

          <div v-if="collectionList.length === 0" class="empty-state">
            No saved items
          </div>

          <div v-else>
            <div class="collection-list">
              <div v-for="item in displayedCollections" :key="item.id" class="collection-item">
                <img v-if="item.image" :src="buildBackendImageUrl(item.image)" :alt="item.productName"
                  class="item-image" />
                <div class="item-info">
                  <h4 class="item-name">{{ item.productName }}</h4>
                  <p class="item-opt">Operating Time {{ item.processingTime || '---' }}h</p>
                  <div class="item-meta">
                    <span class="meta-stock">Stock: {{ item.virtualInventory || item.inventory || '***' }}</span>
                  </div>
                  <div class="item-country">
                    <NuxtImg v-if="item.iconUrl" :src="item.iconUrl" :alt="item.isoCode" class="country-flag-img" />
                    <ClientOnly v-else>
                      <UIcon name="i-heroicons-globe-alt" class="country-icon-placeholder" />
                    </ClientOnly>
                    <span class="country-code">{{ item.isoCode }}</span>
                  </div>
                  <div class="item-actions">
                    <button class="item-action-btn" @click="handleRemoveCollection(item.id)"
                      :disabled="removingIds.has(item.id)">
                      {{ removingIds.has(item.id) ? 'Removing...' : 'Remove' }}
                    </button>
                    <button class="item-action-btn primary" @click="navigateToProduct(item.seoPath)">
                      Chat now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 加载更多按钮 -->
            <div v-if="collectionList.length > 3 && !showAllCollections" class="load-more">
              <button class="load-more-btn" @click="showAllCollections = true">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧列 -->
      <div class="right-column">
        <h3 class="section-title">Browsing history</h3>

        <div v-if="browseHistory.length === 0" class="empty-state">
          No browsing history
        </div>

        <div v-else>
          <div class="history-grid">
            <div v-for="item in displayedHistory" :key="item.id" class="history-item"
              @click="navigateToProduct(item.seoPath)">
              <img v-if="item.image" :src="buildBackendImageUrl(item.image)" :alt="item.productName"
                class="history-image" />
              <div class="history-info">
                <h4 class="history-name">{{ item.productName }}</h4>
              </div>
            </div>
          </div>

          <!-- 加载更多按钮 -->
          <div v-if="browseHistory.length > 6 && !showAllHistory" class="load-more">
            <button class="load-more-btn" @click="showAllHistory = true">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <ReNewAppFooter />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import {
  fetchCustomerInfo,
  updateCustomerInfo,
  fetchCollectionList,
  cancelCollection,
  fetchBrowseHistory,
} from '~/api/personal'

const { $toast } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

// 获取图片URL管理
const { buildBackendImageUrl } = useImageUrl()

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

definePageMeta({
  layout: 'account',
  middleware: 'auth'
})

// 获取客户ID
const customerId = computed(() => {
  return authStore.user?.customerId || authStore.user?.id
})

// 统一的数据获取函数
const { data: pageData, refresh: refreshAllData } = await useAsyncData(
  'profile-page-data',
  async () => {
    if (!customerId.value) {
      return {
        customerInfo: null,
        collectionList: [],
        browseHistory: []
      }
    }

    try {
      const [customerResult, collectionResult, historyResult] = await Promise.allSettled([
        fetchCustomerInfo(customerId.value),
        fetchCollectionList(customerId.value),
        fetchBrowseHistory(customerId.value)
      ])

      let customerDataValue = null
      let collectionListValue: any[] = []
      let browseHistoryValue: any[] = []

      // 处理客户信息数据
      if (customerResult.status === 'fulfilled') {
        const result = customerResult.value as any
        if (result?.success && result?.data) {
          customerDataValue = result.data
        } else {
          // 不在服务端打印 toast，避免 hydration mismatch
          console.error('Failed to load customer info:', result?.message)
        }
      } else {
        console.error('获取客户信息失败:', customerResult.reason)
      }

      // 处理收藏列表数据
      if (collectionResult.status === 'fulfilled') {
        const result = collectionResult.value as any
        if (result?.success && result?.data) {
          collectionListValue = Array.isArray(result.data) ? result.data : []
        }
      } else {
        console.error('获取收藏列表失败:', collectionResult.reason)
      }

      // 处理浏览记录数据
      if (historyResult.status === 'fulfilled') {
        const result = historyResult.value as any
        if (result?.success && result?.data) {
          browseHistoryValue = Array.isArray(result.data) ? result.data : []
        }
      } else {
        console.error('获取浏览记录失败:', historyResult.reason)
      }

      return {
        customerInfo: customerDataValue,
        collectionList: collectionListValue,
        browseHistory: browseHistoryValue
      }
    } catch (error) {
      console.error('数据获取失败:', error)
      return {
        customerInfo: null,
        collectionList: [],
        browseHistory: []
      }
    }
  },
  {
    watch: [customerId]
  }
)

// 导航到商品详情
const navigateToProduct = (productSlug?: string) => {
  if (productSlug) {
    navigateTo(`/product/${productSlug}`)
  } else {
    $toast.error('Product seoPath not found!')
  }
}

// 客户信息
const customerInfo = computed(() => pageData.value?.customerInfo || null)
const isEditing = ref(false)
const updateLoading = ref(false)

// 头像值
const avatarValue = ref('')

// 监听 customerInfo 变化，更新头像
watch(() => customerInfo.value, (newInfo) => {
  if (newInfo) {
    avatarValue.value = newInfo.avatar || ''
  }
}, { immediate: true })

// 编辑表单
const editForm = ref({
  nickName: '',
  address: '',
  telephone: '',
  companyName: '',
})

// 收藏列表
const collectionList = computed(() => pageData.value?.collectionList || [])
const removingIds = ref(new Set<number>())
const showAllCollections = ref(false)
const displayedCollections = computed(() => {
  if (showAllCollections.value) {
    return collectionList.value
  }
  return collectionList.value.slice(0, 3)
})

// 浏览记录
const browseHistory = computed(() => pageData.value?.browseHistory || [])
const showAllHistory = ref(false)
const displayedHistory = computed(() => {
  if (showAllHistory.value) {
    return browseHistory.value
  }
  return browseHistory.value.slice(0, 6)
})

// 监听 customerId 变化，如果为空则跳转登录
watch(customerId, (newId) => {
  if (!newId) {
    navigateTo('/account/login')
  }
}, { immediate: true })

// 开始编辑
const startEdit = () => {
  isEditing.value = true
  editForm.value = {
    nickName: customerInfo.value?.nickName || '',
    address: customerInfo.value?.address || '',
    telephone: customerInfo.value?.telephone || '',
    companyName: customerInfo.value?.companyName || '',
  }
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
}

// 处理重置密码跳转
const handleResetPassword = () => {
  // 优先使用 customerInfo 中的邮箱，如果没有则使用 authStore 中的邮箱
  const email = customerInfo.value?.email || authStore.user?.email || ''
  if (email) {
    navigateTo({
      path: '/account/reset',
      query: { email }
    })
  } else {
    navigateTo('/account/reset')
  }
}

// 确认编辑
const confirmEdit = async () => {
  updateLoading.value = true
  try {
    const requestData = {
      nickName: editForm.value.nickName,
      address: editForm.value.address,
      telephone: editForm.value.telephone,
      companyName: editForm.value.companyName,
      avatar: avatarValue.value
    }

    const response: any = await updateCustomerInfo(requestData)

    if (response?.success) {
      $toast.success('Profile updated successfully')
      isEditing.value = false
      // 重新加载客户信息
      await refreshAllData()
    } else {
      $toast.error(response?.message || 'Failed to update profile')
    }
  } catch (error: any) {
    $toast.error(error?.data?.message || 'Failed to update profile')
  } finally {
    updateLoading.value = false
  }
}

// 移除收藏
const handleRemoveCollection = async (id: number) => {
  removingIds.value.add(id)
  try {
    const response: any = await cancelCollection([id])

    if (response?.success) {
      $toast.success('Removed from collection')
      // 重新加载收藏列表
      await refreshAllData()
    } else {
      $toast.error(response?.message || 'Failed to remove collection')
    }
  } catch (error: any) {
    $toast.error(error?.data?.message || 'Failed to remove collection')
  } finally {
    removingIds.value.delete(id)
  }
}

// SEO 元数据
useHead({
  title: 'Profile - My Account',
  meta: [
    {
      name: 'description',
      content: 'Manage your account profile and preferences'
    }
  ]
})
</script>

<style scoped lang="scss">
@use 'sass:color';

.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.profile-container {
  padding: 1.5625vw 16.1458vw;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.0417vw;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.25vw;
}

.profile-card,
.collection-card,
.right-column {
  background: white;
  border-radius: 0.625vw;
  padding: 1.0417vw;
  box-shadow: 0 0.1042vw 0.4167vw rgba(0, 0, 0, 0.08);
}

.right-column {
  align-self: flex-start;
}

/* 头像部分 */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 0.7813vw;
  margin-bottom: 1.0417vw;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: clamp(18px, 1.25vw, 24px);
  font-weight: 600;
  margin-bottom: 0.1302vw;
  color: #000;
}

.user-name-input {
  margin-bottom: 0.1302vw;

  :deep(input) {
    font-size: clamp(18px, 1.25vw, 24px);
    font-weight: 600;
    color: #000;
    padding: 0.2604vw 0.5208vw;
  }
}

.user-email {
  color: #000;
  font-size: clamp(12px, .8333vw, 16px);
}

/* 按钮部分 */
.action-buttons {
  display: flex;
  gap: 0.5208vw;
  margin-left: auto;

  @media (max-width: 640px) {
    flex-direction: column;
  }
}

.action-btn {
  @include chat-btn;

  & {
    &.dark {
      background: #000;
      color: #FFFFFF;
      border-color: #000;

      &:hover {
        background: color.adjust(#000, $lightness: -5%);
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

}

/* 编辑模式下的操作按钮 */
.edit-actions {
  display: flex;
  gap: 0.5208vw;
  margin-top: 1.0417vw;
  padding-top: 0.7813vw;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;
  }
}

.edit-action-btn {
  @include chat-btn;


  & {
    &.primary {
      background: $primary-color;
      color: #FFFFFF;
      border-color: $primary-color;

      &:hover {
        background: color.adjust($primary-color, $lightness: -5%);
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

}

/* 详细信息 */
.detail-info {
  display: flex;
  flex-direction: column;
  gap: 1.1458vw;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.3906vw;
  font-size: clamp(14px, .8333vw, 16px);

  .icon {
    color: #6b7280;
    font-size: clamp(16px, 1.25vw, 24px);
  }

  .label {
    font-weight: 500;
    color: #000;
    font-weight: bold;
    min-width: 8.25vw;
  }

  .value {
    color: #8D8D8D;
  }
}

.edit-input {
  flex: 1;
}

.phone-input-group {
  display: flex;
  gap: 0.2604vw;
  flex: 1;

  .phone-input {
    flex: 1;
  }
}

/* 标题 */
.section-title {
  font-size: clamp(18px, 1.25vw, 24px);
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.7813vw;
}

/* 加载和空状态 */
.loading-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5625vw;
  color: #9ca3af;
  font-size: clamp(12px, 0.875vw, 16px);
}

.loading-state {
  font-size: clamp(20px, 1.5vw, 28px);
}

/* 收藏列表 */
.collection-list {
  display: flex;
  flex-direction: column;
  gap: .8333vw;
  max-height: 37.8333vw;
  overflow-y: auto;
  padding-right: 0.2604vw;

  &::-webkit-scrollbar {
    width: 0.2604vw;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 0.1302vw;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 0.1302vw;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.collection-item {
  display: flex;
  align-items: center;
  gap: 1.0417vw;
  padding: .8333vw;
  border-radius: 0.4167vw;
  transition: all 0.2s;
  background: rgba(141, 141, 141, 0.06);
  border-radius: 1.25vw;

  &:hover {
    box-shadow: 0 0.1042vw 0.4167vw rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.item-image {
  width: 11.6146vw;
  height: 9.3229vw;
  object-fit: cover;
  border-radius: .625vw;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: clamp(12px, .8333vw, 16px);
  font-weight: 600;
  color: #000;
  margin-bottom: 0.1302vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-opt {
  font-weight: bold;
  font-size: clamp(12px, 1.0417vw, 20px);
  color: #071C63;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0.2604vw;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 0.5208vw;
  font-size: clamp(11px, 0.7292vw, 14px);
  color: #6b7280;
  margin-bottom: 0.5208vw;

  .meta-stock {
    color: #6b7280;
  }

  .meta-location {
    display: flex;
    align-items: center;
    gap: 0.2083vw;
  }
}

.item-country {
  display: flex;
  align-items: center;
  gap: .6771vw;
  font-size: clamp(11px, 0.7292vw, 14px);
  margin-bottom: 0.5208vw;
}

.country-flag-img {
  width: 1.25vw;
  height: 0.8333vw;
  object-fit: contain;
}

.country-icon-placeholder {
  font-size: clamp(12px, 0.8333vw, 16px);
  color: #9ca3af;
}

.country-code {
  font-weight: 500;
  font-size: clamp(12px, 0.8333vw, 16px);
  color: #000;
}

.item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.2604vw;
  flex-shrink: 0;

  @media (max-width: 640px) {
    width: 100%;

    button {
      flex: 1;
    }
  }
}

.item-action-btn {
  @include chat-btn;

  & {
    &.primary {
      background: $primary-color;
      color: #FFFFFF;
      border-color: $primary-color;

      &:hover {
        background: color.adjust($primary-color, $lightness: -5%);
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

}

/* 浏览记录 */
.history-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.7813vw;
  max-height: 41.0833vw;
  overflow-y: auto;
  padding-right: 0.2604vw;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  &::-webkit-scrollbar {
    width: 0.2604vw;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 0.1302vw;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 0.1302vw;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.history-item {
  border-radius: 0.4167vw;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0.2083vw 0.625vw rgba(0, 0, 0, 0.1);
    transform: translateY(-0.1042vw);
  }
}

.history-image {
  width: 100%;
  height: 8.3333vw;
  object-fit: cover;
}

.history-info {
  padding: 0.5208vw;
}

.history-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.2604vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-price {
  color: #059669;
  font-weight: 500;
  font-size: clamp(12px, 0.875vw, 16px);
}

/* 加载更多按钮 */
.load-more {
  display: flex;
  justify-content: center;
  margin-top: 0.7813vw;
  padding-top: 0.7813vw;
  border-top: 1px solid #e5e7eb;
}

.load-more-btn {
  @include chat-btn;

  &:hover {
    background: $primary-color;
    color: #FFFFFF;
    border-color: $primary-color;
  }
}

/* ------------------------------------Mobile样式----------------------------*/
.is-mobile {
  .profile-page {
    min-height: 100vh;
  }

  .profile-container {
    padding: 2.6667vw 4.2667vw;
    grid-template-columns: 1fr;
    gap: 4.2667vw;
  }

  .profile-card,
  .collection-card,
  .right-column {
    border-radius: 3.2vw;
    padding: 4.2667vw;
  }

  .avatar-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 4.2667vw;
    margin-bottom: 4.2667vw;
  }

  .user-info {
    width: 100%;
  }

  .user-name {
    font-size: clamp(16px, 4.2667vw, 20px);
    margin-bottom: 1.0667vw;
  }

  .user-name-input {
    margin-bottom: 1.0667vw;
    width: 100%;

    :deep(input) {
      font-size: clamp(16px, 4.2667vw, 20px);
      padding: 2.1333vw 3.2vw;
    }
  }

  .user-email {
    font-size: clamp(12px, 3.2vw, 14px);
  }

  .action-buttons {
    width: 100%;
    flex-direction: row;
    gap: 2.1333vw;
    margin-left: 0;

    .action-btn {
      flex: 1;
      font-size: clamp(12px, 3.2vw, 14px);
      padding: 2.6667vw 4.2667vw;
    }
  }

  .edit-actions {
    gap: 2.1333vw;
    margin-top: 4.2667vw;
    padding-top: 3.2vw;
    flex-direction: row;

    .edit-action-btn {
      flex: 1;
      font-size: clamp(12px, 3.2vw, 14px);
      padding: 2.6667vw 4.2667vw;
    }
  }

  .detail-info {
    gap: 4.2667vw;
  }

  .info-item {
    gap: 2.1333vw;
    font-size: clamp(12px, 3.2vw, 14px);

    .icon {
      font-size: clamp(16px, 4.2667vw, 20px);
    }

    .label {
      min-width: auto;
      margin-bottom: 1.0667vw;
    }

    .value {
      width: 100%;
    }
  }

  .edit-input,
  .phone-input-group {
    width: 100%;
  }

  .section-title {
    font-size: clamp(16px, 4.2667vw, 20px);
    margin-bottom: 3.2vw;
  }

  .collection-list {
    gap: 3.2vw;
    max-height: none;
  }

  .collection-item {
    flex-direction: row;
    gap: 3.2vw;
    padding: 3.2vw;
    border-radius: 3.2vw;
    align-items: flex-start;
  }

  .item-image {
    width: 26.6667vw;
    height: 26.6667vw;
    border-radius: 2.1333vw;
    flex-shrink: 0;
  }

  .item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1.0667vw;
  }

  .item-name {
    font-size: clamp(12px, 3.2vw, 14px);
    font-weight: 600;
    margin-bottom: 0;
    white-space: normal;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .item-opt {
    font-size: clamp(11px, 2.9333vw, 12px);
    white-space: normal;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 1.0667vw;
  }

  .item-meta {
    gap: 2.1333vw;
    font-size: clamp(10px, 2.6667vw, 11px);
    margin-bottom: 2.1333vw;
  }

  .item-country {
    gap: 1.0667vw;
    font-size: clamp(10px, 2.6667vw, 11px);
    margin-bottom: 2.1333vw;
  }

  .country-flag-img {
    width: 5.3333vw;
    height: 3.7333vw;
    border-radius: 0.5333vw;
  }

  .country-icon-placeholder {
    font-size: clamp(12px, 3.2vw, 14px);
  }

  .country-code {
    font-size: clamp(10px, 2.6667vw, 11px);
  }

  .item-actions {
    width: 100%;
    gap: 2.1333vw;
    margin-top: 0;
    display: flex;
    flex-direction: row;

    .item-action-btn {
      flex: 1;
      font-size: clamp(11px, 2.9333vw, 12px);
      padding: 2.1333vw 3.2vw;
      white-space: nowrap;
    }
  }

  .history-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 3.2vw;
    max-height: none;
  }

  .history-item {
    border-radius: 2.1333vw;
  }

  .history-image {
    height: 26.6667vw;
  }

  .history-info {
    padding: 2.1333vw;
    background: #fff;
  }

  .history-name {
    font-size: clamp(10px, 2.6667vw, 11px);
    margin-bottom: 0;
    white-space: normal;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .load-more {
    margin-top: 3.2vw;
    padding-top: 3.2vw;
  }

  .load-more-btn {
    font-size: clamp(12px, 3.2vw, 14px);
    padding: 2.6667vw 5.3333vw;
  }

  .empty-state {
    padding: 6.4vw;
    font-size: clamp(12px, 3.2vw, 14px);
  }
}
</style>

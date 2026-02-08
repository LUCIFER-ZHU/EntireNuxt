<template>
  <div class="avatar-selector">
    <!-- 查看模式 -->
    <div v-if="!editable" class="avatar-view" @click="handleViewClick">
      <Avatar
        :size="size"
        :name="previewName"
        :variant="extractVariant(modelValue)"
        :colors="selectedColors"
      />
    </div>

    <!-- 编辑模式 -->
    <div v-else class="avatar-edit">
      <div class="current-avatar" @click="showSelector = !showSelector">
        <Avatar
          :size="size"
          :name="previewName"
          :variant="extractVariant(localValue)"
          :colors="selectedColors"
        />
        <div class="edit-overlay">
          <UIcon name="i-heroicons-pencil" class="edit-icon" />
        </div>
      </div>

      <!-- 头像选择器弹窗 -->
      <Teleport to="body">
        <Transition name="selector-fade">
          <div v-if="showSelector" class="avatar-selector-modal" :class="{ 'is-mobile': isMobile }" @click.self="showSelector = false">
            <div class="selector-content">
              <div class="selector-header">
                <h3 class="selector-title">Choose Your Avatar</h3>
                <button class="close-btn" @click="showSelector = false">
                  <UIcon name="i-heroicons-x-mark" />
                </button>
              </div>

              <div class="selector-body">
                <!-- 风格选择 -->
                <div class="style-section">
                  <h4 class="section-title">Style</h4>
                  <div class="style-grid">
                    <div
                      v-for="variant in avatarVariants"
                      :key="variant"
                      class="style-item"
                      :class="{ active: selectedVariant === variant }"
                      @click="selectedVariant = variant"
                    >
                      <Avatar
                        :size="gridAvatarSize"
                        :name="previewName"
                        :variant="variant"
                        :colors="selectedColors"
                      />
                      <span class="style-name">{{ variant }}</span>
                    </div>
                  </div>
                </div>

                <!-- 颜色方案选择 -->
                <div class="color-section">
                  <h4 class="section-title">Color Scheme</h4>
                  <div class="color-grid">
                    <div
                      v-for="(scheme, index) in colorSchemes"
                      :key="index"
                      class="color-item"
                      :class="{ active: selectedColorScheme === index }"
                      @click="selectColorScheme(index)"
                    >
                      <Avatar
                        :size="gridAvatarSize"
                        :name="previewName"
                        :variant="selectedVariant"
                        :colors="scheme.colors"
                      />
                      <span class="color-name">{{ scheme.name }}</span>
                    </div>
                  </div>
                </div>

                <!-- 预览 -->
                <div class="preview-section">
                  <h4 class="section-title">Preview</h4>
                  <div class="preview-container">
                    <Avatar
                      :size="previewAvatarSize"
                      :name="previewName"
                      :variant="selectedVariant"
                      :colors="selectedColors"
                    />
                  </div>
                </div>
              </div>

              <div class="selector-footer">
                <UButton color="neutral" variant="outline" @click="showSelector = false">
                  Cancel
                </UButton>
                <UButton color="primary" @click="confirmSelection">
                  Confirm
                </UButton>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import Avatar from 'vue-boring-avatars'

interface Props {
  modelValue?: string // 格式: "variant:colorSchemeIndex"
  editable?: boolean
  size?: number
  userEmail?: string // 用户邮箱，用于生成头像
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  editable: false,
  size: 80,
  userEmail: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// 使用设备检测组合函数
const { isMobile } = useDeviceDetection()

// 本地值
const localValue = ref(props.modelValue)
const showSelector = ref(false)

// 头像风格选项
const avatarVariants = ['marble', 'beam', 'pixel', 'sunset', 'ring', 'bauhaus'] as const

// 颜色方案
const colorSchemes = [
  {
    name: 'Ocean',
    colors: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']
  },
  {
    name: 'Sunset',
    colors: ['#FF6B6B', '#FFD93D', '#6BCF7F', '#4D96FF', '#A78BFA']
  },
  {
    name: 'Forest',
    colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2']
  },
  {
    name: 'Purple',
    colors: ['#7209B7', '#B5179E', '#F72585', '#4361EE', '#4CC9F0']
  },
  {
    name: 'Warm',
    colors: ['#E63946', '#F77F00', '#FCBF49', '#06AED5', '#073B4C']
  },
  {
    name: 'Cool',
    colors: ['#4A5759', '#6B9080', '#A4C3B2', '#CCE3DE', '#EAF4F4']
  },
  {
    name: 'Neon',
    colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF']
  },
  {
    name: 'Pastel',
    colors: ['#FFB5E8', '#B28DFF', '#85E3FF', '#A79AFF', '#FFC9DE']
  },
  {
    name: 'Earth',
    colors: ['#8D5524', '#C68642', '#E0AC69', '#F1C27D', '#FFDBAC']
  },
  {
    name: 'Berry',
    colors: ['#D81159', '#8F2D56', '#218380', '#73D2DE', '#FBB13C']
  },
  {
    name: 'Mint',
    colors: ['#06FFA5', '#00D9FF', '#4ECDC4', '#44A08D', '#093637']
  },
  {
    name: 'Fire',
    colors: ['#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFA500']
  },
  {
    name: 'Ice',
    colors: ['#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA']
  },
  {
    name: 'Galaxy',
    colors: ['#2E1A47', '#6B4984', '#9B72AA', '#D4ADFC', '#FFA3FD']
  },
  {
    name: 'Candy',
    colors: ['#FF6B9D', '#FEC5E5', '#FFF68F', '#9FE2BF', '#A0E7E5']
  },
  {
    name: 'Retro',
    colors: ['#F72585', '#B5179E', '#7209B7', '#560BAD', '#480CA8']
  }
]

// 选中的风格和颜色
const selectedVariant = ref<typeof avatarVariants[number]>('marble')
const selectedColorScheme = ref(0)
const selectedColors = computed(() => colorSchemes[selectedColorScheme.value]?.colors || colorSchemes[0]!.colors)

// 预览名称（使用用户邮箱或默认值）
const previewName = computed(() => props.userEmail || 'user@example.com')

// 动态头像大小（移动端使用较小尺寸）
const gridAvatarSize = computed(() => isMobile.value ? 50 : 60)
const previewAvatarSize = computed(() => isMobile.value ? 80 : 120)

// 从字符串中提取风格
const extractVariant = (value: string): typeof avatarVariants[number] => {
  if (!value) return 'marble'
  const parts = value.split(':')
  return (parts[0] as typeof avatarVariants[number]) || 'marble'
}

// 从字符串中提取颜色方案索引
const extractColorSchemeIndex = (value: string): number => {
  if (!value) return 0
  const parts = value.split(':')
  const index = parseInt(parts[1] || '0')
  return isNaN(index) ? 0 : Math.min(Math.max(index, 0), colorSchemes.length - 1)
}

// 选择颜色方案
const selectColorScheme = (index: number) => {
  selectedColorScheme.value = index
}

// 查看模式点击
const handleViewClick = () => {
  if (props.editable) {
    showSelector.value = true
  }
}

// 确认选择
const confirmSelection = () => {
  const avatarString = `${selectedVariant.value}:${selectedColorScheme.value}`
  localValue.value = avatarString
  emit('update:modelValue', avatarString)
  showSelector.value = false
}

// 初始化选中值
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    localValue.value = newValue
    selectedVariant.value = extractVariant(newValue)
    selectedColorScheme.value = extractColorSchemeIndex(newValue)
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.avatar-selector {
  display: inline-block;
}

/* 查看模式 */
.avatar-view {
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  width: fit-content;
  height: fit-content;
}

/* 编辑模式 */
.avatar-edit {
  position: relative;
}

.current-avatar {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;

  &:hover .edit-overlay {
    opacity: 1;
  }
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.edit-icon {
  color: white;
  font-size: clamp(20px, 1.5vw, 28px);
}

/* 选择器弹窗 */
.avatar-selector-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.0417vw;

  &.is-mobile {
    padding: 0;
    align-items: flex-end;
  }
}

.selector-content {
  background: white;
  border-radius: 0.625vw;
  width: 90%;
  max-width: 41.6667vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .is-mobile & {
    width: 100%;
    max-width: 100%;
    max-height: 90vh;
    border-radius: 5.3333vw 5.3333vw 0 0;
  }
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.0417vw;
  border-bottom: 1px solid #e5e7eb;

  .is-mobile & {
    padding: 4.2667vw;
  }
}

.selector-title {
  font-size: clamp(18px, 1.25vw, 24px);
  font-weight: 600;
  color: #1f2937;
  margin: 0;

  .is-mobile & {
    font-size: clamp(18px, 4.8vw, 22px);
  }
}

.close-btn {
  width: 2.0833vw;
  height: 2.0833vw;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3125vw;
  transition: background 0.2s;
  font-size: clamp(20px, 1.5vw, 28px);

  &:hover {
    background: #f3f4f6;
  }

  .is-mobile & {
    width: 8vw;
    height: 8vw;
    font-size: clamp(20px, 5.3333vw, 24px);
  }
}

.selector-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.0417vw;

  .is-mobile & {
    padding: 4.2667vw;
  }
}

.section-title {
  font-size: clamp(14px, 0.9375vw, 18px);
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5208vw;

  .is-mobile & {
    font-size: clamp(14px, 3.7333vw, 16px);
    margin-bottom: 3.2vw;
  }
}

/* 风格选择 */
.style-section {
  margin-bottom: 1.5625vw;

  .is-mobile & {
    margin-bottom: 5.3333vw;
  }
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5.2083vw, 1fr));
  gap: 0.5208vw;

  .is-mobile & {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.6667vw;
  }
}

.style-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5208vw;
  border: 2px solid #e5e7eb;
  border-radius: 0.4167vw;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
  }

  &.active {
    border-color: #667eea;
    background: #f5f3ff;
  }

  .is-mobile & {
    padding: 2.6667vw;
    border-radius: 2.1333vw;
    border-width: 2px;
  }
}

.style-name {
  margin-top: 0.2604vw;
  font-size: clamp(12px, 0.875vw, 16px);
  color: #6b7280;
  text-transform: capitalize;

  .is-mobile & {
    margin-top: 1.0667vw;
    font-size: clamp(10px, 2.6667vw, 12px);
  }
}

/* 颜色方案选择 */
.color-section {
  margin-bottom: 1.5625vw;

  .is-mobile & {
    margin-bottom: 5.3333vw;
  }
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5.2083vw, 1fr));
  gap: 0.5208vw;

  .is-mobile & {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.6667vw;
  }
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5208vw;
  border: 2px solid #e5e7eb;
  border-radius: 0.4167vw;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
  }

  &.active {
    border-color: #667eea;
    background: #f5f3ff;
  }

  .is-mobile & {
    padding: 2.6667vw;
    border-radius: 2.1333vw;
    border-width: 2px;
  }
}

.color-name {
  margin-top: 0.2604vw;
  font-size: clamp(12px, 0.875vw, 16px);
  color: #6b7280;

  .is-mobile & {
    margin-top: 1.0667vw;
    font-size: clamp(10px, 2.6667vw, 12px);
  }
}

/* 预览 */
.preview-section {
  margin-bottom: 1.0417vw;

  .is-mobile & {
    margin-bottom: 5.3333vw;
  }
}

.preview-container {
  display: flex;
  justify-content: center;
  padding: 1.0417vw;
  background: #f9fafb;
  border-radius: 0.4167vw;

  .is-mobile & {
    padding: 4.2667vw;
    border-radius: 2.1333vw;
  }
}

/* 底部按钮 */
.selector-footer {
  display: flex;
  gap: 0.5208vw;
  padding: 1.0417vw;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;

  .is-mobile & {
    flex-direction: column;
    gap: 2.6667vw;
    padding: 4.2667vw;

    :deep(button) {
      width: 100%;
      font-size: clamp(14px, 3.7333vw, 16px);
      padding: 3.2vw 3.2vw;
    }
  }
}

/* 动画 */
.selector-fade-enter-active,
.selector-fade-leave-active {
  transition: opacity 0.3s;
}

.selector-fade-enter-from,
.selector-fade-leave-to {
  opacity: 0;
}

.selector-fade-enter-active .selector-content,
.selector-fade-leave-active .selector-content {
  transition: transform 0.3s ease-out;
}

.selector-fade-enter-from .selector-content,
.selector-fade-leave-to .selector-content {
  transform: scale(0.9);
}

/* 移动端动画：从底部滑入 */
.is-mobile .selector-fade-enter-active .selector-content,
.is-mobile .selector-fade-leave-active .selector-content {
  transition: transform 0.3s ease-out;
}

.is-mobile .selector-fade-enter-from .selector-content {
  transform: translateY(100%);
}

.is-mobile .selector-fade-leave-to .selector-content {
  transform: translateY(100%);
}
</style>

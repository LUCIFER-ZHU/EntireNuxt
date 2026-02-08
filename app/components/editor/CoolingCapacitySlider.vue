<template>
  <div class="slider-container">
    <div class="value-display" :style="{ left: sliderPosition + '%' }">
      {{ displayValue }}
    </div>
    <USlider v-model="innerValue" :min="min" :max="max" :step="step" class="capacity-slider" />
    <div class="slider-labels">
      <span v-for="label in labelsToShow" :key="label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 冷却能力滑块组件
 * 展示带单位的数值气泡，并随滑块拇指移动
 */

// 组件属性定义
const props = withDefaults(defineProps<{
  /** 当前值（支持v-model） */
  modelValue: number
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
  /** 数值单位显示，如“KW” */
  unit?: string
  /** 下方刻度标签 */
  labels?: number[]
}>(), {
  min: 3,
  max: 10000,
  step: 1,
  unit: 'KW',
  labels: () => [3, 1250, 2500, 3750, 5000, 6250, 7500, 8750, 10000]
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

// 双向绑定代理
const innerValue = computed({
  get: () => props.modelValue,
  set: (val: number) => emit('update:modelValue', val)
})

/**
 * 计算某个数值在[min, max]范围内的百分比位置
 * @param {number} value - 当前值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 百分比(0-100)
 * @throws {Error} 当最大值小于等于最小值时抛出
 */
function calculatePosition(value: number, min: number, max: number): number {
  if (max <= min) {
    throw new Error('Invalid range: max must be greater than min')
  }
  const clamped = Math.min(Math.max(value, min), max) // 防止越界
  return ((clamped - min) / (max - min)) * 100
}

// 位置百分比
const sliderPosition = computed(() => calculatePosition(innerValue.value, props.min, props.max))

// 展示值（带单位）
const displayValue = computed(() => `${innerValue.value}${props.unit}`)

// 刻度数据
const labelsToShow = computed(() => props.labels)
</script>

<style scoped lang="scss">

.slider-container {
  position: relative;
  width: 100%;
}

.value-display {
  position: absolute;
  top: -3.0208vw;
  left: 0; /* 初始位置 */
  transform: translateX(-50%);
  background: #092991;
  color: #ffffff;
  padding: .4167vw .8333vw;
  border-radius: .5208vw;
  font-size: .8333vw;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  transition: left 0.2s ease;
  pointer-events: none;
  
  /* 添加小三角 */
  &::after {
    content: '';
    position: absolute;
    bottom: -0.4167vw; /* 三角形位置 */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 0.4167vw solid transparent;
    border-right: 0.4167vw solid transparent;
    border-top: 0.4167vw solid #092991; /* 与背景色相同 */
  }
}

.capacity-slider {
  margin-bottom: .625vw;
  width: 100%;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: .625vw;
  color: #6b7280;
  width: 100%;
}

.is-mob {
  .slider-container {
  position: relative;
  width: 100%;
}

.value-display {
  position: absolute;
  top: -45px;
  left: 0; /* 初始位置 */
  transform: translateX(-50%);
  background: #092991;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  transition: left 0.2s ease;
  pointer-events: none;
  
  /* 添加小三角 */
  &::after {
    content: '';
    position: absolute;
    bottom: -4px; /* 三角形位置 */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #092991; /* 与背景色相同 */
  }
}

.capacity-slider {
  margin-bottom: 10px;
  width: 100%;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
  width: 100%;
}
}
</style>



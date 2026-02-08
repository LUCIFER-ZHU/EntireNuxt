<template>
  <div class="faq-accordion">
    <h2 class="title">{{ title }}</h2>

    <UAccordion :items="accordionItems" :type="type" :collapsible="collapsible" :unmount-on-hide="unmountOnHide"
      :ui="{ item: 'ac-item', content: 'ac-content' }" v-model="activeValues">
      <!-- 1. 如何避免铸件报废 -->
      <template #avoid-scrapping>
        <div class="que-1">
          <h3 class="text-style-bold mb-2">Key parameter formula</h3>
          <p class="text-style-common mb-4">Clamping force (tons) ≥ projected area of the casting (cm²) × filling
            pressure (MPa) × safety factor (1.2-1.5)</p>
          <h3 class="text-style-bold mb-2">Action Guide</h3>
          <p class="text-style-common mb-2">Submit your casting drawings → Get a free precise selection report
            (including equipment parameters/process defect warnings)</p>
          <p class="text-style-common">Trial pouring service: Use our equipment to trial-produce 3 samples → Verify the
            actual pass rate</p>
        </div>
      </template>

      <!-- 2. 同吨位压铸机价格差异 -->
      <template #price-difference>
        <div class="que-2">
          <h3 class="text-style-bold mb-2">Total Cost of Ownership (TCO) calculator</h3>
          <p class="text-style-common mb-4">TCO = Equipment price + Energy consumption (electricity bill ×5 years) +
            spare parts wear and tear (average annual) + production halt loss (failure rate × daily output value)</p>
          <h3 class="text-style-bold mb-4">Data comparison</h3>
          <div class="overflow-x-auto">
            <!-- DIV表格 -->
            <div class="div-table">
              <!-- 表头行 -->
              <div class="table-header">
                <div class="th text-style-bold">Cost Item</div>
                <div class="th text-style-bold">Ordinary die-casting machine</div>
                <div class="th text-style-bold">MINNUO servo die-casting machine</div>
              </div>
              
              <!-- 数据行  -->
              <div class="table-row first-row">
                <div class="td text-style-bold">Five years of electricity bill</div>
                <div class="td text-style-common">$380,000</div>
                <div class="td text-style-common">$220,000 (↓42%)</div>
              </div>
              
              <!-- 数据行 - 无下边框 -->
              <div class="table-row">
                <div class="td text-style-bold">Production halt due to annual malfunction</div>
                <div class="td text-style-common">12 days</div>
                <div class="td text-style-common">*<3 days</div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 3. 砂型转压铸需要哪些改造 -->
      <template #sand-to-die-casting>
        <div class="que-3">
          <h3 class="text-style-bold mb-2">Four elements of process switching:</h3>
          <ul>
            <li class="text-style-common mb-1">• Metal runner design: Avoid air entrainment in molten aluminum (mold
              flow analysis software support required)</li>
            <li class="text-style-common mb-1">• Upgrade of the pressurization system: Terminal pressure ≥ 80MPa to
              ensure density</li>
            <li class="text-style-common mb-1">• Vacuum option: Cavity vacuum degree ≤ 50mbar reduces porosity</li>
            <li class="text-style-common">• Cooling rate control: ±1℃ accuracy to prevent thermal cracking</li>
          </ul>
        </div>
      </template>

      <!-- 4. 伺服节能是否是噱头 -->
      <template #servo-gimmick>
        <div class="que-4">
          <h3 class="text-style-bold mb-3">Measured energy consumption data (2800T cold chamber machine for car body
            production):</h3>
          <div class="overflow-x-auto">
            <!-- DIV表格 -->
            <div class="div-table servo-table">
              <!-- 表头行 -->
              <div class="table-header">
                <div class="th text-style-bold">Driver type</div>
                <div class="th text-style-bold">Energy consumption per unit</div>
                <div class="th text-style-bold">Noise</div>
                <div class="th text-style-bold">Hydraulic oil temperature</div>
              </div>
              
              <!-- 数据行  -->
              <div class="table-row first-row">
                <div class="td text-style-bold">Traditional quantitative pump</div>
                <div class="td text-style-common">4.2 kW·h</div>
                <div class="td text-style-common">89 dB</div>
                <div class="td text-style-common">58 +/− 5 ℃</div>
              </div>
              
              <!-- 数据行 - 无下边框 -->
              <div class="table-row">
                <div class="td text-style-bold">MINNUO servo</div>
                <div class="td text-style-common">2.3 kW·h</div>
                <div class="td text-style-common">81 dB</div>
                <div class="td text-style-common">45 +/− 1 ℃</div>
              </div>
              
              <div class="table-row">
                <div class="td text-style-bold">Power-saving principle: <br>Only supplies energy at the <br>moment of action, <br>eliminating no-load loss</div>
                <div class="td text-style-common">Energy consumption per unit</div>
                <div class="td text-style-common">Noise</div>
                <div class="td text-style-common">Hydraulic oil temperature</div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 5. EU CE 认证的关键要求 -->
      <template #eu-ce-requirements>
        <div class="que-5">
          <div class="certification-grid">
            <!-- 安全红线（第一行第一列） -->
            <div class="cert-item cert-safety">
              <h3 class="text-style-bold mb-2">Safety red line</h3>
            </div>
            
            <!-- 保护门（第二行第一列，与安全红线同列） -->
            <div class="cert-item cert-door">
              <h3 class="text-style-bold mb-2">Protective door</h3>
              <p class="text-style-common">10mm tempered glass + mechanical/photoelectric double lock (response ≤0.5s)</p>
            </div>
            
            <!-- 液压密封（第一行第二列，跨两行） -->
            <div class="cert-item cert-hydraulic">
              <h3 class="text-style-bold mb-2">Hydraulic seal</h3>
              <p class="text-style-common">The leakage rate after 72 hours of pressure holding is ≤0.1%</p>
            </div>
            
            <!-- 噪音（第一行第三列，跨两行） -->
            <div class="cert-item cert-noise">
              <h3 class="text-style-bold mb-2">Noise</h3>
              <p class="text-style-common">Operation bit ≤82dB(A)</p>
            </div>
          </div>
        </div>
      </template>

      <!-- 6. 投产后如何估算合格率 -->
      <template #yield-rate-estimate>
        <div class="que-6">
          <div class="yield-grid">
            <!-- 产量公式 -->
            <div class="yield-item">
              <h3 class="text-style-bold mb-2">Yield formula</h3>
              <p class="text-style-common">Yield rate = Material purity × process stability × equipment repeatability accuracy</p>
            </div>
            
            <!-- 铝液纯化 -->
            <div class="yield-item">
              <h3 class="text-style-bold mb-2">Aluminum liquid purification</h3>
              <p class="text-style-common">The hydrogen content in rotary degassing is ≤0.1ml/100g</p>
            </div>
            
            <!-- 工艺窗口 -->
            <div class="yield-item">
              <h3 class="text-style-bold mb-2">Process window</h3>
              <p class="text-style-common">Injection speed fluctuation ≤0.03m/s</p>
            </div>
            
            <!-- 闭环控制 -->
            <div class="yield-item">
              <h3 class="text-style-bold mb-2">Closed-loop control</h3>
              <p class="text-style-common">Position repeatability accuracy ±0.15mm</p>
            </div>
            
            <!-- 质量保证协议 -->
            <div class="yield-item">
              <h3 class="text-style-bold mb-2">Sign the quality guarantee agreement</h3>
              <p class="text-style-common">A full refund will be given if the yield rate in the first month of mass production is less than 95%</p>
            </div>
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AccordionItem } from '@nuxt/ui'

const props = withDefaults(defineProps<{ title?: string; type?: 'single' | 'multiple'; collapsible?: boolean; unmountOnHide?: boolean }>(), {
  title: 'Frequently Asked Questions',
  type: 'multiple',
  collapsible: true,
  unmountOnHide: true
})

/** accordionItems：仅 label/value/slot */
const accordionItems = ref<AccordionItem[]>([
  { label: 'How to avoid the scrapping of castings due to choosing the wrong equipment?', value: 'avoid-scrapping', slot: 'avoid-scrapping' },
  { label: 'The price difference of die-casting machines of the same tonnage can reach 40%. How to determine the true cost?', value: 'price-difference', slot: 'price-difference' },
  { label: 'If my product is to be transferred from sand casting to die casting, what equipment modifications are needed?', value: 'sand-to-die-casting', slot: 'sand-to-die-casting' },
  { label: 'Is the "servo energy-saving" feature of die-casting machines just a marketing gimmick?', value: 'servo-gimmick', slot: 'servo-gimmick' },
  { label: 'What are the fatal requirements for die-casting machines in the EU CE certification?', value: 'eu-ce-requirements', slot: 'eu-ce-requirements' },
  { label: 'How to estimate the yield rate after the equipment goes into production?', value: 'yield-rate-estimate', slot: 'yield-rate-estimate' }
])
/**
 * 默认全部展开的面板值数组
 * @description 所有手风琴项的 value，实现默认全部展开
 */
const activeValues = ref<string[]>([
  'avoid-scrapping',
  'price-difference',
  'sand-to-die-casting',
  'servo-gimmick',
  'eu-ce-requirements',
  'yield-rate-estimate'
])
</script>

<style scoped>
.faq-accordion {
  width: 100%;
  padding: 0 18.75vw 1.875vw;
  background: #F9F9FB;

  .title {
    font-weight: bold;
    font-size: 3.3333vw;
    color: #092991;
    line-height: 5vw;
    margin-bottom: 3.125vw;
  }
}

.text-style-bold {
  font-weight: bold;
  font-size: .9375vw;
  color: #020202;
}

.text-style-common {
  font-weight: 400;
  font-size: .8333vw;
  color: rgba(0, 0, 0, 0.6);
}

:deep(.ac-item) {
  margin-bottom: 1.5625vw;
  
  button {
    background: #092991;
    border-radius: 0vw 0vw 0vw 0vw;
    padding: 1.3021vw;
    color: #fff;
    font-weight: bold;
    font-size: 1.25vw;
    color: #FFFFFF;
    line-height: 1.875vw;
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

:deep(.ac-content) {
  background: #fff;
  padding: 2.0833vw 2.6042vw 1.8229vw;
}

/* DIV表格基础样式 */
.div-table {
  width: 100%;
  background-color: #F9F9FB;
  padding: 1vw;
  display: grid;
  
  /* 表头行 */
  .table-header {
    display: contents;
    
    .th {
      padding: 1vw;
      text-align: left;
      font-weight: 600;
      border-bottom: 1px solid #e5e7eb;
    }
  }
  
  /* 数据行 */
  .table-row {
    display: contents;
    
    .td {
      padding: 1vw;
      text-align: left;
      display: flex;
      align-items: center;
    }
  }
}

/* 针对不同表格的列设置 */
/* 价格差异表格 - 3列 */
.div-table {
  grid-template-columns: 1fr 1fr 1fr;
  
  /* 伺服节能表格 - 4列 */
  &.servo-table {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

/* 认证要求文本布局 */
.certification-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    'safety safety safety'
    'door   hydraulic noise';
  gap: 1.5625vw;
  background-color: #ffffff;
  border-radius: .625vw;

  .cert-item { h3 { margin-bottom: .5208vw; } }

  .cert-safety   { grid-area: safety; }
  .cert-door     { grid-area: door; }
  .cert-hydraulic{ grid-area: hydraulic; }
  .cert-noise    { grid-area: noise; }
}

/* 产量估算文本布局 */
.yield-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  gap: 1.5625vw;
  background-color: #ffffff;
  border-radius: .625vw;

  .yield-item { h3 { margin-bottom: .5208vw; } }

  /* 布局定位：
     第一行：Yield formula | Aluminum liquid purification | Process window
     第二行：Closed-loop control | Sign the quality guarantee agreement | (空)
  */
  .yield-item:nth-child(1) { grid-column: 1; grid-row: 1; }
  .yield-item:nth-child(2) { grid-column: 2; grid-row: 1; }
  .yield-item:nth-child(3) { grid-column: 3; grid-row: 1; }
  .yield-item:nth-child(4) { grid-column: 1; grid-row: 2; }
  .yield-item:nth-child(5) { grid-column: 2; grid-row: 2; }
}
</style>

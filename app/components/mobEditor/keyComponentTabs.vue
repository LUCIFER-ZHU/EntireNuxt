<template>
  <div class="key-component-tabs">
    <div class="title">
      Key Components of an Industrial Chiller Unit
    </div>
    <!-- 自定义标签页按钮 -->
    <div class="custom-tabs">
      <button v-for="item in tabItems" :key="item.value" :class="['tab-button', { 'active': activeTab === item.value }]"
        @click="activeTab = item.value as string">
        {{ item.label }}
      </button>
    </div>

    <!-- 自定义内容区域 -->
    <div class="tab-content mt-4">
      <!-- 根据活动标签显示相应内容 -->
      <div v-if="activeTab === 'low-temp'" class="tab-pane tab-pane-1">
        <div v-for="item in tabPane1Content" :key="item.title" class="box">
          <NuxtImg densities="1" :src="item.image" alt="icon" loading="lazy" />
          <div class="title">
            {{ item.title }}
          </div>
          <div class="content">
            {{ item.content }}
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'air-cooled'" class="tab-pane tab-pane-2">
        <div v-for="item in tabPane2Content" :key="item.title" class="box">
          <NuxtImg densities="1" :src="item.image" alt="icon" loading="lazy" />
          <div class="title">
            {{ item.title }}
          </div>
          <div class="content">
            {{ item.content }}
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'industrial'" class="tab-pane tab-pane-3">
        <div v-for="item in tabPane3Content" :key="item.title" class="box">
          <NuxtImg densities="1" :src="item.image" alt="icon" loading="lazy" />
          <div class="title">
            {{ item.title }}
          </div>
          <div class="content">
            {{ item.content }}
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'mtc'" class="tab-pane tab-pane-4">
        <div v-for="item in tabPane4Content" :key="item.title" class="box">
          <NuxtImg densities="1" :src="item.image" alt="icon" loading="lazy" />
          <div class="title">
            {{ item.title }}
          </div>
          <div class="content">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TabsItem } from '@nuxt/ui'

// 导入图片URL构建函数
const { buildImageUrl } = useImageUrl();

/**
 * 定义标签页项目数组
 * @type {TabsItem[]} 标签页配置项数组
 */
const tabItems: TabsItem[] = [
  {
    label: 'low-temp chiller',
    value: 'low-temp',
  },
  {
    label: 'air-cooled chiller',
    value: 'air-cooled',
  },
  {
    label: 'Water-cooled chiller',
    value: 'industrial',
  },
  {
    label: 'MTC',
    value: 'mtc',
  }
]

/**
 * 当前激活的标签页，默认设为第二个选项卡
 * @type {Ref<string>} 当前选中的标签页值
 */
const activeTab = ref('air-cooled')

/**
 * 第一标签页内容
 */
const tabPane1Content = ref([
  {
    image: buildImageUrl('image/img29.webp'),
    title: "Compound Compressor",
    content: "Utilizes internationally top-brand Linde multi-stage compression technology, specially designed for ultra-low temperature applications down to -60°C, ensuring stable power output under high pressure ratio conditions with reliable and efficient operation."
  },
  {
    image: buildImageUrl('image/img30.webp'),
    title: "Anti-freeze Evaporator",
    content: "Equipped with enhanced heat exchange channels and anti-freeze structural design, significantly improving the heat exchange efficiency of low-temperature refrigerants, ensuring stable cooling output under extreme operating conditions."
  },
  {
    image: buildImageUrl('image/img31.webp'),
    title: "High-efficiency Condenser System",
    content: "Features an optimized finned copper tube combination structure and high airflow fans, achieving efficient condensation of gaseous refrigerant and ensuring the long-term operation of the refrigeration cycle system."
  },
  {
    image: buildImageUrl('image/img32.webp'),
    title: "Expansion Throttle Valve",
    content: "Uses a stepping motor-driven precise flow regulation system, based on the superheat at the evaporator outlet, dynamically controls refrigerant flow to ensure stable evaporation pressure under low-temperature conditions, effectively preventing frost blockage."
  },
  {
    image: buildImageUrl('image/img33.webp'),
    title: "Low-temperature Circulation Pump",
    content: "Equipped with high-quality cold-resistant impellers and energy-efficient drive systems, adapted for stable circulation of low-temperature refrigerants like glycol, meeting flow requirements under different operating conditions."
  },
  {
    image: buildImageUrl('image/img34.webp'),
    title: "Cooling Fan",
    content: "Configured with low-noise, high-airflow dedicated fans, specifically improving condenser heat dissipation efficiency, significantly optimizing overall system energy performance and accelerating heat dissipation."
  },
  {
    image: buildImageUrl('image/img35.webp'),
    title: "Intelligent Electric Control Cabinet​",
    content: "Cabinet body features blue and white coloring. Internally filled with wiring and components. Integrates modular control circuits and multiple safety protection mechanisms, enabling real-time monitoring of key parameters such as temperature and pressure to ensure precise temperature control and system safety under low-temperature operating conditions."
  },
  {
    image: buildImageUrl('image/img36.webp'),
    title: "Thermal Insulation Pipeline Interface",
    content: "Pipe port materials are made of alloy with double-layer thermal insulation design, significantly reducing cold loss. Functional ports are clearly zoned with outlets, inlets, filling ports, and drain ports labeled clearly. Operation instructions and initial troubleshooting guidelines are attached."
  },
])

/**
 * 第二标签页内容
 */
const tabPane2Content = ref([
  {
    image: buildImageUrl('image/img10.webp'),
    title: 'Refrigeration compressor',
    content: 'It uses the internationally renowned Japanese Panasonic brand compressor to provide continuous and strong power support for the refrigeration cycle system, with high energy efficiency, low noise, reliability and durability.'
  },
  {
    image: buildImageUrl('image/img11.webp'),
    title: 'Water pump',
    content: 'Equipped with high-quality impellers and energy-saving motors, it can accurately drive the circulation of cooling water, adapt to different flow and pressure requirements, operate stably, and have low energy consumption, ensuring the continuous circulation of water.'
  },
  {
    image: buildImageUrl('image/img12.webp'),
    title: 'Coil evaporator',
    content: 'It uses high-efficiency heat exchange copper tubes and optimized flow channel design, with high heat exchange efficiency, which can quickly convert refrigeration potential into low-temperature power and accelerate water cooling.'
  },
  {
    image: buildImageUrl('image/img13.webp'),
    title: 'Condenser',
    content: 'It adopts a structure that combines high-efficiency heat exchange fins and copper tubes, and cooperates with the top fan to force heat dissipation, which can quickly condense the gaseous refrigerant into liquid and ensure the recycling of the refrigerant.'
  },
  {
    image: buildImageUrl('image/img14.webp'),
    title: 'Fan',
    content: 'Low noise, high air volume, targeted assistance to condenser heat dissipation, accelerated heat dissipation, and significantly improved condensation efficiency.'
  },
  {
    image: buildImageUrl('image/img15.webp'),
    title: 'Pipeline interface',
    content: 'The nozzles are made of a corrosion-resistant alloy and feature clear functional areas, with the outlet, return, inlet, and drain ports clearly marked. Operational instructions and basic troubleshooting instructions are also provided.'
  },
  {
    image: buildImageUrl('image/img16.webp'),
    title: 'Electric control cabinet',
    content: 'Equipped with high-quality electrical components and modular circuit design, it has high integration and precise control, can quickly respond to temperature adjustment needs, and ensure stable equipment temperature.'
  },
])

/**
 * 第三标签页内容
 */
const tabPane3Content = ref([
  {
    image: buildImageUrl('image/img21.webp'),
    title: 'Unit structure',
    content: 'The base is welded profile, the outer frame is formed steel, and the surface of the electric control box is treated with electrostatic spraying, which is bright and smooth. The adhesion, hardness and smoothness of the coating are all higher than the national standard.'
  },
  {
    image: buildImageUrl('image/img22.webp'),
    title: 'compressor',
    content: 'It uses screw compressors from internationally renowned brands (Taiwan Hanbell and Bitzer), and advanced asymmetric semi-hermetic screw compressors, which are low-carbon, energy-saving and environmentally friendly; they have good performance and low noise, and are 20~30% more energy-efficient than ordinary compressors.'
  },
  {
    image: buildImageUrl('image/img23.webp'),
    title: 'Condenser (water-cooled)',
    content: 'Efficient heat dissipation ensures refrigeration cycle, reduces compressor exhaust pressure and power consumption, improves the energy efficiency ratio of the chiller, and increases the unit COP by 5%-15%, ensuring stable operation of the unit in different seasons and working conditions.'
  },
  {
    image: buildImageUrl('image/img25.webp'),
    title: 'Control System',
    content: 'The Siemens microcomputer controller, a highly intelligent PLC, and PC-level computer control system with explosion-proof circuitry enable remote monitoring and control. Operation is simple, and the host and power supply are easily connected. The unit offers a low failure rate, a high safety factor, and simple installation. The system controls are intuitive and reliable, with real-time adjustments. The customizable language display and menu-driven buttons adjust the unit\'s operating status, creating a convenient operating environment.'
  },
  {
    image: buildImageUrl('image/img26.webp'),
    title: 'expansion valve',
    content: 'The expansion valve adopts the American Emerson external balanced thermal expansion valve, which can automatically adjust the refrigerant flow according to the changes in the system load to achieve automatic balance of system operation; other major refrigeration system components such as drying filters, solenoid valves, pressure gauges, etc. are all internationally renowned brands.'
  },
  {
    image: buildImageUrl('image/img27.webp'),
    title: 'evaporador',
    content: 'The evaporator\'s copper tubes utilize Japanese Kobe-made internal and external threaded reinforced tubes. The threads on the copper tubes create a smooth exterior for optimal cooling. The evaporator itself is insulated with 25mm thick PE insulation, preventing condensation and minimizing cooling loss. The result is a compact structure with stable performance.'
  },
  {
    image: buildImageUrl('image/img28.webp'),
    title: 'Protective device',
    content: 'The chiller protection system devices produced by our company include: explosion-proof device, temperature control switch, antifreeze switch fusible plug, high and low pressure switch, overload protector, compressor overheat protector, compressor frequent start protector and abnormal indicator light.'
  },
])

/**
 * 第四标签页内容
 */
const tabPane4Content = ref([
  {
    image: buildImageUrl('image/img37.webp'),
    title: "Mould temperature control machine",
    content: "The mold temperature controller achieves precise temperature control for molds by circulating a heat-conducting medium (water or oil). Its core functions include: improving product quality, reducing product defects. Shortening the molding cycle, stabilizing the production process, and avoiding quality fluctuations caused by temperature fluctuations."
  },
  {
    image: buildImageUrl('image/img38.webp'),
    title: "heating tube",
    content: "Upon energization, the resistance wire generates heat (converting electrical into thermal energy), heating the thermal medium (water/oil) flowing through the tube walls. The medium temperature can reach up to 400℃ (in oil-based thermal units). It delivers rapid temperature response, outputting heat within 10 seconds of startup to meet the fast warm-up demands of injection molding/die casting. The system maintains stable process temperatures through PID-controlled heating power adjustment with ±1% precision."
  },
  {
    image: buildImageUrl('image/img39.webp'),
    title: "circulating pump",
    content: "propels the thermal medium (water/oil) through a closed-loop circulation, enabling highly efficient heat transfer from the heating source to the mold."
  },
  {
    image: buildImageUrl('image/img40.webp'),
    title: "electron component",
    content: "‌Functioning as the temperature control system's nerve center, it achieves ±0.1℃ precision temperature control through a closed-loop process encompassing sensing, computing, and execution."
  },
  {
    image: buildImageUrl('image/img41.webp'),
    title: "control system",
    content: "Serving as the intelligent command center for the entire equipment, it achieves precise thermal regulation and safety interlocking through closed-loop operations across three phases: sensing, computing, and execution. Its functionality extends far beyond basic temperature control, delivering cascade benefits for product quality, energy efficiency, and equipment longevity."
  },
])


</script>

<style scoped lang="scss">
.key-component-tabs {
  width: 100%;
  padding: 6.6667vw 6.6667vw 6.4vw;

  >.title {
    font-weight: bold;
    font-size: 4.8vw;
    color: #000000;
    text-align: center;
  }
}

// 自定义标签页按钮样式
.custom-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 2rem 0;
  padding: 0 1rem;

  // 移动端适配
  @media (max-width: 768px) {
    gap: 0.8rem;
    margin: 1.5rem 0;
    padding: 0 0.5rem;
  }
}

.tab-button {
  border: 1px solid #000;
  background: #fff;
  color: #000;
  border-radius: 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  min-height: 18.6667vw;

  &.active {
    background: #092991;
    color: #fff;
    border-color: #092991;

    &:hover {
      background: #0a2a7a;
    }
  }
}

.tab-content {
  padding: 1rem 0;
  border-top: none;
}

.tab-pane {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(.2604vw);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-pane {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.6667vw 6.6667vw;

  .box {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .title {
      font-weight: bold;
      font-size: 2.9333vw;
      color: #000000;
      margin: 2.6667vw 0 1.3333vw;
    }

    .content {
      font-weight: 400;
      font-size: 2.6667vw;
      color: rgba(0, 0, 0, 0.6);
      line-height: 3.6vw;
    }
  }
}
</style>
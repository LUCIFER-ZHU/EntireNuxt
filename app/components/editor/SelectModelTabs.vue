<template>
  <div class="select-model-tabs">
    <div class="title">
      Select Your Model
    </div>
    <!-- 标签页选项卡 -->
    <UTabs v-model="activeTab" color="primary" variant="link" :content="false" :items="tabItems" :ui="{
      indicator: 'h-[.1042vw]'
    }" class="w-full chiller-tabs" />

    <!-- 自定义内容区域 -->
    <div class="tab-content mt-4">
      <!-- 根据活动标签显示相应内容 -->
      <div v-if="activeTab === '1'" class="tab-pane tab-pane-1">
        <div class="title">G1 Small diaphragm compressor</div>
        <div class="content">
          <NuxtImg densities="1" :src="buildImageUrl('image/img14.webp')" alt="icon" loading="lazy" />
          <ul>
            <li><b>Structure: </b> Z, L, P, D-type</li>
            <li><b>Lubrication: </b> splash</li>
            <li><b>Oil type: </b>compulsory oil supplement</li>
            <li><b>Cooling way: </b>water cooled or air cooled</li>
            <li><b>Maintenance maximum weight per piece: </b> 80kg</li>
            <li><b>Maintenance maximum space: </b>the circle shall be not less than 1 m</li>
          </ul>
        </div>
        <div class="table-box" v-if="!isMob()">
          <table class="tg">
            <thead>
              <tr>
                <th class="th-header" rowspan="2">Product Model</th>
                <th class="th-header">Volumetric Flow</th>
                <th class="th-header">Intake Pressure</th>
                <th class="th-header">Exhaust Pressure</th>
                <th class="th-header">Water Consumption</th>
                <th class="th-header">Crankshaft Speed</th>
                <th class="th-header">Motor Power</th>
                <th class="th-header">Dimension</th>
                <th class="th-header">Unit Weight</th>
              </tr>
              <tr>
                <th class="th-header">(Nm³/h)</th>
                <th class="th-header">(MPa(G))</th>
                <th class="th-header">(MPa(G))</th>
                <th class="th-header">(L/H)</th>
                <th class="th-header">(r/min)</th>
                <th class="th-header">(KW)</th>
                <th class="th-header">(L×W×H)（MM）</th>
                <th class="th-header">(KG)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="tg-66kk">GD0-3/200</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">ATM</td>
                <td class="tg-ftuc">20</td>
                <td class="tg-ftuc">/</td>
                <td class="tg-ftuc">750</td>
                <td class="tg-ftuc">2.2</td>
                <td class="tg-ftuc">600×500×400</td>
                <td class="tg-ftuc">200</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-5/200</td>
                <td class="tg-ftuc">5</td>
                <td class="tg-ftuc">ATM</td>
                <td class="tg-ftuc">20</td>
                <td class="tg-ftuc">300</td>
                <td class="tg-ftuc">600</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">550</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-10/13</td>
                <td class="tg-ftuc">10</td>
                <td class="tg-ftuc">ATM</td>
                <td class="tg-ftuc">1.3</td>
                <td class="tg-ftuc">300</td>
                <td class="tg-ftuc">600</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">550</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-10/13-200</td>
                <td class="tg-ftuc">10</td>
                <td class="tg-ftuc">1.3</td>
                <td class="tg-ftuc">20</td>
                <td class="tg-ftuc">300</td>
                <td class="tg-ftuc">600</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">550</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-5/1-160</td>
                <td class="tg-ftuc">5</td>
                <td class="tg-ftuc">0.1</td>
                <td class="tg-ftuc">16</td>
                <td class="tg-ftuc">300</td>
                <td class="tg-ftuc">450</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">550</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-10/4-160</td>
                <td class="tg-ftuc">10</td>
                <td class="tg-ftuc">0.4</td>
                <td class="tg-ftuc">16</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">600</td>
                <td class="tg-ftuc">4</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">520</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-8/2.5-160</td>
                <td class="tg-ftuc">8</td>
                <td class="tg-ftuc">0.25</td>
                <td class="tg-ftuc">16</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">520</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-10/6-160</td>
                <td class="tg-ftuc">10</td>
                <td class="tg-ftuc">0.6</td>
                <td class="tg-ftuc">15</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">4</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">520</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-5/6-200</td>
                <td class="tg-ftuc">5</td>
                <td class="tg-ftuc">0.6</td>
                <td class="tg-ftuc">20</td>
                <td class="tg-ftuc">300</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">520</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-10/6-160</td>
                <td class="tg-ftuc">10</td>
                <td class="tg-ftuc">0.6</td>
                <td class="tg-ftuc">16</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">4</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">520</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-5/13-400</td>
                <td class="tg-ftuc">5</td>
                <td class="tg-ftuc">1.3</td>
                <td class="tg-ftuc">40</td>
                <td class="tg-ftuc">300</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">500</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-15/10-150</td>
                <td class="tg-ftuc">15</td>
                <td class="tg-ftuc">1</td>
                <td class="tg-ftuc">15</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">450</td>
                <td class="tg-ftuc">4</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">520</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-10/7-320</td>
                <td class="tg-ftuc">10</td>
                <td class="tg-ftuc">0.7</td>
                <td class="tg-ftuc">32</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">450</td>
                <td class="tg-ftuc">4</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">520</td>
              </tr>
              <tr>
                <td class="tg-66kk">GL1-5/4-350</td>
                <td class="tg-ftuc">5</td>
                <td class="tg-ftuc">0.4</td>
                <td class="tg-ftuc">35</td>
                <td class="tg-ftuc">300</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">1350×600×950</td>
                <td class="tg-ftuc">520</td>
              </tr>
              <tr>
                <td class="tg-66kk">GZ1-5/13</td>
                <td class="tg-ftuc">5</td>
                <td class="tg-ftuc">ATM</td>
                <td class="tg-ftuc">1.3</td>
                <td class="tg-ftuc">200</td>
                <td class="tg-ftuc">450</td>
                <td class="tg-ftuc">1.5</td>
                <td class="tg-ftuc">1100×600×950</td>
                <td class="tg-ftuc">450</td>
              </tr>
              <tr>
                <td class="tg-66kk">GZ1-5/13-200</td>
                <td class="tg-ftuc">5</td>
                <td class="tg-ftuc">1.3</td>
                <td class="tg-ftuc">20</td>
                <td class="tg-ftuc">200</td>
                <td class="tg-ftuc">450</td>
                <td class="tg-ftuc">1.5</td>
                <td class="tg-ftuc">1100×600×950</td>
                <td class="tg-ftuc">420</td>
              </tr>
              <tr>
                <td class="tg-66kk">GZ1-5/30-400</td>
                <td class="tg-ftuc">5</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">40</td>
                <td class="tg-ftuc">300</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">1100×600×950</td>
                <td class="tg-ftuc">400</td>
              </tr>
              <tr>
                <td class="tg-66kk">GZ1-70/30-35</td>
                <td class="tg-ftuc">70</td>
                <td class="tg-ftuc">3</td>
                <td class="tg-ftuc">3.5</td>
                <td class="tg-ftuc">200</td>
                <td class="tg-ftuc">400</td>
                <td class="tg-ftuc">4</td>
                <td class="tg-ftuc">1100×600×950</td>
                <td class="tg-ftuc">420</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === '2'" class="tab-pane tab-pane-2">
        <div class="title">G2 Medium-sized diaphragm compressor</div>
        <div class="content">
          <NuxtImg densities="1" :src="buildImageUrl('image/img15.webp')" alt="icon" loading="lazy" />
          <ul>
            <li><b>Structure: </b> Z, L, P, D-type</li>
            <li><b>Lubrication: </b> splash</li>
            <li><b>Oil type: </b>compulsory oil supplement</li>
            <li><b>Cooling way: </b>water cooled or air cooled</li>
            <li><b>Maintenance maximum weight per piece: </b> 100kg</li>
            <li><b>Maintenance maximum space: </b>the circle shall be not less than 1 m</li>
          </ul>
        </div>
        <div class="table-box" v-if="!isMob()">
          <table class="tg">
            <thead>
              <tr>
                <th class="tg-ev7g" rowspan="2">Product Model</th>
                <th class="tg-ev7g">Volumetric flow</th>
                <th class="tg-ev7g">Intake pressure</th>
                <th class="tg-ev7g">Exhaust pressure</th>
                <th class="tg-ev7g">Water consumption</th>
                <th class="tg-ev7g">Crankshaft speed</th>
                <th class="tg-ev7g">Motor power</th>
                <th class="tg-ev7g">Dimension</th>
                <th class="tg-ev7g">Unit weight</th>
              </tr>
              <tr>
                <th class="tg-ev7g">Nm3/h</th>
                <th class="tg-ev7g">MPa(G)</th>
                <th class="tg-ev7g">MPa(G)</th>
                <th class="tg-ev7g">L/H</th>
                <th class="tg-ev7g">r/min</th>
                <th class="tg-ev7g">KW</th>
                <th class="tg-ev7g">L×W×H(MM)</th>
                <th class="tg-ev7g">KG</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="tg-n0xs">GL2-20/200</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">ATM</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">700</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">7.5</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">1100</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GL2-40/13</td>
                <td class="tg-wman">40</td>
                <td class="tg-wman">ATM</td>
                <td class="tg-wman">1.3</td>
                <td class="tg-wman">700</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">7.5</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">1200</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GL2-40/13-200</td>
                <td class="tg-wman">40</td>
                <td class="tg-wman">1.3</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">700</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">7.5</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">1000</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GL2-25/1-160</td>
                <td class="tg-wman">25</td>
                <td class="tg-wman">0.1</td>
                <td class="tg-wman">16</td>
                <td class="tg-wman">1000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">11</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">1100</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GL2-40/4-160</td>
                <td class="tg-wman">40</td>
                <td class="tg-wman">0.4</td>
                <td class="tg-wman">16</td>
                <td class="tg-wman">1000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">11</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">1050</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GL2-50/7-160</td>
                <td class="tg-wman">50</td>
                <td class="tg-wman">0.7</td>
                <td class="tg-wman">16</td>
                <td class="tg-wman">1200</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">11</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">1000</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GL2-40/7-320</td>
                <td class="tg-wman">40</td>
                <td class="tg-wman">0.7</td>
                <td class="tg-wman">32</td>
                <td class="tg-wman">1200</td>
                <td class="tg-wman">420</td>
                <td class="tg-wman">11</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">900</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GL2-60/12-160</td>
                <td class="tg-wman">60</td>
                <td class="tg-wman">1.2</td>
                <td class="tg-wman">16</td>
                <td class="tg-wman">1000</td>
                <td class="tg-wman">360</td>
                <td class="tg-wman">11</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">900</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GL2-40/13-400</td>
                <td class="tg-wman">40</td>
                <td class="tg-wman">1.3</td>
                <td class="tg-wman">40</td>
                <td class="tg-wman">1000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">11</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">900</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GL2-30/4-350</td>
                <td class="tg-wman">30</td>
                <td class="tg-wman">0.4</td>
                <td class="tg-wman">35</td>
                <td class="tg-wman">1000</td>
                <td class="tg-wman">420</td>
                <td class="tg-wman">11</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">900</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD2-60/30-400</td>
                <td class="tg-wman">60</td>
                <td class="tg-wman">3</td>
                <td class="tg-wman">40</td>
                <td class="tg-wman">1200</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">11</td>
                <td class="tg-wman">1700×850×1150</td>
                <td class="tg-wman">850</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GL2-15/350</td>
                <td class="tg-wman">15</td>
                <td class="tg-wman">0</td>
                <td class="tg-wman">35</td>
                <td class="tg-wman">1500</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">18.5</td>
                <td class="tg-wman">1700×1200×1150</td>
                <td class="tg-wman">1500</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GZ2-10/10-150</td>
                <td class="tg-wman">10</td>
                <td class="tg-wman">1</td>
                <td class="tg-wman">15</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">420</td>
                <td class="tg-wman">4</td>
                <td class="tg-wman">1400×850×1150</td>
                <td class="tg-wman">800</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GZ2-15/13</td>
                <td class="tg-wman">15</td>
                <td class="tg-wman">ATM</td>
                <td class="tg-wman">1.3</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">4</td>
                <td class="tg-wman">1400×850×1150</td>
                <td class="tg-wman">800</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GZ2-15/13-200</td>
                <td class="tg-wman">15</td>
                <td class="tg-wman">1.3</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">4</td>
                <td class="tg-wman">1400×850×1150</td>
                <td class="tg-wman">750</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === '3'" class="tab-pane tab-pane-3">
        <div class="title">G3 Medium-sized diaphragm compressor</div>
        <div class="content">
          <NuxtImg densities="1" :src="buildImageUrl('image/img16.webp')" alt="icon" loading="lazy" />
          <ul>
            <li><b>Structure: </b> Z, L,V, P, D-type</li>
            <li><b>Lubrication: </b> splash</li>
            <li><b>Oil type: </b>compulsory oil supplement</li>
            <li><b>Cooling way: </b>water cooled or air cooled</li>
            <li><b>Maintenance maximum weight per piece: </b> 800kg</li>
            <li><b>Maintenance maximum space: </b>the circle shall be not less than 1.5 m</li>
          </ul>
        </div>
        <div class="table-box" v-if="!isMob()">
          <table class="tg">
            <thead>
              <tr>
                <th class="tg-ev7g" rowspan="2">Product Model</th>
                <th class="tg-ev7g">Volumetric flow</th>
                <th class="tg-ev7g">Intake pressure</th>
                <th class="tg-ev7g">Exhaust pressure</th>
                <th class="tg-ev7g">Water consumption</th>
                <th class="tg-ev7g">Crankshaft speed</th>
                <th class="tg-ev7g">Motor power</th>
                <th class="tg-ev7g">Dimension</th>
                <th class="tg-ev7g">Unit weight</th>
              </tr>
              <tr>
                <th class="tg-ag0s">Nm³/h</th>
                <th class="tg-ag0s">MPa(G)</th>
                <th class="tg-ag0s">MPa(G)</th>
                <th class="tg-ag0s">L/H</th>
                <th class="tg-ag0s">r/min</th>
                <th class="tg-ag0s">KW</th>
                <th class="tg-ag0s">L×W×H（MM）</th>
                <th class="tg-ag0s">KG</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="tg-kakf">GL3-60/200</td>
                <td class="tg-wman">60</td>
                <td class="tg-wman">ATM</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">1600</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">30</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">5500</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL2-40/13</td>
                <td class="tg-wman">120</td>
                <td class="tg-wman">ATM</td>
                <td class="tg-wman">1.3</td>
                <td class="tg-wman">1600</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">30</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">5000</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL3-110/20-200</td>
                <td class="tg-wman">110</td>
                <td class="tg-wman">2</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">1600</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">30</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">4000</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL3-75/20</td>
                <td class="tg-wman">75</td>
                <td class="tg-wman">ATM</td>
                <td class="tg-wman">2</td>
                <td class="tg-wman">4000</td>
                <td class="tg-wman">450</td>
                <td class="tg-wman">45</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">5500</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL3-50/5-160</td>
                <td class="tg-wman">50</td>
                <td class="tg-wman">0.5</td>
                <td class="tg-wman">16</td>
                <td class="tg-wman">2000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">30</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">4200</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL3-150/10-160</td>
                <td class="tg-wman">150</td>
                <td class="tg-wman">1</td>
                <td class="tg-wman">16</td>
                <td class="tg-wman">3500</td>
                <td class="tg-wman">360</td>
                <td class="tg-wman">37</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">4200</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL3-80/7-320</td>
                <td class="tg-wman">80</td>
                <td class="tg-wman">0.7</td>
                <td class="tg-wman">32</td>
                <td class="tg-wman">2500</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">30</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">4000</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL3-180/12-160</td>
                <td class="tg-wman">180</td>
                <td class="tg-wman">1.2</td>
                <td class="tg-wman">16</td>
                <td class="tg-wman">3500</td>
                <td class="tg-wman">360</td>
                <td class="tg-wman">37</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">4200</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL3-120/13-400</td>
                <td class="tg-wman">120</td>
                <td class="tg-wman">1.3</td>
                <td class="tg-wman">40</td>
                <td class="tg-wman">3000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">37</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">4000</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL3-80/4-350</td>
                <td class="tg-wman">80</td>
                <td class="tg-wman">0.4</td>
                <td class="tg-wman">35</td>
                <td class="tg-wman">3000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">30</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">4200</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL3-800/300-700</td>
                <td class="tg-wman">800</td>
                <td class="tg-wman">30</td>
                <td class="tg-wman">70</td>
                <td class="tg-wman">5000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">55</td>
                <td class="tg-wman">3600×2400×2000</td>
                <td class="tg-wman">6000</td>
              </tr>
              <tr>
                <td class="tg-kakf">GL3-200/20-200</td>
                <td class="tg-wman">200</td>
                <td class="tg-wman">2</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">3000</td>
                <td class="tg-wman">360</td>
                <td class="tg-wman">37</td>
                <td class="tg-wman">2800×1600×2000</td>
                <td class="tg-wman">4200</td>
              </tr>
              <tr>
                <td class="tg-kakf">GZ3-50/10-150</td>
                <td class="tg-wman">50</td>
                <td class="tg-wman">1</td>
                <td class="tg-wman">15</td>
                <td class="tg-wman">1000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">11</td>
                <td class="tg-wman">2400×1400×2000</td>
                <td class="tg-wman">3500</td>
              </tr>
              <tr>
                <td class="tg-kakf">GZ3-60/13</td>
                <td class="tg-wman">60</td>
                <td class="tg-wman">ATM</td>
                <td class="tg-wman">1.3</td>
                <td class="tg-wman">1000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">15</td>
                <td class="tg-wman">2400×1400×2000</td>
                <td class="tg-wman">3600</td>
              </tr>
              <tr>
                <td class="tg-kakf">GZ3-60/13-200</td>
                <td class="tg-wman">60</td>
                <td class="tg-wman">1.3</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">1000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">15</td>
                <td class="tg-wman">2400×1400×2000</td>
                <td class="tg-wman">3500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === '4'" class="tab-pane tab-pane-4">
        <div class="title">G4 Medium-sized diaphragm compressor (compact structure)</div>
        <div class="content">
          <NuxtImg densities="1" :src="buildImageUrl('image/img17.webp')" alt="icon" loading="lazy" />
          <ul>
            <li><b>Structure: </b> D-type (two, three, four cylinders)</li>
            <li><b>Lubrication: </b> splash</li>
            <li><b>Oil type: </b>compulsory oil supplement</li>
            <li><b>Cooling way: </b>water cooled</li>
            <li><b>Maintenance maximum weight per piece: </b> 1000kg</li>
            <li><b>Maintenance maximum space: </b>the circle shall be not less than 1.5 m</li>
          </ul>
        </div>
        <div class="table-box" v-if="!isMob()">
          <table class="tg">
            <thead>
              <tr>
                <th class="tg-3c7h" rowspan="2">Product Model</th>
                <th class="tg-3c7h">Volumetric flow</th>
                <th class="tg-3c7h">Intake pressure</th>
                <th class="tg-3c7h">Exhaust pressure</th>
                <th class="tg-3c7h">Water consumption</th>
                <th class="tg-3c7h">Crankshaft speed</th>
                <th class="tg-3c7h">Motor power</th>
                <th class="tg-3c7h">Dimension</th>
                <th class="tg-3c7h">Unit weight</th>
              </tr>
              <tr>
                <th class="tg-3c7h">Nm³/h</th>
                <th class="tg-3c7h">MPa(G)</th>
                <th class="tg-3c7h">MPa(G)</th>
                <th class="tg-3c7h">L/H</th>
                <th class="tg-3c7h">r/min</th>
                <th class="tg-3c7h">KW</th>
                <th class="tg-3c7h">L×W×H（MM）</th>
                <th class="tg-3c7h">T</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="tg-n0xs">GD4-90/200</td>
                <td class="tg-wman">90</td>
                <td class="tg-wman">ATM</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">3200</td>
                <td class="tg-wman">430</td>
                <td class="tg-wman">45</td>
                <td class="tg-wman">4000×2850×2000</td>
                <td class="tg-wman">10.8</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-100/160</td>
                <td class="tg-wman">100</td>
                <td class="tg-wman">ATM</td>
                <td class="tg-wman">16</td>
                <td class="tg-wman">3700</td>
                <td class="tg-wman">430</td>
                <td class="tg-wman">45</td>
                <td class="tg-wman">4000×2850×2000</td>
                <td class="tg-wman">10.8</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-240/16-300</td>
                <td class="tg-wman">240</td>
                <td class="tg-wman">1.6</td>
                <td class="tg-wman">30</td>
                <td class="tg-wman">4700</td>
                <td class="tg-wman">360</td>
                <td class="tg-wman">55</td>
                <td class="tg-wman">3800×2600×1800</td>
                <td class="tg-wman">8.5</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-240/6-150</td>
                <td class="tg-wman">240</td>
                <td class="tg-wman">0.6</td>
                <td class="tg-wman">15</td>
                <td class="tg-wman">5000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">55</td>
                <td class="tg-wman">3800×2600×1800</td>
                <td class="tg-wman">9</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-300/15-210</td>
                <td class="tg-wman">300</td>
                <td class="tg-wman">1.5</td>
                <td class="tg-wman">21</td>
                <td class="tg-wman">5300</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">75</td>
                <td class="tg-wman">3800×2600×1800</td>
                <td class="tg-wman">9.5</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-800/12-40</td>
                <td class="tg-wman">800</td>
                <td class="tg-wman">1.2</td>
                <td class="tg-wman">4</td>
                <td class="tg-wman">5400</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">75</td>
                <td class="tg-wman">3800×2600×1800</td>
                <td class="tg-wman">9.2</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-200/15-350</td>
                <td class="tg-wman">200</td>
                <td class="tg-wman">1.5</td>
                <td class="tg-wman">3.5</td>
                <td class="tg-wman">4600</td>
                <td class="tg-wman">360</td>
                <td class="tg-wman">55</td>
                <td class="tg-wman">3800×2600×1800</td>
                <td class="tg-wman">9</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-300/5-52</td>
                <td class="tg-wman">300</td>
                <td class="tg-wman">0.5</td>
                <td class="tg-wman">5.2</td>
                <td class="tg-wman">4800</td>
                <td class="tg-wman">430</td>
                <td class="tg-wman">55</td>
                <td class="tg-wman">3800×2600×1800</td>
                <td class="tg-wman">9</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-870/11-31</td>
                <td class="tg-wman">870</td>
                <td class="tg-wman">1.1</td>
                <td class="tg-wman">3.1</td>
                <td class="tg-wman">5000</td>
                <td class="tg-wman">420</td>
                <td class="tg-wman">55</td>
                <td class="tg-wman">3800×2850×2000</td>
                <td class="tg-wman">9.5</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-240/5-140</td>
                <td class="tg-wman">240</td>
                <td class="tg-wman">0.5</td>
                <td class="tg-wman">14</td>
                <td class="tg-wman">5000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">55</td>
                <td class="tg-wman">3800×2600×1800</td>
                <td class="tg-wman">9</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-225/9-200</td>
                <td class="tg-wman">225</td>
                <td class="tg-wman">0.9</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">5000</td>
                <td class="tg-wman">420</td>
                <td class="tg-wman">55</td>
                <td class="tg-wman">3800×2600×1800</td>
                <td class="tg-wman">9.5</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-300/5-52</td>
                <td class="tg-wman">300</td>
                <td class="tg-wman">0.5</td>
                <td class="tg-wman">5.2</td>
                <td class="tg-wman">5000</td>
                <td class="tg-wman">430</td>
                <td class="tg-wman">55</td>
                <td class="tg-wman">3800×2600×1800</td>
                <td class="tg-wman">9.5</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-280/0.18-5</td>
                <td class="tg-wman">280</td>
                <td class="tg-wman">0.018</td>
                <td class="tg-wman">0.5</td>
                <td class="tg-wman">4000</td>
                <td class="tg-wman">420</td>
                <td class="tg-wman">45</td>
                <td class="tg-wman">4200×2600×2100</td>
                <td class="tg-wman">15</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-240/0,24-6.17</td>
                <td class="tg-wman">240</td>
                <td class="tg-wman">0.024</td>
                <td class="tg-wman">0.617</td>
                <td class="tg-wman">4000</td>
                <td class="tg-wman">420</td>
                <td class="tg-wman">45</td>
                <td class="tg-wman">4200×2600×2100</td>
                <td class="tg-wman">14</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD4-300/10-250</td>
                <td class="tg-wman">300</td>
                <td class="tg-wman">1</td>
                <td class="tg-wman">25</td>
                <td class="tg-wman">5500</td>
                <td class="tg-wman">420</td>
                <td class="tg-wman">75</td>
                <td class="tg-wman">3800×2600×1800</td>
                <td class="tg-wman">9.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === '5'" class="tab-pane tab-pane-5">
        <div class="title">G5 Super-large diaphragm compressor</div>
        <div class="content">
          <NuxtImg densities="1" :src="buildImageUrl('image/img18.webp')" alt="icon" loading="lazy" />
          <ul>
            <li><b>Structure: </b> D-type (two, three, four cylinders)</li>
            <li><b>Lubrication: </b> splash</li>
            <li><b>Oil type: </b>compulsory oil supplement</li>
            <li><b>Cooling way: </b>water cooled</li>
            <li><b>Maintenance maximum weight per piece: </b> 1500kg</li>
            <li><b>Maintenance maximum space: </b>the circle shall be not less than 1.5 m</li>
          </ul>
        </div>
        <div class="table-box" v-if="!isMob()">
          <table class="tg">
            <thead>
              <tr>
                <th class="tg-3c7h" rowspan="2">Product Model</th>
                <th class="tg-3c7h">Volumetric flow</th>
                <th class="tg-3c7h">Intake pressure</th>
                <th class="tg-3c7h">Exhaust pressure</th>
                <th class="tg-3c7h">Water consumption</th>
                <th class="tg-3c7h">Crankshaft speed</th>
                <th class="tg-3c7h">Motor power</th>
                <th class="tg-3c7h">Dimension</th>
                <th class="tg-3c7h">Unit weight</th>
              </tr>
              <tr>
                <th class="tg-3c7h">Nm³/h</th>
                <th class="tg-3c7h">MPa(G)</th>
                <th class="tg-3c7h">MPa(G)</th>
                <th class="tg-3c7h">L/H</th>
                <th class="tg-3c7h">r/min</th>
                <th class="tg-3c7h">KW</th>
                <th class="tg-3c7h">L×W×H(MM)</th>
                <th class="tg-3c7h">T</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="tg-n0xs">GD5-150/200</td>
                <td class="tg-wman">150</td>
                <td class="tg-wman">ATM</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">7000</td>
                <td class="tg-wman">430</td>
                <td class="tg-wman">90</td>
                <td class="tg-wman">4400×2850×2200</td>
                <td class="tg-wman">13</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-525/6-200</td>
                <td class="tg-wman">525</td>
                <td class="tg-wman">0.6</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">12000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">132</td>
                <td class="tg-wman">3800×2700×2000</td>
                <td class="tg-wman">10.8</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-250/0.3-12</td>
                <td class="tg-wman">250</td>
                <td class="tg-wman">0.03</td>
                <td class="tg-wman">1.2</td>
                <td class="tg-wman">4700</td>
                <td class="tg-wman">375</td>
                <td class="tg-wman">55</td>
                <td class="tg-wman">4200×2900×1800</td>
                <td class="tg-wman">14</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-2900/45-120</td>
                <td class="tg-wman">2900</td>
                <td class="tg-wman">4.5</td>
                <td class="tg-wman">12</td>
                <td class="tg-wman">13200</td>
                <td class="tg-wman">429</td>
                <td class="tg-wman">160</td>
                <td class="tg-wman">4000×2900×2450</td>
                <td class="tg-wman">16</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-9000/78-83</td>
                <td class="tg-wman">9000</td>
                <td class="tg-wman">7.8</td>
                <td class="tg-wman">8.3</td>
                <td class="tg-wman">3700</td>
                <td class="tg-wman">450</td>
                <td class="tg-wman">45</td>
                <td class="tg-wman">3800×2600×2500</td>
                <td class="tg-wman">15</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-1300/45-220</td>
                <td class="tg-wman">1300</td>
                <td class="tg-wman">4.5</td>
                <td class="tg-wman">22</td>
                <td class="tg-wman">13500</td>
                <td class="tg-wman">429</td>
                <td class="tg-wman">160</td>
                <td class="tg-wman">4000×2900×2450</td>
                <td class="tg-wman">16</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-8000/235-250</td>
                <td class="tg-wman">8000</td>
                <td class="tg-wman">23.5</td>
                <td class="tg-wman">25</td>
                <td class="tg-wman">3800</td>
                <td class="tg-wman">429</td>
                <td class="tg-wman">45</td>
                <td class="tg-wman">3800×2600×2500</td>
                <td class="tg-wman">15</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-500/0.8-10</td>
                <td class="tg-wman">500</td>
                <td class="tg-wman">0.08</td>
                <td class="tg-wman">1</td>
                <td class="tg-wman">6800</td>
                <td class="tg-wman">429</td>
                <td class="tg-wman">75</td>
                <td class="tg-wman">4400×2850×2200</td>
                <td class="tg-wman">16</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-500/10-200</td>
                <td class="tg-wman">500</td>
                <td class="tg-wman">1</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">12000</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">132</td>
                <td class="tg-wman">3700×2750×2000</td>
                <td class="tg-wman">10</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-550/17-200</td>
                <td class="tg-wman">550</td>
                <td class="tg-wman">1.7</td>
                <td class="tg-wman">20</td>
                <td class="tg-wman">9500</td>
                <td class="tg-wman">400</td>
                <td class="tg-wman">110</td>
                <td class="tg-wman">3700×2750×2000</td>
                <td class="tg-wman">10</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-1080/5-31.5</td>
                <td class="tg-wman">1080</td>
                <td class="tg-wman">0.5</td>
                <td class="tg-wman">3.15</td>
                <td class="tg-wman">12000</td>
                <td class="tg-wman">429</td>
                <td class="tg-wman">132</td>
                <td class="tg-wman">4400×2850×2200</td>
                <td class="tg-wman">14</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-500/0.7-23</td>
                <td class="tg-wman">500</td>
                <td class="tg-wman">0.07</td>
                <td class="tg-wman">2.3</td>
                <td class="tg-wman">9500</td>
                <td class="tg-wman">429</td>
                <td class="tg-wman">110</td>
                <td class="tg-wman">4400×2850×2200</td>
                <td class="tg-wman">14</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-600/15-350</td>
                <td class="tg-wman">600</td>
                <td class="tg-wman">1.5</td>
                <td class="tg-wman">35</td>
                <td class="tg-wman">12800</td>
                <td class="tg-wman">429</td>
                <td class="tg-wman">160</td>
                <td class="tg-wman">4000×2850×2100</td>
                <td class="tg-wman">12</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-4500/185-190</td>
                <td class="tg-wman">4500</td>
                <td class="tg-wman">18.5</td>
                <td class="tg-wman">19</td>
                <td class="tg-wman">5000</td>
                <td class="tg-wman">420</td>
                <td class="tg-wman">45</td>
                <td class="tg-wman">3800×2600×2500</td>
                <td class="tg-wman">15</td>
              </tr>
              <tr>
                <td class="tg-n0xs">GD5-1000/15-180</td>
                <td class="tg-wman">1000</td>
                <td class="tg-wman">1.5</td>
                <td class="tg-wman">18</td>
                <td class="tg-wman">15000</td>
                <td class="tg-wman">420</td>
                <td class="tg-wman">160</td>
                <td class="tg-wman">4000×2850×2100</td>
                <td class="tg-wman">12</td>
              </tr>
            </tbody>
          </table>
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
    label: 'G1 Series',
    value: '1',
  },
  {
    label: 'G2 Series',
    value: '2',
  },
  {
    label: 'G3 Series',
    value: '3',
  },
  {
    label: 'G4 Series',
    value: '4',
  },
  {
    label: 'G5 Series',
    value: '5',
  },
]

/**
 * 当前激活的标签页，默认设为第二个选项卡
 * @type {Ref<string>} 当前选中的标签页值
 */
const activeTab = ref('1')

// 使用设备检测组合函数
const { isMob } = useDeviceDetection()
</script>

<style scoped lang="scss">
.select-model-tabs {
  width: 100%;
  padding: 4.4271vw 14.8021vw;

  >.title {
    font-weight: bold;
    font-size: clamp(12px, 2.5vw, 2.5vw);
    color: #020202;
    margin-bottom: 2.3438vw;
  }
}

.chiller-tabs :deep(.flex) {
  justify-content: flex-start;
  gap: 1rem;
  border-bottom: none;

  button {
    font-size: clamp(12px, .9375vw, .9375vw);

    &[data-state="active"] {
      font-weight: bold;
    }
  }
}

.tab-content {
  padding: 1rem 0;
  border-top: none;
}

.tab-pane {
  animation: fadeIn 0.3s ease-in-out;

  .title {
    font-weight: bold;
    font-size: clamp(12px, 1.25vw, 1.25vw);
    color: #020202;
    margin-bottom: 3.2813vw;
  }

  .content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5.2083vw;
    margin-bottom: 5.2083vw;

    img {
      width: 31.25vw;
      height: 20.8333vw;
      border-radius: 12px;
    }

    ul {
      li {
        font-size: clamp(12px, .8333vw, .8333vw);
        color: rgba(0, 0, 0, 0.60);
        margin-bottom: 1.0417vw;

        b{
          color: #020202;          
        }
      }
    }
  }
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

.table-box {
  font-size: clamp(10px, .7292vw, .7292vw);
  font-weight: bold;

  table {
    width: 100%;
  }

  thead {
    tr {
      th {
        padding: 10px;
        background: #072D72;
        color: #fff;
      }
    }
  }

  tbody {
    tr {
      &:nth-child(even) {
        background: rgba(16, 75, 212, 0.04);
      }

      &:hover {
        background: #e1e4f0;
      }

      td {
        text-align: center;
        padding: 10px;
      }
    }
  }

}
</style>
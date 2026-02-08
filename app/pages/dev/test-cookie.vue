<template>
    <div class="test-cookie-page">
        <h1>Cookie Consent 测试页面</h1>
        
        <section class="test-section">
            <h2>测试按钮</h2>
            <div class="button-grid">
                <!-- 使用自定义组件 -->
                <CookieSettingsButton :show-text="true" />
                
                <!-- 使用 data-cc 属性 -->
                <button type="button" data-cc="show-preferencesModal" class="test-btn">
                    打开 Cookie 偏好设置
                </button>
                
                <button type="button" @click="showPreferencesManually" class="test-btn">
                    通过 API 打开偏好设置
                </button>
                
                <button type="button" @click="checkConsent" class="test-btn">
                    检查当前同意状态
                </button>
                
                <button type="button" @click="acceptAllCookies" class="test-btn success">
                    接受所有 Cookie
                </button>
                
                <button type="button" @click="rejectAllCookies" class="test-btn danger">
                    拒绝所有非必要 Cookie
                </button>
                
                <button type="button" @click="clearConsent" class="test-btn warning">
                    清除同意设置（重置）
                </button>
            </div>
        </section>
        
        <section class="test-section">
            <h2>当前状态</h2>
            <div class="status-box">
                <pre>{{ consentStatus }}</pre>
            </div>
        </section>
        
        <section class="test-section">
            <h2>使用说明</h2>
            <ol class="instructions">
                <li>首次访问页面时，会在右下角显示 Cookie 同意弹窗</li>
                <li>点击"接受全部"或"仅必要"按钮进行选择</li>
                <li>点击"管理偏好设置"可以自定义 Cookie 类别</li>
                <li>使用上方的测试按钮来测试各项功能</li>
                <li>点击"清除同意设置"可以重置，然后刷新页面重新测试</li>
            </ol>
        </section>
        
        <section class="test-section">
            <h2>集成示例</h2>
            <div class="code-example">
                <h3>在页脚添加 Cookie 设置链接：</h3>
                <pre><code>&lt;a href="#" data-cc="show-preferencesModal"&gt;Cookie 设置&lt;/a&gt;</code></pre>
                
                <h3>使用自定义组件：</h3>
                <pre><code>&lt;CookieSettingsButton :show-text="true" /&gt;</code></pre>
                
                <h3>通过 API 控制：</h3>
                <pre><code>const { $cookieConsent } = useNuxtApp();
$cookieConsent.showPreferences();</code></pre>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const consentStatus = ref('未加载');

onMounted(() => {
    updateConsentStatus();
});

const showPreferencesManually = () => {
    const { $cookieConsent } = useNuxtApp();
    $cookieConsent.showPreferences();
};

const checkConsent = () => {
    updateConsentStatus();
    alert('当前同意状态已更新，请查看下方状态显示');
};

const acceptAllCookies = () => {
    const { $cookieConsent } = useNuxtApp();
    $cookieConsent.acceptCategory('all');
    setTimeout(updateConsentStatus, 100);
};

const rejectAllCookies = () => {
    const { $cookieConsent } = useNuxtApp();
    $cookieConsent.acceptCategory('necessary');
    setTimeout(updateConsentStatus, 100);
};

const clearConsent = () => {
    const { $cookieConsent } = useNuxtApp();
    $cookieConsent.reset(true);
    setTimeout(() => {
        updateConsentStatus();
        alert('同意设置已清除！刷新页面将重新显示同意弹窗。');
    }, 100);
};

const updateConsentStatus = () => {
    try {
        const { $cookieConsent } = useNuxtApp();
        const consent = $cookieConsent.getUserPreferences();
        consentStatus.value = JSON.stringify(consent, null, 2);
    } catch (error) {
        consentStatus.value = '无法获取状态：' + error;
    }
};
</script>

<style scoped>
.test-cookie-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #1f2937;
}

.test-section {
    margin-bottom: 3rem;
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 0.5rem;
}

.test-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #374151;
}

.button-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.test-btn {
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.test-btn:hover {
    background: #2563eb;
    transform: translateY(-1px);
}

.test-btn.success {
    background: #10b981;
}

.test-btn.success:hover {
    background: #059669;
}

.test-btn.danger {
    background: #ef4444;
}

.test-btn.danger:hover {
    background: #dc2626;
}

.test-btn.warning {
    background: #f59e0b;
}

.test-btn.warning:hover {
    background: #d97706;
}

.status-box {
    background: #1f2937;
    color: #10b981;
    padding: 1rem;
    border-radius: 0.375rem;
    overflow-x: auto;
}

.status-box pre {
    margin: 0;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
}

.instructions {
    list-style: decimal;
    padding-left: 1.5rem;
    line-height: 1.8;
}

.instructions li {
    margin-bottom: 0.5rem;
    color: #4b5563;
}

.code-example {
    background: #1f2937;
    color: #10b981;
    padding: 1.5rem;
    border-radius: 0.375rem;
}

.code-example h3 {
    color: #60a5fa;
    font-size: 1rem;
    margin: 1rem 0 0.5rem 0;
}

.code-example h3:first-child {
    margin-top: 0;
}

.code-example pre {
    margin: 0;
}

.code-example code {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
}
</style>


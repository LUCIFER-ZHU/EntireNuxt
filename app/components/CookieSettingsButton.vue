<template>
    <button
        type="button"
        data-cc="show-preferencesModal"
        class="cookie-settings-btn"
        aria-label="管理 Cookie 设置"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
            <path d="M8.5 8.5v.01"></path>
            <path d="M16 15.5v.01"></path>
            <path d="M12 12v.01"></path>
            <path d="M11 17v.01"></path>
            <path d="M7 14v.01"></path>
        </svg>
        <span v-if="showText">Cookie 设置</span>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    showText?: boolean;
}>();
</script>

<style scoped>
.cookie-settings-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    color: #374151;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cookie-settings-btn:hover {
    background-color: #e5e7eb;
    border-color: #d1d5db;
}

.cookie-settings-btn:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

.cookie-settings-btn svg {
    flex-shrink: 0;
}
</style>


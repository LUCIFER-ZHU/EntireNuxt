/**
 * Nuxt 插件类型声明
 * 为自定义插件提供 TypeScript 类型支持
 */

declare module '#app' {
  interface NuxtApp {
    $customFetch: typeof $fetch
    $customUseFetch: typeof useFetch
    $customUseLazyFetch: typeof useLazyFetch
    /**
     * AOS 实例（滚动进入视窗动画库）
     */
    $aos: typeof import('aos')
    $toast: {
      success: (message: string, options?: any) => void
      error: (message: string, options?: any) => void
      warning: (message: string, options?: any) => void
      info: (message: string, options?: any) => void
      clear: () => void
      dismiss: (id?: string) => void
    }
    /**
     * CookieConsent 实例
     */
    $cookieConsent: typeof import('vanilla-cookieconsent')
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $customFetch: typeof $fetch
    $customUseFetch: typeof useFetch
    $customUseLazyFetch: typeof useLazyFetch
    /**
     * AOS 实例（滚动进入视窗动画库）
     */
    $aos: typeof import('aos')
    $toast: {
      success: (message: string, options?: any) => void
      error: (message: string, options?: any) => void
      warning: (message: string, options?: any) => void
      info: (message: string, options?: any) => void
      clear: () => void
      dismiss: (id?: string) => void
    }
    /**
     * CookieConsent 实例
     */
    $cookieConsent: typeof import('vanilla-cookieconsent')
  }
}

/**
 * Google Analytics (gtag.js) type declarations
 */
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    gtag_report_conversion: (url?: string) => boolean;
  }
}

export {}

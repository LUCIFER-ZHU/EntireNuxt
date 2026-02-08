// AOS（滚动进入视窗动画库）初始化插件，仅在客户端执行
import AOS from 'aos';
import 'aos/dist/aos.css';

export default defineNuxtPlugin((nuxtApp) => {
  // 在应用挂载后初始化，确保 DOM 就绪
  if (import.meta.client) {
    // 首次加载
    // 关键：等待 Vue 彻底完成挂载
    nuxtApp.hook('app:suspense:resolve', () => {      
      AOS.init({
        duration: 1000, // 动画时长（毫秒）
        easing: 'ease-out-quart', // 缓动函数
        once: false, // 是否仅在第一次滚动时触发
        offset: 40, // 触发偏移（像素）
      });
    })

    // 路由切换后刷新 AOS，使动态内容也能触发动画
    nuxtApp.hook('page:finish', () => {
      try {
        AOS.refreshHard();
      } catch (error) {
        // 忽略刷新异常，避免打断导航
        console.error('[AOS] refresh error:', error);
      }
    });
  }

  return {
    provide: {
      aos: AOS,
    },
  };
});



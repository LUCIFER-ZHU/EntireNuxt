// https://nuxt.com/docs/api/configuration/nuxt-config
// import { readFileSync } from 'fs';
// import { resolve } from 'path';

// 判断是否为开发环境
const isDev = process.env.NODE_ENV !== "production";

// 从环境变量读取是否生成 sourcemap（默认为 true）
const enableSourcemap = process.env.ENABLE_SOURCEMAP !== "false";

export default defineNuxtConfig({
    compatibilityDate: '2025-01-15',
    devtools: { enabled: process.env.NODE_ENV !== "production" },
    // ✅ 通过环境变量 ENABLE_SOURCEMAP 控制是否生成 sourcemap
    sourcemap: enableSourcemap,
    devServer: {
        host: "0.0.0.0",
        // https: {
        //     key: readFileSync(resolve(__dirname, '.cert/192.168.10.33+2-key.pem'), 'utf-8'),
        //     cert: readFileSync(resolve(__dirname, '.cert/192.168.10.33+2.pem'), 'utf-8'),
        // },
    },
    nitro: {
        routeRules: isDev
            ? {
                  // 开发环境：使用代理转发
                  "/web/**": {
                      proxy: `${process.env.NUXT_DEV_PROXY_TARGET}/web/**`,
                  },
              }
            : {
                  // 生产环境：不设置代理规则
              },
        // ✅ 通过环境变量控制是否生成 sourcemap
        sourceMap: enableSourcemap,
        // 保持动态导入，便于 sourcemap 映射
        inlineDynamicImports: false,
        // 不压缩，保持可读性（可选，如果需要压缩可设为 true）
        minify: false,
        // ✅ 生产环境移除 console 和 debugger（服务端代码）
        esbuild: {
            options: {
                drop: isDev ? [] : ["console", "debugger"],
            },
        },
        prerender: {
          // routes: [
          //   '/'
          // ]
        }        
    },
    modules: [
      "@nuxt/ui",
      "@nuxt/fonts",
      "@nuxt/image",
      "@pinia/nuxt",
      "pinia-plugin-persistedstate/nuxt",
      "@nuxtjs/seo",
      "@nuxtjs/turnstile",
      "@nuxt/eslint",
      "@nuxtjs/device",
    ],
    css: [
        "~/assets/css/vendors.css",
        "~/assets/iconfont/iconfont.css",
        "~/assets/scss/main.scss",
    ],
    plugins: [{ src: "~/plugins/aos.client", mode: "client" }],
    // ssr: false,
    app: {
        head: {
            title: "Precision Renewed. Value Redefined",
            link: [
                { rel: "icon", type: "image/x-icon", href: "/minnuo-logo.ico" }, // 放在 public 目录
            ],
        },
    },
    // Turnstile 站点密钥（客户端可见）
    turnstile: {
        siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || "",
    },
    runtimeConfig: {
        // Turnstile 密钥（服务端使用，不暴露给客户端）
        turnstile: {
            secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || "",
        },
        // JWT 配置（服务端使用）
        jwt: {
            secret: process.env.JWT_SECRET || "dev-secret-key-change-in-production",
            accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
            refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
        },
        public: {
            // 公开的 API 基地址（浏览器可见）
            apiBase: process.env.NUXT_PUBLIC_API_BASE,
            // WebSocket 服务器地址
            wsUrl: process.env.NUXT_PUBLIC_WS_URL,
            // 是否启用 WebSocket 连接
            enableWs: process.env.NUXT_PUBLIC_ENABLE_WS,
            // 图片资源基地址
            imageBase: process.env.NUXT_PUBLIC_IMAGE_BASE,
            // 后台图片资源基地址
            backendImageBase: process.env.NUXT_BACKEND_IMAGE_BASE,
            // 应用版本号（构建时通过 APP_VERSION 注入，回退为 'dev'）
            appVersion: process.env.APP_VERSION || "dev",
            // 站点 URL（用于 SEO）
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://example.com",
        },
    },
    // Nuxt SEO 配置
    site: {
        url: process.env.NUXT_PUBLIC_SITE_URL || "https://example.com",
        name: "Precision Renewed. Value Redefined",
        // 禁用站点索引 - 禁止搜索引擎抓取（内容未定）
        indexable: false,
    },
    // Sitemap 配置 - 自动生成 sitemap.xml
    sitemap: {
        // 自动发现所有页面并生成 sitemap
        // 由于当前禁止爬虫，sitemap 主要用于将来开放时使用
    },
    image: {
        // 默认使用原图
        densities: [1],
    },
    fonts: {
        // 不使用 Google 提供商
        providers: {
            google: false,
            googleicons: false,
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
// 从环境变量注入图片资源基地址
$image-base: '${process.env.NUXT_PUBLIC_IMAGE_BASE }';
$backend-image-base: '${process.env.NUXT_BACKEND_IMAGE_BASE }';
@use "~/assets/scss/variables.scss" as *;
`,
                },
            },
        },
        server: {
            allowedHosts: true, // ✅ 允许任意 Host（推荐）
            fs: {
                allow: ["."], // 放宽本地文件系统访问限制
            },
        },
        build: {
            // ✅ 通过环境变量控制是否生成 sourcemap
            sourcemap: enableSourcemap,
        },
        esbuild: {
            // ✅ 生产环境移除 console 和 debugger
            drop: isDev ? [] : ["console", "debugger"],
        },
    },
    // 在生产环境下排除开发测试页面
    hooks: {
        "pages:extend"(pages) {
            if (process.env.NODE_ENV === "production") {
                // 移除所有 /dev/ 路径的页面
                const pagesToRemove = pages.filter((page) =>
                    page.path.includes("/dev")
                );
                pagesToRemove.forEach((page) => {
                    pages.splice(pages.indexOf(page), 1);
                });
            }
        },
    },
    build: {
        transpile: ["vue-countup-v3", 'emoji-mart-vue-fast'],
    },
});
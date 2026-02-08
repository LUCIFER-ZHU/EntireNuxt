/**
 * $fetch 拦截器插件
 * 自动为所有请求添加环境变量中的 apiBase 作为 baseURL
 * 在客户端和服务端都运行，支持 SSR
 * 提供 $customFetch 和 $customUseFetch 方法
 */

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    // 标记是否正在处理 token 刷新，防止重复处理
    const isRefreshingToken = useState<boolean>('isRefreshingToken', () => false);

    /**
     * 处理 token 过期的情况
     * 如果用户前端是登录状态但后端返回 401，说明 access_token 已过期
     */
    async function handleTokenExpired() {
        // 只在客户端处理，服务端不做处理
        if (process.server) {
            return;
        }

        // 如果正在刷新 token，避免重复处理
        if (isRefreshingToken.value) {
            return;
        }

        try {
            const authStore = useAuthStore();

            authStore.clearAuth();
            // 跳转到登录页，带上当前路径作为 redirect 参数
            const currentPath = useRoute().path;
            await navigateTo({
                path: "/account/login",
                query: {
                    redirect: currentPath,
                    reason: "token_expired",
                },
            });
            // 如果用户前端是登录状态，说明 token 过期了
            // if (authStore.isAuthenticated) {
            //   isRefreshingToken.value = true;
            //   console.log('🔐 检测到 access_token 已过期，尝试刷新...');
            //
            //   // 尝试刷新 token（如果后端支持）
            //   const refreshSuccess = await authStore.refreshToken();
            //
            //   if (!refreshSuccess) {
            //     // 刷新失败或后端不支持刷新，清除登录状态并跳转到登录页
            //     console.warn('⚠️ Token 刷新失败，清除登录状态');
            //     authStore.clearAuth();
            //
            //     // 跳转到登录页，带上当前路径作为 redirect 参数
            //     const currentPath = useRoute().path;
            //     await navigateTo({
            //       path: '/account/login',
            //       query: {
            //         redirect: currentPath,
            //         reason: 'token_expired'
            //       }
            //     });
            //   } else {
            //     console.log('✅ Token 刷新成功');
            //   }
            // }
        } catch (err) {
            console.error("处理 token 过期时出错:", err);
            // 出错时也清除登录状态，确保安全
            const authStore = useAuthStore();
            authStore.clearAuth();
            await navigateTo("/account/login");
        } finally {
            // 重置刷新标记
            isRefreshingToken.value = false;
        }
    }

    // 开发环境：baseURL 为空，走 devProxy 代理
    // 生产环境：baseURL 使用环境变量中的真实后台地址
    const baseURL = process.dev ? "" : config.public.apiBase || "";

    // 创建自定义的 $fetch 实例
    const customFetch = $fetch.create({
        baseURL: baseURL,
        credentials: "include", // 允许发送和接收 cookies（包括 http-only）
        // 请求拦截器
        onRequest({ request, options }) {
            // 打印请求信息，区分服务端和客户端
            const env = process.server ? "🖥️ [服务端]" : "🌐 [客户端]";
            console.log(
                `${env} 发起请求: %c${request}%c | Method: ${
                    options.method || "GET"
                }`,
                "color: #3b82f6; font-weight: bold;",
                "color: inherit;"
            );

            // 如果请求URL已经是完整地址（以http开头），则不添加baseURL
            if (typeof request === "string" && request.startsWith("http")) {
                options.baseURL = undefined;
            }

            // 添加请求时间戳，用于调试
            // if (!options.query) {
            //     options.query = {};
            // }
            // (options.query as any)["_t"] = Date.now();

            // ⚡ SSR 时手动带上客户端 cookie
            if (process.server) {
                const headers = useRequestHeaders(['cookie']);
                options.headers = {
                    ...options.headers,
                    ...headers
                };
            }
        },

        // 响应拦截器
        onResponse({ request, response }) {
            const env = process.server ? "🖥️ [服务端]" : "🌐 [客户端]";
            console.log(
                `${env} 收到响应: %c${request}%c | Status: ${response.status}`,
                "color: #3b82f6; font-weight: bold;",
                "color: inherit;",
                "| data:",
                response._data
            );

            if (response?.status === 200) {
                if (response?._data.code === 401) {
                    console.warn("用户未授权，请重新登录");
                    // 处理 token 过期情况
                    handleTokenExpired();
                }
            }            
        },

        // 错误拦截器
        onResponseError({ response, error }) {
            // 确保错误对象格式正确
            const errorMessage =
                error?.message || response?.statusText || "未知错误";

            // 统一错误处理
            console.error("API请求错误:", {
                status: response?.status,
                statusText: response?.statusText,
                url: response?.url,
                message: errorMessage,
            });

            // 根据状态码进行不同处理
            switch (response?.status) {
                case 401:
                    console.warn("用户未授权，请重新登录");
                    // 处理 token 过期情况
                    handleTokenExpired();
                    break;
                case 403:
                    console.warn("没有权限访问该资源");
                    break;
                case 404:
                    console.warn("请求的资源不存在");
                    break;
                case 500:
                    console.error("服务器内部错误");
                    break;
                default:
                    console.error("请求失败:", errorMessage);
            }

            // 创建格式正确的错误对象
            const formattedError = new Error(errorMessage);
            formattedError.cause = error;

            // 重新抛出格式化的错误
            throw formattedError;
        },

        // 请求错误拦截器
        onRequestError({ error }) {
            const errorMessage = error?.message || "请求发送失败";
            console.error("请求发送失败:", errorMessage);

            // 创建格式正确的错误对象
            const formattedError = new Error(errorMessage);
            formattedError.cause = error;

            throw formattedError;
        },
    });

    /**
     * 自定义的 useFetch 方法
     * 使用我们的拦截器，自动添加 baseURL
     * @param request - 请求URL或选项
     * @param options - 请求选项
     * @returns useFetch 的返回值
     */
    const customUseFetch = <T>(request: any, options: any = {}) => {
        // 确保使用我们的 customFetch
        const fetchOptions = {
            ...options,
            $fetch: customFetch,
        };

        return useFetch<T>(request, fetchOptions);
    };

    /**
     * 自定义的 useLazyFetch 方法
     * 使用我们的拦截器，自动添加 baseURL
     * @param request - 请求URL或选项
     * @param options - 请求选项
     * @returns useLazyFetch 的返回值
     */
    const customUseLazyFetch = <T>(request: any, options: any = {}) => {
        // 确保使用我们的 customFetch
        const fetchOptions = {
            ...options,
            $fetch: customFetch,
        };

        return useLazyFetch<T>(request, fetchOptions);
    };

    /**
     * 自定义的 $fetch 方法（用于直接调用）
     * @param request - 请求URL或选项
     * @param options - 请求选项
     * @returns Promise<any>
     */
    const customFetchDirect = (request: any, options: any = {}) => {
        return customFetch(request, options);
    };

    // 将自定义的方法注入到 Nuxt 应用中
    return {
        provide: {
            // 提供自定义的 fetch 实例，组件可以通过 $customFetch 使用
            customFetch: customFetchDirect,
            // 提供自定义的 useFetch 方法
            customUseFetch,
            // 提供自定义的 useLazyFetch 方法
            customUseLazyFetch,
        },
    };
});

# 认证状态 SSR 优化说明

## 问题背景

之前的实现使用 localStorage 来持久化认证状态，导致以下问题：
1. **闪烁问题**：服务端渲染时无法访问 localStorage，导致服务端渲染未登录状态，客户端水合后才显示登录状态
2. **SEO 不友好**：搜索引擎爬虫看到的是未登录状态的页面
3. **用户体验差**：页面加载时会出现内容闪烁

## 解决方案

使用 **Cookie** 代替 localStorage 来存储认证状态，因为：
- Cookie 在服务端和客户端都可以访问
- 支持 SSR，确保服务端和客户端渲染一致
- 自动随 HTTP 请求发送，便于后端验证

## 实现细节

### 1. 修改 auth store (`app/stores/auth.ts`)

- 移除了 `persist` 配置（不再使用 localStorage）
- 在 `setAuth()` 中同步设置 Cookie
- 在 `setUser()` 中同步更新 Cookie
- 在 `clearAuth()` 中清除 Cookie
- 新增 `initFromCookie()` 方法用于从 Cookie 恢复状态

**Cookie 配置：**
```typescript
{
  maxAge: 60 * 60 * 24 * 7, // 7天过期
  sameSite: 'lax',          // CSRF 保护
  secure: process.env.NODE_ENV === 'production' // 生产环境使用 HTTPS
}
```

### 2. 新增认证初始化插件 (`app/plugins/auth-init.ts`)

该插件在每次页面加载时（包括 SSR）从 Cookie 中恢复认证状态，确保：
- 服务端渲染时获取到正确的登录状态
- 客户端水合时状态一致，不会闪烁
- 支持跨标签页状态同步（可选）

### 3. 优化首页组件 (`app/pages/index.vue`)

为两个组件添加了 `key` 属性，确保 Vue 能正确识别组件切换。

## 使用说明

### 登录时

```typescript
// 登录成功后调用（已有代码）
authStore.setAuth(user)
// 会自动设置 Cookie：auth_user 和 auth_isAuthenticated
```

### 登出时

```typescript
// 登出时调用（已有代码）
authStore.clearAuth()
// 会自动清除 Cookie
```

### 更新用户信息

```typescript
// 更新用户信息时调用
authStore.setUser(updatedUser)
// 会自动更新 Cookie
```

## 技术优势

1. **SEO 友好**：搜索引擎爬虫能看到正确的登录/未登录状态
2. **无闪烁**：服务端和客户端渲染完全一致
3. **用户体验好**：页面加载流畅，无内容跳动
4. **安全性**：使用 sameSite 和 secure 选项防止 CSRF 攻击
5. **持久化**：Cookie 有效期 7 天，自动保持登录状态

## 注意事项

1. **Cookie 大小限制**：Cookie 有 4KB 大小限制，不要存储过大的用户对象
2. **隐私合规**：根据地区法规，可能需要显示 Cookie 使用提示
3. **HTTPS**：生产环境建议使用 HTTPS 以保护 Cookie 安全
4. **跨域**：如果前后端不在同一域名，需要配置 CORS 和 Cookie 策略

## 测试要点

- [ ] 登录后刷新页面，不应该闪烁
- [ ] 服务端渲染的 HTML 应该包含正确的登录状态
- [ ] 登出后 Cookie 应该被清除
- [ ] Cookie 过期后应该自动退出登录
- [ ] 打开多个标签页，状态应该保持同步

## 迁移说明

如果用户之前有 localStorage 中的认证数据：
- 旧的 localStorage 数据会被忽略
- 用户需要重新登录一次以创建 Cookie
- 可以在 `auth-init.ts` 中添加迁移逻辑（如需要）


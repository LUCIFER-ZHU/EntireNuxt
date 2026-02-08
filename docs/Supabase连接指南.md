# Supabase 数据库连接指南

## 获取连接字符串步骤

### 1. 登录 Supabase Dashboard

访问 https://app.supabase.com 并登录你的账户

### 2. 进入项目设置

1. 选择你要连接的项目
2. 点击左侧菜单 **Project Settings**（项目设置）
3. 选择 **Database**（数据库）选项卡

### 3. 复制连接字符串

在 **Connection string**（连接字符串）部分，你会看到：

#### 3.1 连接池 URL (DATABASE_URL)
- 用途：应用运行时使用的连接
- 端口：**6543**
- 点击 **URI** 标签
- 复制连接字符串

**格式示例：**
```
postgresql://postgres.abcdefghijkl:YourPassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

#### 3.2 直接连接 URL (DIRECT_URL)
- 用途：Prisma 迁移时使用
- 端口：**5432**
- 点击 **URI (direct)** 标签
- 复制连接字符串

**格式示例：**
```
postgresql://postgres.abcdefghijkl:YourPassword@db.abcdefghijkl.supabase.co:5432/postgres
```

### 4. 更新环境变量

打开 `.env.development` 文件，替换以下占位符：

```env
# 连接池 URL（用于应用运行时）
DATABASE_URL="postgresql://postgres.你的项目ID:你的密码@aws-0-你的地区.pooler.supabase.com:6543/postgres"

# 直接连接 URL（用于 Prisma 迁移）
DIRECT_URL="postgresql://postgres.你的项目ID:你的密码@db.你的项目ID.supabase.co:5432/postgres"

# JWT 密钥（自己生成一个随机字符串）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 5. 测试连接

配置完成后，运行以下命令测试连接：

```bash
# 测试数据库连接
npx prisma db pull

# 或者查看数据库结构
npx prisma studio
```

### 6. 创建数据库迁移

首次连接后，创建数据库表：

```bash
# 创建迁移文件并应用到数据库
npx prisma migrate dev --name init

# 生成 Prisma Client
npx prisma generate
```

---

## 常见问题

### Q: 连接失败，提示 "password authentication failed"
**A:** 检查密码是否正确，注意区分大小写。如果忘记密码，可以在 Supabase Dashboard → Database → Reset password 重置。

### Q: 连接超时
**A:** 
- 检查网络是否可以访问 Supabase
- 确认使用的是正确的端口号（6543 或 5432）
- 检查防火墙设置

### Q: Prisma Migrate 失败
**A:** 
- 确保 DIRECT_URL 使用的是 5432 端口
- 确认数据库用户有创建表的权限

### Q: 开发环境需要代理吗？
**A:** 不需要，Prisma 直接连接到 Supabase，不走 Nuxt 代理。

---

## 安全提示

⚠️ **永远不要：**
- 将 `.env.development` 或 `.env.production` 提交到 Git
- 在代码中硬编码数据库密码
- 分享你的 JWT_SECRET

✅ **应该：**
- 将敏感信息保存在环境变量中
- 使用强密码和随机 JWT_SECRET
- 定期轮换密码

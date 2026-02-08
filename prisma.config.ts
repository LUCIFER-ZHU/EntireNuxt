// ============================================================
// Prisma 配置文件
// 文件路径: prisma.config.ts
// 作用: Prisma 7+ 的配置方式，将数据库连接信息从 schema 文件分离
// 文档: https://www.prisma.io/docs/orm/prisma-schema/overview
// ============================================================

import dotenv from 'dotenv'
import { resolve } from 'path'

// 加载 .env.development 文件中的环境变量
dotenv.config({ path: resolve(process.cwd(), '.env.development') })

import { defineConfig } from 'prisma/config'
// Prisma 7+ 的配置定义函数

export default defineConfig({
  // --------------------------------------------------------
  // 1. Schema 文件路径
  // --------------------------------------------------------
  schema: 'prisma/schema.prisma',

  // --------------------------------------------------------
  // 2. 迁移配置
  // --------------------------------------------------------
  migrations: {
    path: 'prisma/migrations',
    // 迁移文件存储路径
  },

  // --------------------------------------------------------
  // 3. 数据源配置（Prisma 7+ 新方式）
  // --------------------------------------------------------
  // 注意：在 Prisma 7+ 中，数据库连接 URL 从 schema.prisma 移到此处
  // Prisma 7.3.0 的 defineConfig 类型只支持 url 和 shadowDatabaseUrl
  // 对于 Supabase，迁移时使用 DIRECT_URL，运行时使用 DATABASE_URL
  datasource: {
    // 使用会话池端口 5432（Prisma 迁移用）
    url: process.env.DIRECT_URL,

    // 影子数据库 URL（可选，用于迁移时对比 schema 差异）
    // shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
})

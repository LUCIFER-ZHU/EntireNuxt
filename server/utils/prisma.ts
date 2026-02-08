// ============================================================
// Prisma Client 单例管理
// 文件路径: server/utils/prisma.ts
// 作用: 创建并管理 Prisma Client 实例，防止热重载导致的多实例问题
// 文档: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/instantiate-prisma-client
// ============================================================

import { PrismaClient } from '@prisma/client'
// 从 @prisma/client 导入 PrismaClient 类
// 这是 Prisma 根据 schema.prisma 自动生成的类型安全客户端

// ============================================================
// 1. 全局实例类型声明
// 作用: 扩展 globalThis 类型，支持在全局对象上存储 Prisma 实例
// 为什么需要: 在开发环境热重载时复用同一个实例
// ============================================================
declare global {
  // 使用 var 而不是 const/let 因为 global 对象属性必须是可写的
  var prisma: PrismaClient | undefined
}

// ============================================================
// 2. Prisma Client 配置选项
// 作用: 定义 Prisma 客户端的行为
// ============================================================
const prismaClientOptions = {
  log: process.env.NODE_ENV === 'development'
    ? [
        { emit: 'stdout', level: 'query' },    // 记录所有 SQL 查询
        { emit: 'stdout', level: 'error' },    // 记录错误
        { emit: 'stdout', level: 'warn' },     // 记录警告
        { emit: 'stdout', level: 'info' },     // 记录一般信息
      ]
    : [
        { emit: 'stdout', level: 'error' },    // 生产环境只记录错误（减少日志量）
      ],
  // log 配置说明:
  // - query: 所有执行的 SQL 查询（开发时很有用，可以看到实际执行的 SQL）
  // - error: 数据库错误
  // - warn: 警告信息（如连接池警告）
  // - info: 一般信息（如连接成功）
}

// ============================================================
// 3. Prisma Client 实例创建
// 核心逻辑: 开发环境使用全局变量，生产环境创建新实例
// ============================================================

/**
 * Prisma Client 实例
 *
 * 为什么用全局变量存储？
 * - Next.js/Nuxt 开发时，热重载（Hot Reload）会重新执行模块
 * - 每次重新执行都会创建新的 PrismaClient 实例
 * - 每个实例都会创建新的数据库连接
 * - 多个连接 = 连接池耗尽 = 应用崩溃
 *
 * 解决方案：
 * - 开发环境：将实例存储在 globalThis，热重载时复用已有实例
 * - 生产环境：正常创建实例（生产无热重载问题）
 */
export const prisma = globalThis.prisma ?? new PrismaClient(prismaClientOptions)
// ?? (空值合并运算符): 如果 globalThis.prisma 存在就用它，否则创建新实例

// ============================================================
// 4. 开发环境：挂载到全局对象
// ============================================================
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
  // 将实例挂载到 globalThis，下次热重载时可以复用
}

// ============================================================
// 5. 连接测试函数（可选，用于启动时验证）
// ============================================================

/**
 * 测试数据库连接
 * 用途: 应用启动时验证数据库是否可连接
 * @returns Promise<boolean> 连接是否成功
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    // 执行一个简单的查询测试连接
    await prisma.$queryRaw`SELECT 1`
    // $queryRaw: 执行原始 SQL 查询
    // SELECT 1: 最简单的查询，不访问任何表

    console.log('✅ 数据库连接成功')
    return true
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    return false
  }
}

// ============================================================
// 6. 优雅关闭处理
// 作用: 应用退出时关闭数据库连接，释放资源
// ============================================================

// 正常退出（如按 Ctrl+C）
process.on('beforeExit', async () => {
  // beforeExit: Node.js 进程即将退出时触发
  // 注意: 如果进程被 kill -9 强制终止，不会触发此事件
  await prisma.$disconnect()
  // $disconnect(): 关闭数据库连接池，释放所有连接
  console.log('✅ Prisma Client 已断开连接')
})

// 异常退出（如未捕获的异常）
process.on('SIGINT', async () => {
  // SIGINT: 中断信号（Ctrl+C）
  await prisma.$disconnect()
  console.log('✅ Prisma Client 已断开连接 (SIGINT)')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  // SIGTERM: 终止信号（如 Docker stop、PM2 stop）
  await prisma.$disconnect()
  console.log('✅ Prisma Client 已断开连接 (SIGTERM)')
  process.exit(0)
})

// ============================================================
// 7. 类型导出（方便其他文件使用）
// ============================================================

// 导出 Prisma 命名空间，包含所有模型类型
export type { Prisma } from '@prisma/client'

// 导出具体模型类型（常用）
export type {
  User,
  Session,
  Product,
  ContactForm,
  UserRole,
  UserStatus,
  ProductStatus,
  FormStatus,
} from '@prisma/client'

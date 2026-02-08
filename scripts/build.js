/**
 * 构建脚本：自动注入 Git 版本号并执行 Nuxt 构建
 * 使用方法：node scripts/build.js 或 pnpm run build
 */

import { execSync } from 'child_process';

try {
  // 获取 Git 短哈希作为版本号
  const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  process.env.APP_VERSION = gitHash;
  console.log(`🔖 设置版本号: ${gitHash}`);
} catch (error) {
  // Git 不可用时回退到 'dev'
  process.env.APP_VERSION = 'dev';
  console.log('⚠️  Git 不可用，使用默认版本: dev');
}

try {
  // 执行 Nuxt 构建
  console.log('🏗️  开始构建...');
  execSync('nuxt build --dotenv .env.production', {
    stdio: 'inherit',
    env: process.env
  });
  console.log('✅ 构建完成！');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}



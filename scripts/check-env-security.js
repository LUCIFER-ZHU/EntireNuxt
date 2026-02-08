#!/usr/bin/env node
// ============================================================
// 环境变量安全检查脚本
// 作用: 验证敏感信息是否会被打包到前端
// 使用方法: node scripts/check-env-security.js
// ============================================================

const fs = require('fs');
const path = require('path');

// 敏感关键词（不应该出现在前端打包文件中）
const SENSITIVE_PATTERNS = [
  /DATABASE_URL/i,
  /DIRECT_URL/i,
  /JWT_SECRET/i,
  /password.*[:=]/i,
  /postgres:\/\//i,
  /postgresql:\/\//i,
  /[a-zA-Z0-9]{20,}\.[a-zA-Z0-9]{20,}/i, // 可能的密钥格式
];

// 需要扫描的目录
const SCAN_DIRS = [
  '.output/public',
  '.output/server',
  'dist',
];

// 白名单（允许出现的字符串）
const WHITELIST = [
  'DATABASE_URL', // 变量名本身可以出现
  'JWT_SECRET',   // 变量名本身可以出现
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];

  SENSITIVE_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      // 检查是否在白名单中
      const isWhitelisted = WHITELIST.some(w => matches[0].includes(w) && matches[0] === w);
      if (!isWhitelisted) {
        issues.push({
          pattern: pattern.toString(),
          match: matches[0].substring(0, 50) + '...', // 只显示前50个字符
        });
      }
    }
  });

  return issues;
}

function scanDirectory(dir) {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }

  const files = fs.readdirSync(dir, { recursive: true });
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.json'))) {
      const issues = scanFile(filePath);
      if (issues.length > 0) {
        results.push({
          file: filePath,
          issues: issues,
        });
      }
    }
  });

  return results;
}

function main() {
  console.log('🔍 检查环境变量安全性...\n');

  let totalIssues = 0;

  SCAN_DIRS.forEach(dir => {
    console.log(`📁 扫描目录: ${dir}`);
    const results = scanDirectory(dir);
    
    if (results.length === 0) {
      console.log('   ✅ 未发现敏感信息泄露\n');
    } else {
      console.log(`   ⚠️  发现 ${results.length} 个潜在问题:\n`);
      results.forEach(result => {
        console.log(`   📄 文件: ${result.file}`);
        result.issues.forEach(issue => {
          console.log(`      - 匹配: ${issue.match}`);
          totalIssues++;
        });
        console.log('');
      });
    }
  });

  if (totalIssues === 0) {
    console.log('✅ 安全检查通过！未发现敏感信息泄露。');
    process.exit(0);
  } else {
    console.log(`⚠️  发现 ${totalIssues} 个潜在安全问题，请检查！`);
    process.exit(1);
  }
}

main();

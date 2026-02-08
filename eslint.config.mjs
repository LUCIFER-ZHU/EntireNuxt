// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // ===== 彻底降噪 =====
      // TS
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',      

      // JS
      'no-unused-vars': 'off',

      // Nuxt
      'nuxt/prefer-import-meta': 'off',

      // Import
      'import/no-duplicates': 'off',

      // Vue 模板格式类（全部是 warning）
      'vue/attributes-order': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-self-closing': 'off',
      'vue/no-v-html': 'off',      

      // 空白 / 格式
      'no-irregular-whitespace': 'off',
      
    },
  }
)

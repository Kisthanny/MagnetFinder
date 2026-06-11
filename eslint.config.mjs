import eslint from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['out/**', 'release/**', 'dist/**', 'node_modules/**']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // 主进程 / 预加载 / 配置文件：Node 环境
  {
    files: [
      'src/main/**/*.ts',
      'src/preload/**/*.ts',
      'src/shared/**/*.ts',
      '*.{js,mjs,ts}'
    ],
    languageOptions: {
      globals: { ...globals.node }
    }
  },
  // 渲染层：浏览器环境 + React / Hooks 规则
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // React 19 + 新 JSX 转换：无需在作用域引入 React，也不用 prop-types
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'
    }
  }
)

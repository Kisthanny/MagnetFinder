import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { I18nProvider } from './i18n/I18nProvider'
import { ThemeProvider } from './theme/ThemeProvider'
import './styles.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('找不到 #root 容器')
}

createRoot(container).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>
)

import { nativeTheme } from 'electron'
import { DEFAULT_THEME, isValidTheme, type Theme } from '@shared/theme'
import { readSettings, writeSettings } from './settings'

let currentTheme: Theme = DEFAULT_THEME

export function getCurrentTheme(): Theme {
  return currentTheme
}

export function getThemeState(): { theme: Theme; shouldUseDarkColors: boolean } {
  return {
    theme: currentTheme,
    shouldUseDarkColors: nativeTheme.shouldUseDarkColors
  }
}

export function initTheme(): void {
  const saved = readSettings().theme
  currentTheme = saved && isValidTheme(saved) ? saved : DEFAULT_THEME
  nativeTheme.themeSource = currentTheme
}

export function setTheme(theme: Theme): void {
  currentTheme = theme
  nativeTheme.themeSource = theme
  writeSettings({ ...readSettings(), theme })
}

export type Theme = 'light' | 'dark' | 'system'

export const THEMES: Theme[] = ['light', 'dark', 'system']

export const DEFAULT_THEME: Theme = 'system'

export function isValidTheme(value: string): value is Theme {
  return THEMES.includes(value as Theme)
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode
} from 'react'
import type { Theme } from '@shared/theme'

interface ThemeState {
  theme: Theme
  shouldUseDarkColors: boolean
}

interface ThemeContextValue extends ThemeState {
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyResolvedTheme(shouldUseDarkColors: boolean): void {
  document.documentElement.dataset.theme = shouldUseDarkColors ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, setState] = useState<ThemeState>({
    theme: 'system',
    shouldUseDarkColors: true
  })

  useEffect(() => {
    void window.api.getTheme().then((next) => {
      setState(next)
      applyResolvedTheme(next.shouldUseDarkColors)
    })
    return window.api.onThemeChanged((next) => {
      setState(next)
      applyResolvedTheme(next.shouldUseDarkColors)
    })
  }, [])

  const setTheme = useCallback((theme: Theme) => {
    void window.api.setTheme(theme)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ ...state, setTheme }),
    [state, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme 必须在 ThemeProvider 内使用')
  }
  return ctx
}

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
import {
  DEFAULT_LANGUAGE,
  getMessages,
  type Language,
  type Messages
} from '@shared/i18n'

type TParams = Record<string, string | number>

interface I18nContextValue {
  lang: Language
  messages: Messages
  t: (key: string, params?: TParams) => string
  setLanguage: (lang: Language) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function resolveKey(messages: Messages, key: string): string {
  const value = key
    .split('.')
    .reduce<unknown>((obj, part) => {
      if (obj && typeof obj === 'object' && part in (obj as Record<string, unknown>)) {
        return (obj as Record<string, unknown>)[part]
      }
      return undefined
    }, messages)
  return typeof value === 'string' ? value : key
}

function interpolate(template: string, params?: TParams): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    params[name] != null ? String(params[name]) : `{${name}}`
  )
}

export function I18nProvider({ children }: { children: ReactNode }): JSX.Element {
  const [lang, setLang] = useState<Language>(DEFAULT_LANGUAGE)

  useEffect(() => {
    void window.api.getLanguage().then(({ language }) => setLang(language))
    const unsubscribe = window.api.onLanguageChanged((next) => setLang(next))
    return unsubscribe
  }, [])

  const messages = useMemo(() => getMessages(lang), [lang])

  const t = useCallback(
    (key: string, params?: TParams) => interpolate(resolveKey(messages, key), params),
    [messages]
  )

  const setLanguage = useCallback((next: Language) => {
    void window.api.setLanguage(next)
  }, [])

  const value = useMemo<I18nContextValue>(
    () => ({ lang, messages, t, setLanguage }),
    [lang, messages, t, setLanguage]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useT(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useT 必须在 I18nProvider 内使用')
  }
  return ctx
}

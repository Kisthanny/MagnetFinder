import type { Messages } from './messages'
import zhCN from './locales/zh-CN'
import en from './locales/en'
import ja from './locales/ja'
import fr from './locales/fr'
import es from './locales/es'

export type Language = 'zh-CN' | 'en' | 'ja' | 'fr' | 'es'

export interface LanguageOption {
  code: Language
  /** 该语言的原生名称，用于在 UI 中展示 */
  nativeName: string
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'zh-CN', nativeName: '简体中文' },
  { code: 'en', nativeName: 'English' },
  { code: 'ja', nativeName: '日本語' },
  { code: 'fr', nativeName: 'Français' },
  { code: 'es', nativeName: 'Español' }
]

export const DEFAULT_LANGUAGE: Language = 'en'

const catalogs: Record<Language, Messages> = {
  'zh-CN': zhCN,
  en,
  ja,
  fr,
  es
}

export function isSupported(lang: string | undefined | null): lang is Language {
  return !!lang && Object.prototype.hasOwnProperty.call(catalogs, lang)
}

export function getMessages(lang: Language): Messages {
  return catalogs[lang] ?? catalogs[DEFAULT_LANGUAGE]
}

/** 按系统语言的主前缀映射到受支持语言，不支持时回退默认（英文） */
export function resolveSystemLanguage(locale: string | undefined | null): Language {
  const l = (locale ?? '').toLowerCase()
  if (l.startsWith('zh')) return 'zh-CN'
  if (l.startsWith('ja')) return 'ja'
  if (l.startsWith('fr')) return 'fr'
  if (l.startsWith('es')) return 'es'
  if (l.startsWith('en')) return 'en'
  return DEFAULT_LANGUAGE
}

export type { Messages } from './messages'

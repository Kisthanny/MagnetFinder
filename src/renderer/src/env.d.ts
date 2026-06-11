/// <reference types="vite/client" />

import type {
  CopyResponse,
  MagnetResponse,
  NormalizedResult,
  PollingConfig,
  PollingUpdate,
  SearchRequest,
  SearchResponse,
  SourceInfo
} from '@shared/types'
import type { Language, LanguageOption } from '@shared/i18n'
import type { Theme } from '@shared/theme'

declare global {
  interface Window {
    api: {
      getSources: () => Promise<SourceInfo[]>
      search: (req: SearchRequest) => Promise<SearchResponse>
      buildMagnet: (result: NormalizedResult) => Promise<MagnetResponse>
      copyMagnet: (result: NormalizedResult) => Promise<CopyResponse>
      startPolling: (config: PollingConfig) => Promise<{ ok: boolean; error?: string }>
      stopPolling: () => Promise<{ ok: boolean }>
      onPollingUpdate: (callback: (update: PollingUpdate) => void) => () => void
      getLanguage: () => Promise<{ language: Language; supported: LanguageOption[] }>
      setLanguage: (lang: Language) => Promise<{ ok: boolean }>
      onLanguageChanged: (callback: (lang: Language) => void) => () => void
      onOpenSettings: (callback: () => void) => () => void
      getTheme: () => Promise<{ theme: Theme; shouldUseDarkColors: boolean }>
      setTheme: (theme: Theme) => Promise<{ ok: boolean }>
      onThemeChanged: (
        callback: (state: { theme: Theme; shouldUseDarkColors: boolean }) => void
      ) => () => void
    }
  }
}

export {}

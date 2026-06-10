import { contextBridge, ipcRenderer } from 'electron'
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

const api = {
  getSources: (): Promise<SourceInfo[]> => ipcRenderer.invoke('sources:list'),
  search: (req: SearchRequest): Promise<SearchResponse> => ipcRenderer.invoke('search', req),
  buildMagnet: (result: NormalizedResult): Promise<MagnetResponse> =>
    ipcRenderer.invoke('magnet:build', result),
  copyMagnet: (result: NormalizedResult): Promise<CopyResponse> =>
    ipcRenderer.invoke('magnet:copy', result),
  startPolling: (config: PollingConfig): Promise<{ ok: boolean; error?: string }> =>
    ipcRenderer.invoke('polling:start', config),
  stopPolling: (): Promise<{ ok: boolean }> => ipcRenderer.invoke('polling:stop'),
  onPollingUpdate: (callback: (update: PollingUpdate) => void): (() => void) => {
    const listener = (_e: unknown, data: PollingUpdate): void => callback(data)
    ipcRenderer.on('polling:update', listener)
    return () => ipcRenderer.removeListener('polling:update', listener)
  },
  getLanguage: (): Promise<{ language: Language; supported: LanguageOption[] }> =>
    ipcRenderer.invoke('i18n:get'),
  setLanguage: (lang: Language): Promise<{ ok: boolean }> => ipcRenderer.invoke('i18n:set', lang),
  onLanguageChanged: (callback: (lang: Language) => void): (() => void) => {
    const listener = (_e: unknown, lang: Language): void => callback(lang)
    ipcRenderer.on('i18n:changed', listener)
    return () => ipcRenderer.removeListener('i18n:changed', listener)
  },
  onOpenSettings: (callback: () => void): (() => void) => {
    const listener = (): void => callback()
    ipcRenderer.on('settings:open', listener)
    return () => ipcRenderer.removeListener('settings:open', listener)
  }
}

export type MagnetFinderApi = typeof api

contextBridge.exposeInMainWorld('api', api)

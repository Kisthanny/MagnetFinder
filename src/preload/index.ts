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
  }
}

export type MagnetFinderApi = typeof api

contextBridge.exposeInMainWorld('api', api)

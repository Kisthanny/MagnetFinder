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
    }
  }
}

export {}

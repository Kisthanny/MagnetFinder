export interface SourceCapabilities {
  resolution: boolean
  season: boolean
  episode: boolean
}

export interface NormalizedResult {
  id: string
  source: string
  name: string
  seeders: number
  leechers: number
  sizeBytes: number
  infoHash?: string
  resolution?: string
  raw?: unknown
}

export interface SourceInfo {
  id: string
  displayName: string
  capabilities: SourceCapabilities
}

export interface SearchRequest {
  query: string
  sourceIds: string[]
}

export interface SourceError {
  source: string
  message: string
}

export interface SearchResponse {
  results: NormalizedResult[]
  errors: SourceError[]
}

export interface MagnetResponse {
  available: boolean
  magnet?: string
  error?: string
}

export interface CopyResponse {
  ok: boolean
  magnet?: string
  error?: string
}

export interface PollingConfig {
  query: string
  sourceIds: string[]
  season: number | null
  episodes: number[] | null
  resolution?: string | null
  intervalMs?: number
}

export interface PollingUpdate {
  timestamp: string
  firstRun: boolean
  newResults: NormalizedResult[]
  totalMatched: number
}

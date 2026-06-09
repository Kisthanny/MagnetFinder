import type { NormalizedResult } from './types'

export const RESOLUTIONS = ['2160p', '1080p', '720p'] as const
export type Resolution = (typeof RESOLUTIONS)[number]

export const RESOLUTION_LABELS: Record<Resolution, string> = {
  '2160p': '2160p (4K)',
  '1080p': '1080p (Full HD)',
  '720p': '720p (HD)'
}

export const ZERO_INFO_HASH = '0000000000000000000000000000000000000000'

export function matchPattern(text: string, pattern: string): boolean {
  return new RegExp(pattern, 'i').test(text)
}

export function detectResolution(name: string): Resolution | undefined {
  for (const r of RESOLUTIONS) {
    if (matchPattern(name, r)) return r
  }
  return undefined
}

export function filterByResolution(
  results: NormalizedResult[],
  resolution: string | null | undefined
): NormalizedResult[] {
  if (!resolution) return results
  return results.filter((r) => (r.resolution ?? detectResolution(r.name)) === resolution)
}

export function filterBySeason(
  results: NormalizedResult[],
  season: number | null | undefined
): NormalizedResult[] {
  if (season == null) return results
  const pattern = `S${String(season).padStart(2, '0')}|Season ${season}`
  return results.filter((r) => matchPattern(r.name, pattern))
}

export function filterByEpisodes(
  results: NormalizedResult[],
  episodes: number[] | null | undefined
): NormalizedResult[] {
  if (!episodes || episodes.length === 0) return results
  return results.filter((r) =>
    episodes.some((ep) => matchPattern(r.name, `E${String(ep).padStart(2, '0')}|Episode ${ep}`))
  )
}

export function sortBySeeders(results: NormalizedResult[]): NormalizedResult[] {
  return [...results].sort((a, b) => b.seeders - a.seeders)
}

export function isValidInfoHash(hash: string | undefined | null): hash is string {
  return !!hash && hash !== ZERO_INFO_HASH
}

export function resultKey(r: NormalizedResult): string {
  return isValidInfoHash(r.infoHash) ? `hash:${r.infoHash}` : `${r.source}:${r.id}`
}

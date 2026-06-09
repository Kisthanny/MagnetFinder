import type { NormalizedResult } from '@shared/types'
import { detectResolution, isValidInfoHash } from '@shared/filter'
import { fetchJson } from '../http'
import { generateMagnet, TRACKERS } from './magnet'
import type { SourceAdapter } from './types'

const API_BASE = 'https://apibay.org'

interface PirateBayItem {
  id: string
  name: string
  info_hash: string
  seeders: string
  leechers: string
  size: string
  [key: string]: unknown
}

function normalize(item: PirateBayItem): NormalizedResult {
  const name = item.name ?? ''
  return {
    id: String(item.id),
    source: 'piratebay',
    name,
    seeders: Number(item.seeders ?? 0),
    leechers: Number(item.leechers ?? 0),
    sizeBytes: Number(item.size ?? 0),
    infoHash: item.info_hash,
    resolution: detectResolution(name),
    raw: item
  }
}

/** info_hash 缺失或为全零时，通过详情接口 t.php?id= 二次获取 */
async function fetchInfoHash(id: string): Promise<string | undefined> {
  try {
    const data = await fetchJson<{ info_hash?: string }>(`${API_BASE}/t.php?id=${id}`)
    return data?.info_hash
  } catch {
    return undefined
  }
}

export const pirateBayAdapter: SourceAdapter = {
  id: 'piratebay',
  displayName: 'The Pirate Bay',
  capabilities: { resolution: true, season: true, episode: true },

  async search(query) {
    const url = `${API_BASE}/q.php?q=${encodeURIComponent(query)}&cat=200`
    const data = await fetchJson<PirateBayItem[]>(url)
    if (!Array.isArray(data)) return []
    // apibay 在无结果时会返回单条 id 为 "0" 的占位项
    return data.filter((item) => item && item.id && item.id !== '0').map(normalize)
  },

  async buildMagnet(result) {
    let infoHash = result.infoHash
    if (!isValidInfoHash(infoHash)) {
      infoHash = await fetchInfoHash(result.id)
    }
    if (!isValidInfoHash(infoHash)) return null
    return generateMagnet(infoHash, result.name, TRACKERS)
  }
}
